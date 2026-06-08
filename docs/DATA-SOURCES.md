# MatchMind Data Sources — Real vs Mockup

This document defines exactly what is **official FIFA data**, what is **verified historical**, and what is **illustrative mockup** in MatchMind.

---

## Official (real FIFA data)

Sourced from the **December 5, 2025 final draw** and the **FIFA World Cup 2026 match schedule** (published February 2024, updated after the draw).

| Dataset | Location | Status |
|---------|----------|--------|
| 48 teams in 12 groups | `lib/worldcup2026-official-fixtures.ts` → `OFFICIAL_GROUPS_2026` | Official |
| 72 group-stage pairings | `OFFICIAL_GROUP_FIXTURES` | Official |
| 32 knockout matches (R32 → final) | `OFFICIAL_KNOCKOUT_FIXTURES` | Official |
| **104 total matches** | group + knockout | Official |
| Match dates & kickoff times (UTC) | fixture `date` fields | Official |
| 16 host venues & cities | `OFFICIAL_VENUES` | Official |
| Tournament window (11 Jun – 19 Jul 2026) | `lib/tournament-phase.ts` | Official |

**Groups (official draw):**

| Group | Teams |
|-------|-------|
| A | Mexico, South Africa, South Korea, Czech Republic |
| B | Canada, Bosnia and Herzegovina, Qatar, Switzerland |
| C | Brazil, Morocco, Haiti, Scotland |
| D | United States, Paraguay, Australia, Turkey |
| E | Germany, Curaçao, Ivory Coast, Ecuador |
| F | Netherlands, Japan, Sweden, Tunisia |
| G | Belgium, Iran, New Zealand, Egypt |
| H | Spain, Cape Verde, Saudi Arabia, Uruguay |
| I | France, Senegal, Iraq, Norway |
| J | Argentina, Algeria, Austria, Jordan |
| K | Portugal, DR Congo, Uzbekistan, Colombia |
| L | England, Croatia, Ghana, Panama |

---

## Verified historical (real past data)

| Dataset | Location | Status |
|---------|----------|--------|
| World Cup editions 1930–2022 | `lib/worldcup-historical-data.ts` | Verified |
| Player World Cup careers | `playerWorldCupCareers` collection | Verified |
| Head-to-head records | `H2H_DATA` in `lib/worldcup2026-data.ts` | Verified past meetings |

Historical data is factual and does **not** use preview mockup labeling.

---

## Pending official (not seeded yet)

| Dataset | Location | Status |
|---------|----------|--------|
| Tournament squads (48 × 26) | `players` collection / `lib/worldcup2026-squads.ts` | **Pending** — FIFA has not published official squads |
| Club form & recent matches | `lib/player-enrichment.ts` | Populated only when official squads are added |

MatchMind does **not** seed curated or estimated rosters. The `players` collection stays empty until FIFA publishes official tournament squads.

| Dataset | Location | Status |
|---------|----------|--------|
| Coaches & FIFA ranks | `lib/worldcup2026-data.ts` | Approximate (Nov 2025 rankings) |

---

## Mockup (illustrative — preview mode only)

Active when `now < 2026-06-11` or `FORCE_TOURNAMENT_PREVIEW=true`. Clearly labeled **◇ Preview mockup** in the UI.

| Dataset | Location | Status |
|---------|----------|--------|
| Group-stage scores | `PREVIEW_SCORES` in `lib/worldcup2026-data.ts` | Mockup |
| Standings derived from mock scores | `buildPreviewStandings()` | Mockup |
| Player goals/assists/xG in tournament | `lib/squad-builder.ts` `PREVIEW_STATS` | Mockup (only when official squads exist) |
**Important:** All **104 fixtures** use official pairings, dates, venues, and bracket placeholders. Only **group-stage results** are fabricated in preview mode.

---

## Live (post-kickoff)

Active on/after **11 June 2026** or with `FORCE_TOURNAMENT_LIVE=true`. Labeled **● Live MongoDB** in the UI.

| Dataset | Source | Status |
|---------|--------|--------|
| Match results & scores | `npm run sync` or admin agent | Synced live |
| Player tournament stats | Admin agent / sync pipeline | Synced live |
| Standings | Computed from live results | Live |

Knockout bracket (matches 73–104) is **pre-seeded** with official FIFA placeholders (e.g. "Winner Group A"). Results fill in via sync after the group stage.

---

## Re-seed after changes

```bash
npm run seed
```

Writes `tournament.dataSources` and `tournament.dataMode` to MongoDB so the agent knows what is official vs mockup.

---

## References

- [FIFA World Cup 2026 final draw](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/final-draw-results)
- [FIFA match schedule PDF](https://digitalhub.fifa.com/m/1be9ce37eb98fcc5/original/FWC26-Match-Schedule_English.pdf)
- [2026 FIFA World Cup draw (Wikipedia)](https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_draw)