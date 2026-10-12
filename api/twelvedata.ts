// Twelve Data — https://twelvedata.com — defensive fallback layer.
// Covers JSE, NYSE and LSE quotes on the free tier (800 req/day, 8 req/min).
// DORMANT until a key is available: set the TWELVE_DATA_KEY env var (preferred,
// per the "keys as secrets" rule) — or paste a key as TD_DEFAULT_KEY below.
// With no key present every call is skipped silently and the other fallbacks
// (Mansa, EDGAR, cache) carry on as before.
const TD_DEFAULT_KEY = "";

const TD_BASE = "https://api.twelvedata.com";

const tdKey = () => process.env.TWELVE_DATA_KEY || TD_DEFAULT_KEY;
export const twelveDataAvailable = () => !!tdKey();

async function tdGet(path: string): Promise<any> {
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${TD_BASE}${path}${sep}apikey=${encodeURIComponent(tdKey())}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Twelve Data ${res.status}`);
  const j: any = await res.json();
  if (j?.status === "error") throw new Error(j.message ?? "Twelve Data error");
  return j;
}

// Map a Yahoo-style symbol to Twelve Data's (symbol, exchange) pair.
function toTd(symbol: string): { sym: string; exchange?: string } {
  const s = symbol.toUpperCase();
  if (s.endsWith(".JO")) return { sym: s.slice(0, -3), exchange: "JSE" };
  if (s.endsWith(".L")) return { sym: s.slice(0, -2), exchange: "LSE" };
  return { sym: s }; // NYSE / NASDAQ need no exchange param
}

// Map Twelve Data exchange names back to Yahoo-style suffixes.
function fromTd(symbol: string, exchange: string): string {
  const ex = (exchange ?? "").toUpperCase();
  if (ex === "JSE") return `${symbol.toUpperCase()}.JO`;
  if (ex === "LSE") return `${symbol.toUpperCase()}.L`;
  return symbol.toUpperCase();
}

const TD_EXCHANGES = /jse|lse|nyse|nasdaq/i;

// Cross-market symbol search, mapped back to the app's Yahoo-style symbols.
export async function twelveDataSearch(q: string): Promise<{ symbol: string; name: string; exchange: string; type: string }[]> {
  const j = await tdGet(`/symbol_search?symbol=${encodeURIComponent(q)}&outputsize=10`);
  return (j.data ?? [])
    .filter((r: any) => r?.symbol && r?.instrument_name && TD_EXCHANGES.test(r.exchange ?? ""))
    .filter((r: any) => /stock|equity/i.test(r.instrument_type ?? ""))
    .slice(0, 8)
    .map((r: any) => ({
      symbol: fromTd(r.symbol, r.exchange),
      name: r.instrument_name as string,
      exchange: (r.exchange as string).toUpperCase(),
      type: "EQUITY",
    }));
}

// Quote-only overview: identity, price (major units), currency, basic stats.
// Fundamentals depth (margins, balance sheet) stays Yahoo/Mansa territory;
// Twelve Data's free tier carries price + a light statistics block.
export async function twelveDataOverview(symbol: string) {
  const { sym, exchange } = toTd(symbol);
  const q = await tdGet(
    `/quote?symbol=${encodeURIComponent(sym)}${exchange ? `&exchange=${exchange}` : ""}`
  );
  if (!q?.close) throw new Error("Twelve Data: no quote");
  let stats: any = {};
  try {
    stats = await tdGet(
      `/statistics?symbol=${encodeURIComponent(sym)}${exchange ? `&exchange=${exchange}` : ""}`
    );
  } catch {
    /* statistics block is best-effort on the free tier */
  }
  const fin = stats?.statistics ?? {};
  const price = parseFloat(q.close);
  return {
    symbol,
    name: q.name ?? symbol,
    exchange: (q.exchange ?? exchange ?? "").toUpperCase(),
    currency: q.currency ?? "USD", // Twelve Data serves major-unit currencies
    price: Number.isFinite(price) ? price : null,
    marketCap: typeof fin.market_capitalization === "number" ? fin.market_capitalization : null,
    profitability: {
      grossMargin: typeof fin.gross_margin === "number" ? fin.gross_margin : null,
      operatingMargin: typeof fin.operating_margin === "number" ? fin.operating_margin : null,
      profitMargin: typeof fin.profit_margin === "number" ? fin.profit_margin : null,
      returnOnEquity: typeof fin.return_on_equity_ttm === "number" ? fin.return_on_equity_ttm : null,
      returnOnAssets: typeof fin.return_on_assets_ttm === "number" ? fin.return_on_assets_ttm : null,
      ebitda: null,
    },
    cashPosition: {
      totalCash: null, totalDebt: null, freeCashflow: null, operatingCashflow: null,
      currentRatio: typeof fin.current_ratio === "number" ? fin.current_ratio : null,
      quickRatio: typeof fin.quick_ratio === "number" ? fin.quick_ratio : null,
      cashPerShare: null,
    },
    revenue: {
      totalRevenue: typeof fin.revenue_ttm === "number" ? fin.revenue_ttm : null,
      revenueGrowth: null, revenuePerShare: null,
      history: [], netIncomeHistory: [],
    },
    cashHistory: [],
    fcfHistory: [],
    holdersSummary: { insiders: null, institutions: null, floatInstitutions: null },
    sharesOutstanding: typeof fin.shares_outstanding === "number" ? fin.shares_outstanding : null,
    beta: typeof fin.beta === "number" ? fin.beta : null,
    sector: null,
    industry: null,
    website: null,
    longBusinessSummary: null,
    source: "Twelve Data fallback (Yahoo rate-limited) · free tier · some detail unavailable",
  };
}
