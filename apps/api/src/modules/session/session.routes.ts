import { Elysia, t } from 'elysia'
import { eq, and, desc, gte, lte } from 'drizzle-orm'
import { db } from '../../db'
import { sessions, sessionEvents } from '../../db/schema'
import { verifyToken } from '../../middleware/auth'

async function getUserFromReq(headers: Record<string, string | undefined>, cookie: any) {
  const token = cookie?.token?.value ?? headers['authorization']?.replace('Bearer ', '')
  if (!token) throw new Error('UNAUTHORIZED')
  return await verifyToken(token)
}

export const sessionRoutes = new Elysia({ prefix: '/api/sessions' })
  .get('/active', async ({ headers, cookie, set }) => {
    try {
      const user = await getUserFromReq(headers as any, cookie)
      const active = await db.query.sessions.findFirst({ where: (s, { eq, and }) => and(eq(s.userId, user.id), eq(s.status, 'active')) })
      return { success: true, data: active ?? null, error: null, meta: null }
    } catch { set.status = 401; return { success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null } }
  })
  .get('/', async ({ query, headers, cookie, set }) => {
    try {
      const user = await getUserFromReq(headers as any, cookie)
      const page = Number((query as any).page ?? 1)
      const limit = Math.min(Number((query as any).limit ?? 20), 100)
      const offset = (page - 1) * limit
      const conditions: any[] = [eq(sessions.userId, user.id)]
      if ((query as any).taskId) conditions.push(eq(sessions.taskId, (query as any).taskId))
      if ((query as any).from) conditions.push(gte(sessions.startedAt, new Date((query as any).from)))
      if ((query as any).to) conditions.push(lte(sessions.startedAt, new Date((query as any).to)))
      const list = await db.select().from(sessions).where(and(...conditions)).orderBy(desc(sessions.startedAt)).limit(limit).offset(offset)
      const totalRes = await db.select().from(sessions).where(and(...conditions))
      return { success: true, data: list, error: null, meta: { page, limit, total: totalRes.length, totalPages: Math.ceil(totalRes.length / limit) } }
    } catch { set.status = 401; return { success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null } }
  })
  .get('/:id', async ({ params, headers, cookie, set }) => {
    try {
      const user = await getUserFromReq(headers as any, cookie)
      const session = await db.query.sessions.findFirst({ where: (s, { eq, and }) => and(eq(s.id, (params as any).id), eq(s.userId, user.id)) })
      if (!session) { set.status = 404; return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Session not found' }, meta: null } }
      const events = await db.query.sessionEvents.findMany({ where: (e, { eq }) => eq(e.sessionId, session.id), orderBy: (e, { asc }) => [asc(e.timestamp)] })
      return { success: true, data: { ...session, events }, error: null, meta: null }
    } catch (e: any) { if (e.message === 'UNAUTHORIZED') { set.status = 401; return { success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null } } throw e }
  })
  .post('/', async ({ body, headers, cookie, set, request }) => {
    try {
      const user = await getUserFromReq(headers as any, cookie)
      const existing = await db.query.sessions.findFirst({ where: (s, { eq, and }) => and(eq(s.userId, user.id), eq(s.status, 'active')) })
      if (existing) { set.status = 409; return { success: false, data: null, error: { code: 'CONFLICT', message: 'Already have an active session' }, meta: null } }
      const { taskId } = body as any
      const [s] = await db.insert(sessions).values({ userId: user.id, taskId: taskId ?? null, status: 'active', startedAt: new Date() }).returning()
      await db.insert(sessionEvents).values({ sessionId: s.id, eventType: 'focus_started', timestamp: new Date() })
      return { success: true, data: s, error: null, meta: null }
    } catch (e: any) { if (e.message === 'UNAUTHORIZED') { set.status = 401; return { success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null } } throw e }
  }, { body: t.Object({ taskId: t.Optional(t.String()) }) })
  .patch('/:id', async ({ params, body, headers, cookie, set }) => {
    try {
      const user = await getUserFromReq(headers as any, cookie)
      const session = await db.query.sessions.findFirst({ where: (s, { eq, and }) => and(eq(s.id, (params as any).id), eq(s.userId, user.id)) })
      if (!session) { set.status = 404; return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Session not found' }, meta: null } }
      const updates: any = {}
      const b = body as any
      if (b.status) updates.status = b.status
      if (b.durationSeconds !== undefined) updates.durationSeconds = b.durationSeconds
      if (b.restEarnedSeconds !== undefined) updates.restEarnedSeconds = b.restEarnedSeconds
      if (b.restTakenSeconds !== undefined) updates.restTakenSeconds = b.restTakenSeconds
      if (b.endedAt) updates.endedAt = new Date(b.endedAt)
      else if (b.status === 'completed' && !session.endedAt) updates.endedAt = new Date()
      // auto calc rest if completing
      if (b.status === 'completed' && b.durationSeconds !== undefined) {
        const fetchedUser = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.id, user.id) })
        const ratio = fetchedUser?.restRatio ?? 5
        updates.restEarnedSeconds = Math.floor(b.durationSeconds / ratio)
      }
      const [updated] = await db.update(sessions).set(updates).where(eq(sessions.id, (params as any).id)).returning()
      if (b.status) await db.insert(sessionEvents).values({ sessionId: updated.id, eventType: b.status === 'completed' ? 'session_ended' : b.status, timestamp: new Date() })
      return { success: true, data: updated, error: null, meta: null }
    } catch (e: any) { if (e.message === 'UNAUTHORIZED') { set.status = 401; return { success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null } } throw e }
  }, { body: t.Object({ status: t.Optional(t.String()), durationSeconds: t.Optional(t.Number()), restEarnedSeconds: t.Optional(t.Number()), restTakenSeconds: t.Optional(t.Number()), endedAt: t.Optional(t.String()) }) })
  .delete('/:id', async ({ params, headers, cookie, set }) => {
    try {
      const user = await getUserFromReq(headers as any, cookie)
      const session = await db.query.sessions.findFirst({ where: (s, { eq, and }) => and(eq(s.id, (params as any).id), eq(s.userId, user.id)) })
      if (!session) { set.status = 404; return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Session not found' }, meta: null } }
      await db.delete(sessions).where(eq(sessions.id, (params as any).id))
      return { success: true, data: null, error: null, meta: null }
    } catch (e: any) { if (e.message === 'UNAUTHORIZED') { set.status = 401; return { success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null } } throw e }
  })
