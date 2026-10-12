// Twelve Data — https://twelvedata.com — defensive fallback layer.
// Free plan: US quotes + full statistics, global symbol search (JSE & LSE
// quotes need a paid plan, so those stay Mansa/Yahoo territory).
// Key: set TWELVE_DATA_KEY env var to use your own. The bundled default is a
// free-plan key (registered for this app) so the fallback works out of the
// box on the published site — rotate anytime via the env var.
const TD_DEFAULT_KEY = "06b000afe7a942d0a9d027174050af76";

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
const n = (v: any): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);

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

// Overview from /quote + /statistics (free plan: US markets only for quotes —
// JSE/LSE quote calls throw and the router moves down the fallback chain).
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
  const st = stats?.statistics ?? {};
  const val = st.valuations_metrics ?? {};
  const fin = st.financials ?? {};
  const inc = fin.income_statement ?? {};
  const bs = fin.balance_sheet ?? {};
  const cf = fin.cash_flow ?? {};
  const ss = st.stock_statistics ?? {};
  const sps = st.stock_price_summary ?? {};
  const price = parseFloat(q.close);
  return {
    symbol,
    name: q.name ?? symbol,
    exchange: (q.exchange ?? exchange ?? "").toUpperCase(),
    currency: q.currency ?? "USD", // Twelve Data serves major-unit currencies
    price: Number.isFinite(price) ? price : null,
    marketCap: n(val.market_capitalization),
    profitability: {
      grossMargin: n(fin.gross_margin),
      operatingMargin: n(fin.operating_margin),
      profitMargin: n(fin.profit_margin),
      returnOnEquity: n(fin.return_on_equity_ttm),
      returnOnAssets: n(fin.return_on_assets_ttm),
      ebitda: n(inc.ebitda),
    },
    cashPosition: {
      totalCash: n(bs.total_cash_mrq),
      totalDebt: n(bs.total_debt_mrq),
      freeCashflow: n(cf.levered_free_cash_flow_ttm),
      operatingCashflow: n(cf.operating_cash_flow_ttm),
      currentRatio: n(bs.current_ratio_mrq),
      quickRatio: null,
      cashPerShare: n(bs.total_cash_per_share_mrq),
    },
    revenue: {
      totalRevenue: n(inc.revenue_ttm),
      revenueGrowth: n(inc.quarterly_revenue_growth),
      revenuePerShare: n(inc.revenue_per_share_ttm),
      history: [], netIncomeHistory: [],
    },
    cashHistory: [],
    fcfHistory: [],
    holdersSummary: {
      insiders: n(ss.percent_held_by_insiders),
      institutions: n(ss.percent_held_by_institutions),
      floatInstitutions: null,
    },
    sharesOutstanding: n(ss.shares_outstanding),
    beta: n(sps.beta),
    sector: null,
    industry: null,
    website: null,
    longBusinessSummary: null,
    source: "Twelve Data fallback (Yahoo rate-limited) · free plan · histories unavailable on this feed",
  };
}
