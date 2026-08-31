import { Elysia, t } from 'elysia'
import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { tasks } from '../../db/schema'
import { verifyToken } from '../../middleware/auth'

async function getUser(headers: any, cookie: any) {
  const token = cookie?.token?.value ?? headers['authorization']?.replace('Bearer ', '')
  if (!token) throw new Error('UNAUTHORIZED')
  return await verifyToken(token)
}

export const taskRoutes = new Elysia({ prefix: '/api/tasks' })
  .get('/', async ({ headers, cookie, set }) => {
    try {
      const user = await getUser(headers as any, cookie)
      const list = await db.select().from(tasks).where(eq(tasks.userId, user.id))
      return { success: true, data: list, error: null, meta: null }
    } catch (e: any) { if (e.message === 'UNAUTHORIZED') { set.status = 401; return { success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null } } throw e }
  })
  .post('/', async ({ body, headers, cookie, set }) => {
    try {
      const user = await getUser(headers as any, cookie)
      const { name } = body as any
      if (!name || name.length < 1) { set.status = 422; return { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Task name required' }, meta: null } }
      const [t] = await db.insert(tasks).values({ userId: user.id, name }).returning()
      return { success: true, data: t, error: null, meta: null }
    } catch (e: any) { if (e.message === 'UNAUTHORIZED') { set.status = 401; return { success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null } } throw e }
  }, { body: t.Object({ name: t.String() }) })
