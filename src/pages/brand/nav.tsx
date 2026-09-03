import React from "react";
import { LayoutGrid, Search, Bookmark, Megaphone, BarChart3, Settings } from "lucide-react";
import type { NavItem } from "../../components/AppShell";

export const BRAND_NAV: NavItem[] = [
  { label: "Dashboard", to: "/brand/dashboard", icon: <LayoutGrid size={18} /> },
  { label: "Discovery", to: "/brand/discovery", icon: <Search size={18} /> },
  { label: "Saved Creators", to: "/brand/saved", icon: <Bookmark size={18} /> },
  { label: "Campaigns", to: "/brand/campaigns", icon: <Megaphone size={18} /> },
  { label: "Analytics", to: "/brand/analytics", icon: <BarChart3 size={18} /> },
  { label: "Settings", to: "/brand/settings", icon: <Settings size={18} /> },
];
