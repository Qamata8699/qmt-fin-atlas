import { useEffect, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { trpc } from "@/providers/trpc";

interface Props {
  onSelect: (symbol: string, name: string) => void;
  large?: boolean;
}

export default function SearchBar({ onSelect, large }: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [debounced, setDebounced] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const { data, isFetching } = trpc.finance.search.useQuery(
    { q: debounced },
    { enabled: debounced.length >= 1 }
  );

  return (
    <div ref={boxRef} className={`relative w-full ${large ? "max-w-2xl" : "max-w-md"}`}>
      <div
        className={`flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 backdrop-blur focus-within:border-emerald-400/60 ${
          large ? "py-4" : "py-2.5"
        }`}
      >
        {isFetching ? (
          <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
        ) : (
          <Search className="h-5 w-5 text-slate-400" />
        )}
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search companies — NYSE, LSE, JSE (e.g. Apple, VOD.L, NPN.JO)"
          className={`w-full bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none ${
            large ? "text-lg" : "text-sm"
          }`}
        />
      </div>
      {open && data && data.length > 0 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl">
          {data.map((r: { symbol: string; name: string; exchange: string }) => (
            <button
              key={r.symbol}
              onClick={() => {
                onSelect(r.symbol, r.name);
                setOpen(false);
                setQ("");
              }}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/5"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-slate-100">{r.name}</div>
                <div className="text-xs text-slate-500">{r.symbol}</div>
              </div>
              <span className="shrink-0 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400">
                {r.exchange}
              </span>
            </button>
          ))}
        </div>
      )}
      {open && data && data.length === 0 && !isFetching && debounced && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-400">
          No NYSE / LSE / JSE listings found.
        </div>
      )}
    </div>
  );
}
