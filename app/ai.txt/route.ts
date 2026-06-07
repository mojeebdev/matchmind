import { buildAiTxt } from '@/lib/aeo'

export const dynamic = 'force-static'

export function GET() {
  return new Response(buildAiTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}