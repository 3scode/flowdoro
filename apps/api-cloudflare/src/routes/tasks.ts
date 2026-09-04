import { Hono } from 'hono'
import { ID } from 'appwrite'
import { dbList, dbListAll, dbGet, dbCreate, dbUpdate, dbDelete } from '../lib/appwrite'
import { authMiddleware } from '../middleware/auth'
import * as calendar from '../lib/calendar'

type User = { id: string; email: string; name: string }
type Env = { Bindings: any; Variables: { user: User; env: any } }

const tasks = new Hono<Env>().use('*', authMiddleware)

tasks.get('/', async (c) => {
  const e = c.get('env')
  const url = new URL(c.req.url)
  const userId = c.get('user').id
  const parentId = url.searchParams.get('parentId')
  const listId = url.searchParams.get('listId')
  const status = url.searchParams.get('status')
  const starred = url.searchParams.get('starred') === 'true'
  let r: any
  if (parentId) {
    // get subtasks of given parent — use dbListAll to handle >25 subtasks
    r = await dbListAll(e, e.appwriteCollectionTasks, [['userId', userId], ['parentId', parentId]])
    if (starred) r.documents = r.documents.filter((d: any) => d.starred)
  } else if (listId) {
    // get tasks with exact listId match (use dbListAll + server-side listId filter, client-side top-level filter)
    const all = await dbListAll(e, e.appwriteCollectionTasks, [['userId', userId], ['listId', listId]])
    const docs = all.documents.filter((d: any) => !d.parentId)
    return c.json({ success: true, data: docs, error: null, meta: null })
  } else {
    // top-level tasks only (no parentId), optionally filter by status/starred
    r = await dbListAll(e, e.appwriteCollectionTasks, [['userId', userId]])
    const docs = r.documents.filter((d: any) => !d.parentId)
    if (status === 'done') {
      r.documents = docs.filter((d: any) => d.completedAt)
    } else if (status === 'pending') {
      r.documents = docs.filter((d: any) => !d.completedAt)
    } else {
      r.documents = docs
    }
    if (starred) r.documents = r.documents.filter((d: any) => d.starred)
    return c.json({ success: true, data: r.documents, error: null, meta: null })
  }
  const docs = r.documents
  const filtered = status === 'done'
    ? docs.filter((d: any) => d.completedAt)
    : status === 'pending'
    ? docs.filter((d: any) => !d.completedAt)
    : docs
  return c.json({ success: true, data: filtered, error: null, meta: null })
})

