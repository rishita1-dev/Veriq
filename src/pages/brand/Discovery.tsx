import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Bookmark, BookmarkCheck, Loader2, AlertCircle } from "lucide-react";
import { AppShell } from "../../components/AppShell";
import { fmtNumber, ProgressBar, ScoreRing } from "../../components/Shared";
import { useApp } from "../../context/AppContext";
import {
  buildMockDiscoveryFeed,
  computeCompatibility,
  fetchCreatorByHandle,
  isYoutubeConfigured,
} from "../../lib/youtube";
import { BRAND_NAV } from "./nav";
import type { CreatorProfile } from "../../lib/types";

export default function Discovery() {
  const { brand, saveCreator, removeCreator, isSaved } = useApp();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feed, setFeed] = useState<CreatorProfile[]>([]);
  const [selected, setSelected] = useState<CreatorProfile | null>(null);

  useEffect(() => {
    setFeed(buildMockDiscoveryFeed("discovery-" + brand.category, 8));
  }, [brand.category]);

  const runSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    try {
      const creator = await fetchCreatorByHandle(q);
      setSelected(creator);
      setParams({ q });
    } catch (e: any) {
      setError(e.message ?? "Something went wrong fetching that channel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = params.get("q");
    if (q) runSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const compatibility = selected ? computeCompatibility(selected, brand.category) : null;

  return (
    <AppShell navItems={BRAND_NAV} accountLabel={brand.name} accountSub={brand.category.toLowerCase()}>
      <h1 className="text-3xl font-bold mb-2">Discovery</h1>
      <p className="text-slate-400 mb-6 text-sm">
        Search any YouTube channel by handle or name to pull real subscriber, view, and engagement
        data and generate a verified authenticity + compatibility score.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(query);
        }}
        className="flex gap-3 mb-2"
      >
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a YouTube handle, e.g. @mrbeast"
            className="input pl-10"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary px-6">
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Search"}
        </button>
      </form>
      {!isYoutubeConfigured() && (
        <p className="text-xs text-brand-amber flex items-center gap-1.5 mb-6">
          <AlertCircle size={13} /> No YouTube API key configured — showing modeled data. Add
          VITE_YOUTUBE_API_KEY to your .env to pull live channel stats.
        </p>
      )}
      {error && <p className="text-xs text-brand-red mb-6">{error}</p>}
      {isYoutubeConfigured() && !error && <div className="mb-6" />}

      {selected && compatibility && (
        <div className="card p-7 mb-10 grid lg:grid-cols-[auto_1fr_auto] gap-8 items-center">
          <ScoreRing score={selected.authenticityScore} size={160} stroke={12} />
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h2 className="text-2xl font-bold">{selected.name}</h2>
              <span className="pill bg-ink-700 text-slate-300 text-xs">{selected.handle}</span>
              <span className="pill bg-ink-700 text-slate-300 text-xs">{selected.niche}</span>
            </div>
            <p className="text-slate-500 text-sm mb-4">{selected.description}</p>
            <div className="grid grid-cols-3 gap-4 mb-4 max-w-md">
              <MiniStat label="Subscribers" value={fmtNumber(selected.subscribers)} />
              <MiniStat label="Avg Views" value={fmtNumber(selected.avgViewsLast12)} />
              <MiniStat label="Engagement" value={`${selected.engagementRate}%`} />
            </div>
            <ProgressBar value={selected.realAudiencePct} color="#34d399" labelLeft="Real audience" />
            <div className="h-2" />
            <ProgressBar value={selected.botPct} color="#f2495c" labelLeft="Bot presence" />
          </div>
          <div className="flex flex-col items-center gap-3 min-w-[180px]">
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-brand-cyan">
                {compatibility.score}%
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">
                Compatibility · {compatibility.label}
              </div>
            </div>
            <button
              onClick={() =>
                isSaved(selected.id)
                  ? removeCreator(selected.id)
                  : saveCreator({ ...selected, savedAt: new Date().toISOString(), compatibility })
              }
              className={isSaved(selected.id) ? "btn-secondary w-full" : "btn-primary w-full"}
            >
              {isSaved(selected.id) ? (
                <>
                  <BookmarkCheck size={16} /> Saved
                </>
              ) : (
                <>
                  <Bookmark size={16} /> Save creator
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Suggested for {brand.category}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {feed.map((c) => (
          <button
            key={c.id}
            onClick={() => runSearch(c.handle.replace("@", ""))}
            className="card p-5 text-left hover:border-brand-cyan/30 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-ink-700 flex items-center justify-center text-sm font-semibold shrink-0">
                {c.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{c.name}</div>
                <div className="text-xs text-slate-500 truncate">{c.handle}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{fmtNumber(c.subscribers)} subs</span>
              <span className="text-brand-cyan font-semibold">{c.authenticityScore} score</span>
            </div>
          </button>
        ))}
      </div>
    </AppShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
