import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import { fmtMoney, fmtPct, fmtNum } from "@/lib/format";

const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#e2e8f0",
};

export default function DcfTab({ dcf }: { dcf: any }) {
  const cur = dcf.currency;
  const upside = dcf.upsidePct;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">Market price</div>
          <div className="mt-1 text-2xl font-semibold text-slate-100">
            {dcf.price != null ? `${fmtNum(dcf.price)} ${cur}` : "—"}
          </div>
        </div>
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/5 p-4">
          <div className="text-xs uppercase tracking-wide text-emerald-400">DCF intrinsic value</div>
          <div className="mt-1 text-2xl font-semibold text-emerald-300">
            {dcf.intrinsicValuePerShare != null ? `${fmtNum(dcf.intrinsicValuePerShare)} ${cur}` : "—"}
          </div>
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
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">Base FCF</div>
          <div className="mt-1 text-2xl font-semibold text-slate-100">{fmtMoney(dcf.baseFcf, cur)}</div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["FCF growth (proj.)", fmtPct(dcf.growthRate)],
          ["Discount rate (WACC)", fmtPct(dcf.discountRate)],
          ["Terminal growth", fmtPct(dcf.terminalGrowth)],
          ["Projection horizon", `${dcf.projectionYears} years`],
        ].map(([l, v]) => (
          <div key={l} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">{l}</div>
            <div className="mt-1 text-lg font-semibold text-slate-100">{v}</div>
          </div>
        ))}
      </div>

      {dcf.projectedFcf?.length > 0 && (
        <div className="h-64 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dcf.projectedFcf.map((p: any) => ({ year: `Year ${p.year}`, FCF: p.fcf, "PV of FCF": p.pv }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="year" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v: number) => fmtMoney(v, cur)} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtMoney(v, cur)} />
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
