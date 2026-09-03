import { Hono } from 'hono'
import { ID } from 'appwrite'
import { dbList, dbGet, dbCreate, dbUpdate, dbDelete, getProfile } from '../lib/appwrite'
import { authMiddleware } from '../middleware/auth'

type User = { id: string; email: string; name: string }
type Env = { Bindings: any; Variables: { user: User; env: any } }

const sessions = new Hono<Env>().use('*', authMiddleware)

sessions.get('/active', async (c) => {
  const e = c.get('env')
  const r = await dbList(e, e.appwriteCollectionSessions, [['userId', c.get('user').id], ['status', 'active']])
  return c.json({ success: true, data: r.documents[0] ?? null, error: null, meta: null })
})

sessions.get('/', async (c) => {
  const e = c.get('env')
  const url = new URL(c.req.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'))
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') ?? '20')))
  const offset = (page - 1) * limit
  const filters: [string, string | number][] = [['userId', c.get('user').id]]
  const taskId = url.searchParams.get('taskId')
  if (taskId) filters.push(['taskId', taskId])
  const from = url.searchParams.get('from')
  if (from) filters.push(['startedAt', new Date(from).toISOString()])
  const to = url.searchParams.get('to')
  if (to) filters.push(['startedAt', new Date(to).toISOString()])
  const r = await dbList(e, e.appwriteCollectionSessions, filters)
  return c.json({ success: true, data: r.documents, error: null, meta: { page, limit, total: r.total, totalPages: Math.ceil(r.total / limit) } })
})

sessions.get('/:id', async (c) => {
  const e = c.get('env')
  try {
    const doc: any = await dbGet(e, e.appwriteCollectionSessions, c.req.param('id'))
    if (doc.userId !== c.get('user').id) return c.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Session not found' }, meta: null }, 404)
    const events = await dbList(e, e.appwriteCollectionEvents, [['sessionId', doc.$id]])
    return c.json({ success: true, data: { ...doc, events: events.documents }, error: null, meta: null })
  } catch {
    return c.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Session not found' }, meta: null }, 404)
  }
})

sessions.post('/', async (c) => {
  const e = c.get('env')
  const existing = await dbList(e, e.appwriteCollectionSessions, [['userId', c.get('user').id], ['status', 'active']])
  if (existing.total > 0) return c.json({ success: false, data: null, error: { code: 'CONFLICT', message: 'Already have an active session' }, meta: null }, 409)
  const { taskId }: any = await c.req.json().catch(() => ({}))
  const now = new Date().toISOString()
  const doc = await dbCreate(e, e.appwriteCollectionSessions, {
    userId: c.get('user').id, taskId: taskId ?? null, status: 'active',
    durationSeconds: 0, restEarnedSeconds: 0, restTakenSeconds: 0, startedAt: now, createdAt: now,
  })
  await dbCreate(e, e.appwriteCollectionEvents, { sessionId: doc.$id, eventType: 'focus_started', timestamp: now, payload: '{}' }).catch(() => {})
  return c.json({ success: true, data: doc, error: null, meta: null }, 201)
})

sessions.patch('/:id', async (c) => {
  const e = c.get('env')
  let doc: any
  try {
    doc = await dbGet(e, e.appwriteCollectionSessions, c.req.param('id'))
    if (doc.userId !== c.get('user').id) return c.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Session not found' }, meta: null }, 404)
  } catch {
    return c.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Session not found' }, meta: null }, 404)
  }
  const b: any = await c.req.json().catch(() => ({}))
  const updates: any = {}
  if (b.status) updates.status = b.status
  if (b.durationSeconds !== undefined) updates.durationSeconds = b.durationSeconds
  if (b.restEarnedSeconds !== undefined) updates.restEarnedSeconds = b.restEarnedSeconds
  if (b.restTakenSeconds !== undefined) updates.restTakenSeconds = b.restTakenSeconds
  if (b.endedAt) updates.endedAt = new Date(b.endedAt).toISOString()
  else if (b.status === 'completed' && !doc.endedAt) updates.endedAt = new Date().toISOString()
  if (b.status === 'completed' && b.durationSeconds !== undefined) {
    const profile = await getProfile(e, c.get('user').id)
    const ratio = profile?.restRatio ?? Number(e.restRatioDefault)
    updates.restEarnedSeconds = Math.floor(b.durationSeconds / ratio)
  }
  const updated = await dbUpdate(e, e.appwriteCollectionSessions, c.req.param('id'), updates)
  if (b.status) {
    await dbCreate(e, e.appwriteCollectionEvents, {
      sessionId: updated.$id, eventType: b.status === 'completed' ? 'session_ended' : b.status,
      timestamp: new Date().toISOString(), payload: '{}',
    }).catch(() => {})
  }
  return c.json({ success: true, data: updated, error: null, meta: null })
})

sessions.delete('/:id', async (c) => {
  const e = c.get('env')
  try {
    const doc: any = await dbGet(e, e.appwriteCollectionSessions, c.req.param('id'))
    if (doc.userId !== c.get('user').id) return c.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Session not found' }, meta: null }, 404)
    await dbDelete(e, e.appwriteCollectionSessions, c.req.param('id'))
    return c.json({ success: true, data: null, error: null, meta: null })
  } catch {
    return c.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Session not found' }, meta: null }, 404)
  }
})

export default sessions
