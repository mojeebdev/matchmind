import { ImageResponse } from 'next/og'
import { BRAND } from '@/lib/brand'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: BRAND.emerald,
          borderRadius: 8,
          border: `1px solid ${BRAND.goldBorder}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            width: 18,
            height: 18,
            gap: 3,
            justifyContent: 'center',
            alignContent: 'center',
          }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: i === 4 ? BRAND.gold : 'rgba(201,168,76,0.45)',
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}