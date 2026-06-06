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

1. Copy scripts/sync.example.ts → scripts/sync.ts (use your private version)
2. Copy data/sync/feed.example.json → data/sync/feed.json
3. Add to .env (optional):
     SYNC_MODE=feed
     SYNC_FEED_PATH=data/sync/feed.json
     FOOTBALL_DATA_API_KEY=...   # only if SYNC_MODE=api|both

Then run: npm run sync
`)

process.exit(1)