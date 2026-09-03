import React from "react";
import { LayoutGrid, User, Users, ShieldCheck, TrendingUp, Settings } from "lucide-react";
import type { NavItem } from "../../components/AppShell";

export const CREATOR_NAV: NavItem[] = [
  { label: "Dashboard", to: "/creator/dashboard", icon: <LayoutGrid size={18} /> },
  { label: "My Profile", to: "/creator/profile", icon: <User size={18} /> },
  { label: "Audience Insights", to: "/creator/audience", icon: <Users size={18} /> },
  { label: "Brand Matches", to: "/creator/matches", icon: <ShieldCheck size={18} /> },
  { label: "Growth", to: "/creator/growth", icon: <TrendingUp size={18} /> },
  { label: "Settings", to: "/creator/settings", icon: <Settings size={18} /> },
];