tasks.post('/', async (c) => {
  const e = c.get('env')
  const body: any = await c.req.json().catch(() => ({}))
  const { name, title, description, dueDate, dueTime, parentId, listId }: any = body
  if ((!title || title.length < 1) && (!name || name.length < 1)) {
    return c.json({ success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Task title required' }, meta: null }, 422)
  }
  const doc = await dbCreate(e, e.appwriteCollectionTasks, {
    userId: c.get('user').id,
    name: title || name,
    title: title || name,
    description, dueDate, dueTime,
    parentId, listId: listId ?? null,
    sortOrder: 0, completedAt: null, createdAt: new Date().toISOString(), starred: body.starred ?? false,
  })
  // best-effort calendar sync (non-blocking, ignore errors)
  try { await calendar.syncTaskToCalendar(e, doc) } catch {}
  return c.json({ success: true, data: doc, error: null, meta: null }, 201)
})

tasks.patch('/:id', async (c) => {
  const e = c.get('env')
  try {
    const doc: any = await dbGet(e, e.appwriteCollectionTasks, c.req.param('id'))
    if (doc.userId !== c.get('user').id) return c.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Task not found' }, meta: null }, 404)
  } catch {
    return c.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Task not found' }, meta: null }, 404)
  }
  const b: any = await c.req.json().catch(() => ({}))
  const updates: Record<string, any> = {}
  if (b.title !== undefined) updates.title = b.title
  if (b.description !== undefined) updates.description = b.description
  if (b.dueDate !== undefined) updates.dueDate = b.dueDate
  if (b.dueTime !== undefined) updates.dueTime = b.dueTime
  if (b.parentId !== undefined) updates.parentId = b.parentId
  if (b.listId !== undefined) updates.listId = b.listId ?? null
  if (b.sortOrder !== undefined) updates.sortOrder = b.sortOrder
  if (b.status !== undefined) updates.status = b.status
  if (b.completedAt !== undefined) updates.completedAt = b.completedAt
  if (b.starred !== undefined) updates.starred = b.starred
  const updated = await dbUpdate(e, e.appwriteCollectionTasks, c.req.param('id'), updates)
  try { await calendar.syncTaskToCalendar(e, updated) } catch {}
  return c.json({ success: true, data: updated, error: null, meta: null })
})

tasks.post('/:id/star', async (c) => {
  const e = c.get('env')
  try {
    const doc: any = await dbGet(e, e.appwriteCollectionTasks, c.req.param('id'))
    if (doc.userId !== c.get('user').id) return c.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Task not found' }, meta: null }, 404)
    const updated = await dbUpdate(e, e.appwriteCollectionTasks, c.req.param('id'), { starred: !doc.starred })
    return c.json({ success: true, data: updated, error: null, meta: null })
  } catch {
    return c.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Task not found' }, meta: null }, 404)
  }
})

tasks.put('/reorder', async (c) => {
  const e = c.get('env')
  const body: any = await c.req.json().catch(() => ({}))
  const tasks: Array<{ id: string; sortOrder: number }> = body.tasks ?? []
  if (!Array.isArray(tasks) || tasks.length === 0) return c.json({ success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'tasks array required' }, meta: null }, 422)
  for (const item of tasks) {
    try {
      const doc: any = await dbGet(e, e.appwriteCollectionTasks, item.id)
      if (doc.userId !== c.get('user').id) continue
      await dbUpdate(e, e.appwriteCollectionTasks, item.id, { sortOrder: item.sortOrder })
    } catch {}
  }
  return c.json({ success: true, data: null, error: null, meta: null })
})

tasks.post('/:id/toggle', async (c) => {
  const e = c.get('env')
  let doc: any
  try {
    doc = await dbGet(e, e.appwriteCollectionTasks, c.req.param('id'))
    if (doc.userId !== c.get('user').id) return c.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Task not found' }, meta: null }, 404)
  } catch {
    return c.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Task not found' }, meta: null }, 404)
  }
  const isDone = !!doc.completedAt
  const updates = { completedAt: isDone ? null : new Date().toISOString() }
  const updated = await dbUpdate(e, e.appwriteCollectionTasks, c.req.param('id'), updates)
  try {
    if (updated.completedAt) await calendar.deleteTaskFromCalendar(e, updated)
    else await calendar.syncTaskToCalendar(e, updated)
  } catch {}
  return c.json({ success: true, data: updated, error: null, meta: null })
})

tasks.delete('/:id', async (c) => {
  const e = c.get('env')
  try {
    const doc: any = await dbGet(e, e.appwriteCollectionTasks, c.req.param('id'))
    if (doc.userId !== c.get('user').id) return c.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Task not found' }, meta: null }, 404)
    try { await calendar.deleteTaskFromCalendar(e, doc) } catch {}
    // cascade delete subtasks — use dbListAll for completeness
    const children = await dbListAll(e, e.appwriteCollectionTasks, [['userId', c.get('user').id], ['parentId', doc.$id]])
    for (const child of children.documents) {
      try { await calendar.deleteTaskFromCalendar(e, child) } catch {}
      await dbDelete(e, e.appwriteCollectionTasks, child.$id)
    }
    await dbDelete(e, e.appwriteCollectionTasks, c.req.param('id'))
    return c.json({ success: true, data: null, error: null, meta: null })
  } catch {
    return c.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Task not found' }, meta: null }, 404)
  }
})

export default tasks
