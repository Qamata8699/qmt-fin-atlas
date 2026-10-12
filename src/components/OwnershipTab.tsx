import { useMemo } from "react";
import ReactFlow, { Background, Controls, Handle, Position } from "reactflow";
import "reactflow/dist/style.css";
import { fmtPct, fmtMoney } from "@/lib/format";

function HolderNode({ data }: any) {
  return (
    <div className="w-56 rounded-xl border border-white/15 bg-slate-900 px-4 py-3 shadow-xl">
      <Handle type="source" position={Position.Right} className="!bg-emerald-400" />
      <div className="truncate text-sm font-semibold text-slate-100" title={data.name}>{data.name}</div>
      <div className="mt-1 text-xs text-slate-400">
        {data.pct != null ? fmtPct(data.pct) : "—"} held{data.value != null ? ` · ${fmtMoney(data.value, data.currency)}` : ""}
      </div>
    </div>
  );
}

function CompanyNode({ data }: any) {
  return (
    <div className="w-64 rounded-xl border-2 border-emerald-400/60 bg-emerald-500/10 px-5 py-4 shadow-2xl">
      <Handle type="target" position={Position.Left} className="!bg-emerald-400" />
      <div className="truncate text-base font-bold text-emerald-300">{data.name}</div>
      <div className="mt-1 text-xs text-emerald-200/60">{data.symbol}</div>
    </div>
  );
}

const nodeTypes = { holder: HolderNode, company: CompanyNode };

export default function OwnershipTab({ data, symbol, currency }: { data: any; symbol: string; currency: string }) {
  const { nodes, edges } = useMemo(() => {
    const holders = (data.institutions ?? []).filter((h: any) => h.name);
    const centerY = Math.max(holders.length, 1) * 55;
    const nodes: any[] = [
      {
        id: "company",
        type: "company",
        position: { x: 430, y: centerY },
        data: { name: data.company, symbol },
      },
      ...holders.map((h: any, i: number) => ({
        id: `h${i}`,
        type: "holder",
        position: { x: 0, y: 40 + i * 110 },
        data: { name: h.name, pct: h.pctHeld, value: h.value, currency },
      })),
    ];
    const edges = holders.map((h: any, i: number) => ({
      id: `e${i}`,
      source: `h${i}`,
      target: "company",
      animated: true,
      label: h.pctHeld != null ? fmtPct(h.pctHeld) : undefined,
      style: { stroke: "#10b981", strokeWidth: 1.5 },
      labelStyle: { fill: "#94a3b8", fontSize: 11 },
      labelBgStyle: { fill: "#0f172a" },
    }));
    return { nodes, edges };
  }, [data, symbol, currency]);

  const b = data.breakdown ?? {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Insiders", fmtPct(b.insiders)],
          ["Institutions", fmtPct(b.institutions)],
          ["Inst. % of float", fmtPct(b.floatInstitutions)],
          ["# Institutions", b.institutionsCount != null ? String(b.institutionsCount) : "—"],
        ].map(([l, v]) => (
          <div key={l} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">{l}</div>
            <div className="mt-1 text-xl font-semibold text-slate-100">{v}</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-400">
          Beneficial ownership map — top institutional holders
        </h3>
        <div className="h-[480px] overflow-hidden rounded-xl border border-white/10 bg-slate-950/60">
          {nodes.length > 1 ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              nodesDraggable
              nodesConnectable={false}
              proOptions={{ hideAttribution: true }}
            >
              <Background color="rgba(255,255,255,0.05)" gap={24} />
              <Controls showInteractive={false} className="!border-white/10 !bg-slate-900 [&_button]:!border-white/10 [&_button]:!bg-slate-900 [&_button]:!fill-slate-300" />
            </ReactFlow>
          ) : (
            <p className="p-6 text-sm text-slate-400">
              No institutional ownership data available for this listing. This is common for some LSE/JSE tickers on free data feeds — try the primary US listing if one exists.
            </p>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Drag nodes to rearrange. Scroll to zoom.{" "}
          {data.source ??
            "Data: top 10 institutional holders from public 13F-style filings via Yahoo Finance."}
        </p>
      </div>

      {data.funds?.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Top mutual fund holders
          </h3>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Fund</th>
                  <th className="px-4 py-3 text-right">% held</th>
                  <th className="px-4 py-3 text-right">Position value</th>
                  <th className="px-4 py-3 text-right">Reported</th>
                </tr>
              </thead>
              <tbody>
                {data.funds.map((f: any, i: number) => (
                  <tr key={i} className="border-b border-white/5 text-slate-300">
                    <td className="px-4 py-2.5">{f.name}</td>
                    <td className="px-4 py-2.5 text-right">{fmtPct(f.pctHeld)}</td>
                    <td className="px-4 py-2.5 text-right">{fmtMoney(f.value, currency)}</td>
                    <td className="px-4 py-2.5 text-right text-slate-500">{f.reportDate ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
