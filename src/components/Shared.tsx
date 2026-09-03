import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";

export function Logo({ size = 22 }: { size?: number }) {
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0">
      <ShieldCheck size={size} className="text-brand-cyan" />
      <span className="font-display font-bold tracking-tight text-lg">VERIQ</span>
    </Link>
  );
}

export function MarketingNavbar() {
  const navigate = useNavigate();
  const links = [
    { label: "Product", href: "/#product" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Reviews", href: "/#reviews" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/select-role")}
            className="text-sm text-slate-300 hover:text-white transition-colors hidden sm:block"
          >
            Log in
          </button>
          <button onClick={() => navigate("/select-role")} className="btn-primary text-sm py-2 px-4">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-950">
      <div className="mx-auto max-w-7xl px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-3 text-sm text-slate-400">Verified creator-brand intelligence.</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="/#product" className="hover:text-white">Discovery</a></li>
            <li><a href="/#product" className="hover:text-white">Compatibility</a></li>
            <li><a href="/#product" className="hover:text-white">ROI Forecast</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><span className="hover:text-white cursor-default">About</span></li>
            <li><span className="hover:text-white cursor-default">Careers</span></li>
            <li><span className="hover:text-white cursor-default">Press</span></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><span className="hover:text-white cursor-default">Privacy Policy</span></li>
            <li><span className="hover:text-white cursor-default">Terms</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} VERIQ. All rights reserved.
      </div>
    </footer>
  );
}

export function ScoreRing({
  score,
  size = 220,
  stroke = 16,
  label = "AUTHENTICITY SCORE",
}: {
  score: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;
  const color = score >= 85 ? "#34d399" : score >= 65 ? "#38d6ff" : score >= 45 ? "#f5a623" : "#f2495c";
  const banding = score >= 85 ? "Excellent" : score >= 65 ? "Good" : score >= 45 ? "Fair" : "Needs Review";

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#16283f" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="-mt-[135px] flex flex-col items-center">
        <span className="text-5xl font-display font-bold">{score}</span>
        <span className="text-xs text-slate-400">/100</span>
      </div>
      <div className="mt-6 text-center">
        {label && <div className="text-xs tracking-wider text-slate-400 uppercase">{label}</div>}
        <span
          className="pill mt-2"
          style={{ backgroundColor: `${color}22`, color }}
        >
          {banding}
        </span>
      </div>
    </div>
  );
}

export function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="text-brand-cyan/80">{icon}</span>
      </div>
      <div className="text-3xl font-display font-bold">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

export function ProgressBar({
  value,
  color = "#38d6ff",
  labelLeft,
  labelRight,
}: {
  value: number;
  color?: string;
  labelLeft: string;
  labelRight?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="text-slate-300">{labelLeft}</span>
        <span className="font-semibold">{labelRight ?? `${value}%`}</span>
      </div>
      <div className="h-2 rounded-full bg-ink-700 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(100, value)}%`, backgroundColor: color, transition: "width 0.6s ease" }}
        />
      </div>
    </div>
  );
}

export function fmtNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

export function fmtINR(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function LogoutButton() {
  const { reset } = useApp();
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        reset();
        navigate("/");
      }}
      className="text-slate-400 hover:text-white transition-colors"
      title="Log out"
    >
      Log out
    </button>
  );
}
