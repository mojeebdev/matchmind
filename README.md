# MatchMind ⚽
**Know Your Game. Own Every Moment.**

> AI football intelligence for World Cup 2026 fans — powered by Gemini, Google Cloud Agent Builder (ADK), and MongoDB Atlas.

[![Live at matchmind.xyz](https://img.shields.io/badge/Live%20at-matchmind.xyz-gold?style=flat-square)](https://matchmind.xyz)
[![MongoDB](https://img.shields.io/badge/Partner-MongoDB-green?style=flat-square)](https://mongodb.com)
[![Google Cloud](https://img.shields.io/badge/Built%20on-Google%20Cloud-blue?style=flat-square)](https://cloud.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

## What is MatchMind?

MatchMind is an AI agent that answers World Cup 2026 questions like a senior football analyst — not a search engine.

Ask it anything:
- *"Who are the top scorers in Group B?"*
- *"Predict the Brazil vs France quarterfinal"*
- *"Build me a fantasy XI from Group C players"*
- *"What's Argentina's defensive weakness this tournament?"*

It classifies intent, queries the MongoDB football intelligence database via MCP, and returns structured analyst-grade responses with key stats, confidence signals, and follow-up suggestions.

> **Data note:** **Groups, fixtures, venues, and kickoff times** match the official FIFA World Cup 2026 draw (5 Dec 2025) and published schedule. **Scores, standings, and player tournament stats** before kickoff are **◇ Preview mockup** — illustrative demo data, clearly labeled. After kickoff (**11 June 2026**), real results sync via **● Live MongoDB**. See [docs/DATA-SOURCES.md](docs/DATA-SOURCES.md) for the full real vs mockup breakdown.

### Data modes

| Mode | When | Badge | What's official | What's mockup |
|---|---|---|---|---|
| **Preview mockup** | Before 11 Jun 2026 | ◇ Preview mockup (amber) | Groups, **104 fixtures**, venues, squads (Guardian + FOX USA), H2H | Group-stage scores, standings, player WC stats |
| **Live** | On/after kickoff | ● Live MongoDB (green) | Fixtures + FIFA-synced scores & standings | Player WC stats via FotMob sync or manual feed |
| **Demo** | MongoDB not configured | ○ Demo data | Same official fixture structure | In-memory fallback scores |

Automatic switch is date-based (`lib/tournament-phase.ts`). Override for testing:

```bash
FORCE_TOURNAMENT_PREVIEW=true   # always preview mockup
FORCE_TOURNAMENT_LIVE=true      # always live mode
```

Re-seed after changing mode: `npm run seed`

---

## Architecture

```
Fan Question (Natural Language)
        ↓
Next.js 16+ App Router (/agent)
        ↓
/api/agent — ADK or local pipeline
        ↓
Step 1: Classify question type (Gemini)
        ↓
Step 2: query_football_data → MongoDB Atlas (MCP tool contract)
        ↓
Step 3: Gemini reasons over records → structured JSON
        ↓
Analyst card (headline, analysis, stats, data badge: ◇ Preview mockup / ● Live MongoDB / ○ Demo)

Admin updates (optional):
/agent/admin → update_match_result / update_player_stats → MongoDB
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16+ App Router |
| Agent Brain | Gemini (`gemini-2.5-flash-lite`) via `@google/generative-ai` |
| Orchestration | Google ADK (`@google/adk`) — `USE_ADK_AGENT=true` |
| Partner MCP | MongoDB tool interface (`lib/mcp.ts`) |
| Database | MongoDB Atlas |
| Frontend | TypeScript + Tailwind CSS |
| Fonts | Fraunces + Sora |
| Deploy | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (free tier)
- Google AI / Gemini API key
- Google Cloud project (optional — Agent Engine deploy)

### Installation

```bash
git clone https://github.com/mojeebdev/matchmind
cd matchmind
npm install
cp .env.local.example .env
```

Fill in `.env` — see [`.env.local.example`](.env.local.example) for all variables.

### Seed the database

```bash
npm run seed
```

Populates 48 teams, 12 groups, players, matches, and head-to-head records.

- **Before kickoff:** seeds **preview mockup** results (sample scores + knockouts) — `tournament.dataMode: preview`
- **After kickoff:** seeds **live** fixtures only (scheduled, no fake results) — sync real scores with `npm run sync`

### Live sync (recommended)

After kickoff, pull **finished match scores** from FIFA into MongoDB. Standings recalculate automatically.

```bash
# .env — default in .env.local.example
SYNC_MODE=fifa

npm run sync -- --dry-run   # preview what FIFA would apply
npm run sync                # write scores to MongoDB
```

**Also works from the UI:** `/agent/admin` → **Sync from FIFA** (uses `POST /api/admin/sync`).

| `SYNC_MODE` | Source | Best for |
|---|---|---|
| **`fifa`** (default) | `api.fifa.com` | Match scores + standings — easiest |
| `feed` | `data/sync/feed.json` | Manual scores + player goal deltas |
| `both` | FIFA + local feed | Scores from FIFA; player stats from feed |

FIFA sync does **not** pull player goals/assists — use **FotMob** (below), the admin agent, or `feed` for that. See [docs/DATA-SOURCES.md](docs/DATA-SOURCES.md) and [docs/PLAYER-STATS-SOURCES.md](docs/PLAYER-STATS-SOURCES.md).

**Match days:** run `npm run sync` after final whistles, or schedule it every 15–30 minutes.

### Player stats sync (FotMob — automated)

After each matchday, pull tournament goals, assists, minutes, xG, and rating from FotMob into `data/sync/feed.json`, then sync to MongoDB:

```bash
npm run fotmob-feed          # ~365 players with WC minutes (fast — league stat JSON)
# or full squad + club form:
npm run fotmob-full          # 1,149 mapped players + playerData enrich (~3 min)

npm run validate-feed        # check names vs 1,248-player roster
SYNC_MODE=both npm run sync  # FIFA scores + player stats
```

| Command | What it does |
|---|---|
| `npm run fotmob-feed` | League stat lists — G/A, minutes, xG, rating for everyone who played |
| `npm run fotmob-squads` | Map 48 national teams → FotMob player IDs (`data/sync/fotmob-id-map.json`) |
| `npm run fotmob-full` | Squad map + `playerData` enrich — club form, club & WC match logs |

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) · Agent UI at `/agent` · Admin at `/agent/admin`

---

## Scripts

### On GitHub (public)

| Script | Command | Purpose |
|---|---|---|
| `scripts/seed.ts` | `npm run seed` | Load World Cup 2026 dataset into MongoDB |
| `scripts/fotmob-to-feed.mjs` | `npm run fotmob-feed` | Build player feed from FotMob league stats |
| `scripts/fotmob-squads.mjs` | `npm run fotmob-squads` / `fotmob-full` | Map squads to FotMob IDs; optional enrich |
| `scripts/fotmob-shared.mjs` | — | Shared FotMob name/team matching utilities |
| `scripts/validate-feed.mjs` | `npm run validate-feed` | Validate `feed.json` names against roster |
| `scripts/sync.example.ts` | — | Template stub for local sync setup |
| `scripts/gcloud.example.sh` | — | Template for Git Bash gcloud wrapper |
| `scripts/test-mongo.example.ts` | — | Template for MongoDB connectivity check |

### Local only (gitignored)

These stay on your machine — not committed:

| File | Setup | Purpose |
|---|---|---|
| `scripts/sync.ts` | `cp scripts/sync.example.ts scripts/sync.ts` *(use your full local copy)* | Private `npm run sync` recipe |
| `data/sync/feed.json` | `cp data/sync/feed.example.json data/sync/feed.json` | Match/player updates to apply |
| `scripts/gcloud.sh` | `cp scripts/gcloud.example.sh scripts/gcloud.sh` | Your machine-specific gcloud path |
| `scripts/test-mongo.ts` | `cp scripts/test-mongo.example.ts scripts/test-mongo.ts` | Quick Atlas connection test |
| `.env` | copy from `.env.local.example` | API keys, MongoDB URI, admin secret |

**Why examples matter:** Judges and contributors can clone the repo, run `seed` + `dev`, and understand the project without your private sync recipe, credentials, or Windows paths. You keep the real pipeline local.

### Update data (operator workflow)

**Option A — FIFA sync (recommended)**

```bash
SYNC_MODE=fifa npm run sync
```

Or `/agent/admin` → **Sync from FIFA**.

**Option B — Admin agent (spot fixes & player stats)**

1. Open `/agent/admin`
2. Enter `ADMIN_SECRET` from `.env`
3. Example: *"Mbappé scored — add 1 goal to his tournament total."*

**Option C — FotMob feed (recommended for player stats)**

```bash
npm run fotmob-feed && npm run validate-feed
SYNC_MODE=both npm run sync
```

**Option D — Local feed (manual overrides)**

```bash
cp data/sync/feed.example.json data/sync/feed.json
# edit feed.json — player goalsDelta / assistsDelta

SYNC_MODE=both npm run sync   # FIFA scores + feed player updates
```

### Google Cloud (optional)

```bash
cp scripts/gcloud.example.sh scripts/gcloud.sh
bash scripts/gcloud.sh auth login
bash scripts/gcloud.sh auth application-default login
npm run agent:deploy
```

On PowerShell, use `gcloud` directly if it is already in PATH.

---

## Environment Variables

See [`.env.local.example`](.env.local.example). Key entries:

```bash
MONGODB_URI=...
MONGODB_URI_DIRECT=...          # optional — bypasses SRV DNS issues on Windows
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash-lite
USE_ADK_AGENT=true
GOOGLE_CLOUD_PROJECT=...
ADMIN_SECRET=...                # /agent/admin
SYNC_MODE=fifa                  # live scores from FIFA (npm run sync)
```

---

## MongoDB Collections

- `teams` — group standings, form, possession
- `players` — goals, assists, xG, minutes, club form, match logs, `fotmobId`
- `matches` — fixtures, scores, stage, xG
- `headToHead` — historical meetings
- `groups` — group definitions (A–L)
- `tournament` — metadata + `lastSyncedAt` when sync runs

---

## Key Features

- **ADK agent** — `query_football_data` tool over MongoDB
- **Admin agent** — write scores and player stats in plain English
- **Honest data badges** — ◇ Preview mockup (pre-kickoff) · ● Live MongoDB (synced results) · ○ Demo data
- **Preview banner** — amber notice on `/agent` before World Cup starts
- **5 question types** — stats, prediction, fantasy, tactical, historical
- **Stadium Night × Gold UI** — hero, middle, CTA tunnel, and footer backgrounds with gradient scrims
- **Animated How It Works** — step numbers count up on scroll

## Design / Background Images

| Section | Desktop | Mobile | CSS class |
|---|---|---|---|
| Hero | `desktop-hero.png` | `mobile-hero.png` | `.bg-hero` |
| How It Works / Agent | `desktop-middle.png` | `mobile-middle.png` | `.bg-middle` |
| Agent CTA | `cta-desktop.png` | `cta-mobile.png` | `.cta-section` |
| Footer | `desktop-footer.png` | `mobile-footer.png` | `.bg-footer` |

Scrims (`--scrim-*` in `styles/globals.css`) keep stadium art visible while text stays readable.

## Documentation

- **[Architecture](/docs/architecture)** — agent flow, admin writes, security, implementation map
- **`docs/ARCHITECTURE.md`** — same content in markdown for judges/repo
- **`docs/DATA-SOURCES.md`** — official vs mockup vs live data breakdown
- **`docs/PLAYER-STATS-SOURCES.md`** — FIFA, FotMob, ESPN, FOX workflow for matchday stats

---

## Builder

Built by **Mojeeb Titilayo** ([@mojeebeth](https://x.com/mojeebeth))  
Studio: [BlindspotLab](https://blindspotlab.xyz) · Lagos, Nigeria  
Portfolio: [mojeeb.xyz](https://mojeeb.xyz)

---

## Hackathon

Built for the **Google Cloud Rapid Agent Hackathon 2026**  
Partner Track: **MongoDB**  
Submission deadline: June 11, 2026

Partners: [@GoogleCloud](https://x.com/googlecloud) · [@MongoDB](https://x.com/mongodb)

---

## License

MIT License — see [LICENSE](LICENSE) for details.