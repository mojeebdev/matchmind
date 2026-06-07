import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export async function publicSvgDataUrl(filename: string): Promise<string> {
  const filePath = join(process.cwd(), 'public', filename)
  const svg = await readFile(filePath, 'utf8')
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}