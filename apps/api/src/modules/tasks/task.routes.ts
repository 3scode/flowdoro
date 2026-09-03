import { Elysia, t } from 'elysia'
import { ID } from 'node-appwrite'
import { getDatabases, appwrite, Query } from '../../lib/appwrite'
import * as calendar from '../../lib/calendar'

type TaskBody = {
  title: string
  description?: string | null
  dueDate?: string | null
  dueTime?: string | null
  priority?: number
  parentId?: string | null
  sortOrder?: number
  listId?: string | null
}

function serialize(doc: any): any {
  if (!doc) return null
  return {
    id: doc.$id,
    userId: doc.userId,
    title: doc.title ?? '',
    description: doc.description ?? null,
    status: doc.completedAt ? 'done' : 'pending',
    dueDate: doc.dueDate ?? null,
    dueTime: doc.dueTime ?? null,
    priority: doc.priority ?? 0,
    parentId: doc.parentId ?? null,
    sortOrder: doc.sortOrder ?? 0,
    completedAt: doc.completedAt ?? null,
    googleEventId: doc.googleEventId ?? null,
    listId: doc.listId ?? null,
    createdAt: doc.createdAt ?? new Date().toISOString(),
    updatedAt: doc.updatedAt ?? new Date().toISOString(),
  }
}

async function fireAndForget(fn: Promise<void>): Promise<void> {
  void fn.catch(() => {})
}

