import { ImageResponse } from 'next/og'
import { BRAND } from '@/lib/brand'
import { publicSvgDataUrl } from '@/lib/og-assets'

export const alt = 'Football Intelligence AI | MatchMind — World Cup 2026'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  const logoSrc = await publicSvgDataUrl('logo.svg')

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

        <div style={{ display: 'flex', alignItems: 'center', gap: 28, zIndex: 1 }}>
          <img src={logoSrc} width={360} height={72} alt="MatchMind" />
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
              marginLeft: 'auto',
            }}
          >
            World Cup 2026 · AI Football Intelligence
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', zIndex: 1 }}>
          <div
            style={{
              fontSize: 36,
              color: BRAND.inkPrimary,
              fontWeight: 600,
              maxWidth: 820,
              lineHeight: 1.35,
              marginBottom: 16,
            }}
          >
            Football Intelligence AI
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