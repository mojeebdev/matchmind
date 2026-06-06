import Image from 'next/image'
import Link from 'next/link'

type LogoProps = {
  href?: string
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
}

const heights = { sm: 28, md: 36, lg: 44 } as const

export function Logo({ href = '/', size = 'md', showWordmark = true }: LogoProps) {
  const h = heights[size]
  const w = showWordmark ? Math.round(h * 5) : h

  const img = (
    <Image
      src={showWordmark ? '/logo.svg' : '/icon.svg'}
      alt="MatchMind"
      width={w}
      height={h}
      priority
      style={{ height: h, width: 'auto' }}
    />
  )

  if (!href) return img

  return (
    <Link href={href} style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
      {img}
    </Link>
  )
}