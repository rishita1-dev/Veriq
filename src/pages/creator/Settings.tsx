import React from "react";
import { AppShell } from "../../components/AppShell";
import { useApp } from "../../context/AppContext";
import { useMyChannel } from "../../lib/useMyChannel";
import { CREATOR_NAV } from "./nav";
import { isYoutubeConfigured } from "../../lib/youtube";

export default function CreatorSettings() {
  const { creatorHandle } = useApp();
  const { profile } = useMyChannel();

  return (
    <AppShell navItems={CREATOR_NAV} accountLabel={profile?.name ?? creatorHandle} accountSub={profile?.niche.toLowerCase() ?? ""}>
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-slate-400 mb-8 text-sm">Manage notifications and your integration status.</p>

      <div className="card p-7 max-w-2xl space-y-5 mb-6">
        <ToggleRow label="Email me when a new brand match appears" defaultOn />
        <ToggleRow label="Weekly growth digest" defaultOn />
        <ToggleRow label="Allow brands to see contact details after 70%+ match" />
      </div>

      <div className="card p-7 max-w-2xl">
        <h2 className="font-bold mb-3">YouTube Data API</h2>
        <p className="text-sm text-slate-400 mb-3">
          Your dashboard, profile, and insights are powered by the YouTube Data API v3. Configure{" "}
          <code className="text-brand-cyan">VITE_YOUTUBE_API_KEY</code> in your{" "}
          <code className="text-brand-cyan">.env</code> file to pull live stats instead of modeled
          data.
        </p>
        <span
          className={`pill ${
            isYoutubeConfigured() ? "bg-brand-green/15 text-brand-green" : "bg-brand-amber/15 text-brand-amber"
          }`}
        >
          {isYoutubeConfigured() ? "API key detected" : "Using modeled data — no key found"}
        </span>
      </div>
    </AppShell>
  );
}

function ToggleRow({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = React.useState(defaultOn);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className={`w-11 h-6 rounded-full transition-colors relative ${on ? "bg-brand-cyan" : "bg-ink-700"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            on ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
