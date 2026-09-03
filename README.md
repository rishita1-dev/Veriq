# VERIQ

AI creator-brand intelligence platform. VERIQ scores YouTube creators for
authenticity and bot presence, computes a brand-creator compatibility score,
and forecasts campaign reach, engagement, and ROI before any budget is spent.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS
- React Router
- YouTube Data API v3 (optional — falls back to deterministic modeled data)

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Connecting the YouTube Data API

Discovery, the creator dashboard, audience insights, and brand matching all
pull real channel statistics when a YouTube Data API key is present.

1. Create a project in the Google Cloud Console.
2. Enable **YouTube Data API v3** for that project.
3. Create an API key under APIs & Services -> Credentials and restrict it
   to the YouTube Data API (and optionally to your domain).
4. Copy `.env.example` to `.env` and set:

   ```
   VITE_YOUTUBE_API_KEY=your_key_here
   ```

5. Restart the dev server.

Without a key configured, VERIQ automatically falls back to seeded, stable
modeled data so every page remains fully explorable offline.

## How scoring works

- **Authenticity Score** — derived from the ratio of average recent views to
  subscriber count and the channel's engagement rate, both of which
  correlate with organic (vs. purchased) audiences.
- **Compatibility Score** — blends audience overlap, content-voice match,
  authenticity, and engagement quality between a creator and a brand niche.
- **Campaign Prediction** — forecasts reach, engagement rate, and ROI
  multiplier from a creator's authenticity score and subscriber base.

These are transparent heuristics, not a black-box model — see
`src/lib/youtube.ts` for the full implementation.

## Project structure

```
src/
  components/     Shared UI (navbar, footer, score ring, app shell)
  context/        Global app state (role, saved creators, campaigns)
  lib/            YouTube API client, scoring engine, types
  pages/
    Landing.tsx       Marketing site
    RoleSelect.tsx    Brand / Creator role picker
    brand/            Brand dashboard, discovery, saved creators, campaigns,
                       analytics, settings
    creator/          Creator dashboard, profile, audience insights,
                       brand matches, growth, settings
```

## Build

```bash
npm run build
npm run preview
```

## License

MIT
