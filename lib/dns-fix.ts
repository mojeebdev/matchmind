import dns from 'dns'

let applied = false

/** Apply once — fixes querySrv ECONNREFUSED on Windows for mongodb+srv:// */
export function applyDnsFix() {
  if (applied) return
  applied = true
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])
  dns.setDefaultResultOrder('ipv4first')
}