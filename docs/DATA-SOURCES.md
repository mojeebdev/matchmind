# MatchMind Data Sources — Real vs Mockup

This document defines exactly what is **official FIFA data**, what is **verified historical**, what is **editorial (third-party)**, and what is **illustrative mockup** in MatchMind.

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

---

## Editorial squads & guides (Guardian + FOX)

| Dataset | Location | Status |
|---------|----------|--------|
| Tournament squads (48 × 26 = 1,248) | `lib/squads/group-*.ts` | Guardian WC2026 squad guide (Jun 2026) |
| United States roster (26) | `lib/squads/group-d.ts` | **FOX Sports official** USMNT roster (Jun 10 2026) — overrides Guardian USA |
| Per-player bios & photos | `lib/guardian-player-profiles.ts` | Guardian (all 1,248 players) |
| Team guides (coach, strengths, weaknesses, player pick) | `lib/guardian-team-guides.ts` | Guardian (all 48 teams) |
| FOX Top 100 ranks & caps | `lib/fox-top100-players.ts` | FOX Sports (Jun 2026) |
| FOX analyst bios | `lib/fox-player-bios.ts` | FOX Sports Top 100 + USMNT roster |
| FOX predictions & Americas rankings | `lib/fox-predictions.ts`, `lib/fox-americas-power-rankings.ts` | FOX Sports (Jun 2026) |
| Reuters key-player spotlights | `lib/reuters-key-players.ts` | Reuters (Jun 2026) |
| NPR tournament facts | `lib/npr-wc2026-facts.ts` | NPR (Jun 2026) |

**Regenerate Guardian libs:** `npx tsx scripts/generate-guardian-profiles.ts`

`tournament.squadSources` in seed metadata: Guardian default URL; United States points to FOX roster article. `OFFICIAL_SQUAD_TEAMS` = USA only (FIFA has not published all 48 official squads).

---

## Verified historical (real past data)

| Dataset | Location | Status |
|---------|----------|--------|
| World Cup editions 1930–2022 | `lib/worldcup-historical-data.ts` | Verified |
| Player World Cup careers (20 curated) | `PLAYER_WORLD_CUP_CAREERS` | Verified — matched to 2026 rosters via `lib/player-name-match.ts` |
| Head-to-head (14 curated meetings) | `H2H_CURATED` in `lib/worldcup2026-data.ts` | Verified past meetings |
| Head-to-head (72 group pairings) | `buildGroupStageH2H()` | 14 verified + **58 placeholders** (`dataNote` when no meetings on record) |

Historical data is factual and does **not** use preview mockup labeling.

---

## Illustrative / demo (preview mode only)

Active when `now < 2026-06-11` or `FORCE_TOURNAMENT_PREVIEW=true`. Clearly labeled **◇ Preview mockup** in the UI.

| Dataset | Location | Status |
|---------|----------|--------|
| Group-stage scores | `PREVIEW_SCORES` in `lib/worldcup2026-data.ts` | Mockup |
| Standings derived from mock scores | `buildPreviewStandings()` | Mockup |
| Player goals/assists/xG in tournament | `lib/squad-builder.ts` `PREVIEW_STATS` | Mockup |
| Club form & recent matches (most players) | `lib/player-enrichment.ts` | **Illustrative** (`clubFormSource: 'illustrative'`) — 10 stars are **curated** |
| Pass accuracy defaults | `player-enrichment.ts` | Estimated |

**Important:** All **104 fixtures** use official pairings, dates, venues, and bracket placeholders. Only **group-stage results** and most **club-form samples** are fabricated in preview mode.

---

## Live (post-kickoff)

Active on/after **11 June 2026** or with `FORCE_TOURNAMENT_LIVE=true`. Labeled **● Live MongoDB** in the UI.

**Recommended sync:** `SYNC_MODE=fifa` → `npm run sync` (or `/agent/admin` → Sync from FIFA).

| Dataset | Source | Status |
|---------|--------|--------|
| Match results & scores | FIFA `api.fifa.com` via `lib/fifa-sync.ts` | Synced on `npm run sync` |
| Group standings | Recalculated in MongoDB from finished group matches | Auto after score sync |
| Player tournament stats | Admin agent or `data/sync/feed.json` (`SYNC_MODE=both`) | Manual / feed only — FIFA sync does not include player stats |
| Knockout results | Same FIFA sync when matches finish | Synced live |

Knockout bracket (matches 73–104) is **pre-seeded** with official FIFA placeholders. Results fill in via sync as FIFA reports them.

---

## Re-seed after changes

```bash
npm run seed
```

Writes `tournament.dataSources` and `tournament.dataMode` to MongoDB so the agent knows what is official vs mockup vs editorial.

---

## References

- [FIFA World Cup 2026 final draw](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/final-draw-results)
- [FIFA match schedule PDF](https://digitalhub.fifa.com/m/1be9ce37eb98fcc5/original/FWC26-Match-Schedule_English.pdf)
- [Guardian WC2026 squads guide](https://www.theguardian.com/football/2026/jun/06/world-cup-2026-squads-guide)
- [FOX Sports Top 100](https://www.foxsports.com/stories/soccer/world-cup-2026-ranking-best-100-players)
- [FOX USMNT roster](https://www.foxsports.com/stories/soccer/usmnt-world-cup-roster-2026-pulisic-mckennie-weah-adams)