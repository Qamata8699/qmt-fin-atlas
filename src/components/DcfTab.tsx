import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import { fmtMoney, fmtPct, fmtNum } from "@/lib/format";

const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#e2e8f0",
};

export default function DcfTab({ dcf, cur = dcf.currency, rate = 1 }: { dcf: any; cur?: string; rate?: number }) {
  const M = (v: number | null | undefined) => fmtMoney(v == null ? v : v * rate, cur);
  const N = (v: number | null | undefined) => fmtNum(v == null ? v : v * rate);
  const upside = dcf.upsidePct;
  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-slate-400">
        A DCF (discounted cash flow) asks one simple question:{" "}
        <span className="text-slate-200">
          what are all the future cash flows of this business worth in today's money?
        </span>{" "}
        We project free cash flow forward, discount it back (because a rand next year is worth less
        than a rand today), add it up, divide by the share count — and compare that to what the
        market is charging.
      </p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">Market price</div>
          <div className="mt-1 text-2xl font-semibold text-slate-100">
            {dcf.price != null ? `${N(dcf.price)} ${cur}` : "—"}
          </div>
          <div className="mt-0.5 text-xs text-slate-500">What the market is charging right now</div>
        </div>
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/5 p-4">
          <div className="text-xs uppercase tracking-wide text-emerald-400">DCF intrinsic value</div>
          <div className="mt-1 text-2xl font-semibold text-emerald-300">
            {dcf.intrinsicValuePerShare != null ? `${N(dcf.intrinsicValuePerShare)} ${cur}` : "—"}
          </div>
          <div className="mt-0.5 text-xs text-emerald-200/60">What the maths says it's actually worth</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">Upside / downside</div>
          <div
            className={`mt-1 text-2xl font-semibold ${
              upside == null ? "text-slate-100" : upside >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {upside != null ? fmtPct(upside) : "—"}
          </div>
          <div className="mt-0.5 text-xs text-slate-500">
            {upside != null && upside >= 0 ? "Model says: potentially cheap" : upside != null ? "Model says: potentially rich" : "No live price to compare"}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">Base FCF</div>
          <div className="mt-1 text-2xl font-semibold text-slate-100">{M(dcf.baseFcf)}</div>
          <div className="mt-0.5 text-xs text-slate-500">Recent yearly free cash flow — the starting point</div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["FCF growth (proj.)", fmtPct(dcf.growthRate), "How fast we assume cash flow grows — capped, because trees don't grow to the sky"],
          ["Discount rate (WACC)", fmtPct(dcf.discountRate), "The return we demand for taking the risk — higher = harsher valuation"],
          ["Terminal growth", fmtPct(dcf.terminalGrowth), "The forever-growth rate after year 5 — kept modest, roughly inflation"],
          ["Projection horizon", `${dcf.projectionYears} years`, "How far out we model before switching to 'forever' mode"],
        ].map(([l, v, h]) => (
          <div key={l} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">{l}</div>
            <div className="mt-1 text-lg font-semibold text-slate-100">{v}</div>
            <div className="mt-0.5 text-xs text-slate-500">{h}</div>
          </div>
        ))}
      </div>

      {dcf.projectedFcf?.length > 0 && (
        <div className="h-64 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dcf.projectedFcf.map((p: any) => ({ year: `Year ${p.year}`, FCF: p.fcf, "PV of FCF": p.pv }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="year" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v: number) => M(v)} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => M(v)} />
              <ReferenceLine y={0} stroke="#475569" />
              <Bar dataKey="FCF" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              <Bar dataKey="PV of FCF" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <p className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-4 text-sm leading-relaxed text-amber-200/80">
        {dcf.assumptionsNote}
      </p>
    </div>
  );
}
