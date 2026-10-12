import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { fmtMoney, fmtPct, fmtNum } from "@/lib/format";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-semibold text-slate-100">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#e2e8f0",
};

export default function OverviewTab({ data, cur = data.currency, rate = 1 }: { data: any; cur?: string; rate?: number }) {
  const M = (v: number | null | undefined) => fmtMoney(v == null ? v : v * rate, cur);
  const N = (v: number | null | undefined) => fmtNum(v == null ? v : v * rate);
  const revChart = [...(data.revenue?.history ?? [])]
    .reverse()
    .map((h: any, i: number) => ({
      period: h.date?.slice(0, 4) ?? `FY${i}`,
      Revenue: h.value,
      "Net income": data.revenue.netIncomeHistory?.[i]?.value ?? null,
    }));
  const fcfChart = [...(data.fcfHistory ?? [])]
    .reverse()
    .map((h: any, i: number) => ({ period: h.date?.slice(0, 4) ?? `FY${i}`, FCF: h.value }));

  const p = data.profitability ?? {};
  const c = data.cashPosition ?? {};

  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-400">
          Profitability
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Gross margin" value={fmtPct(p.grossMargin)} />
          <Stat label="Operating margin" value={fmtPct(p.operatingMargin)} />
          <Stat label="Net margin" value={fmtPct(p.profitMargin)} />
          <Stat label="ROE" value={fmtPct(p.returnOnEquity)} />
          <Stat label="ROA" value={fmtPct(p.returnOnAssets)} />
          <Stat label="EBITDA" value={M(p.ebitda)} />
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-400">
          Cash position
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Total cash" value={M(c.totalCash)} />
          <Stat label="Total debt" value={M(c.totalDebt)} />
          <Stat label="Free cash flow" value={M(c.freeCashflow)} />
          <Stat label="Operating CF" value={M(c.operatingCashflow)} />
          <Stat label="Current ratio" value={fmtNum(c.currentRatio)} />
          <Stat label="Cash / share" value={N(c.cashPerShare)} hint={cur} />
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-400">
          Revenue
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Total revenue (TTM)" value={M(data.revenue?.totalRevenue)} />
          <Stat label="Revenue growth (YoY)" value={fmtPct(data.revenue?.revenueGrowth)} />
          <Stat label="Revenue / share" value={N(data.revenue?.revenuePerShare)} hint={cur} />
        </div>
        {revChart.length > 0 && (
          <div className="mt-4 h-64 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(v: number) => M(v)}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: number) => M(v)}
                />
                <Legend />
                <Bar dataKey="Revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Net income" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {fcfChart.length > 0 && (
          <div className="mt-4 h-56 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fcfChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v: number) => M(v)} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => M(v)} />
                <Legend />
                <Bar dataKey="FCF" name="Free cash flow" fill="#a78bfa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
}
