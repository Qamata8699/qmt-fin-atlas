import { useState } from "react";
import { Activity, Landmark, Globe2, TrendingUp } from "lucide-react";
import { trpc } from "@/providers/trpc";
import SearchBar from "@/components/SearchBar";
import OverviewTab from "@/components/OverviewTab";
import DcfTab from "@/components/DcfTab";
import NewsTab from "@/components/NewsTab";
import OwnershipTab from "@/components/OwnershipTab";
import { fmtMoney, fmtNum } from "@/lib/format";

const TABS = ["Overview", "DCF Benchmark", "M&A News", "Ownership"] as const;

const EXAMPLES = [
  { symbol: "AAPL", label: "Apple · NYSE/Nasdaq" },
  { symbol: "VOD.L", label: "Vodafone · LSE" },
  { symbol: "NPN.JO", label: "Naspers · JSE" },
  { symbol: "SBK.JO", label: "Standard Bank · JSE" },
];

export default function Home() {
  const [sel, setSel] = useState<{ symbol: string; name: string } | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");

  const overview = trpc.finance.overview.useQuery(
    { symbol: sel?.symbol ?? "" },
    { enabled: !!sel, retry: 1 }
  );
  const dcf = trpc.finance.dcf.useQuery(
    { symbol: sel?.symbol ?? "" },
    { enabled: !!sel && tab === "DCF Benchmark", retry: 1 }
  );
  const news = trpc.finance.news.useQuery(
    { symbol: sel?.symbol ?? "", name: sel?.name },
    { enabled: !!sel && tab === "M&A News", retry: 1 }
  );
  const ownership = trpc.finance.ownership.useQuery(
    { symbol: sel?.symbol ?? "" },
    { enabled: !!sel && tab === "Ownership", retry: 1 }
  );

  const o = overview.data;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <button onClick={() => setSel(null)} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold tracking-wide">QMT FIN ATLAS</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500">
                NYSE · LSE · JSE intelligence
              </div>
            </div>
          </button>
          {sel && (
            <div className="hidden sm:block">
              <SearchBar onSelect={(symbol, name) => { setSel({ symbol, name }); setTab("Overview"); }} />
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20">
        {!sel ? (
          /* -- Landing / hero -- */
          <div className="flex min-h-[80vh] flex-col items-center justify-center py-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-medium text-emerald-300">
              <Globe2 className="h-3.5 w-3.5" /> Three exchanges, one terminal
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
              Company intelligence across{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
                NYSE, LSE &amp; JSE
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-400 sm:text-lg">
              Profitability, cash position, revenue trends, DCF benchmarks, M&amp;A news and
              beneficial-ownership maps — in one search.
            </p>
            <div className="mt-9 flex w-full justify-center px-2">
              <SearchBar large onSelect={(symbol, name) => setSel({ symbol, name })} />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {EXAMPLES.map((e) => (
                <button
                  key={e.symbol}
                  onClick={() => setSel({ symbol: e.symbol, name: e.label.split(" · ")[0] })}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-slate-300 transition hover:border-emerald-400/40 hover:text-emerald-300"
                >
                  {e.label}
                </button>
              ))}
            </div>
            <div className="mt-16 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: Activity, t: "Fundamentals", d: "Margins, returns, cash flow and balance-sheet strength at a glance." },
                { icon: TrendingUp, t: "DCF benchmark", d: "Transparent 5-year DCF with stated assumptions vs. live price." },
                { icon: Landmark, t: "Ownership maps", d: "See which institutions and funds — Vanguard, BlackRock & peers — sit on the register." },
              ].map((f) => (
                <div key={f.t} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left">
                  <f.icon className="h-6 w-6 text-emerald-400" />
                  <div className="mt-3 font-semibold">{f.t}</div>
                  <div className="mt-1 text-sm text-slate-400">{f.d}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* -- Company view -- */
          <div className="pt-6">
            <div className="sm:hidden">
              <SearchBar onSelect={(symbol, name) => { setSel({ symbol, name }); setTab("Overview"); }} />
            </div>

            {overview.isLoading && (
              <div className="mt-10 space-y-4">
                <div className="h-10 w-2/3 animate-pulse rounded-lg bg-white/5" />
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-24 animate-pulse rounded-xl bg-white/5" />
                  ))}
                </div>
              </div>
            )}

            {overview.isError && (
              <div className="mt-10 rounded-xl border border-rose-400/20 bg-rose-500/5 p-6 text-sm text-rose-300">
                Could not load data for {sel.symbol}. The free data feed may be rate-limited or may not
                cover this listing — try again in a moment, or pick another ticker.
              </div>
            )}

            {o && (
              <>
                <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold sm:text-3xl">{o.name}</h2>
                      <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400">
                        {o.exchange}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {o.symbol} · {o.sector ?? "—"} · {o.industry ?? "—"}
                    </div>
                    {(o as any).source && (
                      <div className="mt-1 text-xs text-amber-400/80">Source: {(o as any).source}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {o.price != null ? `${fmtNum(o.price)} ${o.currency}` : "—"}
                    </div>
                    <div className="text-sm text-slate-500">
                      Mkt cap {fmtMoney(o.marketCap, o.currency)}
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="sticky top-[64px] z-30 mt-6 -mx-4 overflow-x-auto bg-slate-950/90 px-4 backdrop-blur">
                  <div className="flex gap-1 border-b border-white/10">
                    {TABS.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition ${
                          tab === t
                            ? "border-b-2 border-emerald-400 text-emerald-300"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  {tab === "Overview" && <OverviewTab data={o} />}
                  {tab === "DCF Benchmark" &&
                    (dcf.isLoading ? (
                      <div className="h-64 animate-pulse rounded-xl bg-white/5" />
                    ) : dcf.data ? (
                      <DcfTab dcf={dcf.data} />
                    ) : (
                      <p className="text-sm text-slate-400">Unable to compute DCF right now.</p>
                    ))}
                  {tab === "M&A News" &&
                    (news.isLoading ? (
                      <div className="h-64 animate-pulse rounded-xl bg-white/5" />
                    ) : news.data ? (
                      <NewsTab news={news.data} />
                    ) : (
                      <p className="text-sm text-slate-400">Unable to load news right now.</p>
                    ))}
                  {tab === "Ownership" &&
                    (ownership.isLoading ? (
                      <div className="h-64 animate-pulse rounded-xl bg-white/5" />
                    ) : ownership.data ? (
                      <OwnershipTab data={ownership.data} symbol={o.symbol} currency={o.currency} />
                    ) : (
                      <p className="text-sm text-slate-400">Unable to load ownership data right now.</p>
                    ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-600">
        QMT FIN ATLAS — data from free public feeds (Yahoo Finance), may be delayed or incomplete.
        Benchmark DCF is illustrative and not investment advice.
      </footer>
    </div>
  );
}
