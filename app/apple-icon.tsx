import { ImageResponse } from 'next/og'
import { BRAND } from '@/lib/brand'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(145deg, ${BRAND.void} 0%, ${BRAND.emerald} 100%)`,
          borderRadius: 40,
          border: `3px solid ${BRAND.goldBorder}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            width: 72,
            height: 72,
            gap: 10,
            justifyContent: 'center',
            alignContent: 'center',
            marginBottom: 12,
          }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: i === 4 ? BRAND.gold : 'rgba(201,168,76,0.4)',
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 36,
            fontWeight: 700,
            color: BRAND.inkPrimary,
            letterSpacing: '-1px',
          }}
        >
          <span style={{ color: BRAND.inkPrimary }}>M</span>
          <span style={{ color: BRAND.gold }}>M</span>
        </div>
      </div>
    ),
    { ...size }
  )
}