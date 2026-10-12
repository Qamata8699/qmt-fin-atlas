import { useState } from "react";
import { Activity, Landmark, Globe2, TrendingUp } from "lucide-react";
import { trpc } from "@/providers/trpc";
import SearchBar from "@/components/SearchBar";
import OverviewTab from "@/components/OverviewTab";
import DcfTab from "@/components/DcfTab";
import NewsTab from "@/components/NewsTab";
import OwnershipTab from "@/components/OwnershipTab";
import SaFlag from "@/components/SaFlag";
import DealRoom from "@/components/DealRoom";
import CasePrep from "@/components/CasePrep";
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
  const [zar, setZar] = useState(true);
  const [view, setView] = useState<"search" | "deals" | "cases">("search");

  const openCompany = (symbol: string, name: string) => {
    setSel({ symbol, name });
    setTab("Overview");
    setView("search");
  };

  const fx = trpc.finance.fx.useQuery(undefined, { staleTime: 30 * 60 * 1000 });

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
  const rate = o && zar ? (fx.data?.rates?.[o.currency] ?? 1) : 1;
  const cur = o ? (zar ? "ZAR" : o.currency) : "ZAR";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <button onClick={() => { setSel(null); setView("search"); }} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <div className="text-sm font-bold tracking-wide">QMT FIN ATLAS</div>
                <SaFlag className="h-3 w-[18px] rounded-[2px] ring-1 ring-white/20" />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500">
                NYSE · LSE · JSE intelligence
              </div>
            </div>
          </button>
          <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5 text-xs font-medium">
            {(["search", "deals", "cases"] as const).map((v) => (
              <button
                key={v}
                onClick={() => { setView(v); if (v !== "search") setSel(null); }}
                className={`rounded-md px-2.5 py-1.5 transition ${
                  view === v
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {v === "search" ? "Search" : v === "deals" ? "Deal Room" : "Case Prep"}
              </button>
            ))}
          </div>
          {sel && (
            <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5 text-xs font-medium">
              {([false, true] as const).map((v) => (
                <button
                  key={String(v)}
                  onClick={() => setZar(v)}
                  className={`rounded-md px-2.5 py-1.5 transition ${
                    zar === v ? "bg-emerald-500/20 text-emerald-300" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {v ? "R ZAR" : "Local"}
                </button>
              ))}
            </div>
          )}
          {sel && (
            <div className="hidden sm:block">
              <SearchBar onSelect={openCompany} />
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20">
        {view === "deals" && !sel ? (
          <DealRoom onOpen={openCompany} />
        ) : view === "cases" && !sel ? (
          <CasePrep />
        ) : !sel ? (
          /* ── Landing / hero ── */
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
              Type a company, get the full picture — is it profitable, is it drowning in debt,
              what's it actually worth, who's buying who, and which giants quietly own the stock.
              No jargon walls, we translate as we go.
            </p>
            <div className="mt-9 flex w-full justify-center px-2">
              <SearchBar large onSelect={openCompany} />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {EXAMPLES.map((e) => (
                <button
                  key={e.symbol}
                  onClick={() => openCompany(e.symbol, e.label.split(" · ")[0])}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-slate-300 transition hover:border-emerald-400/40 hover:text-emerald-300"
                >
                  {e.label}
                </button>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setView("deals")}
                className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-6 py-2.5 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20"
              >
                Visit the Deal Room — the M&amp;A tea: done deals, live situations &amp; legendary fumbles
              </button>
              <button
                onClick={() => setView("cases")}
                className="rounded-full border border-sky-400/40 bg-sky-500/10 px-6 py-2.5 text-sm font-medium text-sky-300 transition hover:bg-sky-500/20"
              >
                Case Prep — frameworks &amp; practice cases for the consulting grind
              </button>
            </div>
            <div className="mt-16 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: Activity, t: "Fundamentals", d: "Margins, returns, cash and debt — is the business actually healthy, in plain terms." },
                { icon: TrendingUp, t: "DCF benchmark", d: "What the future cash flows are worth today vs what the market is charging. Every assumption spelled out." },
                { icon: Landmark, t: "Ownership maps", d: "See who's really on the register — the Vanguards and BlackRocks whose moves quietly shift prices." },
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
          /* ── Company view ── */
          <div className="pt-6">
            <div className="sm:hidden">
              <SearchBar onSelect={openCompany} />
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
                Couldn't pull the data for {sel.symbol} — the free feed is probably rate-limited
                right now, or it doesn't cover this listing. Give it a few seconds and try again,
                or grab another ticker.
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
                      {o.price != null ? `${fmtNum(o.price * rate)} ${cur}` : "—"}
                    </div>
                    {zar && o.currency !== "ZAR" && rate !== 1 && (
                      <div className="text-xs text-emerald-400/80">
                        1 {o.currency} ≈ R{rate.toFixed(2)}
                      </div>
                    )}
                    <div className="text-sm text-slate-500">
                      Mkt cap {fmtMoney(o.marketCap != null ? o.marketCap * rate : null, cur)}
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
                  {tab === "Overview" && <OverviewTab data={o} cur={cur} rate={rate} />}
                  {tab === "DCF Benchmark" &&
                    (dcf.isLoading ? (
                      <div className="h-64 animate-pulse rounded-xl bg-white/5" />
                    ) : dcf.data ? (
                      <DcfTab dcf={dcf.data} cur={cur} rate={rate} />
                    ) : (
                      <p className="text-sm text-slate-400">Can't run the DCF right now — the free feed didn't give us enough cash-flow history. Try again shortly.</p>
                    ))}
                  {tab === "M&A News" &&
                    (news.isLoading ? (
                      <div className="h-64 animate-pulse rounded-xl bg-white/5" />
                    ) : news.data ? (
                      <NewsTab news={news.data} />
                    ) : (
                      <p className="text-sm text-slate-400">No news coming through right now — the feed's probably rate-limited. Give it a moment.</p>
                    ))}
                  {tab === "Ownership" &&
                    (ownership.isLoading ? (
                      <div className="h-64 animate-pulse rounded-xl bg-white/5" />
                    ) : ownership.data ? (
                      <OwnershipTab data={ownership.data} symbol={o.symbol} currency={cur} rate={rate} />
                    ) : (
                      <p className="text-sm text-slate-400">Ownership data isn't coming through right now — try again in a moment.</p>
                    ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-600">
        <div className="mb-2 flex items-center justify-center gap-2">
          <SaFlag className="h-3.5 w-[21px] rounded-[2px]" />
          <span className="font-medium text-slate-500">Proudly South African — QMT, from QAMATA</span>
        </div>
        QMT FIN ATLAS — data from free public feeds (Yahoo Finance), may be delayed or incomplete.
        Benchmark DCF is illustrative and not investment advice.
      </footer>
    </div>
  );
}
