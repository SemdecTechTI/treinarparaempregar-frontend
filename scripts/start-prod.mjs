import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * OKD: o secret nuxt-env costuma vir como arquivo .env (o `nuxt dev` lia sozinho).
 * O servidor Nitro de produção não carrega .env — precisa injetar no process.env.
 */
function loadEnvFile(filePath) {
  const text = readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '')
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const withoutExport = line.startsWith('export ') ? line.slice(7).trim() : line
    const eq = withoutExport.indexOf('=')
    if (eq <= 0) continue

    const key = withoutExport.slice(0, eq).trim()
    let value = withoutExport.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

const envCandidates = [
  process.env.NUXT_ENV_FILE,
  resolve(process.cwd(), '.env'),
  '/opt/app-root/src/.env',
].filter(Boolean)

for (const candidate of envCandidates) {
  if (existsSync(candidate)) {
    loadEnvFile(candidate)
    break
  }
}

process.env.NITRO_HOST ||= '0.0.0.0'
process.env.HOST ||= process.env.NITRO_HOST
process.env.NITRO_PORT ||= process.env.PORT || '8080'
process.env.PORT ||= process.env.NITRO_PORT

const server = resolve(process.cwd(), '.output/server/index.mjs')
await import(pathToFileURL(server).href)
