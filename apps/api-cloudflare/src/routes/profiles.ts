import { Hono } from 'hono'
import { ID } from 'appwrite'
import { dbUpdate, getProfile } from '../lib/appwrite'
import { authMiddleware } from '../middleware/auth'

type User = { id: string; email: string; name: string }
type Env = { Bindings: any; Variables: { user: User; env: any } }

function serialize(doc: any) {
  if (!doc) return null
  return {
    id: doc.$id, userId: doc.userId, email: doc.email, name: doc.name,
    avatarUrl: doc.avatarUrl ?? null, restRatio: doc.restRatio ?? 5,
    theme: doc.theme ?? 'system', notificationsEnabled: doc.notificationsEnabled ?? false,
    soundEnabled: doc.soundEnabled ?? false, createdAt: doc.createdAt, updatedAt: doc.updatedAt,
  }
}

async function ensureProfile(e: any, user: User) {
  let profile = await getProfile(e, user.id)
  if (!profile) {
    profile = await fetch(`${e.appwriteEndpoint}/databases/${e.appwriteDatabaseId}/collections/${e.appwriteCollectionProfiles}/documents`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-appwrite-project': e.appwriteProjectId, 'x-appwrite-key': e.appwriteApiKey },
      body: JSON.stringify({ documentId: ID.unique(), data: { userId: user.id, email: user.email, name: user.name, restRatio: 5, theme: 'system', notificationsEnabled: false, soundEnabled: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } }),
    }).then(r => r.json())
  }
  return profile
}

const profiles = new Hono<Env>().use('*', authMiddleware)

profiles.get('/', async (c) => {
  const e = c.get('env')
  try {
    const profile = await ensureProfile(e, c.get('user'))
    return c.json({ success: true, data: serialize(profile), error: null, meta: null })
  } catch {
    return c.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'User not found' }, meta: null }, 404)
  }
})

profiles.patch('/', async (c) => {
  const e = c.get('env')
  const profile = await ensureProfile(e, c.get('user'))
  const b: any = await c.req.json().catch(() => ({}))
  const updates: any = {}
  if (b.name !== undefined) updates.name = b.name
  if (b.restRatio !== undefined) updates.restRatio = b.restRatio
  if (b.theme !== undefined) updates.theme = b.theme
  if (b.notificationsEnabled !== undefined) updates.notificationsEnabled = b.notificationsEnabled
  if (b.soundEnabled !== undefined) updates.soundEnabled = b.soundEnabled
  updates.updatedAt = new Date().toISOString()
  const updated = await dbUpdate(e, e.appwriteCollectionProfiles, profile.$id, updates)
  return c.json({ success: true, data: serialize(updated), error: null, meta: null })
})

profiles.post('/avatar', async (c) => {
  const e = c.get('env')
  const profile = await ensureProfile(e, c.get('user'))
  const b: any = await c.req.json().catch(() => ({}))
  let avatarUrl = profile.avatarUrl ?? null
  if (b?.avatarUrl !== undefined) avatarUrl = b.avatarUrl
  if (b?.file?.dataUrl) {
    try {
      const b64 = b.file.dataUrl.split(',')[1]
      const bytes = new Uint8Array([...b64].map((ch: string) => ch.charCodeAt(0)))
      const res = await fetch(`${e.appwriteEndpoint}/storage/buckets/${e.appwriteBucketAvatars}/files`, {
        method: 'POST',
        headers: { 'x-appwrite-project': e.appwriteProjectId, 'x-appwrite-key': e.appwriteApiKey },
        body: bytes,
      })
      if (res.ok) {
        const up: any = await res.json()
        avatarUrl = `${e.appwriteEndpoint}/storage/buckets/${e.appwriteBucketAvatars}/files/${up.$id}/view?project=${e.appwriteProjectId}`
      }
    } catch { /* ignore */ }
  }
  try {
    const updated = await dbUpdate(e, e.appwriteCollectionProfiles, profile.$id, { avatarUrl, updatedAt: new Date().toISOString() })
    return c.json({ success: true, data: serialize(updated), error: null, meta: null })
  } catch (err) {
    console.error('avatar update failed', err)
    return c.json({ success: true, data: serialize(profile), error: null, meta: null })
  }
})

export default profiles
