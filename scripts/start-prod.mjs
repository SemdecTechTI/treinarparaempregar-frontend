import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'

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

const nodeMajor = Number(process.versions.node.split('.')[0])
if (nodeMajor < 20) {
  console.error(`Node 20+ é obrigatório (atual: ${process.version}). Rode: nvm use 20 && npm run start`)
  process.exit(1)
}

const inOpenShift = !!(process.env.OPENSHIFT_BUILD_NAME || process.env.KUBERNETES_SERVICE_HOST)
process.env.NITRO_HOST ||= '0.0.0.0'
process.env.HOST ||= process.env.NITRO_HOST
process.env.NITRO_PORT ||= process.env.PORT || (inOpenShift ? '8080' : '3002')
process.env.PORT ||= process.env.NITRO_PORT

// Dev usa Vite proxy em /api. O `nuxt start` não tem proxy — aponta direto no Laravel.
const apiBase = process.env.NUXT_PUBLIC_API_BASE || '/api'
const proxyTarget = process.env.NUXT_PROXY_API_TARGET?.replace(/\/$/, '')
if (apiBase === '/api' && proxyTarget) {
  process.env.NUXT_PUBLIC_API_BASE = `${proxyTarget}/api`
  console.log(`[start] NUXT_PUBLIC_API_BASE=/api → ${process.env.NUXT_PUBLIC_API_BASE}`)
}

const server = resolve(process.cwd(), '.output/server/index.mjs')
if (!existsSync(server)) {
  console.log('[start] .output ausente. Rodando npm run build...')
  const build = spawnSync('npm', ['run', 'build'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: process.env,
    shell: true,
  })
  if (build.status !== 0) {
    process.exit(build.status ?? 1)
  }
}

if (!existsSync(server)) {
  console.error('[start] Build terminou sem gerar .output/server/index.mjs')
  process.exit(1)
}

console.log(`[start] Node ${process.version}  http://${process.env.NITRO_HOST}:${process.env.NITRO_PORT}`)
await import(pathToFileURL(server).href)
