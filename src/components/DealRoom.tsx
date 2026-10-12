import { useMemo, useState } from "react";
import { Search, Handshake, Hourglass, Ban, ArrowUpRight } from "lucide-react";
import { DEALS, STATUS_META, type Deal, type DealStatus } from "@/data/deals";
import SaFlag from "@/components/SaFlag";

const STATUS_STYLE: Record<DealStatus, { chip: string; icon: any }> = {
  pending: { chip: "border-amber-400/30 bg-amber-500/10 text-amber-300", icon: Hourglass },
  completed: { chip: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300", icon: Handshake },
  declined: { chip: "border-rose-400/30 bg-rose-500/10 text-rose-300", icon: Ban },
};

function DealCard({ deal, onOpen }: { deal: Deal; onOpen: (symbol: string, name: string) => void }) {
  const meta = STATUS_STYLE[deal.status];
  const Icon = meta.icon;
  return (
    <article className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/25">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold text-slate-100">{deal.acquirer}</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-500" />
            <span className="font-semibold text-slate-100">{deal.target}</span>
            {deal.flag === "ZA" && <SaFlag className="h-3 w-[18px] rounded-[2px]" />}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {deal.sector} · {deal.announced}
          </div>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${meta.chip}`}>
          <Icon className="h-3 w-3" />
          {deal.status === "pending" ? "Pending" : deal.status === "completed" ? "Completed" : "Declined"}
        </span>
      </div>

      <div className="mt-3 text-lg font-bold text-emerald-300">{deal.value}</div>
      <div className="text-xs text-slate-500">{deal.statusNote}</div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{deal.story}</p>

      {deal.lesson && (
        <p className="mt-3 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-xs italic text-slate-500">
          “{deal.lesson}”
        </p>
      )}

      {(deal.acquirerTicker || deal.targetTicker) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {deal.acquirerTicker && (
            <button
              onClick={() => onOpen(deal.acquirerTicker!, deal.acquirer)}
              className="rounded-full border border-emerald-400/30 px-3 py-1.5 text-xs text-emerald-300 transition hover:bg-emerald-500/10"
            >
              {deal.acquirer} · {deal.acquirerTicker}
            </button>
          )}
          {deal.targetTicker && (
            <button
              onClick={() => onOpen(deal.targetTicker!, deal.target)}
              className="rounded-full border border-sky-400/30 px-3 py-1.5 text-xs text-sky-300 transition hover:bg-sky-500/10"
            >
              {deal.target} · {deal.targetTicker}
            </button>
          )}
        </div>
      )}
    </article>
  );
}

export default function DealRoom({ onOpen }: { onOpen: (symbol: string, name: string) => void }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<DealStatus | "all">("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return DEALS.filter((d) => filter === "all" || d.status === filter).filter(
      (d) =>
        !needle ||
        [d.acquirer, d.target, d.sector, d.story, d.value, d.announced]
          .join(" ")
          .toLowerCase()
          .includes(needle)
    );
  }, [q, filter]);

  const groups: { status: DealStatus; deals: Deal[] }[] = (
    ["pending", "completed", "declined"] as DealStatus[]
  )
    .map((s) => ({ status: s, deals: filtered.filter((d) => d.status === s) }))
    .filter((g) => g.deals.length > 0);

  return (
    <div className="py-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-3xl font-bold">
            The <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">Deal Room</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Storyboards of the deals that happened, the ones still in play, and the ones that got
            away — from Yahoo twice passing on Google to MTN's on-again pursuit of Telkom. Tap a
            ticker on any card to open the live company profile.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search deals — e.g. Zuckerberg, Nvidia, MTN, Twitter…"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm outline-none placeholder:text-slate-500 focus:border-emerald-400/50"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["all", "pending", "completed", "declined"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3.5 py-2 text-xs font-medium transition ${
                filter === s
                  ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40"
                  : "border border-white/10 text-slate-400 hover:text-slate-200"
              }`}
            >
              {s === "all" ? "All boards" : s === "pending" ? "Pending & rumoured" : s === "completed" ? "Done deals" : "Declined & missed"}
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 && (
        <p className="mt-10 text-center text-sm text-slate-500">No storyboards match “{q}”.</p>
      )}

      {groups.map((g) => (
        <section key={g.status} className="mt-10">
          <div className="mb-4 flex items-baseline gap-3">
            <h3 className="text-lg font-semibold text-slate-100">{STATUS_META[g.status].label}</h3>
            <span className="text-xs text-slate-500">{STATUS_META[g.status].blurb}</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {g.deals.map((d) => (
              <DealCard key={d.id} deal={d} onOpen={onOpen} />
            ))}
          </div>
        </section>
      ))}

      <p className="mt-10 text-xs text-slate-600">
        Storyboards are curated from public reporting and may lag fast-moving situations. For
        company-specific M&amp;A filings and news, open a company and check its M&amp;A News tab.
      </p>
    </div>
  );
}
