// SEC EDGAR fallback data source (US-listed companies only).
// Verified free, no key required; needs a descriptive User-Agent.

const UA = "QMT Fin Atlas (research demo; contact: admin@example.com)";
const DATA = "https://data.sec.gov";
const WWW = "https://www.sec.gov";
const EFTS = "https://efts.sec.gov";

async function eg(url: string): Promise<any> {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) throw new Error(`EDGAR ${res.status}`);
  return res.json();
}

interface TickerRow {
  cik: number;
  name: string;
  ticker: string;
  exchange: string;
}

let tickersCache: { rows: TickerRow[]; at: number } | null = null;

export async function tickerMap(): Promise<TickerRow[]> {
  if (tickersCache && Date.now() - tickersCache.at < 6 * 60 * 60 * 1000) return tickersCache.rows;
  const j = await eg(`${WWW}/files/company_tickers_exchange.json`);
  const rows: TickerRow[] = j.data.map((d: any[]) => ({
    cik: d[0],
    name: d[1],
    ticker: d[2],
    exchange: d[3],
  }));
  tickersCache = { rows, at: Date.now() };
  return rows;
}

export async function edgarSearch(q: string) {
  const rows = await tickerMap();
  const needle = q.toLowerCase();
  return rows
    .filter(
      (r) =>
        (r.exchange === "NYSE" || r.exchange === "Nasdaq") &&
        (r.ticker.toLowerCase().startsWith(needle) || r.name.toLowerCase().includes(needle))
    )
    .slice(0, 12)
    .map((r) => ({ symbol: r.ticker, name: r.name, exchange: r.exchange, type: "EQUITY" }));
}

export async function findUsCompany(symbol: string): Promise<TickerRow | null> {
  const rows = await tickerMap();
  return rows.find((r) => r.ticker.toUpperCase() === symbol.toUpperCase()) ?? null;
}

const cik10 = (cik: number) => String(cik).padStart(10, "0");

type FactPoint = { fy: number; end: string; val: number };

function annual(facts: any, taxonomy: string, tag: string): FactPoint[] {
  const units = facts?.facts?.[taxonomy]?.[tag]?.units ?? {};
  const arr: any[] = units.USD ?? units.shares ?? units["USD/shares"] ?? Object.values(units)[0] ?? [];
  const byFy = new Map<number, any>();
  for (const u of arr) {
    if (u.form === "10-K" && u.fy && typeof u.val === "number") {
      // keep the value whose period is ~a year (for flow tags) — approximated by preferring later-filed
      byFy.set(u.fy, u);
    }
  }
  return [...byFy.values()]
    .sort((a, b) => b.fy - a.fy)
    .map((u) => ({ fy: u.fy, end: u.end, val: u.val }));
}

function latestAnnual(facts: any, tags: [string, string][]): FactPoint[] {
  for (const [tax, tag] of tags) {
    const v = annual(facts, tax, tag);
    if (v.length) return v;
  }
  return [];
}

