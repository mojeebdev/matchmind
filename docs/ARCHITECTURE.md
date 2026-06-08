# MatchMind — Technical Architecture

## Overview

MatchMind is a multi-step AI agent that transforms natural language football questions into analyst-grade responses by combining:

1. **Gemini** (`gemini-2.5-flash-lite`) for intent classification and response generation
2. **MongoDB Atlas** as the football intelligence database
3. **MongoDB MCP tool interface** (`lib/mcp.ts`) for structured data retrieval
4. **Google ADK** (`@google/adk`) for agent orchestration when `USE_ADK_AGENT=true`
5. **Next.js 16+** App Router for the web UI and API routes

---

## Agent Flow (Fan — `/api/agent`)

### Step 1 — Question Classification
Every fan question is classified into one of five types:
- `stats` — player or team statistics queries
- `prediction` — future match outcome questions
- `fantasy` — team selection and player recommendations
- `tactical` — formation, pressing, and strategy questions
- `historical` — past results and head-to-head records

### Step 2 — MongoDB Query
The agent generates a targeted MongoDB aggregation pipeline and executes it via the `query_football_data` tool contract (`lib/mcp.ts`) against collections: `matches`, `players`, `teams`, `headToHead`, `groups`, `tournament`.

When `MCP_SERVER_URL` is unset, the direct MongoDB driver implements the same contract locally.

### Step 3 — Gemini / ADK Analysis
With `USE_ADK_AGENT=true`, the ADK `LlmAgent` (`agent/matchmind-agent.ts`) calls `query_football_data` and returns structured JSON.

Otherwise the local pipeline runs: `classifyQuestion()` → `mcpQueryFootballData()` → `analyzeFootballQuestion()`.

### Step 4 — Response Rendering
The structured response is rendered as an analyst card with:
- A punchy headline
- 2–4 paragraph analysis
- Key stats row (label, value, context)
- Confidence signal (high/medium/low)
- Data badge via `preview_data` / `live_data`:
  - **◇ Preview mockup** — illustrative stats before kickoff (11 Jun 2026)
  - **● Live MongoDB** — synced real results after kickoff
  - **○ Demo data** — in-memory fallback when MongoDB is not configured
- Follow-up question suggestion

---

## Tournament Data Phases (`lib/tournament-phase.ts`)

| Phase | Trigger | Official data | Mockup data | UI |
|---|---|---|---|---|
| `preview` | `now < 2026-06-11` (or `FORCE_TOURNAMENT_PREVIEW=true`) | Groups, fixtures, venues, kickoff times (FIFA Dec 2025 draw) | Scores, standings, player stats, sample knockouts | Amber banner + ◇ Preview mockup badge |
| `live` | On/after kickoff (or `FORCE_TOURNAMENT_LIVE=true`) | Official fixtures + synced results | — | ● Live MongoDB badge |

Official fixture data lives in `lib/worldcup2026-official-fixtures.ts`. See [docs/DATA-SOURCES.md](DATA-SOURCES.md) for the complete real vs mockup matrix.

`lib/response-data-mode.ts` applies `preview_data: true`, prepends disclosure text, and sets `live_data: false` during preview mode so the agent never claims mock stats are live FIFA data.

`getSeedDataset()` in `lib/worldcup2026-data.ts` picks preview vs live builders. `npm run seed` writes `tournament.dataMode` and `tournament.dataSources` to MongoDB.

---

## Admin Flow (`/api/admin/agent`)

Protected by `ADMIN_SECRET`. The admin ADK agent (`agent/matchmind-admin-agent.ts`) can:

- `update_match_result` — set scores; recalculates group standings
- `update_player_stats` — set or increment goals/assists
- `query_football_data` — verify data before/after writes

UI: `/agent/admin`

---

## Data Updates

| Method | Path | Notes |
|---|---|---|
| Seed | `npm run seed` | Full reset — preview mockup before kickoff, live fixtures after |
| Admin agent | `/agent/admin` | Natural-language writes |
| Local sync | `npm run sync` | Private `scripts/sync.ts` + `data/sync/feed.json` (gitignored) |

> Powered by live MongoDB sync after tournament kickoff. Independent of any official broadcast data feed. Before kickoff: **preview mockup** (clearly labeled). After kickoff: **live** synced results.

---

## MongoDB Collections

| Collection | Purpose |
|---|---|
| `teams` | Group standings, form, possession |
| `players` | Goals, assists, xG |
| `matches` | Fixtures, scores, stage, xG |
| `headToHead` | Historical meetings |
| `groups` | Group A–L definitions |
| `tournament` | Metadata, `dataMode` (`preview` \| `live`), `lastSyncedAt` |

---

## Security

- API keys in environment variables only — never client-side
- MongoDB Atlas IP whitelist + connection string auth
- `MONGODB_URI_DIRECT` optional for Windows SRV DNS issues
- Gemini and MongoDB calls server-side via Next.js API routes only
- Admin writes require `X-Admin-Key` header
- No user accounts — stateless agent interactions

---

## Performance

- Next.js 16+ App Router (v16.2.x) with React Server Components
- MongoDB aggregation with read-only pipeline safety (`lib/query-safety.ts`)
- Instrumentation hook applies DNS fix at server boot (`instrumentation.ts`)
- Vercel CDN for static assets and edge delivery

---

## UI / Design System

**Stadium Night × Gold Intelligence** — section backgrounds in `public/images/`:

| Asset | Class | Section |
|---|---|---|
| `desktop-hero.png` / `mobile-hero.png` | `.bg-hero` | Hero |
| `desktop-middle.png` / `mobile-middle.png` | `.bg-middle` | How It Works, `/agent` |
| `cta-desktop.png` / `cta-mobile.png` | `.cta-section` | Agent CTA on home (layered bg + light scrim) |
| `desktop-footer.png` / `mobile-footer.png` | `.bg-footer` | Footer |

Gradient scrims (`--scrim-*` in `styles/globals.css`) keep background art visible while preserving text contrast. Cards use glass-style blur (`backdrop-filter`).

---

## Implementation Map

| Component | Module | Status |
|---|---|---|
| MCP tool interface | `lib/mcp.ts` | `query_football_data` contract + direct-driver fallback |
| Fan agent orchestration | `lib/agent-builder.ts` | ADK when `USE_ADK_AGENT=true`; else local pipeline |
| Admin agent | `lib/admin-agent-builder.ts` | `/api/admin/agent` |
| MongoDB writes | `lib/mongo-writes.ts` | Match/player updates + standings recalc |
| Gemini model | `lib/gemini.ts` | `gemini-2.5-flash-lite` |
| Query safety | `lib/query-safety.ts` | Collection allowlist, write-stage blocking |
| Tournament phase | `lib/tournament-phase.ts` | Preview vs live date logic + disclosure copy |
| Response data mode | `lib/response-data-mode.ts` | Preview badges, disclaimers, `live_data` flags |
| Response validation | `lib/validation.ts` | Schema normalization + `live_data` / `preview_data` |
| Partial-env fallback | `lib/data-response.ts` | Deterministic MongoDB responses without Gemini |

**Fan data flow:** `runAgent()` → ADK or `processAgentQuestion()` → `mcpQueryFootballData()` → `validateAgentResponse()`

---

## Builder Notes

**The database is the intelligence; the agent is the reasoning layer on top.**

MongoDB isn't just storage — it's the domain knowledge base that makes Gemini's answers specific and traceable. Without MongoDB-backed tools, the agent would hallucinate statistics. With them, every stat can trace to a stored record.

That's what makes MatchMind a real agent, not a chatbot wrapper.