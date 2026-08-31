import { Elysia } from 'elysia'
import { env } from '../../config/env'

export const healthRoutes = new Elysia({ prefix: '/api/health' })
  .get('/', () => ({
    success: true,
    data: { status: 'ok', service: 'flowdoro-api', uptime: process.uptime(), env: env.nodeEnv },
    error: null,
    meta: null,
  }))