export async function edgarOverview(symbol: string) {
  const co = await findUsCompany(symbol);
  if (!co) throw new Error("Not a US-listed company");
  const facts = await eg(`${DATA}/api/xbrl/companyfacts/CIK${cik10(co.cik)}.json`);

  const revenue = latestAnnual(facts, [
    ["us-gaap", "RevenueFromContractWithCustomerExcludingAssessedTax"],
    ["us-gaap", "Revenues"],
    ["us-gaap", "SalesRevenueNet"],
  ]);
  const netIncome = latestAnnual(facts, [["us-gaap", "NetIncomeLoss"]]);
  const ocf = latestAnnual(facts, [["us-gaap", "NetCashProvidedByUsedInOperatingActivities"]]);
  const capex = latestAnnual(facts, [["us-gaap", "PaymentsToAcquirePropertyPlantAndEquipment"]]);
  const cash = latestAnnual(facts, [
    ["us-gaap", "CashAndCashEquivalentsAtCarryingValue"],
    ["us-gaap", "CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents"],
  ]);
  const debt = latestAnnual(facts, [
    ["us-gaap", "LongTermDebt"],
    ["us-gaap", "LongTermDebtNoncurrent"],
  ]);
  const assets = latestAnnual(facts, [["us-gaap", "Assets"]]);
  const equity = latestAnnual(facts, [
    ["us-gaap", "StockholdersEquity"],
    ["us-gaap", "StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest"],
  ]);
  const grossProfit = latestAnnual(facts, [["us-gaap", "GrossProfit"]]);
  const opIncome = latestAnnual(facts, [["us-gaap", "OperatingIncomeLoss"]]);
  const shares = latestAnnual(facts, [["dei", "EntityCommonStockSharesOutstanding"]]);

  const L = (a: FactPoint[]) => a[0]?.val ?? null;
  const rev0 = L(revenue);
  const fcf = ocf.slice(0, 4).map((o, i) => ({
    date: o.end,
    value: o.val - Math.abs(capex[i]?.val ?? 0),
  }));

  return {
    symbol,
    name: co.name,
    exchange: co.exchange,
    currency: "USD",
    price: null,
    marketCap: null,
    source: "SEC EDGAR (price unavailable from free feed right now)",
    profitability: {
      grossMargin: rev0 && L(grossProfit) != null ? L(grossProfit)! / rev0 : null,
      operatingMargin: rev0 && L(opIncome) != null ? L(opIncome)! / rev0 : null,
      profitMargin: rev0 && L(netIncome) != null ? L(netIncome)! / rev0 : null,
      returnOnEquity: L(equity) && L(netIncome) != null ? L(netIncome)! / L(equity)! : null,
      returnOnAssets: L(assets) && L(netIncome) != null ? L(netIncome)! / L(assets)! : null,
      ebitda: null,
    },
    cashPosition: {
      totalCash: L(cash),
      totalDebt: L(debt),
      freeCashflow: fcf[0]?.value ?? null,
      operatingCashflow: L(ocf),
      currentRatio: null,
      quickRatio: null,
      cashPerShare: L(cash) && L(shares) ? L(cash)! / L(shares)! : null,
    },
    revenue: {
      totalRevenue: rev0,
      revenueGrowth:
        revenue[0] && revenue[1] ? revenue[0].val / revenue[1].val - 1 : null,
      revenuePerShare: rev0 && L(shares) ? rev0 / L(shares)! : null,
      history: revenue.slice(0, 4).map((r) => ({ date: r.end, value: r.val })),
      netIncomeHistory: netIncome.slice(0, 4).map((r) => ({ date: r.end, value: r.val })),
    },
    cashHistory: cash.slice(0, 4).map((r) => ({ date: r.end, value: r.val })),
    fcfHistory: fcf,
    holdersSummary: { insiders: null, institutions: null, floatInstitutions: null },
    sharesOutstanding: L(shares),
    beta: null,
    sector: null,
    industry: null,
    website: null,
    longBusinessSummary: null,
  };
}

export async function edgarDcf(symbol: string) {
  const ov = await edgarOverview(symbol);
  const fcfPos = ov.fcfHistory.filter((f) => f.value != null && f.value > 0);
  const baseFcf = fcfPos.length
    ? fcfPos.slice(0, 3).reduce((a, f) => a + (f.value as number), 0) / Math.min(3, fcfPos.length)
    : null;
  const shares = ov.sharesOutstanding;
  const growthRate = Math.min(Math.max(ov.revenue.revenueGrowth ?? 0.05, -0.05), 0.15);
  const discountRate = 0.1;
  const terminalGrowth = 0.025;
  const years = 5;
  const base = {
    symbol,
    currency: "USD",
    price: null,
    baseFcf,
    growthRate,
    terminalGrowth,
    discountRate,
    projectionYears: years,
    assumptionsNote:
      "Benchmark DCF from SEC EDGAR filings: base FCF = average of up to 3 most recent positive annual FCFs (operating cash flow − capex); growth capped to [−5%, +15%] from reported revenue growth; 10% discount rate; 2.5% terminal growth. Live price unavailable from free feeds right now. Illustrative only — not investment advice.",
  };
  if (!baseFcf || !shares) {
    return { ...base, intrinsicValuePerShare: null, upsidePct: null, projectedFcf: [], terminalValuePv: null };
  }
  let fcf = baseFcf;
  const projected = [];
  let pvSum = 0;
  for (let y = 1; y <= years; y++) {
    fcf *= 1 + growthRate;
    const pv = fcf / Math.pow(1 + discountRate, y);
    pvSum += pv;
    projected.push({ year: y, fcf, pv });
  }
  const tv = (fcf * (1 + terminalGrowth)) / (discountRate - terminalGrowth);
  const tvPv = tv / Math.pow(1 + discountRate, years);
  return {
    ...base,
    intrinsicValuePerShare: (pvSum + tvPv) / shares,
    upsidePct: null,
    projectedFcf: projected,
    terminalValuePv: tvPv,
  };
}

