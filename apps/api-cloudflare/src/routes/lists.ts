import { Hono } from 'hono'
import { ID } from 'appwrite'
import { dbList, dbGet, dbCreate, dbUpdate, dbDelete } from '../lib/appwrite'
import { authMiddleware } from '../middleware/auth'

type User = { id: string; email: string; name: string }
type Env = { Bindings: any; Variables: { user: User; env: any } }

const lists = new Hono<Env>().use('*', authMiddleware)

lists.get('/', async (c) => {
  const e = c.get('env')
  const r = await dbList(e, e.appwriteCollectionLists, [['userId', c.get('user').id]])
  return c.json({ success: true, data: r.documents, error: null, meta: null })
})

lists.post('/', async (c) => {
  const e = c.get('env')
  const { name }: any = await c.req.json().catch(() => ({}))
  if (!name || name.length < 1) return c.json({ success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'List name required' }, meta: null }, 422)
  // get max sortOrder to set next
  const existing = await dbList(e, e.appwriteCollectionLists, [['userId', c.get('user').id]])
  const nextSort = existing.documents.reduce((max: number, d: any) => Math.max(max, d.sortOrder ?? 0), 0) + 1
  const doc = await dbCreate(e, e.appwriteCollectionLists, { userId: c.get('user').id, name, sortOrder: nextSort, createdAt: new Date().toISOString() })
  return c.json({ success: true, data: doc, error: null, meta: null }, 201)
})

lists.patch('/:id', async (c) => {
  const e = c.get('env')
  try {
    const doc: any = await dbGet(e, e.appwriteCollectionLists, c.req.param('id'))
    if (doc.userId !== c.get('user').id) return c.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'List not found' }, meta: null }, 404)
  } catch {
    return c.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'List not found' }, meta: null }, 404)
  }
  const b: any = await c.req.json().catch(() => ({}))
  const updates: Record<string, any> = {}
  if (b.name !== undefined) updates.name = b.name.trim()
  if (b.sortOrder !== undefined) updates.sortOrder = b.sortOrder
  const updated = await dbUpdate(e, e.appwriteCollectionLists, c.req.param('id'), updates)
  return c.json({ success: true, data: updated, error: null, meta: null })
})

lists.delete('/:id', async (c) => {
  const e = c.get('env')
  try {
    const doc: any = await dbGet(e, e.appwriteCollectionLists, c.req.param('id'))
    if (doc.userId !== c.get('user').id) return c.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'List not found' }, meta: null }, 404)
    // un-link tasks from this list (set listId to null)
    const tasks = await dbList(e, e.appwriteCollectionTasks, [['userId', c.get('user').id], ['listId', doc.$id]])
    for (const task of tasks.documents) {
      await dbUpdate(e, e.appwriteCollectionTasks, task.$id, { listId: null }).catch(() => {})
    }
    await dbDelete(e, e.appwriteCollectionLists, c.req.param('id'))
    return c.json({ success: true, data: null, error: null, meta: null })
  } catch {
    return c.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'List not found' }, meta: null }, 404)
  }
})

export default lists
