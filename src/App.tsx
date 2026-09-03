import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";

import Landing from "./pages/Landing";
import RoleSelect from "./pages/RoleSelect";

import BrandDashboard from "./pages/brand/BrandDashboard";
import Discovery from "./pages/brand/Discovery";
import SavedCreators from "./pages/brand/SavedCreators";
import Campaigns from "./pages/brand/Campaigns";
import Analytics from "./pages/brand/Analytics";
import BrandSettings from "./pages/brand/Settings";

import CreatorDashboard from "./pages/creator/CreatorDashboard";
import CreatorProfile from "./pages/creator/CreatorProfile";
import AudienceInsights from "./pages/creator/AudienceInsights";
import BrandMatches from "./pages/creator/BrandMatches";
import Growth from "./pages/creator/Growth";
import CreatorSettings from "./pages/creator/Settings";

function RequireRole({ role, children }: { role: "brand" | "creator"; children: React.ReactNode }) {
  const { role: currentRole } = useApp();
  if (currentRole !== role) return <Navigate to="/select-role" replace />;
  return <>{children}</>;
}

function Routed() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/select-role" element={<RoleSelect />} />

      <Route path="/brand/dashboard" element={<RequireRole role="brand"><BrandDashboard /></RequireRole>} />
      <Route path="/brand/discovery" element={<RequireRole role="brand"><Discovery /></RequireRole>} />
      <Route path="/brand/saved" element={<RequireRole role="brand"><SavedCreators /></RequireRole>} />
      <Route path="/brand/campaigns" element={<RequireRole role="brand"><Campaigns /></RequireRole>} />
      <Route path="/brand/analytics" element={<RequireRole role="brand"><Analytics /></RequireRole>} />
      <Route path="/brand/settings" element={<RequireRole role="brand"><BrandSettings /></RequireRole>} />

      <Route path="/creator/dashboard" element={<RequireRole role="creator"><CreatorDashboard /></RequireRole>} />
      <Route path="/creator/profile" element={<RequireRole role="creator"><CreatorProfile /></RequireRole>} />
      <Route path="/creator/audience" element={<RequireRole role="creator"><AudienceInsights /></RequireRole>} />
      <Route path="/creator/matches" element={<RequireRole role="creator"><BrandMatches /></RequireRole>} />
      <Route path="/creator/growth" element={<RequireRole role="creator"><Growth /></RequireRole>} />
      <Route path="/creator/settings" element={<RequireRole role="creator"><CreatorSettings /></RequireRole>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routed />
      </BrowserRouter>
    </AppProvider>
  );
}
