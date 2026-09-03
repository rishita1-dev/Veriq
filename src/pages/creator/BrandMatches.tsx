import React, { useMemo } from "react";
import { Loader2, IndianRupee } from "lucide-react";
import { AppShell } from "../../components/AppShell";
import { useApp } from "../../context/AppContext";
import { useMyChannel } from "../../lib/useMyChannel";
import { computeCompatibility } from "../../lib/youtube";
import { CREATOR_NAV } from "./nav";

const MOCK_BRANDS = [
  { name: "boAt Lifestyle", category: "Tech", budget: 250000 },
  { name: "Mamaearth", category: "Beauty", budget: 180000 },
  { name: "Cult.fit", category: "Fitness", budget: 200000 },
  { name: "Zomato", category: "Food", budget: 150000 },
  { name: "Myntra", category: "Fashion", budget: 300000 },
  { name: "Groww", category: "Finance", budget: 220000 },
  { name: "MakeMyTrip", category: "Travel", budget: 175000 },
  { name: "Duolingo", category: "Education", budget: 120000 },
];

export default function BrandMatches() {
  const { creatorHandle } = useApp();
  const { profile, loading } = useMyChannel();

  const matches = useMemo(() => {
    if (!profile) return [];
    return MOCK_BRANDS.map((b) => ({
      ...b,
      compatibility: computeCompatibility(profile, b.category),
    })).sort((a, b) => b.compatibility.score - a.compatibility.score);
  }, [profile]);

  return (
    <AppShell navItems={CREATOR_NAV} accountLabel={profile?.name ?? creatorHandle} accountSub={profile?.niche.toLowerCase() ?? ""}>
      <h1 className="text-3xl font-bold mb-2">Brand Matches</h1>
      <p className="text-slate-400 mb-8 text-sm">
        Brands ranked by AI-computed compatibility with your audience and content style.
      </p>

      {loading || !profile ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Loader2 size={16} className="animate-spin" /> Finding matches…
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {matches.map((m) => (
            <div key={m.name} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{m.name}</h3>
                  <span className="pill bg-ink-700 text-slate-300 text-xs mt-1">{m.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-display font-bold text-brand-cyan">
                    {m.compatibility.score}%
                  </div>
                  <div className="text-xs text-slate-500">{m.compatibility.label}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <MetricPill label="Audience overlap" value={m.compatibility.breakdown.audienceOverlap} />
                <MetricPill label="Voice match" value={m.compatibility.breakdown.voiceMatch} />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <IndianRupee size={12} /> Avg budget ₹{m.budget.toLocaleString("en-IN")}
                </span>
                <button className="text-brand-cyan hover:underline font-medium">Request intro →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}

function MetricPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-ink-900 border border-white/5 p-3">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="font-semibold">{value}%</div>
    </div>
  );
}
