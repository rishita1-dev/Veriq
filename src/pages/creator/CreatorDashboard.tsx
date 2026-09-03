import React from "react";
import { Users, TrendingUp, ShieldCheck, Star, Loader2 } from "lucide-react";
import { AppShell } from "../../components/AppShell";
import { fmtNumber, ProgressBar, ScoreRing, StatCard } from "../../components/Shared";
import { useApp } from "../../context/AppContext";
import { useMyChannel } from "../../lib/useMyChannel";
import { CREATOR_NAV } from "./nav";

export default function CreatorDashboard() {
  const { creatorHandle } = useApp();
  const { profile, loading } = useMyChannel();

  return (
    <AppShell navItems={CREATOR_NAV} accountLabel={profile?.name ?? creatorHandle} accountSub={profile?.niche.toLowerCase() ?? ""}>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {loading || !profile ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading channel data…
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-[280px_1fr] gap-5 mb-10">
            <div className="card p-8 flex flex-col items-center">
              <ScoreRing score={profile.authenticityScore} />
              <div className="mt-5 text-center">
                <div className="font-bold">{profile.name}</div>
                <div className="text-sm text-slate-500">{profile.handle}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <StatCard icon={<Users size={18} />} label="Total Followers" value={fmtNumber(profile.subscribers)} sub={profile.niche} />
              <StatCard icon={<TrendingUp size={18} />} label="Engagement Rate" value={`${profile.engagementRate}%`} sub="Avg per recent video" />
              <StatCard icon={<Star size={18} />} label="Avg Views" value={fmtNumber(profile.avgViewsLast12)} sub="Last 12 videos" />
              <StatCard icon={<ShieldCheck size={18} />} label="Total Views" value={fmtNumber(profile.totalViews)} sub="All-time" />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-5">Audience Insights</h2>
              <div className="space-y-5">
                <ProgressBar value={profile.realAudiencePct} color="#34d399" labelLeft="Real audience" />
                <ProgressBar value={profile.engagementConsistency} labelLeft="Engagement consistency" />
                <ProgressBar value={profile.growthHealth} color="#f5a623" labelLeft="Growth health" />
              </div>
            </div>
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-5">AI Insights</h2>
              <div className="space-y-3">
                <InsightRow
                  title={
                    profile.authenticityScore >= 80
                      ? "Your authenticity is in the top 5% for your niche"
                      : "Your authenticity score is solid but has room to grow"
                  }
                  body="Brands looking for verified creators will surface you first."
                />
                <InsightRow
                  title={`Engagement rate ${profile.engagementRate}% ${
                    profile.engagementRate >= 2 ? "beats" : "trails"
                  } the median`}
                  body="Engagement rate is one of the strongest predictors of campaign ROI."
                />
                <InsightRow
                  title={`${profile.botPct}% estimated bot presence`}
                  body="Keep this below 10% to maintain Verified+ eligibility."
                />
              </div>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}

function InsightRow({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl bg-ink-900 border border-white/5 p-4">
      <div className="font-semibold text-sm mb-1">{title}</div>
      <div className="text-xs text-slate-500">{body}</div>
    </div>
  );
}
