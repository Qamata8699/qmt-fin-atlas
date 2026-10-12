// JSE fundamentals seed — annual statement data harvested from Yahoo Finance
// via the agent backend (see api/data/jse-seed.json for provenance).
// Purpose: when Yahoo's live quoteSummary is rate-limited, JSE companies in
// the seed still show real profitability / cash / revenue / DCF inputs,
// merged with Mansa's live price. Expand the seed by re-running the harvest.
import seedJson from "./data/jse-seed.json";

export interface SeedEntry {
  asOf: string;
  profitability: {
    grossMargin: number | null; operatingMargin: number | null; profitMargin: number | null;
    returnOnEquity: number | null; returnOnAssets: number | null; ebitda: number | null;
  };
  cashPosition: {
    totalCash: number | null; totalDebt: number | null; freeCashflow: number | null;
    operatingCashflow: number | null; currentRatio: number | null; quickRatio: number | null;
    cashPerShare: number | null;
  };
  revenue: {
    totalRevenue: number | null; revenueGrowth: number | null; revenuePerShare: number | null;
    history: { date: string; value: number | null }[];
    netIncomeHistory: { date: string; value: number | null }[];
  };
  cashHistory: { date: string; value: number | null }[];
  fcfHistory: { date: string; value: number | null }[];
  holdersSummary: { insiders: number | null; institutions: number | null; floatInstitutions: number | null };
  sharesOutstanding: number | null;
}

const companies = (seedJson as any).companies as Record<string, SeedEntry>;

export const seedAvailable = (symbol: string) => symbol.toUpperCase() in companies;
export const seedEntry = (symbol: string): SeedEntry | null =>
  companies[symbol.toUpperCase()] ?? null;

// Merge seed fundamentals onto a partial overview (e.g. Mansa's price-only
// fallback). Live identity/price fields win; seed fills the null sections.
export function mergeSeed(base: any, symbol: string) {
  const s = seedEntry(symbol);
  if (!s) return base;
  return {
    ...base,
    profitability: s.profitability,
    cashPosition: s.cashPosition,
    revenue: s.revenue,
    cashHistory: s.cashHistory,
    fcfHistory: s.fcfHistory,
    holdersSummary:
      s.holdersSummary.insiders != null || s.holdersSummary.institutions != null
        ? s.holdersSummary
        : base.holdersSummary,
    sharesOutstanding: base.sharesOutstanding ?? s.sharesOutstanding,
    source: `${base.source ?? "feed"} · fundamentals: annual statements snapshot (FY ending ${s.asOf}, Yahoo via agent backend)`,
  };
}

// DCF inputs from the seed when live Yahoo is unavailable.
export function seedDcf(symbol: string, livePrice: number | null, currency = "ZAR") {
  const s = seedEntry(symbol);
  if (!s) return null;
  const fcfHist = s.fcfHistory
    .map((f) => f.value)
    .filter((v): v is number => v != null && v > 0);
  const baseFcf = fcfHist.length
    ? fcfHist.slice(0, 3).reduce((a, b) => a + b, 0) / Math.min(3, fcfHist.length)
    : s.cashPosition.freeCashflow;
  const shares = s.sharesOutstanding;
  const growthRate = Math.min(Math.max(s.revenue.revenueGrowth ?? 0.05, -0.05), 0.15);
  const discountRate = 0.10;
  const terminalGrowth = 0.025;
  const years = 5;
  const base = {
    symbol,
    currency,
    price: livePrice,
    baseFcf: baseFcf ?? null,
    growthRate,
    terminalGrowth,
    discountRate,
    projectionYears: years,
    assumptionsNote: `Benchmark DCF on annual-statements snapshot (FY ending ${s.asOf}); live price when Mansa is up. Base FCF = average of up to 3 most recent positive annual FCFs; growth capped to [−5%, +15%]; 10% discount; 2.5% terminal. Illustrative only — not investment advice.`,
  };
  if (!baseFcf || !shares) {
    return { ...base, intrinsicValuePerShare: null, upsidePct: null, projectedFcf: [], terminalValuePv: null };
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
  const perShare = (pvSum + tvPv) / shares;
  return {
    ...base,
    intrinsicValuePerShare: perShare,
    upsidePct: livePrice ? perShare / livePrice - 1 : null,
    projectedFcf: projected,
    terminalValuePv: tvPv,
  };
}
