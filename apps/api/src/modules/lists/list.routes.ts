import { Elysia, t } from 'elysia'
import { ID } from 'node-appwrite'
import { getDatabases, appwrite, Query } from '../../lib/appwrite'

export const listRoutes = new Elysia({ prefix: '/api/lists' })

  .get('/', async ({ user }: any) => {
    const databases = getDatabases()
    const res = await databases.listDocuments(appwrite.databaseId, appwrite.collections.lists, [
      Query.equal('userId', user.id),
      Query.orderAsc('sortOrder'),
      Query.orderDesc('createdAt'),
    ])
    const data = res.documents.map((doc: any) => ({
      id: doc.$id,
      name: doc.name ?? 'Untitled',
      sortOrder: doc.sortOrder ?? 0,
      createdAt: doc.createdAt ?? new Date().toISOString(),
    }))
    return { success: true, data, error: null, meta: null }
  })
  .post('/', async ({ user, body, set }: any) => {
    const b = body as { name: string }
    if (!b.name || !b.name.trim()) {
      set.status = 422
      return { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'List name required' }, meta: null }
    }
    const databases = getDatabases()
    const now = new Date().toISOString()
    const existing = await databases.listDocuments(appwrite.databaseId, appwrite.collections.lists, [
      Query.equal('userId', user.id),
      Query.orderDesc('sortOrder'),
      Query.limit(1),
    ])
    const nextSort = (existing.documents[0]?.sortOrder ?? 0) + 1
    const doc = await databases.createDocument(appwrite.databaseId, appwrite.collections.lists, ID.unique(), {
      userId: user.id,
      name: b.name.trim(),
      sortOrder: nextSort,
      createdAt: now,
    })
    return { success: true, data: { id: doc.$id, name: doc.name, sortOrder: doc.sortOrder, createdAt: doc.createdAt }, error: null, meta: null }
  }, { body: t.Object({ name: t.String() }) })
  .patch('/:id', async ({ user, params, body, set }: any) => {
    const databases = getDatabases()
    const listId = (params as any).id
    let doc
    try {
      doc = await databases.getDocument(appwrite.databaseId, appwrite.collections.lists, listId)
      if (doc.userId !== user.id) { set.status = 404; return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'List not found' }, meta: null } }
    } catch {
      set.status = 404
      return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'List not found' }, meta: null }
    }
    const b = body as { name?: string; sortOrder?: number }
    const updates: Record<string, any> = {}
    if (b.name !== undefined) updates.name = b.name.trim()
    if (b.sortOrder !== undefined) updates.sortOrder = b.sortOrder
    const updated = await databases.updateDocument(appwrite.databaseId, appwrite.collections.lists, listId, updates)
    return { success: true, data: { id: updated.$id, name: updated.name, sortOrder: updated.sortOrder, createdAt: updated.createdAt }, error: null, meta: null }
  }, { body: t.Object({ name: t.Optional(t.String()), sortOrder: t.Optional(t.Number()) }) })
  .delete('/:id', async ({ user, params, set }: any) => {
    const databases = getDatabases()
    const listId = (params as any).id
    let doc
    try {
      doc = await databases.getDocument(appwrite.databaseId, appwrite.collections.lists, listId)
      if (doc.userId !== user.id) { set.status = 404; return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'List not found' }, meta: null } }
    } catch {
      set.status = 404
      return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'List not found' }, meta: null }
    }
    const tasks = await databases.listDocuments(appwrite.databaseId, appwrite.collections.tasks, [
      Query.equal('userId', user.id),
      Query.equal('listId', listId),
    ])
    for (const task of tasks.documents) {
      try { await databases.updateDocument(appwrite.databaseId, appwrite.collections.tasks, task.$id, { listId: null }) } catch {}
    }
    await databases.deleteDocument(appwrite.databaseId, appwrite.collections.lists, listId)
    return { success: true, data: null, error: null, meta: null }
  })
