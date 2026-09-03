import React, { useState } from "react";
import { AppShell } from "../../components/AppShell";
import { useApp } from "../../context/AppContext";
import { BRAND_NAV } from "./nav";
import { isYoutubeConfigured } from "../../lib/youtube";
import { Check } from "lucide-react";

const CATEGORIES = ["Lifestyle", "Tech", "Beauty", "Fitness", "Gaming", "Food", "Fashion", "Finance"];

export default function BrandSettings() {
  const { brand, setBrand } = useApp();
  const [form, setForm] = useState(brand);
  const [saved, setSaved] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBrand(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell navItems={BRAND_NAV} accountLabel={brand.name} accountSub={brand.category.toLowerCase()}>
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-slate-400 mb-8 text-sm">Manage your brand profile and integration status.</p>

      <form onSubmit={submit} className="card p-7 max-w-2xl space-y-5">
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Brand name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="input"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Brand voice tags (comma separated)</label>
          <input
            value={form.values.join(", ")}
            onChange={(e) => setForm({ ...form, values: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })}
            className="input"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Default campaign budget (₹)</label>
          <input
            type="number"
            value={form.budgetPerCampaign}
            onChange={(e) => setForm({ ...form, budgetPerCampaign: Number(e.target.value) })}
            className="input"
          />
        </div>
        <button type="submit" className="btn-primary">
          {saved ? (
            <>
              <Check size={16} /> Saved
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </form>

      <div className="card p-7 max-w-2xl mt-6">
        <h2 className="font-bold mb-3">YouTube Data API</h2>
        <p className="text-sm text-slate-400 mb-3">
          Discovery uses the YouTube Data API v3 to pull live channel statistics. Configure your key
          in a <code className="text-brand-cyan">.env</code> file as{" "}
          <code className="text-brand-cyan">VITE_YOUTUBE_API_KEY</code>.
        </p>
        <span className={`pill ${isYoutubeConfigured() ? "bg-brand-green/15 text-brand-green" : "bg-brand-amber/15 text-brand-amber"}`}>
          {isYoutubeConfigured() ? "API key detected" : "Using modeled data — no key found"}
        </span>
      </div>
    </AppShell>
  );
}
