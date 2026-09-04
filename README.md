# VeriQ

### Verified Creator Intelligence for Smarter Brand–Creator Collaborations

VeriQ is a creator intelligence platform designed to help **brands discover suitable creators** and help **creators identify relevant brand opportunities**.

The platform combines publicly available YouTube channel data with audience and engagement signals to generate an **authenticity score** and **brand compatibility score**, allowing users to make more informed collaboration decisions.

---

## ✨ Key Features

### For Brands

* **Creator Discovery** — Search YouTube creators by handle or channel name.
* **Authenticity Scoring** — Evaluate creators using observable engagement and audience signals.
* **Compatibility Scoring** — Measure how well a creator aligns with a brand's category.
* **Creator Recommendations** — Get suggested creators based on the brand's selected category.
* **Saved Creators** — Save promising creators for later evaluation.
* **Campaign Planning** — Create campaigns around saved creators and budgets.
* **Campaign Forecasting** — Estimate reach, engagement and ROI before launching.
* **Analytics Dashboard** — View aggregate creator and campaign metrics.

### For Creators

* **YouTube Profile Verification** — Connect a YouTube handle/channel to generate a creator profile.
* **Audience Insights** — View channel-level audience and performance indicators.
* **Brand Matching** — Discover brands ranked by compatibility.
* **Growth Insights** — Track creator performance indicators and growth health.

---

## 🏗️ Architecture

VeriQ follows a lightweight **client-side React architecture** with a clear separation between presentation, application state, and data/analysis logic.

```text
                         ┌──────────────────────┐
                         │      VeriQ UI        │
                         │ React + Tailwind CSS │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    React Router      │
                         │ Role-based Routing   │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
          ┌─────────────────┐             ┌─────────────────┐
          │   Brand Portal  │             │ Creator Portal  │
          │                 │             │                 │
          │ Discovery       │             │ Profile         │
          │ Saved Creators  │             │ Audience        │
          │ Campaigns       │             │ Brand Matches   │
          │ Analytics       │             │ Growth          │
          └────────┬────────┘             └────────┬────────┘
                   │                               │
                   └──────────────┬────────────────┘
                                  ▼
                       ┌──────────────────────┐
                       │    AppContext        │
                       │ Shared Application    │
                       │ State & Persistence   │
                       └──────────┬───────────┘
                                  │
                                  ▼
                       ┌──────────────────────┐
                       │     YouTube Data     │
                       │        Layer         │
                       ├──────────────────────┤
                       │ Channel Data         │
                       │ Video Statistics     │
                       │ Engagement Metrics   │
                       └──────────┬───────────┘
                                  │
                                  ▼
                       ┌──────────────────────┐
                       │  VeriQ Intelligence  │
                       ├──────────────────────┤
                       │ Authenticity Score   │
                       │ Compatibility Score  │
                       │ Campaign Prediction  │
                       └──────────────────────┘
```

### Data Flow

1. A user selects a **Brand** or **Creator** role.
2. The application loads the corresponding dashboard and navigation.
3. Creator/channel information is retrieved through the YouTube data layer.
4. Recent video statistics are processed to derive engagement metrics.
5. VeriQ's scoring logic generates authenticity, compatibility and campaign predictions.
6. Results are presented through dashboards, discovery cards, analytics and campaign views.
7. Brand-side selections such as saved creators and campaigns are maintained through the application's shared context.

---

## 🧠 VeriQ Intelligence

The current implementation uses transparent, signal-based scoring rather than claiming to have a proprietary fraud-detection model.

### Authenticity Score

The authenticity score is calculated from publicly observable signals including:

* Subscriber-to-view ratio
* Average views across recent videos
* Engagement rate
* Overall engagement consistency

The resulting score is normalized to a **0–100 scale** and is intended as an indicative creator-quality signal rather than a definitive determination of fraudulent activity.

### Compatibility Score

Creator–brand compatibility considers signals such as:

* Audience overlap
* Creator niche/category
* Content/brand alignment
* Voice/content-style match

This produces a compatibility percentage that can be used to rank potential collaboration opportunities.

### Campaign Prediction

Campaign forecasts use creator performance signals and campaign budget to estimate:

* Potential reach
* Engagement rate
* Expected ROI
* Prediction confidence

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── AppShell.tsx
│   └── Shared.tsx
│
├── context/
│   └── AppContext.tsx
│
├── lib/
│   ├── types.ts
│   ├── youtube.ts
│   └── useMyChannel.ts
│
├── pages/
│   ├── Landing.tsx
│   ├── RoleSelect.tsx
│   │
│   ├── brand/
│   │   ├── BrandDashboard.tsx
│   │   ├── Discovery.tsx
│   │   ├── SavedCreators.tsx
│   │   ├── Campaigns.tsx
│   │   ├── Analytics.tsx
│   │   └── Settings.tsx
│   │
│   └── creator/
│       ├── CreatorDashboard.tsx
│       ├── CreatorProfile.tsx
│       ├── AudienceInsights.tsx
│       ├── BrandMatches.tsx
│       ├── Growth.tsx
│       └── Settings.tsx
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🛠️ Tech Stack

| Technology            | Purpose                                       |
| --------------------- | --------------------------------------------- |
| **React 19**          | Frontend application                          |
| **TypeScript**        | Type-safe development                         |
| **Vite**              | Development server and build tooling          |
| **React Router**      | Client-side routing and role-based navigation |
| **Tailwind CSS**      | UI styling and responsive layouts             |
| **Lucide React**      | Interface icons                               |
| **YouTube Data API**  | Channel and video statistics                  |
| **React Context API** | Shared application state                      |

---

## 🚀 Getting Started

### Prerequisites

* Node.js
* npm
* A YouTube Data API v3 key for live YouTube data

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd Veriq
npm install
```

Create the required environment configuration for the YouTube API key:

```env
VITE_YOUTUBE_API_KEY=your_api_key_here
```

Start the development server:

```bash
npm run dev
```

Build the application for production:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

---

## 🔐 Data & Privacy

VeriQ uses publicly accessible YouTube channel and video statistics when the YouTube API is configured.

The platform does **not require access to private creator data** to calculate its current channel-level insights. Scores are derived from observable metrics and should be interpreted as decision-support indicators rather than absolute judgments.

---

## 🔮 Future Scope

Potential extensions include:

* Multi-platform creator verification across YouTube, Instagram and other platforms
* Machine-learning-based fraud and bot detection
* Historical growth and engagement trend analysis
* Real-time campaign performance tracking
* Advanced audience demographic analysis
* Persistent cloud storage and authentication
* Automated brand–creator matchmaking
* Campaign communication and collaboration workflows

---

## 🎯 Vision

VeriQ aims to make influencer marketing **more data-driven, transparent and trustworthy** by helping brands evaluate creators beyond follower counts and helping creators discover partnerships where their audience and content genuinely fit.

> **Don't choose creators by numbers alone. Choose them by verified signals and meaningful compatibility.**
