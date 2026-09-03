import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Fingerprint,
  MessageSquare,
  BrainCircuit,
  Check,
  X,
  ArrowRight,
} from "lucide-react";
import { MarketingNavbar, Footer } from "../components/Shared";

const FEATURES = [
  {
    icon: <ShieldCheck size={20} />,
    title: "Authenticity Scoring",
    desc: "A 0–100 score combining follower quality, growth pattern anomalies, and historical engagement consistency.",
  },
  {
    icon: <Users size={20} />,
    title: "Audience Demographic Analysis",
    desc: "Age, geography, interest, and language breakdowns modeled against platform-level signals.",
  },
  {
    icon: <Fingerprint size={20} />,
    title: "Bot & Fraud Detection",
    desc: "Pattern-based detection of purchased followers, engagement pods, and inorganic spikes.",
  },
  {
    icon: <MessageSquare size={20} />,
    title: "Voice & Content Style Matching",
    desc: "Language analysis of captions, scripts, and tone to match brand voice with creator authenticity.",
  },
  {
    icon: <TrendingUp size={20} />,
    title: "Campaign Success Prediction",
    desc: "Forecasts reach, engagement rate, and ROI range based on historical performance of similar pairings.",
  },
  {
    icon: <BrainCircuit size={20} />,
    title: "Smart Recommendation Engine",
    desc: "Continuously ranks the creators most likely to produce a successful, authentic collaboration.",
  },
];

const COMPARISON = [
  { other: "Optimize for volume of introductions", veriq: "Optimizes for verified fit" },
  { other: "Surface follower count", veriq: "Surfaces authenticity + compatibility" },
  { other: "ROI is a surprise after spend", veriq: "ROI is a forecast before spend" },
  { other: "One-sided (brand-first)", veriq: "Dual-sided value for brands and creators" },
];

const TESTIMONIALS = [
  {
    quote:
      "VERIQ caught three fake-follower creators before we signed. Saved us ₹40L in wasted spends in the very first quarter.",
    name: "Ananya Sharma",
    role: "Head of Influencer Marketing, Mamaearth",
  },
  {
    quote:
      "Finally matched with D2C brands that actually fit my content. Every collab since VERIQ has felt authentic, not forced.",
    name: "Rohan Mehta",
    role: "Creator, @rohanlifestyle",
  },
  {
    quote:
      "The Compatibility Score replaced our spreadsheet guesswork entirely. We close campaigns in days now, not months.",
    name: "Shruti Kapoor",
    role: "Growth Lead, boAt Lifestyle",
  },
  {
    quote:
      "The Verified+ badge doubled my inbound brand enquiries in 60 days. VERIQ made me visible to the right Indian brands.",
    name: "Arjun Nair",
    role: "Independent Creator, @arjunfoodlab",
  },
];

