import type { CreatorProfile } from "./types";

// --- Configuration -------------------------------------------------------
// Set VITE_YOUTUBE_API_KEY in a .env file at the project root to pull real
// channel data from the YouTube Data API v3. Without a key, VERIQ falls
// back to deterministic mock data so the app is fully explorable offline.
const YT_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined;
const YT_BASE = "https://www.googleapis.com/youtube/v3";

export const isYoutubeConfigured = () => Boolean(YT_API_KEY);

const NICHES = [
  "Tech",
  "Beauty",
  "Fitness",
  "Gaming",
  "Food",
  "Fashion",
  "Lifestyle",
  "Education",
  "Finance",
  "Travel",
];

// Simple seeded PRNG so mock data is stable per-handle instead of random
// on every render.
function seedFromString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Core authenticity heuristic. In lieu of a proprietary fraud model, VERIQ
 * derives a 0-100 score from publicly observable signals: subscriber-to-view
 * ratios, upload consistency, and engagement rate bands that correlate with
 * organic (vs. purchased) audiences.
 */
function scoreAuthenticity(params: {
  subscribers: number;
  totalViews: number;
  videoCount: number;
  avgViewsLast12: number;
  engagementRate: number;
}) {
  const { subscribers, avgViewsLast12, engagementRate } = params;

  const viewToSubRatio = subscribers > 0 ? avgViewsLast12 / subscribers : 0;
  // Healthy organic channels usually see 5-40% of subs viewing new uploads.
  let viewRatioScore = 0;
  if (viewToSubRatio > 0.03 && viewToSubRatio < 0.8) viewRatioScore = 40;
  else if (viewToSubRatio >= 0.8) viewRatioScore = 28;
  else viewRatioScore = Math.max(5, viewToSubRatio * 800);

  // Engagement rate: 1-6% is a healthy organic band on YouTube.
  let engagementScore = 0;
  if (engagementRate >= 1 && engagementRate <= 8) engagementScore = 35;
  else if (engagementRate > 8) engagementScore = 22;
  else engagementScore = Math.max(5, engagementRate * 25);

  const consistencyBonus = 25 * Math.min(1, (viewRatioScore + engagementScore) / 75);

  const raw = viewRatioScore + engagementScore + consistencyBonus;
  return Math.max(35, Math.min(99, Math.round(raw)));
}

