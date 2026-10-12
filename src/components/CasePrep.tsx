import { useMemo, useState } from "react";
import { Search, GraduationCap, ChevronDown, Calculator, Lightbulb, AlertTriangle } from "lucide-react";
import { CASES, CATEGORY_META, type CaseCategory, type CaseItem, type CaseNode } from "@/data/cases";

const CATS = Object.keys(CATEGORY_META) as CaseCategory[];

function Tree({ node, depth = 0 }: { node: CaseNode; depth?: number }) {
  return (
    <div className={depth === 0 ? "" : "ml-4 border-l border-white/10 pl-3"}>
      <div
        className={`inline-block rounded-md border px-2.5 py-1 text-xs font-medium ${
          depth === 0
            ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
            : "border-white/15 bg-white/[0.04] text-slate-200"
        }`}
      >
        {node.label}
      </div>
      {node.children && node.children.length > 0 && (
        <div className="mt-1.5 space-y-1.5">
          {node.children.map((c, i) => (
            <Tree key={i} node={c} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function CaseCard({ item, open, onToggle }: { item: CaseItem; open: boolean; onToggle: () => void }) {
  const meta = CATEGORY_META[item.category];
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <button onClick={onToggle} className="flex w-full items-start justify-between gap-3 p-5 text-left">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="rounded-md bg-sky-500/10 px-2 py-0.5 font-semibold text-sky-300">
              {meta.label}
            </span>
            {item.firm && <span className="text-slate-500">{item.firm}</span>}
          </div>
          <h4 className="font-bold leading-snug text-slate-100">{item.title}</h4>
          <p className="mt-1 text-sm italic text-slate-400">{item.prompt}</p>
        </div>
        <ChevronDown
          className={`mt-1 h-4 w-4 shrink-0 text-slate-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="space-y-5 border-t border-white/10 p-5 pt-4">
          {item.body.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-slate-300">
              {p}
            </p>
          ))}

          {item.treeBad && (
            <div className="rounded-xl border border-rose-400/20 bg-rose-500/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-rose-300">
                <AlertTriangle className="h-3.5 w-3.5" /> The trap — a tree that looks smart but isn't MECE
              </div>
              <div className="space-y-1.5">
                {item.treeBad.map((b, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium text-rose-200">{b.label}:</span>{" "}
                    <span className="text-slate-400">{b.why}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.tree && (
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                The clean issue tree
              </div>
              <Tree node={item.tree} />
            </div>
          )}

          {item.numbers && (
            <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-300">
                <Calculator className="h-3.5 w-3.5" /> Mental maths drills
              </div>
              <div className="space-y-2">
                {item.numbers.map((n, i) => (
                  <div key={i} className="text-sm">
                    <div className="font-medium text-slate-200">{n.q}</div>
                    <div className="text-slate-400">{n.a}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.moves && (
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                <Lightbulb className="h-3.5 w-3.5" /> Moves that get you the offer
              </div>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-300">
                {item.moves.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CasePrep() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CaseCategory | "all">("all");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["mece"]));

  const toggle = (id: string) =>
    setOpenIds((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return CASES.filter((c) => {
      if (cat !== "all" && c.category !== cat) return false;
      if (!needle) return true;
      return (
        c.title.toLowerCase().includes(needle) ||
        c.prompt.toLowerCase().includes(needle) ||
        (c.firm ?? "").toLowerCase().includes(needle) ||
        c.body.some((p) => p.toLowerCase().includes(needle))
      );
    });
  }, [q, cat]);

  return (
    <div className="pt-10">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/5 px-4 py-1.5 text-xs font-medium text-sky-300">
          <GraduationCap className="h-3.5 w-3.5" /> Case interview prep — read-only
        </div>
        <h2 className="text-3xl font-bold sm:text-4xl">The Case Prep Room</h2>
        <p className="mt-3 text-sm text-slate-400 sm:text-base">
          Built for the Oliver Wyman, Bain, BCG and Rothschild grind. Frameworks, the classic
          profitability cases, market sizing, M&amp;A — explained like a friend who's already
          been through the process, with the proper terms kept intact.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search — e.g. MECE, movie theatre, valuation, Rothschild…"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-sky-400/50"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setCat("all")}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
            cat === "all"
              ? "bg-sky-500/20 text-sky-300"
              : "border border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200"
          }`}
        >
          Everything
        </button>
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            title={CATEGORY_META[c].blurb}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              cat === c
                ? "bg-sky-500/20 text-sky-300"
                : "border border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200"
            }`}
          >
            {CATEGORY_META[c].label}
          </button>
        ))}
      </div>

      {cat !== "all" && (
        <p className="mx-auto mt-4 max-w-xl text-center text-xs text-slate-500">
          {CATEGORY_META[cat].blurb}
        </p>
      )}

      <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4">
        {filtered.map((c) => (
          <CaseCard key={c.id} item={c} open={openIds.has(c.id)} onToggle={() => toggle(c.id)} />
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-500">
            Nothing matches that — try "MECE", "profits", "sizing" or "deal".
          </p>
        )}
      </div>
    </div>
  );
}