export const taskRoutes = new Elysia({ prefix: '/api/tasks' })

  .get('/', async ({ user, query }: any) => {
    const databases = getDatabases()
    const filters: any[] = [Query.equal('userId', user.id)]
    const qParent = query?.parentId as string | undefined
    const qListId = query?.listId as string | undefined
    if (qParent) {
      filters.push(Query.equal('parentId', qParent))
    } else {
      filters.push(Query.isNull('parentId'))
    }
    if (qListId) filters.push(Query.equal('listId', qListId))
    else filters.push(Query.isNull('listId'))
    filters.push(Query.orderAsc('sortOrder'), Query.orderDesc('createdAt'))
    const res = await databases.listDocuments(appwrite.databaseId, appwrite.collections.tasks, filters)
    // Client-side status filter (status derived from completedAt)
    const qStatus = query?.status as string | undefined
    const tasks = qStatus === 'done'
      ? res.documents.filter((d: any) => d.completedAt)
      : qStatus === 'pending'
      ? res.documents.filter((d: any) => !d.completedAt)
      : res.documents
    return { success: true, data: tasks.map(serialize), error: null, meta: null }
  })
  .post('/', async ({ body, user, set }: any) => {
    const b = body as TaskBody
    if (!b.title || b.title.length < 1) {
      set.status = 422
      return { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Task title required' }, meta: null }
    }
    const databases = getDatabases()
    const doc = await databases.createDocument(appwrite.databaseId, appwrite.collections.tasks, ID.unique(), {
      userId: user.id,
      name: b.title,
      title: b.title,
      description: b.description ?? null,
      dueDate: b.dueDate ?? null,
      dueTime: b.dueTime ?? null,
      priority: b.priority ?? 0,
      parentId: b.parentId ?? null,
      sortOrder: b.sortOrder ?? 0,
      listId: b.listId ?? null,
      completedAt: null,
      googleEventId: null,
    })
    fireAndForget(calendar.syncTaskToCalendar({ ...doc, userId: user.id }))
    return { success: true, data: serialize(doc), error: null, meta: null }
  }, { body: t.Object({ title: t.String(), description: t.Optional(t.Union([t.String(), t.Null()])), dueDate: t.Optional(t.Union([t.String(), t.Null()])), dueTime: t.Optional(t.Union([t.String(), t.Null()])), priority: t.Optional(t.Number()), parentId: t.Optional(t.Union([t.String(), t.Null()])), sortOrder: t.Optional(t.Number()), listId: t.Optional(t.Union([t.String(), t.Null()])) }) })
  .patch('/:id', async ({ params, user, body, set }: any) => {
    const databases = getDatabases()
    const taskId = (params as any).id
    let doc
    try { doc = await databases.getDocument(appwrite.databaseId, appwrite.collections.tasks, taskId) } catch {
      set.status = 404
      return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Task not found' }, meta: null }
    }
    if (doc.userId !== user.id) {
      set.status = 404
      return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Task not found' }, meta: null }
    }
    const updates: Record<string, any> = {}
    const b = body as Partial<TaskBody & { status?: string; completedAt?: string }>
    if (b.title !== undefined) updates.title = b.title
    if (b.description !== undefined) updates.description = b.description
    if (b.dueDate !== undefined) updates.dueDate = b.dueDate
    if (b.dueTime !== undefined) updates.dueTime = b.dueTime
    if (b.priority !== undefined) updates.priority = b.priority
    if (b.parentId !== undefined) updates.parentId = b.parentId
    if (b.sortOrder !== undefined) updates.sortOrder = b.sortOrder
    if (b.listId !== undefined) updates.listId = b.listId
    if (b.status !== undefined) updates.status = b.status
    if (b.completedAt !== undefined) updates.completedAt = b.completedAt
    await databases.updateDocument(appwrite.databaseId, appwrite.collections.tasks, taskId, updates)
    const updated = await databases.getDocument(appwrite.databaseId, appwrite.collections.tasks, taskId)
    fireAndForget(updated.status === 'done' ? calendar.deleteTaskFromCalendar(updated) : calendar.syncTaskToCalendar(updated))
    return { success: true, data: serialize(updated), error: null, meta: null }
  }, { body: t.Object({ title: t.Optional(t.String()), description: t.Optional(t.Union([t.String(), t.Null()])), dueDate: t.Optional(t.Union([t.String(), t.Null()])), dueTime: t.Optional(t.Union([t.String(), t.Null()])), priority: t.Optional(t.Number()), parentId: t.Optional(t.Union([t.String(), t.Null()])), sortOrder: t.Optional(t.Number()), listId: t.Optional(t.Union([t.String(), t.Null()])), status: t.Optional(t.String()), completedAt: t.Optional(t.String()) }) })
  .put('/reorder', async ({ body, user, set }: any) => {
    const databases = getDatabases()
    const tasks = (body as { tasks: Array<{ id: string; sortOrder: number }> }).tasks
    if (!Array.isArray(tasks) || tasks.length === 0) {
      set.status = 422
      return { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'tasks array required' }, meta: null }
    }
    for (const item of tasks) {
      try {
        const doc = await databases.getDocument(appwrite.databaseId, appwrite.collections.tasks, item.id)
        if (doc.userId !== user.id) continue
        await databases.updateDocument(appwrite.databaseId, appwrite.collections.tasks, item.id, { sortOrder: item.sortOrder })
      } catch {}
    }
    return { success: true, data: null, error: null, meta: null }
  }, { body: t.Object({ tasks: t.Array(t.Object({ id: t.String(), sortOrder: t.Number() })) }) })
  .post('/:id/toggle', async ({ params, user, set }: any) => {
    const databases = getDatabases()
    const taskId = (params as any).id
    let doc
    try { doc = await databases.getDocument(appwrite.databaseId, appwrite.collections.tasks, taskId) } catch {
      set.status = 404
      return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Task not found' }, meta: null }
    }
    if (doc.userId !== user.id) {
      set.status = 404
      return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Task not found' }, meta: null }
    }
    const isDone = !!doc.completedAt
    const updates: Record<string, any> = {
      completedAt: isDone ? null : new Date().toISOString(),
    }
    await databases.updateDocument(appwrite.databaseId, appwrite.collections.tasks, taskId, updates)
    const updated = await databases.getDocument(appwrite.databaseId, appwrite.collections.tasks, taskId)
    fireAndForget(isDone ? calendar.syncTaskToCalendar(updated) : calendar.deleteTaskFromCalendar(updated))
    return { success: true, data: serialize(updated), error: null, meta: null }
  })
  .delete('/:id', async ({ params, user, set }: any) => {
    const databases = getDatabases()
    const taskId = (params as any).id
    let doc
    try { doc = await databases.getDocument(appwrite.databaseId, appwrite.collections.tasks, taskId) } catch {
      set.status = 404
      return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Task not found' }, meta: null }
    }
    if (doc.userId !== user.id) {
      set.status = 404
      return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Task not found' }, meta: null }
    }
    fireAndForget(doc.googleEventId ? calendar.deleteTaskFromCalendar(doc) : Promise.resolve())
    // cascade delete subtasks
    const children = await databases.listDocuments(appwrite.databaseId, appwrite.collections.tasks, [Query.equal('userId', user.id), Query.equal('parentId', taskId)])
    for (const child of children.documents) {
      await databases.deleteDocument(appwrite.databaseId, appwrite.collections.tasks, child.$id)
    }
    await databases.deleteDocument(appwrite.databaseId, appwrite.collections.tasks, taskId)
    return { success: true, data: null, error: null, meta: null }
  })
