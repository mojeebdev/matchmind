import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

/** Load .env then .env.local into process.env (for standalone scripts like seed). */
export function loadEnvFiles(cwd = process.cwd()) {
  for (const file of ['.env', '.env.local']) {
    const path = resolve(cwd, file)
    if (!existsSync(path)) continue

    const lines = readFileSync(path, 'utf8').split(/\r?\n/)
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      let value = trimmed.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (process.env[key] === undefined) {
        process.env[key] = value
      }
    }
  }
}