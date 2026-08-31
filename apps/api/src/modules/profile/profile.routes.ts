import { Elysia, t } from 'elysia'
import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { users } from '../../db/schema'
import { verifyToken } from '../../middleware/auth'

async function getUser(headers: any, cookie: any) {
  const token = cookie?.token?.value ?? headers['authorization']?.replace('Bearer ', '')
  if (!token) throw new Error('UNAUTHORIZED')
  return await verifyToken(token)
}

export const profileRoutes = new Elysia()
  .get('/api/me', async ({ headers, cookie, set }) => {
    try {
      const payload = await getUser(headers as any, cookie)
      const user = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.id, payload.id) })
      if (!user) { set.status = 404; return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'User not found' }, meta: null } }
      const { passwordHash, ...safe } = user as any
      return { success: true, data: safe, error: null, meta: null }
    } catch (e: any) { if (e.message === 'UNAUTHORIZED') { set.status = 401; return { success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null } } throw e }
  })
  .patch('/api/me', async ({ body, headers, cookie, set }) => {
    try {
      const payload = await getUser(headers as any, cookie)
      const updates: any = {}
      const b = body as any
      if (b.name !== undefined) updates.name = b.name
      if (b.restRatio !== undefined) updates.restRatio = b.restRatio
      if (b.theme !== undefined) updates.theme = b.theme
      if (b.notificationsEnabled !== undefined) updates.notificationsEnabled = b.notificationsEnabled
      if (b.soundEnabled !== undefined) updates.soundEnabled = b.soundEnabled
      updates.updatedAt = new Date()
      const [updated] = await db.update(users).set(updates).where(eq(users.id, payload.id)).returning()
      const { passwordHash, ...safe } = updated as any
      return { success: true, data: safe, error: null, meta: null }
    } catch (e: any) { if (e.message === 'UNAUTHORIZED') { set.status = 401; return { success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null } } throw e }
  }, { body: t.Object({ name: t.Optional(t.String()), restRatio: t.Optional(t.Number()), theme: t.Optional(t.String()), notificationsEnabled: t.Optional(t.Boolean()), soundEnabled: t.Optional(t.Boolean()) }) })
