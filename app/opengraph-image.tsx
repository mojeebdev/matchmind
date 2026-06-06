import { ImageResponse } from 'next/og'
import { BRAND } from '@/lib/brand'

export const alt = 'MatchMind — Football Intelligence AI for World Cup 2026'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: `linear-gradient(135deg, ${BRAND.void} 0%, ${BRAND.void02} 45%, ${BRAND.emerald} 100%)`,
          position: 'relative',
        }}
      >
        {/* Dot grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(201,168,76,0.15) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            opacity: 0.4,
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, zIndex: 1 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: BRAND.emerald,
              border: `2px solid ${BRAND.goldBorder}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color: BRAND.gold }}>MM</div>
          </div>
          <span
            style={{
              fontSize: 14,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: BRAND.gold,
              border: `1px solid ${BRAND.goldBorder}`,
              background: BRAND.goldDim,
              padding: '6px 14px',
              borderRadius: 999,
            }}
          >
            World Cup 2026 · AI Football Intelligence
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', zIndex: 1 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: '-3px',
              lineHeight: 1,
              marginBottom: 20,
            }}
          >
            <span style={{ color: BRAND.inkPrimary }}>Match</span>
            <span style={{ color: BRAND.gold }}>Mind</span>
          </div>
          <div
            style={{
              fontSize: 32,
              color: BRAND.inkSecondary,
              fontWeight: 400,
              maxWidth: 720,
              lineHeight: 1.4,
            }}
          >
            {BRAND.tagline}
          </div>
          <div
            style={{
              fontSize: 20,
              color: BRAND.inkMuted,
              marginTop: 24,
            }}
          >
            Gemini 2.5 Flash Lite · MongoDB Atlas · Google Cloud
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1,
            borderTop: `1px solid ${BRAND.voidBorder}`,
            paddingTop: 24,
          }}
        >
          <span style={{ fontSize: 18, color: BRAND.inkMuted }}>Built by @mojeebeth · BlindspotLab</span>
          <span style={{ fontSize: 18, color: BRAND.gold }}>matchmind.xyz</span>
        </div>
      </div>
    ),
    { ...size }
  )
}