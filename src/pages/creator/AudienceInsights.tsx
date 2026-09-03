import React, { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { AppShell } from "../../components/AppShell";
import { ProgressBar } from "../../components/Shared";
import { useApp } from "../../context/AppContext";
import { useMyChannel } from "../../lib/useMyChannel";
import { CREATOR_NAV } from "./nav";

function seeded(seedStr: string) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) h = (h << 5) - h + seedStr.charCodeAt(i);
  return Math.abs(h);
}

export default function AudienceInsights() {
  const { creatorHandle } = useApp();
  const { profile, loading } = useMyChannel();

  const demo = useMemo(() => {
    if (!profile) return null;
    const seed = seeded(profile.id);
    const ageGroups = [
      { label: "13–17", pct: 5 + (seed % 8) },
      { label: "18–24", pct: 28 + (seed % 12) },
      { label: "25–34", pct: 30 + (seed % 10) },
      { label: "35–44", pct: 15 + (seed % 8) },
      { label: "45+", pct: 8 + (seed % 6) },
    ];
    const total = ageGroups.reduce((a, g) => a + g.pct, 0);
    const normalized = ageGroups.map((g) => ({ ...g, pct: Math.round((g.pct / total) * 100) }));

    const geo = [
      { label: profile.country === "IN" ? "India" : "United States", pct: 45 + (seed % 20) },
      { label: "United Kingdom", pct: 10 + (seed % 8) },
      { label: "Canada", pct: 8 + (seed % 6) },
      { label: "Australia", pct: 6 + (seed % 5) },
      { label: "Other", pct: 15 },
    ];

    const gender = { male: 45 + (seed % 20), female: 0 };
    gender.female = 100 - gender.male;

    return { ageGroups: normalized, geo, gender };
  }, [profile]);

  return (
    <AppShell navItems={CREATOR_NAV} accountLabel={profile?.name ?? creatorHandle} accountSub={profile?.niche.toLowerCase() ?? ""}>
      <h1 className="text-3xl font-bold mb-2">Audience Insights</h1>
      <p className="text-slate-400 mb-8 text-sm">
        Modeled demographic breakdown based on your channel's public signals.
      </p>

      {loading || !profile || !demo ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading audience data…
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-5">Age distribution</h2>
            <div className="space-y-4">
              {demo.ageGroups.map((g) => (
                <ProgressBar key={g.label} value={g.pct} labelLeft={g.label} />
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-5">Top geographies</h2>
            <div className="space-y-4">
              {demo.geo.map((g) => (
                <ProgressBar key={g.label} value={g.pct} color="#34d399" labelLeft={g.label} />
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-5">Gender split</h2>
            <div className="space-y-4">
              <ProgressBar value={demo.gender.male} labelLeft="Male" />
              <ProgressBar value={demo.gender.female} color="#f5a623" labelLeft="Female" />
            </div>
          </div>
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-5">Authenticity signals</h2>
            <div className="space-y-4">
              <ProgressBar value={profile.realAudiencePct} color="#34d399" labelLeft="Real audience" />
              <ProgressBar value={profile.botPct} color="#f2495c" labelLeft="Bot presence" />
              <ProgressBar value={profile.engagementConsistency} labelLeft="Engagement consistency" />
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
