// Mansa API — African market data (https://mansaapi.com).
// Used as the fallback for JSE tickers when Yahoo Finance is rate-limited/down.
// Key comes from the MANSA_API_KEY env var — pasted as a secret, NEVER committed.

const MANSA_BASE = "https://mansaapi.com";

const mansaKey = () => process.env.MANSA_API_KEY ?? "";

async function mansaGet(path: string): Promise<any> {
  const res = await fetch(`${MANSA_BASE}${path}`, {
    headers: { Authorization: `Bearer ${mansaKey()}`, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Mansa API ${res.status}`);
  const j: any = await res.json();
  if (!j?.success) throw new Error(j?.error?.message ?? "Mansa API error");
  return j;
}

const isJse = (symbol: string) => symbol.toUpperCase().endsWith(".JO");
const jseTicker = (symbol: string) => symbol.replace(/\.JO$/i, "").toUpperCase();

export const mansaAvailable = (symbol: string) => isJse(symbol) && !!mansaKey();

// Partial overview: identity, live price (major-unit ZAR), market cap, sector.
// Profitability / cash / revenue detail stays Yahoo-only — Mansa's JSE
// fundamentals feed doesn't carry margins or balance-sheet lines yet.
export async function mansaOverview(symbol: string) {
  const t = jseTicker(symbol);
  const j = await mansaGet(`/api/v1/markets/exchanges/JSE/stocks/${encodeURIComponent(t)}`);
  const d = j.data ?? {};
  return {
    symbol,
    name: d.name ?? t,
    exchange: "JSE",
    currency: j.meta?.currency ?? "ZAR", // Mansa serves JSE prices in major units already
    price: typeof d.price === "number" ? d.price : null,
    marketCap: typeof d.market_cap === "number" ? d.market_cap : null,
    profitability: {
      grossMargin: null, operatingMargin: null, profitMargin: null,
      returnOnEquity: null, returnOnAssets: null, ebitda: null,
    },
    cashPosition: {
      totalCash: null, totalDebt: null, freeCashflow: null, operatingCashflow: null,
      currentRatio: null, quickRatio: null, cashPerShare: null,
    },
    revenue: {
      totalRevenue: null, revenueGrowth: null, revenuePerShare: null,
      history: [], netIncomeHistory: [],
    },
    cashHistory: [],
    fcfHistory: [],
    holdersSummary: { insiders: null, institutions: null, floatInstitutions: null },
    sharesOutstanding: typeof d.shares_outstanding === "number" ? d.shares_outstanding : null,
    beta: null,
    sector: d.sector ?? null,
    industry: null,
    website: null,
    longBusinessSummary: null,
    source: `Mansa API fallback (Yahoo rate-limited) · updated ${j.meta?.updated_at ?? "recently"} · fundamentals detail unavailable on this feed`,
  };
}