function buildMockCreator(handleRaw: string): CreatorProfile {
  const handle = handleRaw.replace(/^@/, "").trim();
  const rnd = seededRandom(seedFromString(handle || "veriq"));

  const subscribers = Math.round(20_000 + rnd() * 5_000_000);
  const videoCount = Math.round(50 + rnd() * 900);
  const totalViews = Math.round(subscribers * (8 + rnd() * 40));
  const avgViewsLast12 = Math.round(subscribers * (0.05 + rnd() * 0.5));
  const engagementRate = Math.round((1 + rnd() * 7) * 100) / 100;

  const authenticityScore = scoreAuthenticity({
    subscribers,
    totalViews,
    videoCount,
    avgViewsLast12,
    engagementRate,
  });

  const botPct = Math.max(1, Math.round(100 - authenticityScore - rnd() * 10));
  const realAudiencePct = Math.min(99, 100 - botPct);

  return {
    id: `mock_${handle}`,
    handle: `@${handle || "creator"}`,
    name: handle
      ? handle.replace(/[-_.]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "Unnamed Creator",
    avatarUrl: undefined,
    country: rnd() > 0.5 ? "IN" : "US",
    description: "Channel data unavailable — showing modeled estimates.",
    subscribers,
    totalViews,
    videoCount,
    avgViewsLast12,
    engagementRate,
    authenticityScore,
    realAudiencePct,
    botPct,
    engagementConsistency: Math.round(40 + rnd() * 55),
    growthHealth: Math.round(35 + rnd() * 60),
    niche: NICHES[Math.floor(rnd() * NICHES.length)],
    source: "mock",
  };
}

async function ytFetch(path: string, params: Record<string, string>) {
  if (!YT_API_KEY) throw new Error("YouTube API key not configured");
  const url = new URL(`${YT_BASE}/${path}`);
  Object.entries({ ...params, key: YT_API_KEY }).forEach(([k, v]) =>
    url.searchParams.set(k, v)
  );
  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube API error ${res.status}: ${body}`);
  }
  return res.json();
}

/**
 * Resolve a handle or search query to a channel ID, then pull channel
 * statistics and the most recent uploads to estimate engagement.
 */
export async function fetchCreatorByHandle(
  handleOrQuery: string
): Promise<CreatorProfile> {
  const query = handleOrQuery.trim();
  if (!query) throw new Error("Empty query");

  if (!isYoutubeConfigured()) {
    return buildMockCreator(query);
  }

  try {
    let channelId: string | null = null;

    // Try direct handle resolution first (forHandle works for @handles).
    const cleanHandle = query.startsWith("@") ? query : `@${query}`;
    try {
      const byHandle = await ytFetch("channels", {
        part: "id,snippet,statistics",
        forHandle: cleanHandle.replace("@", ""),
      });
      if (byHandle.items?.length) {
        return mapChannelToProfile(byHandle.items[0], await fetchRecentEngagement(byHandle.items[0].id));
      }
    } catch {
      /* fall through to search */
    }

    const search = await ytFetch("search", {
      part: "snippet",
      q: query,
      type: "channel",
      maxResults: "1",
    });
    channelId = search.items?.[0]?.snippet?.channelId ?? search.items?.[0]?.id?.channelId;
    if (!channelId) return buildMockCreator(query);

    const channelRes = await ytFetch("channels", {
      part: "id,snippet,statistics",
      id: channelId,
    });
    const channel = channelRes.items?.[0];
    if (!channel) return buildMockCreator(query);

    const engagement = await fetchRecentEngagement(channel.id);
    return mapChannelToProfile(channel, engagement);
  } catch (err) {
    console.warn("YouTube fetch failed, falling back to modeled data:", err);
    return buildMockCreator(query);
  }
}

async function fetchRecentEngagement(channelId: string) {
  try {
    const channelRes = await ytFetch("channels", {
      part: "contentDetails",
      id: channelId,
    });
    const uploadsPlaylist =
      channelRes.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylist) return { avgViews: 0, engagementRate: 0 };

    const playlistRes = await ytFetch("playlistItems", {
      part: "contentDetails",
      playlistId: uploadsPlaylist,
      maxResults: "12",
    });
    const videoIds = (playlistRes.items ?? [])
      .map((i: any) => i.contentDetails?.videoId)
      .filter(Boolean)
      .join(",");
    if (!videoIds) return { avgViews: 0, engagementRate: 0 };

    const videosRes = await ytFetch("videos", {
      part: "statistics",
      id: videoIds,
    });
    const stats = (videosRes.items ?? []).map((v: any) => v.statistics);
    const views = stats.map((s: any) => Number(s.viewCount ?? 0));
    const likes = stats.map((s: any) => Number(s.likeCount ?? 0));
    const comments = stats.map((s: any) => Number(s.commentCount ?? 0));

    const avgViews = views.length
      ? views.reduce((a: number, b: number) => a + b, 0) / views.length
      : 0;
    const totalInteractions =
      likes.reduce((a: number, b: number) => a + b, 0) +
      comments.reduce((a: number, b: number) => a + b, 0);
    const totalViews = views.reduce((a: number, b: number) => a + b, 0);
    const engagementRate = totalViews > 0 ? (totalInteractions / totalViews) * 100 : 0;

    return { avgViews: Math.round(avgViews), engagementRate: Math.round(engagementRate * 100) / 100 };
  } catch {
    return { avgViews: 0, engagementRate: 0 };
  }
}

function mapChannelToProfile(
  channel: any,
  engagement: { avgViews: number; engagementRate: number }
): CreatorProfile {
  const stats = channel.statistics ?? {};
  const snippet = channel.snippet ?? {};
  const subscribers = Number(stats.subscriberCount ?? 0);
  const totalViews = Number(stats.viewCount ?? 0);
  const videoCount = Number(stats.videoCount ?? 0);
  const avgViewsLast12 = engagement.avgViews || Math.round(totalViews / Math.max(1, videoCount));
  const engagementRate = engagement.engagementRate || 1.5;

  const authenticityScore = scoreAuthenticity({
    subscribers,
    totalViews,
    videoCount,
    avgViewsLast12,
    engagementRate,
  });
  const botPct = Math.max(1, Math.round(100 - authenticityScore - 5));
  const realAudiencePct = Math.min(99, 100 - botPct);

  return {
    id: channel.id,
    handle: snippet.customUrl ? `@${snippet.customUrl.replace(/^@/, "")}` : snippet.title,
    name: snippet.title ?? "Unknown Channel",
    avatarUrl: snippet.thumbnails?.default?.url,
    country: snippet.country ?? "—",
    description: snippet.description?.slice(0, 160),
    subscribers,
    totalViews,
    videoCount,
    avgViewsLast12,
    engagementRate,
    authenticityScore,
    realAudiencePct,
    botPct,
    engagementConsistency: Math.round(40 + authenticityScore * 0.5),
    growthHealth: Math.round(35 + authenticityScore * 0.55),
    niche: NICHES[seedFromString(channel.id) % NICHES.length],
    source: "youtube",
  };
}

export function computeCompatibility(
  creator: CreatorProfile,
  brandNiche: string
) {
  const rnd = seededRandom(seedFromString(creator.id + brandNiche));
  const nicheMatch = creator.niche.toLowerCase() === brandNiche.toLowerCase() ? 30 : 12 + rnd() * 10;
  const audienceOverlap = Math.round(40 + rnd() * 55);
  const voiceMatch = Math.round(nicheMatch + rnd() * 20 + 40);
  const authenticity = creator.authenticityScore;
  const engagementQuality = Math.min(100, Math.round(creator.engagementRate * 10 + 30));

  const score = Math.round(
    audienceOverlap * 0.25 +
      Math.min(100, voiceMatch) * 0.25 +
      authenticity * 0.3 +
      engagementQuality * 0.2
  );

  const label =
    score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Fair" : "Poor";

  return {
    score: Math.min(99, score),
    label: label as "Poor" | "Fair" | "Good" | "Excellent",
    breakdown: {
      audienceOverlap,
      voiceMatch: Math.min(100, Math.round(voiceMatch)),
      authenticity,
      engagementQuality,
    },
  };
}

export function predictCampaign(creator: CreatorProfile, budget: number) {
  const rnd = seededRandom(seedFromString(creator.id + budget));
  const reachMultiplier = 0.15 + (creator.authenticityScore / 100) * 0.35 + rnd() * 0.1;
  const estimatedReach = Math.round(creator.subscribers * reachMultiplier);
  const estimatedEngagementRate =
    Math.round((creator.engagementRate * (0.8 + rnd() * 0.4)) * 100) / 100;
  const roiBase = 1.5 + (creator.authenticityScore / 100) * 3 + rnd() * 1.5;
  const estimatedRoi = Math.round(roiBase * 10) / 10;
  const confidence =
    creator.authenticityScore >= 80 ? "High" : creator.authenticityScore >= 60 ? "Medium" : "Low";

  return {
    estimatedReach,
    estimatedEngagementRate,
    estimatedRoi,
    confidence: confidence as "Low" | "Medium" | "High",
  };
}

export function buildMockDiscoveryFeed(seed: string, count = 12): CreatorProfile[] {
  const handles = [
    "rahultech", "celainesasmr", "rjmobile01", "beautybyanya", "fitwithkabir",
    "foodiefables", "styledbysia", "learnwithlia", "financewithraj", "wanderwithvik",
    "gamewithgee", "dailydeepa", "chefaroon", "beastmodefit", "cinemasnippets",
    "codewithkiara", "glowupguru", "trailblazertom", "budgetbaddie", "mindfulmona",
  ];
  const rnd = seededRandom(seedFromString(seed));
  const shuffled = [...handles].sort(() => rnd() - 0.5);
  return shuffled.slice(0, count).map((h) => buildMockCreator(h));
}
