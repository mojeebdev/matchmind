export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { applyDnsFix } = await import('./lib/dns-fix')
    applyDnsFix()
  }
}