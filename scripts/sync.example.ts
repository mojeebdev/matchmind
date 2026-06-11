/**
 * TEMPLATE ONLY — committed to GitHub as a stub.
 *
 * Setup (local, once):
 *   cp scripts/sync.example.ts scripts/sync.ts   # replace stub with your full local sync.ts
 *   cp data/sync/feed.example.json data/sync/feed.json
 *
 * scripts/sync.ts is gitignored — it holds your private sync recipe and never ships to GitHub.
 *
 * Run:
 *   npm run sync
 *   npm run sync -- --dry-run
 */

console.error(`
MatchMind sync is not set up on this machine.

1. Copy scripts/sync.example.ts → scripts/sync.ts (full version with FIFA support)
2. Add to .env:
     SYNC_MODE=fifa              # recommended — finished scores from FIFA
     # SYNC_MODE=both            # FIFA + data/sync/feed.json for player stats
3. Optional manual feed:
     cp data/sync/feed.example.json data/sync/feed.json

Then run:
  npm run sync -- --dry-run
  npm run sync
`)

process.exit(1)