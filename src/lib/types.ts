export interface CreatorProfile {
  id: string; // channel id or synthetic id
  handle: string; // @handle
  name: string;
  avatarUrl?: string;
  country?: string;
  description?: string;
  subscribers: number;
  totalViews: number;
  videoCount: number;
  avgViewsLast12: number;
  engagementRate: number; // percent
  authenticityScore: number; // 0-100
  realAudiencePct: number;
  botPct: number;
  engagementConsistency: number; // 0-100
  growthHealth: number; // 0-100
  niche: string;
  source: "youtube" | "mock";
}

export interface BrandProfile {
  id: string;
  name: string;
  category: string;
  values: string[]; // brand voice tags
  budgetPerCampaign: number; // INR
}

export interface CompatibilityResult {
  score: number; // 0-100
  label: "Poor" | "Fair" | "Good" | "Excellent";
  breakdown: {
    audienceOverlap: number;
    voiceMatch: number;
    authenticity: number;
    engagementQuality: number;
  };
}

export interface CampaignPrediction {
  estimatedReach: number;
  estimatedEngagementRate: number;
  estimatedRoi: number; // multiplier, e.g. 3.2x
  confidence: "Low" | "Medium" | "High";
}

export interface SavedCreator extends CreatorProfile {
  savedAt: string;
  compatibility?: CompatibilityResult;
}

export interface Campaign {
  id: string;
  name: string;
  creatorHandle: string;
  creatorName: string;
  status: "Draft" | "Active" | "Completed";
  budget: number;
  createdAt: string;
  prediction: CampaignPrediction;
}

export type UserRole = "brand" | "creator" | null;
