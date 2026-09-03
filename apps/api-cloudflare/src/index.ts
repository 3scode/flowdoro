import { Hono } from 'hono'
import { getEnvFromContext } from './lib/env'
import healthRoutes from './routes/health'
import authRoutes from './routes/auth'
import taskRoutes from './routes/tasks'
import sessionRoutes from './routes/sessions'
import analyticsRoutes from './routes/analytics'
import profileRoutes from './routes/profiles'
import listRoutes from './routes/lists'

type Bindings = {
  NODE_ENV: string; APP_URL: string; CORS_ORIGIN: string; API_URL: string
  REST_RATIO_DEFAULT: string; LOG_LEVEL: string
  APPWRITE_ENDPOINT: string; APPWRITE_PROJECT_ID: string; APPWRITE_API_KEY: string
  APPWRITE_DATABASE_ID: string
  APPWRITE_COLLECTION_PROFILES: string; APPWRITE_COLLECTION_TASKS: string
  APPWRITE_COLLECTION_SESSIONS: string; APPWRITE_COLLECTION_EVENTS: string
  APPWRITE_COLLECTION_LISTS: string; APPWRITE_BUCKET_AVATARS: string
}

const app = new Hono<{ Bindings: Bindings; Variables: { user: any; env: ReturnType<typeof getEnvFromContext> } }>()
  .use('*', async (c, next) => {
    c.set('env', getEnvFromContext(c))
    await next()
  })
  // Custom CORS: works for both preflight OPTIONS and actual requests
  .use('*', async (c, next) => {
    const env = c.get('env')
    const origin = c.req.header('Origin') ?? ''
    const allowedOrigin = env.corsOrigin || 'https://flowdoro-web.pages.dev'
    const isCrossOrigin = origin && origin !== allowedOrigin && origin.startsWith('https://')

    const corsHeaders: Record<string, string> = {}
    if (isCrossOrigin || c.req.method === 'OPTIONS') {
      corsHeaders['Access-Control-Allow-Origin'] = allowedOrigin
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
    } else if (resp.headers.get('access-control-allow-origin') !== allowedOrigin) {
      resp.headers.set('Access-Control-Allow-Origin', allowedOrigin)
      resp.headers.set('Access-Control-Allow-Credentials', 'true')
    }
  })
  .get('/api/health', (c) =>
    c.json({
      success: true, data: { status: 'ok', service: 'flowdoro-api', uptime: process.uptime(), env: c.get('env').nodeEnv }, error: null, meta: null,
    }),
  )
  .route('/api/auth', authRoutes)
  .route('/api/tasks', taskRoutes)
  .route('/api/sessions', sessionRoutes)
  .route('/api/analytics', analyticsRoutes)
  .route('/api/me', profileRoutes)
  .route('/api/lists', listRoutes)

export default app
