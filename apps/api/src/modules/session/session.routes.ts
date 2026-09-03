import { Elysia, t } from 'elysia'
import { ID } from 'node-appwrite'
import { getDatabases, getProfile, appwrite, Query } from '../../lib/appwrite'

export const sessionRoutes = new Elysia({ prefix: '/api/sessions' })
  
  .get('/active', async ({ user }: any) => {
    const databases = getDatabases()
    const res = await databases.listDocuments(appwrite.databaseId, appwrite.collections.sessions, [Query.equal('userId', user.id), Query.equal('status', 'active'), Query.limit(1)])
    return { success: true, data: res.documents[0] ?? null, error: null, meta: null }
  })
  .get('/', async ({ user, query }: any) => {
    const databases = getDatabases()
    const page = Number((query as any).page ?? 1)
    const limit = Math.min(Number((query as any).limit ?? 20), 100)
    const offset = (page - 1) * limit
    const q = [Query.equal('userId', user.id)]
    if ((query as any).taskId) q.push(Query.equal('taskId', (query as any).taskId))
    if ((query as any).from) q.push(Query.greaterThanEqual('startedAt', new Date((query as any).from).toISOString()))
    if ((query as any).to) q.push(Query.lessThanEqual('startedAt', new Date((query as any).to).toISOString()))
    q.push(Query.orderDesc('startedAt'))
    q.push(Query.limit(limit))
    q.push(Query.offset(offset))
    const res = await databases.listDocuments(appwrite.databaseId, appwrite.collections.sessions, q, undefined, true)
    return { success: true, data: res.documents, error: null, meta: { page, limit, total: res.total, totalPages: Math.ceil(res.total / limit) } }
  })
  .get('/:id', async ({ user, params, set }: any) => {
    const databases = getDatabases()
    try {
      const doc = await databases.getDocument(appwrite.databaseId, appwrite.collections.sessions, (params as any).id)
      if (doc.userId !== user.id) { set.status = 404; return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Session not found' }, meta: null } }
      const events = await databases.listDocuments(appwrite.databaseId, appwrite.collections.events, [Query.equal('sessionId', doc.$id), Query.orderAsc('timestamp')])
      return { success: true, data: { ...doc, events: events.documents }, error: null, meta: null }
    } catch {
      set.status = 404
      return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Session not found' }, meta: null }
    }
  })
  .post('/', async ({ user, body, set }: any) => {
    const databases = getDatabases()
    const existing = await databases.listDocuments(appwrite.databaseId, appwrite.collections.sessions, [Query.equal('userId', user.id), Query.equal('status', 'active'), Query.limit(1)])
    if (existing.total > 0) { set.status = 409; return { success: false, data: null, error: { code: 'CONFLICT', message: 'Already have an active session' }, meta: null } }
    const { taskId } = body as any
    const now = new Date().toISOString()
    const doc = await databases.createDocument(appwrite.databaseId, appwrite.collections.sessions, ID.unique(), {
      userId: user.id,
      taskId: taskId ?? null,
      status: 'active',
      durationSeconds: 0,
      restEarnedSeconds: 0,
      restTakenSeconds: 0,
      startedAt: now,
      createdAt: now,
    })
    await databases.createDocument(appwrite.databaseId, appwrite.collections.events, ID.unique(), {
      sessionId: doc.$id,
      eventType: 'focus_started',
      timestamp: now,
      payload: '{}',
    }).catch(() => {})
    return { success: true, data: doc, error: null, meta: null }
  }, { body: t.Object({ taskId: t.Optional(t.String()) }) })
  .patch('/:id', async ({ user, params, body, set }: any) => {
    const databases = getDatabases()
    let doc: any
    try {
      doc = await databases.getDocument(appwrite.databaseId, appwrite.collections.sessions, (params as any).id)
      if (doc.userId !== user.id) { set.status = 404; return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Session not found' }, meta: null } }
    } catch {
      set.status = 404
      return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Session not found' }, meta: null }
    }
    const updates: any = {}
    const b = body as any
    if (b.status) updates.status = b.status
    if (b.durationSeconds !== undefined) updates.durationSeconds = b.durationSeconds
    if (b.restEarnedSeconds !== undefined) updates.restEarnedSeconds = b.restEarnedSeconds
    if (b.restTakenSeconds !== undefined) updates.restTakenSeconds = b.restTakenSeconds
    if (b.endedAt) updates.endedAt = new Date(b.endedAt).toISOString()
    else if (b.status === 'completed' && !doc.endedAt) updates.endedAt = new Date().toISOString()
    if (b.status === 'completed' && b.durationSeconds !== undefined) {
      const profile = await getProfile(user.id)
      const ratio = profile?.restRatio ?? 5
      updates.restEarnedSeconds = Math.floor(b.durationSeconds / ratio)
    }
    const updated = await databases.updateDocument(appwrite.databaseId, appwrite.collections.sessions, (params as any).id, updates)
    if (b.status) {
      await databases.createDocument(appwrite.databaseId, appwrite.collections.events, ID.unique(), {
        sessionId: updated.$id,
        eventType: b.status === 'completed' ? 'session_ended' : b.status,
        timestamp: new Date().toISOString(),
        payload: '{}',
      }).catch(() => {})
    }
    return { success: true, data: updated, error: null, meta: null }
  }, { body: t.Object({ status: t.Optional(t.String()), durationSeconds: t.Optional(t.Number()), restEarnedSeconds: t.Optional(t.Number()), restTakenSeconds: t.Optional(t.Number()), endedAt: t.Optional(t.String()) }) })
  .delete('/:id', async ({ user, params, set }: any) => {
    const databases = getDatabases()
    try {
      const doc = await databases.getDocument(appwrite.databaseId, appwrite.collections.sessions, (params as any).id)
      if (doc.userId !== user.id) { set.status = 404; return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Session not found' }, meta: null } }
      await databases.deleteDocument(appwrite.databaseId, appwrite.collections.sessions, (params as any).id)
      return { success: true, data: null, error: null, meta: null }
    } catch {
      set.status = 404
      return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Session not found' }, meta: null }
    }
  })
