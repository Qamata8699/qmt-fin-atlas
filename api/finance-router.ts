import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { edgarSearch, edgarOverview, edgarDcf, edgarOwnership, edgarNews } from "./edgar";
import { searchDirectory } from "./jse-directory";
import { mansaAvailable, mansaOverview } from "./mansa";

const isUsTicker = (s: string) => !s.includes(".");

async function withEdgarFallback<T>(symbol: string, primary: () => Promise<T>, fallback: () => Promise<any>): Promise<T> {
  try {
    return await primary();
  } catch (e) {
    if (isUsTicker(symbol)) {
      try {
        return await fallback();
      } catch {
        /* fall through */
      }
    }
    throw e;
  }
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const YF1 = "https://query1.finance.yahoo.com";
const YF2 = "https://query2.finance.yahoo.com";

let cached: { cookie: string; crumb: string; at: number } | null = null;

const overviewCache = new Map<string, { at: number; data: any }>();

async function getAuth(force = false): Promise<{ cookie: string; crumb: string }> {
  if (!force && cached && Date.now() - cached.at < 25 * 60 * 1000) return cached;
  const headers = { "User-Agent": UA };
  const r1 = await fetch("https://fc.yahoo.com", { headers, redirect: "manual" });
  const setCookies =
    (r1.headers as any).getSetCookie?.() ?? [r1.headers.get("set-cookie")].filter(Boolean);
  const cookie = setCookies.map((c: string) => c.split(";")[0]).join("; ");
  if (!cookie) throw new Error("Yahoo Finance auth unavailable");
  const r2 = await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb", {
    headers: { ...headers, Cookie: cookie },
  });
  if (!r2.ok) throw new Error(`Yahoo Finance crumb ${r2.status}`);
  const crumb = await r2.text();
  cached = { cookie, crumb, at: Date.now() };
  return cached;
}

async function yf(url: string): Promise<any> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const { cookie, crumb } = await getAuth(attempt > 0);
    const sep = url.includes("?") ? "&" : "?";
    const res = await fetch(`${url}${sep}crumb=${encodeURIComponent(crumb)}`, {
      headers: { "User-Agent": UA, Accept: "application/json", Cookie: cookie },
    });
    if (res.status === 429 || res.status === 401) {
      cached = null;
      continue;
    }
    if (!res.ok) throw new Error(`Yahoo Finance ${res.status}`);
    return res.json();
  }
  throw new Error("Yahoo Finance rate-limited — please retry shortly");
}

const num = (v: any): number | null =>
  v && typeof v === "object" && "raw" in v ? v.raw : typeof v === "number" ? v : null;
const fmt = (v: any): string | null =>
  v && typeof v === "object" ? v.fmt ?? null : v != null ? String(v) : null;

function normalizeExchange(exch: string | undefined): string {
  if (!exch) return "—";
  if (exch === "NYQ" || exch === "NYE") return "NYSE";
  if (exch === "NMS" || exch === "NGM") return "NASDAQ";
  if (exch === "LSE" || exch === "IOB") return "LSE";
  if (exch === "JSE") return "JSE";
  return exch;
}

// Yahoo quotes JSE prices in cents (ZAc) and LSE prices in pence (GBp),
// while market cap & financials are in the major unit (ZAR / GBP).
// Normalise price-level fields so everything downstream is one currency.
const isCents = (cur: string | undefined) => cur === "ZAc" || cur === "GBp";
const normCur = (cur: string | undefined) =>
  cur === "ZAc" ? "ZAR" : cur === "GBp" ? "GBP" : cur ?? "USD";
const normPrice = (v: number | null, cur: string | undefined) =>
  v != null && isCents(cur) ? v / 100 : v;

const MA_KEYWORDS =
  /merger|acqui|takeover|buyout|bids?|deal|m&a|combine|consolidat|sell-off|divest|spin-?off|stake/i;

