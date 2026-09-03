import React, { createContext, useContext, useEffect, useState } from "react";
import type { BrandProfile, Campaign, SavedCreator, UserRole } from "../lib/types";

interface AppState {
  role: UserRole;
  setRole: (r: UserRole) => void;
  brand: BrandProfile;
  setBrand: (b: BrandProfile) => void;
  creatorHandle: string;
  setCreatorHandle: (h: string) => void;
  savedCreators: SavedCreator[];
  saveCreator: (c: SavedCreator) => void;
  removeCreator: (id: string) => void;
  isSaved: (id: string) => boolean;
  campaigns: Campaign[];
  addCampaign: (c: Campaign) => void;
  reset: () => void;
}

const STORAGE_KEY = "veriq_state_v1";

const defaultBrand: BrandProfile = {
  id: "brand_default",
  name: "Your Brand",
  category: "Lifestyle",
  values: ["Authentic", "Bold", "Community-first"],
  budgetPerCampaign: 150000,
};

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return null;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const initial = loadInitial();
  const [role, setRole] = useState<UserRole>(initial?.role ?? null);
  const [brand, setBrand] = useState<BrandProfile>(initial?.brand ?? defaultBrand);
  const [creatorHandle, setCreatorHandle] = useState<string>(initial?.creatorHandle ?? "mrbeast");
  const [savedCreators, setSavedCreators] = useState<SavedCreator[]>(
    initial?.savedCreators ?? []
  );
  const [campaigns, setCampaigns] = useState<Campaign[]>(initial?.campaigns ?? []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ role, brand, savedCreators, campaigns, creatorHandle })
    );
  }, [role, brand, savedCreators, campaigns, creatorHandle]);

  const saveCreator = (c: SavedCreator) => {
    setSavedCreators((prev) =>
      prev.some((p) => p.id === c.id) ? prev : [...prev, c]
    );
  };
  const removeCreator = (id: string) =>
    setSavedCreators((prev) => prev.filter((p) => p.id !== id));
  const isSaved = (id: string) => savedCreators.some((p) => p.id === id);
  const addCampaign = (c: Campaign) => setCampaigns((prev) => [c, ...prev]);
  const reset = () => {
    setRole(null);
    setSavedCreators([]);
    setCampaigns([]);
    setBrand(defaultBrand);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        brand,
        setBrand,
        creatorHandle,
        setCreatorHandle,
        savedCreators,
        saveCreator,
        removeCreator,
        isSaved,
        campaigns,
        addCampaign,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
