import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { env } from './config/env'
import { healthRoutes } from './modules/health/health.routes'

export const app = new Elysia()
  .use(
    cors({
      origin: env.corsOrigin.split(','),
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Idempotency-Key'],
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    }),
  )
  .onError(({ code, error, set }) => {
    if (code === 'NOT_FOUND') {
      set.status = 404
      return {
        success: false,
        data: null,
        error: { code: 'NOT_FOUND', message: 'Resource not found' },
        meta: null,
      }
    }
    console.error(error)
    set.status = 500
    return {
      success: false,
      data: null,
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
      meta: null,
    }
  })
  .use(healthRoutes)
