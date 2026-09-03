import React from "react";
import { Link } from "react-router-dom";
import { Trash2, ExternalLink } from "lucide-react";
import { AppShell } from "../../components/AppShell";
import { fmtNumber } from "../../components/Shared";
import { useApp } from "../../context/AppContext";
import { BRAND_NAV } from "./nav";

export default function SavedCreators() {
  const { brand, savedCreators, removeCreator } = useApp();

  return (
    <AppShell navItems={BRAND_NAV} accountLabel={brand.name} accountSub={brand.category.toLowerCase()}>
      <h1 className="text-3xl font-bold mb-2">Saved Creators</h1>
      <p className="text-slate-400 mb-8 text-sm">
        Creators you've shortlisted for future or ongoing campaigns.
      </p>

      {savedCreators.length === 0 ? (
        <div className="card p-12 text-center text-slate-500 text-sm">
          Nothing saved yet.{" "}
          <Link to="/brand/discovery" className="text-brand-cyan hover:underline">
            Find creators in Discovery →
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-slate-500">
                <th className="px-6 py-3 font-medium">Creator</th>
                <th className="px-6 py-3 font-medium">Subscribers</th>
                <th className="px-6 py-3 font-medium">Authenticity</th>
                <th className="px-6 py-3 font-medium">Compatibility</th>
                <th className="px-6 py-3 font-medium">Saved</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {savedCreators.map((c) => (
                <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-ink-700 flex items-center justify-center text-xs font-semibold">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-xs text-slate-500">{c.handle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{fmtNumber(c.subscribers)}</td>
                  <td className="px-6 py-4">
                    <span className="text-brand-cyan font-semibold">{c.authenticityScore}</span>/100
                  </td>
                  <td className="px-6 py-4">
                    {c.compatibility ? (
                      <span className="pill bg-brand-green/15 text-brand-green">
                        {c.compatibility.score}% {c.compatibility.label}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(c.savedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/brand/discovery?q=${encodeURIComponent(c.handle.replace("@", ""))}`}
                        className="text-slate-400 hover:text-brand-cyan"
                        title="View profile"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <button
                        onClick={() => removeCreator(c.id)}
                        className="text-slate-400 hover:text-brand-red"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
