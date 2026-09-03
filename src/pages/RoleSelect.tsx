import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bot, ArrowRight } from "lucide-react";
import { Logo } from "../components/Shared";
import { useApp } from "../context/AppContext";

export default function RoleSelect() {
  const navigate = useNavigate();
  const { setRole } = useApp();

  const choose = (role: "brand" | "creator") => {
    setRole(role);
    navigate(role === "brand" ? "/brand/dashboard" : "/creator/dashboard");
  };

  return (
    <div className="min-h-screen bg-ink-950 bg-grid-fade flex flex-col">
      <header className="px-6 py-6">
        <Logo />
      </header>
      <div className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
            Stop guessing. Start matching.
          </h1>
          <p className="text-slate-400 mb-14">Choose how you want to experience VERIQ.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <RoleCard
              icon={<Search size={28} />}
              title="Brand"
              desc="Discover creators with verified audiences and predictable campaign outcomes."
              tags={["Discovery", "Compatibility Score", "ROI Forecast"]}
              cta="Continue as Brand"
              onClick={() => choose("brand")}
            />
            <RoleCard
              icon={<Bot size={28} />}
              title="Creator"
              desc="Get discovered by brands that match your audience, voice, and values."
              tags={["Verification Profile", "Brand Matches", "Growth Insights"]}
              cta="Continue as Creator"
              onClick={() => choose("creator")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleCard({
  icon,
  title,
  desc,
  tags,
  cta,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tags: string[];
  cta: string;
  onClick: () => void;
}) {
  return (
    <div className="card p-9 text-left hover:border-brand-cyan/30 transition-colors">
      <div className="h-16 w-16 rounded-full bg-brand-cyan/10 text-brand-cyan flex items-center justify-center mb-6">
        {icon}
      </div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-slate-400 text-sm mb-5">{desc}</p>
      <div className="flex flex-wrap gap-2 mb-7">
        {tags.map((t) => (
          <span key={t} className="pill bg-brand-cyan/10 text-brand-cyan text-xs">
            {t}
          </span>
        ))}
      </div>
      <button onClick={onClick} className="btn-primary w-full">
        {cta} <ArrowRight size={16} />
      </button>
    </div>
  );
}
