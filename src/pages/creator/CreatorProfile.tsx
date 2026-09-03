import React, { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { AppShell } from "../../components/AppShell";
import { fmtNumber } from "../../components/Shared";
import { useApp } from "../../context/AppContext";
import { useMyChannel } from "../../lib/useMyChannel";
import { CREATOR_NAV } from "./nav";

export default function CreatorProfile() {
  const { creatorHandle, setCreatorHandle } = useApp();
  const { profile, loading } = useMyChannel();
  const [input, setInput] = useState(creatorHandle);

  return (
    <AppShell navItems={CREATOR_NAV} accountLabel={profile?.name ?? creatorHandle} accountSub={profile?.niche.toLowerCase() ?? ""}>
      <h1 className="text-3xl font-bold mb-2">My Profile</h1>
      <p className="text-slate-400 mb-8 text-sm">
        Link your YouTube channel to power your verification profile.
      </p>

      <div className="card p-7 max-w-xl mb-8">
        <label className="text-xs text-slate-400 mb-1.5 block">YouTube handle or channel name</label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCreatorHandle(input);
          }}
          className="flex gap-3"
        >
          <input value={input} onChange={(e) => setInput(e.target.value)} className="input" placeholder="@yourchannel" />
          <button type="submit" className="btn-primary shrink-0">
            Update
          </button>
        </form>
      </div>

      {loading || !profile ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading channel data…
        </div>
      ) : (
        <div className="card p-7 max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-ink-700 flex items-center justify-center text-xl font-semibold overflow-hidden">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} className="h-full w-full object-cover" alt={profile.name} />
              ) : (
                profile.name.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{profile.name}</h2>
                {profile.authenticityScore >= 80 && (
                  <span className="pill bg-brand-cyan/15 text-brand-cyan text-xs">
                    <ShieldCheck size={12} /> Verified+
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500">
                {profile.handle} · {profile.country} · {profile.niche}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-6">{profile.description}</p>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Subscribers" value={fmtNumber(profile.subscribers)} />
            <Field label="Videos" value={fmtNumber(profile.videoCount)} />
            <Field label="Authenticity" value={`${profile.authenticityScore}/100`} />
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ink-900 border border-white/5 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
