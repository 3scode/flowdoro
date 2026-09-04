import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import * as google from '../lib/google'
import * as calendar from '../lib/calendar'

type Env = { Bindings: any; Variables: { user: any; env: any } }

const googleRoutes = new Hono<Env>()

googleRoutes.get('/connect', authMiddleware, async (c) => {
  const e = c.get('env')
  const user = c.get('user')
  if (!user) return c.json({ success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null }, 401)
  if (!e.googleClientId || !e.googleClientSecret) {
    return c.json({ success: false, data: null, error: { code: 'INTERNAL_ERROR', message: 'Google not configured' }, meta: null }, 500)
  }
  const { url } = await google.getConnectUrl(e, user.id)
  return c.json({ success: true, data: { url }, error: null, meta: null })
})

googleRoutes.get('/callback', async (c) => {
  const e = c.get('env')
  const code = c.req.query('code')
  const state = c.req.query('state')
  if (!code || !state) {
    return c.json({ success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Missing code or state' }, meta: null }, 422)
  }
  try {
    await google.exchangeCode(e, code, state)
    const decoded = JSON.parse(atob(state)) as { userId: string }
    await calendar.backfillUserTasks(e, decoded.userId)
    const frontendUrl = e.appUrl ?? 'https://flowdoro.3scode.my.id'
    return c.redirect(`${frontendUrl}/settings?google=connected`)
  } catch (err: any) {
    const msg = err?.message ?? 'Google OAuth failed'
    // if already redirected, rethrow?
    return c.json({ success: false, data: null, error: { code: 'INTERNAL_ERROR', message: msg }, meta: null }, 500)
  }
})

googleRoutes.get('/status', authMiddleware, async (c) => {
  const e = c.get('env')
  const user = c.get('user')
  if (!user) return c.json({ success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null }, 401)
  const status = await google.getStatus(e, user.id)
  return c.json({ success: true, data: status, error: null, meta: null })
})

googleRoutes.post('/disconnect', authMiddleware, async (c) => {
  const e = c.get('env')
  const user = c.get('user')
  if (!user) return c.json({ success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null }, 401)
  // unlink tasks googleEventId
  try {
    const { dbList, dbUpdate } = await import('../lib/appwrite')
    const tasks = await dbList(e, e.appwriteCollectionTasks, [['userId', user.id]])
    for (const task of tasks.documents) {
      if ((task as any).googleEventId) {
        await dbUpdate(e, e.appwriteCollectionTasks, (task as any).$id, { googleEventId: null, updatedAt: new Date().toISOString() })
      }
    }
  } catch {}
  await google.disconnect(e, user.id)
  return c.json({ success: true, data: null, error: null, meta: null })
})

export default googleRoutes
