import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { env } from './config/env'
import { healthRoutes } from './modules/health/health.routes'
import { authRoutes } from './modules/auth/auth.routes'
import { sessionRoutes } from './modules/session/session.routes'
import { analyticsRoutes } from './modules/analytics/analytics.routes'
import { profileRoutes } from './modules/profile/profile.routes'
import { taskRoutes } from './modules/tasks/task.routes'

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
    const msg = error?.message ?? ''
    if (msg === 'UNAUTHORIZED') {
      set.status = 401
      return { success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null }
    }
    if (code === 'VALIDATION') {
      set.status = 422
      return { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: (error as any)?.message ?? 'Validation failed' }, meta: null }
    }
    if (code === 'NOT_FOUND') {
      set.status = 404
      return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Resource not found' }, meta: null }
    }
    console.error(error)
    set.status = 500
    return { success: false, data: null, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }, meta: null }
  })
  .use(healthRoutes)
  .use(authRoutes)
  .use(sessionRoutes)
  .use(analyticsRoutes)
  .use(profileRoutes)
  .use(taskRoutes)
