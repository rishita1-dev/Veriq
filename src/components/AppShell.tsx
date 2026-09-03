import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Logo } from "./Shared";
import { useApp } from "../context/AppContext";

export interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

export function AppShell({
  navItems,
  children,
  accountLabel,
  accountSub,
}: {
  navItems: NavItem[];
  children: React.ReactNode;
  accountLabel: string;
  accountSub: string;
}) {
  const { reset } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-ink-950">
      <aside className="w-64 shrink-0 border-r border-white/5 flex flex-col justify-between h-screen sticky top-0">
        <div>
          <div className="px-6 py-6">
            <Logo />
          </div>
          <nav className="px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to.split("/").length <= 2}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-cyan/10 text-brand-cyan"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="px-4 py-5 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-brand-cyan/20 text-brand-cyan flex items-center justify-center font-semibold">
              {accountLabel.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{accountLabel}</div>
              <div className="text-xs text-slate-500 truncate">{accountSub}</div>
            </div>
            <button
              onClick={() => {
                reset();
                navigate("/");
              }}
              title="Log out"
              className="text-slate-500 hover:text-white transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <div className="px-8 py-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
