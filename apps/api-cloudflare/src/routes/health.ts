import { Hono } from 'hono'

const health = new Hono<{ Bindings: any; Variables: { env: any } }>()

health.get('/', (c) =>
  new Response(JSON.stringify({
    success: true, data: { status: 'ok', service: 'flowdoro-api', uptime: process.uptime(), env: c.get('env').nodeEnv }, error: null, meta: null,
  }), { headers: { 'content-type': 'application/json' } }),
)

export default health
