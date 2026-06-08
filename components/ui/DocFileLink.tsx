import { githubBlobUrl } from '@/lib/site'

type DocFileLinkProps = {
  path: string
  children?: React.ReactNode
}

const linkStyle = {
  color: 'var(--gold)',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
} as const

export function DocFileLink({ path, children }: DocFileLinkProps) {
  return (
    <a
      href={githubBlobUrl(path)}
      target="_blank"
      rel="noopener noreferrer"
      style={linkStyle}
    >
      {children ?? path}
    </a>
  )
}