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
| **Preview mockup** | Before 11 Jun 2026 | ◇ Preview mockup (amber) | Groups, **104 fixtures**, venues, kickoff times, H2H history | Group-stage scores & standings only; squads pending FIFA |
| **Live** | On/after kickoff | ● Live MongoDB (green) | Fixtures + synced real results | — |
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

**Option A — Admin agent (demo-friendly)**

1. Open `/agent/admin`
2. Enter `ADMIN_SECRET` from `.env`
3. Say: *"Mexico beat South Korea 2-1 in Group A. Update standings."*

**Option B — Local sync (private)**

```bash
# one-time setup
cp data/sync/feed.example.json data/sync/feed.json
# edit data/sync/feed.json with scores / player deltas

npm run sync -- --dry-run   # preview
npm run sync                # apply to MongoDB
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
```

---

## MongoDB Collections

- `teams` — group standings, form, possession
- `players` — goals, assists, xG
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