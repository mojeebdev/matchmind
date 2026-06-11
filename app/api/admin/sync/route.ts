import { applyDnsFix } from '@/lib/dns-fix'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminKey, isAdminConfigured } from '@/lib/admin-auth'
import { fetchFifaFixtureUpdates } from '@/lib/fifa-sync'
import { applySyncFeed, type SyncFeed } from '@/lib/sync-runner'

applyDnsFix()

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: 'Admin sync is not configured. Set ADMIN_SECRET in .env' },
      { status: 503 }
    )
  }

  const adminKey =
    request.headers.get('x-admin-key') ??
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')

  if (!verifyAdminKey(adminKey)) {
    return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 })
  }

  let body: { dryRun?: boolean; source?: string } = {}
  try {
    const raw = await request.json()
    if (raw && typeof raw === 'object') body = raw as typeof body
  } catch {
    // empty body is fine
  }

  const dryRun = body.dryRun === true
  const source = (body.source ?? process.env.SYNC_MODE ?? 'fifa').toLowerCase()

  if (source !== 'fifa') {
    return NextResponse.json(
      { error: 'Only source=fifa is supported from the admin API. Use npm run sync for feed mode.' },
      { status: 400 }
    )
  }

  try {
    const fifa = await fetchFifaFixtureUpdates({ includeLive: true, includeScheduled: false })
    const finishedMatches = fifa.matches.filter((m) => m.status === 'finished')

    const feed: SyncFeed = {
      matches: finishedMatches.map((m) => ({
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        homeScore: m.homeScore,
        awayScore: m.awayScore,
        status: 'finished' as const,
      })),
      players: [],
      meta: {
        source: fifa.meta.source,
        note: `FIFA season ${fifa.meta.seasonId} — ${finishedMatches.length} finished match(es)`,
      },
    }

    if (feed.matches.length === 0) {
      return NextResponse.json({
        dryRun,
        applied: false,
        message:
          'No finished scores on FIFA yet. Tournament fixtures are loaded; run again after matchdays.',
        fifa: fifa.meta,
      })
    }

    const result = await applySyncFeed(feed, dryRun)

    return NextResponse.json({
      dryRun,
      applied: !dryRun && result.matchOk > 0,
      message: dryRun
        ? `Dry run — would apply ${feed.matches.length} finished match(es) from FIFA`
        : `Applied ${result.matchOk} match(es) from FIFA`,
      fifa: fifa.meta,
      result,
      preview: dryRun ? feed.matches.slice(0, 12) : undefined,
    })
  } catch (error) {
    console.error('Admin FIFA sync error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'FIFA sync failed' },
      { status: 500 }
    )
  }
}