# Where to get World Cup 2026 player stats (goals & assists)

MatchMind **auto-syncs match scores** from FIFA (`npm run sync`, `SYNC_MODE=fifa`).  
**Player goals and assists are manual** — you pull them from the sources below and write `data/sync/feed.json`.

---

## Your weekly workflow

```bash
# 1. Scores (automatic)
SYNC_MODE=fifa npm run sync

# 2. Copy latest player feed template or edit feed.json
cp data/sync/feed-md1.example.json data/sync/feed.json
# edit goals/assists totals (or goalsDelta after each matchday)

# 3. Validate names against your 1,248-player roster
npx tsx scripts/validate-feed.mjs data/sync/feed.json

# 4. Apply player stats only (or merge with FIFA)
SYNC_MODE=feed npm run sync -- --dry-run
SYNC_MODE=feed npm run sync
```

Use **`goals` / `assists`** for tournament totals after a matchday.  
Use **`goalsDelta` / `assistsDelta`** when adding one new goal mid-tournament.

---

## Official sources (use in this order)

### 1. FIFA scores & fixtures (scores only — you already use this)

| What | URL |
|------|-----|
| All matches | https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures |
| Standings | https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/standings |
| Single match (scorers in timeline) | Open any finished match → **Match centre** |

**Gives:** final score, sometimes goal scorers on match page.  
**Does not** feed MatchMind player stats automatically.

---

### 2. FotMob — best automated source (recommended)

| What | URL |
|------|-----|
| Goals + assists stats | https://www.fotmob.com/leagues/77/stats/season/24254/players/_goals_and_goal_assist |
| JSON API (goals) | https://data.fotmob.com/stats/77/season/24254/goals.json |
| JSON API (assists) | https://data.fotmob.com/stats/77/season/24254/goal_assist.json |
| JSON API (minutes) | https://data.fotmob.com/stats/77/season/24254/mins_played.json |
| JSON API (xG) | https://data.fotmob.com/stats/77/season/24254/expected_goals.json |
| Per-player page (e.g. Undav) | https://www.fotmob.com/players/661519/deniz-undav |
| Per-player JSON API | https://www.fotmob.com/api/data/playerData?id=661519 |

**One-command import into MatchMind:**

```bash
npm run fotmob-feed          # builds data/sync/feed.json (G/A/minutes/xG/rating for everyone who played)
npm run validate-feed        # check names vs roster
SYNC_MODE=both npm run sync  # FIFA scores + player stats
```

`fotmob-feed` pulls **~365 players** who have World Cup minutes (MD1) from FotMob league stat lists — no need to scrape each player page.

**Full squad map + club form (all ~1,248 players):**

```bash
npm run fotmob-squads              # map 48 teams → FotMob IDs → data/sync/fotmob-id-map.json
npm run fotmob-full                # map + playerData enrich + feed.json (club form, match logs)
# or step by step:
npm run fotmob-squads -- --enrich --feed
npm run validate-feed
SYNC_MODE=both npm run sync
```

`fotmob-squads` uses national team squad APIs (`teams?id={teamId}&tab=squad`). With `--enrich`, it calls `playerData` per player (~150ms delay) for club season stats, recent club matches, and World Cup match logs.

---

### 3. ESPN — backup Golden Boot page (Groups A–L)

| What | URL |
|------|-----|
| Top scorers & assists | https://www.espn.co.uk/football/stats/_/league/fifa.world |
| US mirror | https://www.espn.com/soccer/stats/_/league/fifa.world |

**Gives:** goals (G) and assists (A) per player, games played (P).  
**Tip:** ESPN may lag Groups E–F for a day; cross-check big games on FOX or match pages.

---

### 4. FOX Sports — goal-by-goal for high-scoring games

| What | URL |
|------|-----|
| Every goal ranked | https://www.foxsports.com/stories/soccer/2026-world-cup-goals-every-score-ranked |
| Top scorer per team | https://www.foxsports.com/stories/soccer/2026-world-cup-odds-top-goalscorer-each-team |

**Gives:** who scored in Germany 7–1, Sweden 5–1, etc. when ESPN is incomplete.

---

### 5. Match pages (when you need one game)

| Source | URL pattern |
|--------|-------------|
| FIFA match centre | `fifa.com/en/match-centre/match/17/285023/...` |
| BBC Sport | Search team name + World Cup 2026 on bbc.com/sport/football |
| Guardian live | theguardian.com/football/world-cup-2026 |

Open the **lineups / timeline** tab for scorers and assisters.

---

## What to update each matchday

| Data | Source | How in MatchMind |
|------|--------|------------------|
| Match scores | FIFA API | `SYNC_MODE=fifa npm run sync` |
| Group standings | Auto | Recalculated from scores |
| Player goals & assists | FotMob (`npm run fotmob-feed`) | `data/sync/feed.json` → `SYNC_MODE=feed npm run sync` |
| Minutes, xG | FotMob league stats (same feed) | Synced when present in `feed.json` |

---

## Name matching rules

Player names in `feed.json` must **exactly match** your seeded roster (accents matter):

| External site | Your database |
|---------------|---------------|
| Giovanni Reyna | Gio Reyna |
| Hwang In-Beom (sometimes wrong) | Hwang Hee-chan (Korea equalizer) |
| Cyrienco Summerville | Crysencio Summerville |
| Matthias Svanberg | Mattias Svanberg |

Run `npx tsx scripts/validate-feed.mjs` before every sync.

---

## Germany 7–1 Curaçao (reference)

| Player | G | A |
|--------|---|---|
| Kai Havertz | 2 | 0 |
| Felix Nmecha | 1 | 0 |
| Jamal Musiala | 1 | 0 |
| Nico Schlotterbeck | 1 | 0 |
| Nathaniel Brown | 1 | 0 |
| Deniz Undav | 1 | 1 |
| Florian Wirtz | 0 | 1 |
| Joshua Kimmich | 0 | 2 |
| Livano Comenencia | 1 | 0 | (Curaçao)

---

## After matchday 2+

1. `SYNC_MODE=fifa npm run sync` — new scores  
2. Refresh ESPN stats page — copy **full tournament totals** into feed (not deltas unless you prefer incremental)  
3. `validate-feed` → `sync`

Admin shortcut for 1–2 fixes: `/agent/admin` → *"Set Kai Havertz to 2 goals."*