const PRICING = {
  brand: [
    {
      tier: "Starter",
      price: "Free",
      features: ["Discovery search", "Authenticity scores", "25 saved creators", "3 active campaigns"],
      cta: "Get Started",
      popular: false,
    },
    {
      tier: "Growth",
      price: "₹599",
      suffix: "/mo",
      features: [
        "Everything in Starter",
        "Compatibility Engine",
        "Campaign ROI Prediction",
        "Unlimited campaigns",
        "Priority support",
      ],
      cta: "Get Started",
      popular: true,
    },
    {
      tier: "Enterprise",
      price: "Custom",
      features: [
        "Everything in Growth",
        "API access",
        "White-label reporting",
        "Dedicated success manager",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ],
  creator: [
    {
      tier: "Starter",
      price: "Free",
      features: ["Verification profile", "Authenticity score", "Basic audience insights", "1 brand match / week"],
      cta: "Get Started",
      popular: false,
    },
    {
      tier: "Growth",
      price: "₹399",
      suffix: "/mo",
      features: [
        "Everything in Starter",
        "Verified+ badge",
        "Unlimited brand matches",
        "Growth analytics",
        "Priority support",
      ],
      cta: "Get Started",
      popular: true,
    },
    {
      tier: "Enterprise",
      price: "Custom",
      features: ["Everything in Growth", "Agency dashboard", "Multi-channel management", "Dedicated success manager"],
      cta: "Contact Sales",
      popular: false,
    },
  ],
};

export default function Landing() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<"brand" | "creator">("brand");

  return (
    <div className="bg-ink-950 bg-grid-fade">
      <MarketingNavbar />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="pill bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 mb-6">
            AI CREATOR-BRAND INTELLIGENCE
          </span>
          <h1 className="text-5xl md:text-6xl font-display font-bold leading-[1.05] tracking-tight">
            Verified <span className="text-brand-cyan">Authenticity</span>
            <br />
            in Every Collaboration
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-xl">
            We don't connect brands and creators — we verify whether they{" "}
            <em className="not-italic font-semibold text-slate-200">should</em> collaborate. Real
            YouTube data, AI-scored compatibility, predicted ROI.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={() => navigate("/select-role")} className="btn-primary">
              Start verifying <ArrowRight size={16} />
            </button>
            <a href="#how-it-works" className="btn-secondary">
              See how it works
            </a>
          </div>
        </div>

        <div className="card shadow-glow p-8">
          <div className="flex flex-col items-center">
            <HeroRing score={94} />
            <div className="mt-4 flex items-center gap-2 flex-wrap justify-center">
              <span className="pill bg-brand-green/15 text-brand-green">Excellent</span>
              <span className="pill bg-brand-cyan/15 text-brand-cyan">✓ Verified</span>
            </div>
          </div>
          <div className="mt-6 rounded-xl bg-ink-900 border border-white/5 py-3 text-center text-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-green mr-2" />
            88% match · @rahultech ↔ boAt Lifestyle
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-ink-900 border border-white/5 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Real</span>
                <span className="font-semibold text-brand-green">92%</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-ink-700 overflow-hidden">
                <div className="h-full bg-brand-green" style={{ width: "92%" }} />
              </div>
            </div>
            <div className="rounded-xl bg-ink-900 border border-white/5 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Bot</span>
                <span className="font-semibold text-brand-red">8%</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-ink-700 overflow-hidden">
                <div className="h-full bg-brand-red" style={{ width: "8%" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-14">Intelligence before introduction</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              n: "01",
              icon: <ShieldCheck size={22} />,
              title: "Verify",
              color: "text-brand-cyan",
              desc: "Every creator is scored for authenticity, audience quality, and bot presence before they ever appear in search results.",
            },
            {
              n: "02",
              icon: <Target size={22} />,
              title: "Match",
              color: "text-brand-green",
              desc: "Our Compatibility Score Engine analyzes voice, content style, audience overlap, and brand values to surface only real fits.",
            },
            {
              n: "03",
              icon: <TrendingUp size={22} />,
              title: "Predict",
              color: "text-brand-amber",
              desc: "Campaign Prediction forecasts reach, engagement, and ROI before a single dollar is committed.",
            },
          ].map((s) => (
            <div key={s.n} className="card p-8 relative overflow-hidden">
              <span className="absolute top-4 right-6 text-6xl font-display font-bold text-white/5">
                {s.n}
              </span>
              <div className={`h-11 w-11 rounded-xl bg-white/5 flex items-center justify-center mb-5 ${s.color}`}>
                {s.icon}
              </div>
              <h3 className={`text-xl font-bold mb-2 ${s.color}`}>{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section id="product" className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-14">
          The intelligence layer brands and creators actually trust
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-7">
              <div className="h-11 w-11 rounded-xl bg-brand-cyan/10 text-brand-cyan flex items-center justify-center mb-5">
                {f.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-10">
          <span className="pill bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 mb-4">
            WHY VERIQ
          </span>
          <h2 className="text-4xl font-bold">We don't connect. We verify.</h2>
        </div>
        <div className="card overflow-hidden">
          <div className="grid grid-cols-2 border-b border-white/5 px-8 py-4 text-sm font-semibold text-slate-400">
            <span>Other Platforms</span>
            <span className="text-brand-cyan">VERIQ</span>
          </div>
          {COMPARISON.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-2 px-8 py-5 items-center ${
                i !== COMPARISON.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <div className="flex items-center gap-3 text-slate-400 pr-4">
                <X size={16} className="text-brand-red shrink-0" />
                {row.other}
              </div>
              <div className="flex items-center gap-3 font-medium pr-4">
                <Check size={16} className="text-brand-green shrink-0" />
                {row.veriq}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">Plans for every stage of growth</h2>
        <div className="flex justify-center mb-14">
          <div className="inline-flex rounded-full bg-ink-800 border border-white/5 p-1">
            {(["brand", "creator"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlan(p)}
                className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${
                  plan === p ? "bg-brand-cyan text-ink-950" : "text-slate-400 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PRICING[plan].map((tier) => (
            <div
              key={tier.tier}
              className={`card p-8 relative ${tier.popular ? "border-brand-cyan/40 shadow-glow" : ""}`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 pill bg-brand-cyan text-ink-950">
                  Most Popular
                </span>
              )}
              <div className="text-sm text-slate-400 mb-2">{tier.tier}</div>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-display font-bold">{tier.price}</span>
                {"suffix" in tier && tier.suffix && (
                  <span className="text-slate-500 mb-1">{tier.suffix}</span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <Check size={16} className="text-brand-green shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/select-role")}
                className={tier.popular ? "btn-primary w-full" : "btn-secondary w-full"}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-10">
          <span className="pill bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
            WHAT THEY SAY
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card p-7">
              <p className="text-slate-200 leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-ink-700 flex items-center justify-center text-sm font-semibold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <h2 className="text-5xl font-bold mb-4">
          Stop guessing.
          <br />
          Start matching.
        </h2>
        <p className="text-slate-400 mb-8">Verified authenticity in every collaboration.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button onClick={() => navigate("/select-role")} className="btn-primary">
            Continue as Brand <ArrowRight size={16} />
          </button>
          <button onClick={() => navigate("/select-role")} className="btn-secondary">
            Continue as Creator <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function HeroRing({ score }: { score: number }) {
  const size = 220;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#16283f" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#34d399"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-display font-bold">{score}</span>
        <span className="text-xs text-slate-400">/100</span>
        <span className="text-xs tracking-wider text-slate-400 uppercase mt-2">
          Authenticity Score
        </span>
      </div>
    </div>
  );
}
