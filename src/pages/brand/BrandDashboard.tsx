import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Megaphone, Sparkles, Users, IndianRupee, ExternalLink, Plus } from "lucide-react";
import { AppShell } from "../../components/AppShell";
import { fmtNumber, StatCard } from "../../components/Shared";
import { useApp } from "../../context/AppContext";
import { buildMockDiscoveryFeed } from "../../lib/youtube";
import { BRAND_NAV } from "./nav";
import type { CreatorProfile } from "../../lib/types";

export default function BrandDashboard() {
  const { brand, savedCreators, campaigns } = useApp();
  const [recommended, setRecommended] = useState<CreatorProfile[]>([]);

  useEffect(() => {
    setRecommended(buildMockDiscoveryFeed(brand.category, 4));
  }, [brand.category]);

  const avgAuthenticity = useMemo(() => {
    if (!savedCreators.length) return 0;
    return Math.round(
      savedCreators.reduce((a, c) => a + c.authenticityScore, 0) / savedCreators.length
    );
  }, [savedCreators]);

  const combinedReach = savedCreators.reduce((a, c) => a + c.subscribers, 0);
  const activeCampaigns = campaigns.filter((c) => c.status !== "Completed").length;

  return (
    <AppShell navItems={BRAND_NAV} accountLabel={brand.name} accountSub={brand.category.toLowerCase()}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/brand/campaigns" className="btn-primary text-sm py-2.5">
          <Plus size={16} /> New Campaign
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard
          icon={<Megaphone size={18} />}
          label="Active Campaigns"
          value={activeCampaigns}
          sub={`${campaigns.length} total`}
        />
        <StatCard
          icon={<Sparkles size={18} />}
          label="Avg Authenticity"
          value={avgAuthenticity}
          sub="Across saved creators"
        />
        <StatCard
          icon={<Users size={18} />}
          label="Saved Creators"
          value={savedCreators.length}
          sub={`${(combinedReach / 1_000_000).toFixed(1)}M combined reach`}
        />
        <StatCard
          icon={<IndianRupee size={18} />}
          label="Est. Reach"
          value={fmtNumber(combinedReach)}
          sub="Subscribers across saved"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">AI-Recommended Creators</h2>
        <Link to="/brand/discovery" className="text-sm text-brand-cyan hover:underline">
          Browse all →
        </Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {recommended.map((c) => (
          <CreatorMiniCard key={c.id} creator={c} />
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Saved Creators</h2>
        <Link to="/brand/saved" className="text-sm text-brand-cyan hover:underline">
          View all →
        </Link>
      </div>
      {savedCreators.length === 0 ? (
        <div className="card p-10 text-center text-slate-500 text-sm">
          You haven't saved any creators yet. Head to Discovery to find your first match.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {savedCreators.slice(0, 4).map((c) => (
            <CreatorMiniCard key={c.id} creator={c} />
          ))}
        </div>
      )}
    </AppShell>
  );
}

export function CreatorMiniCard({ creator }: { creator: CreatorProfile }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-11 w-11 rounded-full bg-ink-700 overflow-hidden shrink-0 flex items-center justify-center text-sm font-semibold">
          {creator.avatarUrl ? (
            <img src={creator.avatarUrl} className="h-full w-full object-cover" alt={creator.name} />
          ) : (
            creator.name.charAt(0)
          )}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm truncate">{creator.name}</div>
          <div className="text-xs text-slate-500 truncate">{creator.handle}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="pill bg-ink-700 text-slate-300 text-[11px]">{creator.country}</span>
        <span className="pill bg-ink-700 text-slate-300 text-[11px]">
          {fmtNumber(creator.subscribers)} subs
        </span>
      </div>
      <Link
        to={`/brand/discovery?q=${encodeURIComponent(creator.handle.replace("@", ""))}`}
        className="flex items-center gap-1.5 text-xs text-brand-cyan hover:underline"
      >
        View profile <ExternalLink size={12} />
      </Link>
    </div>
  );
}
