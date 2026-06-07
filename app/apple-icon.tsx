import { ImageResponse } from 'next/og'
import { BRAND } from '@/lib/brand'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  const dots = Array.from({ length: 9 })

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: BRAND.void,
        }}
      >
        <div
          style={{
            width: 156,
            height: 156,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: BRAND.emerald,
            borderRadius: 36,
            border: `4px solid ${BRAND.goldBorder}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              width: 96,
              height: 96,
              gap: 12,
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            {dots.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: i === 4 ? BRAND.gold : 'rgba(201,168,76,0.45)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}