// Beneficial owners via SC 13G / 13D filings (>5% holders must file these).
export async function edgarOwnership(symbol: string) {
  const co = await findUsCompany(symbol);
  if (!co) throw new Error("Not a US-listed company");
  const q = encodeURIComponent(`"${co.name}"`);
  const j = await eg(`${EFTS}/LATEST/search-index?q=${q}&forms=SC+13G%2CSC+13D%2CSC+13G%2FA%2CSC+13D%2FA`);
  const hits: any[] = (j.hits?.hits ?? []).filter((h: any) =>
    (h._source?.ciks ?? []).includes(cik10(co.cik))
  );
  const byName = new Map<string, { date: string; form: string }>();
  for (const h of hits.slice(0, 60)) {
    const src = h._source ?? {};
    const names: string[] = src.display_names ?? [];
    const forms: string[] = (src.file_type ? [src.file_type] : src.forms) ?? [];
    // filer = a display name that is NOT the subject company
    for (const n of names) {
      const cikMatch = n.match(/\(CIK (\d+)\)/);
      if (cikMatch && Number(cikMatch[1]) === co.cik) continue; // subject company itself
      const clean = n.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
      if (clean && clean.length > 2 && !byName.has(clean)) {
        byName.set(clean, { date: src.file_date ?? "", form: forms[0] ?? "SC 13G" });
      }
    }
  }
  const holders = [...byName.entries()].slice(0, 10).map(([name, m]) => ({
    name,
    pctHeld: null,
    position: null,
    value: null,
    reportDate: m.date,
  }));
  return {
    company: co.name,
    breakdown: { insiders: null, institutions: null, floatInstitutions: null, institutionsCount: null },
    institutions: holders,
    funds: [],
    source:
      "Beneficial owners (>5%) identified from SEC SC 13D/13G filings; percentages not included in the free full-text feed.",
  };
}

// M&A signal from recent EDGAR filings (merger proxies, tender offers, S-4s, 8-Ks).
export async function edgarNews(symbol: string) {
  const co = await findUsCompany(symbol);
  if (!co) throw new Error("Not a US-listed company");
  const j = await eg(`${DATA}/submissions/CIK${cik10(co.cik)}.json`);
  const r = j.filings?.recent ?? {};
  const items: any[] = [];
  const n = r.form?.length ?? 0;
  for (let i = 0; i < Math.min(n, 400); i++) {
    const form: string = r.form[i];
    const accession: string = r.accessionNumber[i];
    const doc: string = r.primaryDocument[i];
    const link = `https://www.sec.gov/Archives/edgar/data/${co.cik}/${accession.replace(/-/g, "")}/${doc}`;
    items.push({
      title: `${form} — ${r.primaryDocDescription?.[i] || "SEC filing"}`,
      publisher: "SEC EDGAR",
      link,
      publishedAt: r.filingDate[i],
      summary: undefined,
      _form: form,
    });
  }
  const maForms = new Set(["S-4", "S-4/A", "DEFM14A", "DEFA14A", "SC TO-T", "SC14D9", "425", "PREM14A"]);
  const ma = items.filter((i) => maForms.has(i._form)).slice(0, 12);
  const recent = items.filter((i) => ["8-K", "10-Q", "10-K", "8-K/A"].includes(i._form)).slice(0, 12);
  const strip = (arr: any[]) => arr.map(({ _form, ...rest }) => rest);
  return { ma: strip(ma), all: strip(recent) };
}
