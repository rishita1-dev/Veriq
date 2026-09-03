import React, { useState } from "react";
import { Plus, TrendingUp, Users, Percent, X } from "lucide-react";
import { AppShell } from "../../components/AppShell";
import { fmtINR, fmtNumber } from "../../components/Shared";
import { useApp } from "../../context/AppContext";
import { predictCampaign } from "../../lib/youtube";
import { BRAND_NAV } from "./nav";
import type { Campaign } from "../../lib/types";

export default function Campaigns() {
  const { brand, savedCreators, campaigns, addCampaign } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [budget, setBudget] = useState(brand.budgetPerCampaign);

  const selectedCreator = savedCreators.find((c) => c.id === creatorId);
  const preview = selectedCreator ? predictCampaign(selectedCreator, budget) : null;

  const createCampaign = () => {
    if (!name || !selectedCreator) return;
    const prediction = predictCampaign(selectedCreator, budget);
    const campaign: Campaign = {
      id: `camp_${Date.now()}`,
      name,
      creatorHandle: selectedCreator.handle,
      creatorName: selectedCreator.name,
      status: "Draft",
      budget,
      createdAt: new Date().toISOString(),
      prediction,
    };
    addCampaign(campaign);
    setShowForm(false);
    setName("");
    setCreatorId("");
  };

  return (
    <AppShell navItems={BRAND_NAV} accountLabel={brand.name} accountSub={brand.category.toLowerCase()}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Campaigns</h1>
          <p className="text-slate-400 text-sm">Plan, forecast, and track creator collaborations.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg">New Campaign</h2>
            <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white">
              <X size={18} />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Campaign name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Festive Launch Push"
                className="input"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Creator</label>
              <select
                value={creatorId}
                onChange={(e) => setCreatorId(e.target.value)}
                className="input"
              >
                <option value="">Select a saved creator</option>
                {savedCreators.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.handle})
                  </option>
                ))}
              </select>
              {savedCreators.length === 0 && (
                <p className="text-xs text-brand-amber mt-1.5">
                  Save a creator from Discovery first.
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Budget (INR)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="input"
              />
            </div>
          </div>

          {preview && (
            <div className="grid grid-cols-3 gap-4 mb-6 rounded-xl bg-ink-900 border border-white/5 p-4">
              <PreviewStat icon={<Users size={15} />} label="Est. Reach" value={fmtNumber(preview.estimatedReach)} />
              <PreviewStat
                icon={<Percent size={15} />}
                label="Est. Engagement"
                value={`${preview.estimatedEngagementRate}%`}
              />
              <PreviewStat
                icon={<TrendingUp size={15} />}
                label="Est. ROI"
                value={`${preview.estimatedRoi}x`}
                sub={`${preview.confidence} confidence`}
              />
            </div>
          )}

          <button onClick={createCampaign} disabled={!name || !selectedCreator} className="btn-primary">
            Create campaign
          </button>
        </div>
      )}

      {campaigns.length === 0 ? (
        <div className="card p-12 text-center text-slate-500 text-sm">
          No campaigns yet. Create your first one to see an AI-forecasted reach, engagement rate, and ROI.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {campaigns.map((c) => (
            <div key={c.id} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">{c.name}</h3>
                  <p className="text-sm text-slate-500">
                    {c.creatorName} · {c.creatorHandle}
                  </p>
                </div>
                <StatusPill status={c.status} />
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <PreviewStat icon={<Users size={14} />} label="Reach" value={fmtNumber(c.prediction.estimatedReach)} />
                <PreviewStat
                  icon={<Percent size={14} />}
                  label="Engagement"
                  value={`${c.prediction.estimatedEngagementRate}%`}
                />
                <PreviewStat icon={<TrendingUp size={14} />} label="ROI" value={`${c.prediction.estimatedRoi}x`} />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Budget {fmtINR(c.budget)}</span>
                <span>{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}

function PreviewStat({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
        {icon} {label}
      </div>
      <div className="font-semibold">{value}</div>
      {sub && <div className="text-[11px] text-slate-500">{sub}</div>}
    </div>
  );
}

function StatusPill({ status }: { status: Campaign["status"] }) {
  const styles: Record<Campaign["status"], string> = {
    Draft: "bg-slate-500/15 text-slate-300",
    Active: "bg-brand-green/15 text-brand-green",
    Completed: "bg-brand-cyan/15 text-brand-cyan",
  };
  return <span className={`pill ${styles[status]} text-xs`}>{status}</span>;
}
