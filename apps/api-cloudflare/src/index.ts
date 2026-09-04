import { Hono } from 'hono'
import { getEnvFromContext } from './lib/env'
import { createAuth } from './lib/auth'
import healthRoutes from './routes/health'
import authRoutes from './routes/auth'
import taskRoutes from './routes/tasks'
import sessionRoutes from './routes/sessions'
import analyticsRoutes from './routes/analytics'
import profileRoutes from './routes/profiles'
import listRoutes from './routes/lists'
import googleRoutes from './routes/google'

type Bindings = {
  NODE_ENV: string; APP_URL: string; CORS_ORIGIN: string; API_URL: string; FRONTEND_URL: string
  REST_RATIO_DEFAULT: string; LOG_LEVEL: string
  APPWRITE_ENDPOINT: string; APPWRITE_PROJECT_ID: string; APPWRITE_API_KEY: string
  APPWRITE_DATABASE_ID: string
  APPWRITE_COLLECTION_PROFILES: string; APPWRITE_COLLECTION_TASKS: string
  APPWRITE_COLLECTION_SESSIONS: string; APPWRITE_COLLECTION_EVENTS: string
  APPWRITE_COLLECTION_LISTS: string; APPWRITE_COLLECTION_GOOGLE_TOKENS: string; APPWRITE_BUCKET_AVATARS: string
  GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; GOOGLE_REDIRECT_URI: string; GOOGLE_TOKEN_ENCRYPTION_KEY: string
  BETTER_AUTH_SECRET: string; BETTER_AUTH_URL: string
  RESEND_API_KEY: string; RESEND_FROM_EMAIL: string
  GITHUB_CLIENT_ID: string; GITHUB_CLIENT_SECRET: string
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings; Variables: { user: any; env: ReturnType<typeof getEnvFromContext> } }>()
  .use('*', async (c, next) => {
    c.set('env', getEnvFromContext(c))
    await next()
  })
  // Custom CORS: allow prod + localhost + env origins, reflect request origin if allowed
  .use('*', async (c, next) => {
    const env = c.get('env')
    const origin = c.req.header('Origin') ?? ''
    const prodOrigin = env.corsOrigin || 'https://flowdoro.3scode.my.id'
    const allowedOrigins = [
      prodOrigin,
      env.frontendUrl,
      env.appUrl,
      'http://localhost:5173',
      'http://localhost:8787',
      'http://localhost:4173',
      'https://flowdoro.3scode.my.id',
      'https://flowdoro-web.pages.dev',
      'https://flowdoro.email-trisno-sanjaya.pages.dev',
    ].filter(Boolean) as string[]
    const isAllowed = !origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')
    const allowOrigin = isAllowed && origin ? origin : prodOrigin

    const corsHeaders: Record<string, string> = {}
    // always add Vary, and set ACAO to the reflected allowed origin (or prod fallback)
    if (origin || c.req.method === 'OPTIONS') {
      corsHeaders['Access-Control-Allow-Origin'] = allowOrigin
      corsHeaders['Access-Control-Allow-Credentials'] = 'true'
      corsHeaders['Access-Control-Allow-Methods'] = 'GET,POST,PATCH,PUT,DELETE'
      corsHeaders['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,X-Idempotency-Key'
      corsHeaders['Vary'] = 'Origin'
    }

    if (c.req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    await next()
    const resp = c.res
    if (Object.keys(corsHeaders).length > 0) {
      for (const [k, v] of Object.entries(corsHeaders)) resp.headers.set(k, v)
    } else if (!resp.headers.get('access-control-allow-origin')) {
      resp.headers.set('Access-Control-Allow-Origin', allowOrigin)
      resp.headers.set('Access-Control-Allow-Credentials', 'true')
    }
  })
  .get('/api/health', (c) =>
    c.json({
      success: true, data: { status: 'ok', service: 'flowdoro-api', uptime: process.uptime(), env: c.get('env').nodeEnv }, error: null, meta: null,
    }),
  )
  // Better Auth D1 migration helper (remove in prod): POST /api/auth/migrate — creates D1 tables
  .post('/api/auth/migrate', async (c) => {
    const env = c.get('env') as any
    if (!env.DB) return c.json({ success: false, data: null, error: { code: 'INTERNAL_ERROR', message: 'D1 not bound — check wrangler.toml [[d1_databases]]' }, meta: null }, 500)
    const isDev = (env.NODE_ENV ?? env.nodeEnv) !== 'production'
    const secret = c.req.header('x-migrate-secret') ?? ''
    if (!isDev && secret !== (env.BETTER_AUTH_SECRET ?? env.betterAuthSecret ?? '')) return c.json({ success: false, data: null, error: { code: 'FORBIDDEN', message: 'Forbidden' }, meta: null }, 403)
    try {
      // @ts-ignore — Better Auth 1.7 exports getMigrations via "better-auth/db/migration" (see package.json "./db/migration")
      const mod: any = await import('better-auth/db/migration')
      const getMigrations = mod.getMigrations
      if (!getMigrations) throw new Error('getMigrations not exported from better-auth/db/migration')
      const auth = createAuth(env)
      const migrations = await (getMigrations as any)(auth.options)
      if (migrations.toBeCreated.length === 0 && migrations.toBeAdded.length === 0) return c.json({ success: true, data: { message: 'No migrations needed' }, error: null, meta: null })
      await migrations.runMigrations()
      return c.json({ success: true, data: { message: 'Migrations done', created: migrations.toBeCreated.map((t: any) => t.table), added: migrations.toBeAdded.map((t: any) => t.table) }, error: null, meta: null })
    } catch (e: any) {
      return c.json({ success: false, data: null, error: { code: 'INTERNAL_ERROR', message: e?.message ?? String(e) }, meta: null }, 500)
    }
  })
  // Better Auth handler (100% free D1) — only for Better Auth paths, fallback to legacy Appwrite routes otherwise
  .use('/api/auth/*', async (c, next) => {
    const path = new URL(c.req.url).pathname
    const isBetterAuthPath =
      path.startsWith('/api/auth/sign-') ||
      path.startsWith('/api/auth/callback/') ||
      path === '/api/auth/get-session' ||
      path === '/api/auth/ok' ||
      path.startsWith('/api/auth/verify-') ||
      path.startsWith('/api/auth/reset-password') ||
      path.startsWith('/api/auth/request-password-reset') ||
      path.startsWith('/api/auth/forget-password') ||
      path.startsWith('/api/auth/forgot-password') || // alias ejaan lama TECH-SPEC
      path.startsWith('/api/auth/update-user') ||
      path.startsWith('/api/auth/change-password')
    if (!isBetterAuthPath) { await next(); return }
    const env = c.get('env')
    if (!env.DB) return c.json({ success: false, data: null, error: { code: 'INTERNAL_ERROR', message: 'D1 not configured — set [[d1_databases]] in wrangler.toml' }, meta: null }, 500)
    const auth = createAuth(env)
    // alias: /forgot-password (o) -> /request-password-reset  and /forget-password -> /request-password-reset
    let rawReq = c.req.raw
    if (path.startsWith('/api/auth/forgot-password') || path.startsWith('/api/auth/forget-password')) {
      const url = new URL(c.req.url)
      url.pathname = url.pathname.replace('/forgot-password', '/request-password-reset').replace('/forget-password', '/request-password-reset')
      rawReq = new Request(url.toString(), c.req.raw as any)
    }
    return (auth as any).handler(rawReq)
  })
  .route('/api/auth', authRoutes)
  .route('/api/tasks', taskRoutes)
  .route('/api/sessions', sessionRoutes)
  .route('/api/analytics', analyticsRoutes)
  .route('/api/me', profileRoutes)
  .route('/api/lists', listRoutes)
  .route('/api/google', googleRoutes)

export default app