export const financeRouter = createRouter({
  search: publicQuery.input(z.object({ q: z.string().min(1) })).query(async ({ input }) => {
    // Local JSE directory first — guarantees SA companies are always findable,
    // even when Yahoo's free search ignores .JO tickers or is rate-limited.
    const local = searchDirectory(input.q);
    let yahoo: any[] = [];
    try {
      const data = await yf(
        `${YF1}/v1/finance/search?q=${encodeURIComponent(input.q)}&quotesCount=12&newsCount=0&listsCount=0`
      );
      const allowed = new Set(["NYQ", "NYE", "NMS", "NGM", "LSE", "IOB", "JSE", "ASE"]);
      yahoo = (data.quotes ?? [])
        .filter((q: any) => q.isYahooFinance && q.quoteType === "EQUITY")
        .filter((q: any) => !q.exchange || allowed.has(q.exchange))
        .map((q: any) => ({
          symbol: q.symbol as string,
          name: (q.longname || q.shortname || q.symbol) as string,
          exchange: normalizeExchange(q.exchange),
          type: q.quoteType as string,
        }));
    } catch {
      /* Yahoo unavailable — local directory + EDGAR fallback below */
    }
    try {
      const edgar = await edgarSearch(input.q);
      const seen = new Set([...local, ...yahoo].map((r) => r.symbol));
      return [...local, ...yahoo, ...edgar.filter((r) => !seen.has(r.symbol))].slice(0, 12);
    } catch {
      return [...local, ...yahoo];
    }
  }),

  overview: publicQuery.input(z.object({ symbol: z.string() })).query(async ({ input }) => {
    try {
      const result = await withEdgarFallback(input.symbol, async () => {
    const modules =
      "price,summaryDetail,financialData,defaultKeyStatistics,incomeStatementHistory,balanceSheetHistory,cashflowStatementHistory,majorHoldersBreakdown";
    const data = await yf(
      `${YF2}/v10/finance/quoteSummary/${encodeURIComponent(input.symbol)}?modules=${modules}`
    );
    const r = data.quoteSummary?.result?.[0];
    if (!r) throw new Error("Company not found");
    const p = r.price ?? {};
    const fd = r.financialData ?? {};
    const ks = r.defaultKeyStatistics ?? {};

    const pick = (list: any[], field: string) =>
      (list ?? []).slice(0, 4).map((e: any) => ({
        date: e.endDate?.fmt ?? null,
        value: num(e[field]),
      }));

    const income = r.incomeStatementHistory?.incomeStatementHistory ?? [];
    const balance = r.balanceSheetHistory?.balanceSheetStatements ?? [];
    const cashflow = r.cashflowStatementHistory?.cashflowStatements ?? [];

    return {
      symbol: input.symbol,
      name: p.longName ?? p.shortName ?? input.symbol,
      exchange: normalizeExchange(p.exchangeName),
      currency: normCur(p.currency),
      price: normPrice(num(p.regularMarketPrice), p.currency),
      marketCap: num(p.marketCap),
      profitability: {
        grossMargin: num(fd.grossMargins),
        operatingMargin: num(fd.operatingMargins),
        profitMargin: num(fd.profitMargins),
        returnOnEquity: num(fd.returnOnEquity),
        returnOnAssets: num(fd.returnOnAssets),
        ebitda: num(fd.ebitda),
      },
      cashPosition: {
        totalCash: num(fd.totalCash),
        totalDebt: num(fd.totalDebt),
        freeCashflow: num(fd.freeCashflow),
        operatingCashflow: num(fd.operatingCashflow),
        currentRatio: num(fd.currentRatio),
        quickRatio: num(fd.quickRatio),
        cashPerShare: num(fd.totalCashPerShare),
      },
      revenue: {
        totalRevenue: num(fd.totalRevenue),
        revenueGrowth: num(fd.revenueGrowth),
        revenuePerShare: num(fd.revenuePerShare),
        history: pick(income, "totalRevenue"),
        netIncomeHistory: pick(income, "netIncome"),
      },
      cashHistory: pick(balance, "cash"),
      fcfHistory: pick(cashflow, "freeCashflow"),
      holdersSummary: {
        insiders: num(r.majorHoldersBreakdown?.insidersPercentHeld),
        institutions: num(r.majorHoldersBreakdown?.institutionsPercentHeld),
        floatInstitutions: num(r.majorHoldersBreakdown?.institutionsFloatPercentHeld),
      },
      sharesOutstanding: num(ks.sharesOutstanding),
      beta: num(ks.beta),
      sector: p.sector ?? null,
      industry: p.industry ?? null,
      website: p.website ?? null,
      longBusinessSummary: p.longBusinessSummary ?? null,
    };
    }, () => edgarOverview(input.symbol));
      overviewCache.set(input.symbol.toUpperCase(), { at: Date.now(), data: result });
      return result;
    } catch (e) {
      // Fallback chain when Yahoo fails:
      // 1) Mansa API for JSE tickers (live price, market cap, sector — partial profile)
      if (mansaAvailable(input.symbol)) {
        try {
          const m = await mansaOverview(input.symbol);
          overviewCache.set(input.symbol.toUpperCase(), { at: Date.now(), data: m });
          return m;
        } catch {
          /* Mansa down too — try the local snapshot cache */
        }
      }
      // 2) Last good fetch from this server, whatever its age, over an error wall.
      const hit = overviewCache.get(input.symbol.toUpperCase());
      if (hit) return { ...hit.data, source: "cached snapshot (live feed rate-limited)" };
      throw e;
    }
  }),

  ownership: publicQuery.input(z.object({ symbol: z.string() })).query(({ input }) =>
    withEdgarFallback(input.symbol, async () => {
    const modules = "majorHoldersBreakdown,institutionOwnership,fundOwnership,price";
    const data = await yf(
      `${YF2}/v10/finance/quoteSummary/${encodeURIComponent(input.symbol)}?modules=${modules}`
    );
    const r = data.quoteSummary?.result?.[0];
    if (!r) throw new Error("Company not found");
    const mapHolder = (h: any) => ({
      name: h.organization ?? "Unknown",
      pctHeld: num(h.pctHeld),
      position: num(h.position),
      value: num(h.value),
      reportDate: fmt(h.reportDate),
    });
    return {
      company: r.price?.longName ?? r.price?.shortName ?? input.symbol,
      breakdown: {
        insiders: num(r.majorHoldersBreakdown?.insidersPercentHeld),
        institutions: num(r.majorHoldersBreakdown?.institutionsPercentHeld),
        floatInstitutions: num(r.majorHoldersBreakdown?.institutionsFloatPercentHeld),
        institutionsCount: num(r.majorHoldersBreakdown?.institutionsCount),
      },
      institutions: (r.institutionOwnership?.ownershipList ?? []).slice(0, 10).map(mapHolder),
      funds: (r.fundOwnership?.ownershipList ?? []).slice(0, 10).map(mapHolder),
    };
    }, () => edgarOwnership(input.symbol))
  ),

  news: publicQuery
    .input(z.object({ symbol: z.string(), name: z.string().optional() }))
    .query(({ input }) =>
      withEdgarFallback(input.symbol, async () => {
      const q = encodeURIComponent(input.name || input.symbol);
      const data = await yf(`${YF1}/v1/finance/search?q=${q}&quotesCount=0&newsCount=30`);
      const items = (data.news ?? []).map((n: any) => ({
        title: n.title as string,
        publisher: n.publisher as string,
        link: n.link as string,
        publishedAt: new Date((n.providerPublishTime ?? 0) * 1000).toISOString(),
        summary: n.summary as string | undefined,
      }));
      const maNews = items.filter(
        (n: any) => MA_KEYWORDS.test(n.title) || (n.summary && MA_KEYWORDS.test(n.summary))
      );
      return { ma: maNews.slice(0, 12), all: items.slice(0, 12) };
      }, () => edgarNews(input.symbol))
    ),

  // ZAR per 1 unit of each currency (for the "view in Rands" toggle).
  fx: publicQuery.query(async () => {
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/ZAR");
      const j: any = await res.json();
      if (j?.result === "success" && j.rates) {
        const out: Record<string, number> = { ZAR: 1 };
        for (const [cur, perZar] of Object.entries(j.rates)) {
          if (typeof perZar === "number" && perZar > 0) out[cur] = 1 / perZar;
        }
        if (j.rates.GBp == null && j.rates.GBP) out.GBp = out.GBP / 100; // LSE quotes in pence
        return { rates: out, source: "exchangerate-api.com (free)", fallback: false };
      }
      throw new Error("bad fx response");
    } catch {
      return {
        rates: { ZAR: 1, USD: 18.2, GBP: 23.1, GBp: 0.231, EUR: 19.6 },
        source: "static fallback rates",
        fallback: true,
      };
    }
  }),

  dcf: publicQuery.input(z.object({ symbol: z.string() })).query(({ input }) =>
    withEdgarFallback(input.symbol, async () => {
    const modules = "financialData,defaultKeyStatistics,price,cashflowStatementHistory";
    const data = await yf(
      `${YF2}/v10/finance/quoteSummary/${encodeURIComponent(input.symbol)}?modules=${modules}`
    );
    const r = data.quoteSummary?.result?.[0];
    if (!r) throw new Error("Company not found");
    const fd = r.financialData ?? {};
    const fcfHist = (r.cashflowStatementHistory?.cashflowStatements ?? [])
      .map((s: any) => num(s.freeCashflow))
      .filter((v: number | null): v is number => v != null && v > 0);
    const baseFcf = fcfHist.length
      ? fcfHist.slice(0, 3).reduce((a: number, b: number) => a + b, 0) / Math.min(3, fcfHist.length)
      : num(fd.freeCashflow);
    const shares = num(r.defaultKeyStatistics?.sharesOutstanding);
    const price = num(r.price?.regularMarketPrice);
    const growthRate = Math.min(Math.max(num(fd.revenueGrowth) ?? 0.05, -0.05), 0.15);
    const discountRate = 0.10;
    const terminalGrowth = 0.025;
    const years = 5;

    if (!baseFcf || !shares) {
      return {
        symbol: input.symbol,
        currency: normCur(r.price?.currency),
        price: normPrice(price, r.price?.currency),
        baseFcf,
        growthRate,
        terminalGrowth,
        discountRate,
        projectionYears: years,
        intrinsicValuePerShare: null,
        upsidePct: null,
        projectedFcf: [],
        terminalValuePv: null,
        assumptionsNote:
          "Insufficient positive free-cash-flow history to compute a DCF benchmark for this company.",
      };
    }

    let fcf = baseFcf;
    const projected = [];
    let pvSum = 0;
    for (let y = 1; y <= years; y++) {
      fcf = fcf * (1 + growthRate);
      const pv = fcf / Math.pow(1 + discountRate, y);
      pvSum += pv;
      projected.push({ year: y, fcf, pv });
    }
    const tv = (fcf * (1 + terminalGrowth)) / (discountRate - terminalGrowth);
    const tvPv = tv / Math.pow(1 + discountRate, years);
    const equityValue = pvSum + tvPv;
    const perShare = equityValue / shares;
    return {
      symbol: input.symbol,
      currency: normCur(r.price?.currency),
      price: normPrice(price, r.price?.currency),
      baseFcf,
      growthRate,
      terminalGrowth,
      discountRate,
      projectionYears: years,
      intrinsicValuePerShare: perShare,
      upsidePct: price ? perShare / normPrice(price, r.price?.currency)! - 1 : null,
      projectedFcf: projected,
      terminalValuePv: tvPv,
      assumptionsNote:
        "Benchmark DCF: base FCF = average of up to 3 most recent positive annual FCFs; growth capped to [−5%, +15%] from reported revenue growth; 10% discount rate; 2.5% terminal growth. Illustrative only — not investment advice.",
    };
    }, () => edgarDcf(input.symbol))
  ),
});
