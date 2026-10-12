import { Newspaper, GitMerge, ExternalLink } from "lucide-react";

function NewsList({ items, empty }: { items: any[]; empty: string }) {
  if (!items?.length)
    return <p className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">{empty}</p>;
  return (
    <div className="space-y-3">
      {items.map((n: any, i: number) => (
        <a
          key={i}
          href={n.link}
          target="_blank"
          rel="noreferrer"
          className="group flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-emerald-400/40 hover:bg-white/[0.06]"
        >
          <div>
            <div className="text-sm font-medium leading-snug text-slate-100 group-hover:text-emerald-300">
              {n.title}
            </div>
            <div className="mt-1.5 text-xs text-slate-500">
              {n.publisher} · {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : ""}
            </div>
          </div>
          <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-slate-600 group-hover:text-emerald-400" />
        </a>
      ))}
    </div>
  );
}

export default function NewsTab({ news }: { news: any }) {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-400">
          <GitMerge className="h-4 w-4" /> Mergers &amp; acquisitions
        </h3>
        <NewsList
          items={news.ma}
          empty="No recent M&A-related headlines detected for this company (keyword-filtered from public news feeds)."
        />
      </section>
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
          <Newspaper className="h-4 w-4" /> Latest headlines
        </h3>
        <NewsList items={news.all} empty="No recent news available." />
      </section>
    </div>
  );
}
