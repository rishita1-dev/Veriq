import React, { useMemo } from "react";
import { AppShell } from "../../components/AppShell";
import { fmtNumber, ProgressBar, StatCard } from "../../components/Shared";
import { useApp } from "../../context/AppContext";
import { BRAND_NAV } from "./nav";
import { TrendingUp, Target, Users, ShieldCheck } from "lucide-react";

export default function Analytics() {
  const { brand, savedCreators, campaigns } = useApp();

  const avgAuthenticity = useMemo(
    () =>
      savedCreators.length
        ? Math.round(savedCreators.reduce((a, c) => a + c.authenticityScore, 0) / savedCreators.length)
        : 0,
    [savedCreators]
  );
  const avgRoi = useMemo(
    () =>
      campaigns.length
        ? Math.round(
            (campaigns.reduce((a, c) => a + c.prediction.estimatedRoi, 0) / campaigns.length) * 10
          ) / 10
        : 0,
    [campaigns]
  );
  const totalReach = campaigns.reduce((a, c) => a + c.prediction.estimatedReach, 0);
  const totalBudget = campaigns.reduce((a, c) => a + c.budget, 0);

  const nicheBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    savedCreators.forEach((c) => {
      map[c.niche] = (map[c.niche] ?? 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [savedCreators]);

  return (
    <AppShell navItems={BRAND_NAV} accountLabel={brand.name} accountSub={brand.category.toLowerCase()}>
      <h1 className="text-3xl font-bold mb-2">Analytics</h1>
      <p className="text-slate-400 mb-8 text-sm">
        Aggregate performance across your saved creators and forecasted campaigns.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard icon={<ShieldCheck size={18} />} label="Avg Authenticity" value={avgAuthenticity} sub="Saved creator pool" />
        <StatCard icon={<TrendingUp size={18} />} label="Avg Predicted ROI" value={`${avgRoi}x`} sub="Across campaigns" />
        <StatCard icon={<Users size={18} />} label="Forecasted Reach" value={fmtNumber(totalReach)} sub="All campaigns" />
        <StatCard icon={<Target size={18} />} label="Total Budget Committed" value={`₹${fmtNumber(totalBudget)}`} sub={`${campaigns.length} campaigns`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-bold text-lg mb-5">Niche distribution (saved creators)</h2>
          {nicheBreakdown.length === 0 ? (
            <p className="text-sm text-slate-500">Save creators to see niche distribution.</p>
          ) : (
            <div className="space-y-4">
              {nicheBreakdown.map(([niche, count]) => (
                <ProgressBar
                  key={niche}
                  value={(count / savedCreators.length) * 100}
                  labelLeft={niche}
                  labelRight={`${count}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-lg mb-5">Campaign ROI forecast</h2>
          {campaigns.length === 0 ? (
            <p className="text-sm text-slate-500">Create a campaign to see ROI trends.</p>
          ) : (
            <div className="space-y-4">
              {campaigns.map((c) => (
                <ProgressBar
                  key={c.id}
                  value={Math.min(100, c.prediction.estimatedRoi * 15)}
                  color="#f5a623"
                  labelLeft={c.name}
                  labelRight={`${c.prediction.estimatedRoi}x`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
