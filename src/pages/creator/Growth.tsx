import React, { useMemo } from "react";
import { Loader2, TrendingUp } from "lucide-react";
import { AppShell } from "../../components/AppShell";
import { fmtNumber, ProgressBar } from "../../components/Shared";
import { useApp } from "../../context/AppContext";
import { useMyChannel } from "../../lib/useMyChannel";
import { CREATOR_NAV } from "./nav";

function seeded(seedStr: string) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) h = (h << 5) - h + seedStr.charCodeAt(i);
  return Math.abs(h);
}

export default function Growth() {
  const { creatorHandle } = useApp();
  const { profile, loading } = useMyChannel();

  const trend = useMemo(() => {
    if (!profile) return [];
    const seed = seeded(profile.id);
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
    let base = profile.subscribers * 0.85;
    return months.map((month, i) => {
      const variation =
        0.01 +
        ((seed + i * 7) % 11) * 0.006;

      base += profile.subscribers * variation;

      return {
        month,
        subs: Math.round(base),
      };
    });
  }, [profile]);

  const maxSubs = trend.length ? Math.max(...trend.map((t) => t.subs)) : 1;

  return (
    <AppShell navItems={CREATOR_NAV} accountLabel={profile?.name ?? creatorHandle} accountSub={profile?.niche.toLowerCase() ?? ""}>
      <h1 className="text-3xl font-bold mb-2">Growth</h1>
      <p className="text-slate-400 mb-8 text-sm">Track your subscriber trajectory and channel health signals.</p>

      {loading || !profile ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading growth data…
        </div>
      ) : (
        <>
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <TrendingUp size={18} className="text-brand-cyan" /> Subscriber trend (6 months)
              </h2>
              <span className="text-sm text-brand-green font-semibold">
                +{fmtNumber(trend[trend.length - 1].subs - trend[0].subs)}
              </span>
            </div>
            <div className="h-48 w-full">
              <svg
                viewBox="0 0 600 180"
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand-cyan"
                  points={trend
                    .map((t, i) => {
                      const x =
                        trend.length === 1
                          ? 300
                          : (i / (trend.length - 1)) * 560 + 20;

                      const y =
                        160 -
                        ((t.subs / maxSubs) * 130);

                      return `${x},${y}`;
                    })
                    .join(" ")}
                />

                {trend.map((t, i) => {
                  const x =
                    trend.length === 1
                      ? 300
                      : (i / (trend.length - 1)) * 560 + 20;

                  const y =
                    160 -
                    ((t.subs / maxSubs) * 130);

                  return (
                    <g key={t.month}>
                      <circle
                        cx={x}
                        cy={y}
                        r="5"
                        className="fill-brand-cyan"
                      />

                      <text
                        x={x}
                        y="178"
                        textAnchor="middle"
                        className="fill-slate-500 text-[11px]"
                      >
                        {t.month}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-5">Channel health</h2>
              <div className="space-y-4">
                <ProgressBar value={profile.growthHealth} color="#f5a623" labelLeft="Growth health" />
                <ProgressBar value={profile.engagementConsistency} labelLeft="Upload consistency" />
                <ProgressBar value={profile.authenticityScore} color="#34d399" labelLeft="Authenticity score" />
              </div>
            </div>
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-5">Recommendations</h2>
              <ul className="space-y-3 text-sm">
                <li className="rounded-xl bg-ink-900 border border-white/5 p-4">
                  Maintain a consistent upload cadence — channels with steady schedules see
                  higher compatibility scores with brand campaigns.
                </li>
                <li className="rounded-xl bg-ink-900 border border-white/5 p-4">
                  Your engagement rate of {profile.engagementRate}% is{" "}
                  {profile.engagementRate >= 2 ? "above" : "near"} the platform median — keep
                  encouraging comments to sustain it.
                </li>
                <li className="rounded-xl bg-ink-900 border border-white/5 p-4">
                  Reaching an authenticity score of 85+ unlocks the Verified+ badge, which
                  historically doubles inbound brand interest.
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
