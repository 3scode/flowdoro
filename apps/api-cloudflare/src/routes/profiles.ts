import { Hono } from 'hono'
import { ID } from 'appwrite'
import { dbUpdate, dbList, dbDelete, getProfile } from '../lib/appwrite'
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
  if (profile) return profile

  // Fallback: check by email (lowercased) — handles D1 migration where old Appwrite profile has different userId
  const emailLower = (user.email ?? '').toLowerCase()
  if (emailLower) {
    try {
      let byEmail = await dbList(e, e.appwriteCollectionProfiles, [['email', emailLower]])
      console.log(`[profiles] byEmail ${emailLower} found ${byEmail.documents?.length ?? 0}`)
      // Fallback for eventual consistency / query quirks: client-side filter if 0
      if (!byEmail.documents?.length) {
        try {
          const all = await dbList(e, e.appwriteCollectionProfiles, [], 100, 0)
          console.log(`[profiles] byEmail fallback all ${all.documents?.length ?? 0}`)
          const filtered = (all.documents || []).filter((d: any) => (d.email ?? '').toLowerCase() === emailLower)
          console.log(`[profiles] byEmail fallback filtered ${filtered.length}`)
          if (filtered.length) byEmail = { documents: filtered, total: filtered.length } as any
        } catch (e:any) { console.log('[profiles] fallback error', e?.message) }
      }
      if (byEmail.documents?.length) {
        // Pick most recent profile for this email
        const sorted = [...byEmail.documents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        const primary = sorted[0]
        const oldUserIds = [...new Set(sorted.map((d) => d.userId).filter((id: string) => id !== user.id))]
        if (oldUserIds.length) {
          console.log(`[profiles] reconciling ${emailLower}: ${oldUserIds.join(',')} -> ${user.id}`)
          // Update primary profile to new D1 id
          try { await dbUpdate(e, e.appwriteCollectionProfiles, primary.$id, { userId: user.id, updatedAt: new Date().toISOString() }) } catch {}
          // Migrate related collections from old ids to new
          const colls = [e.appwriteCollectionTasks, e.appwriteCollectionLists, e.appwriteCollectionSessions, e.appwriteCollectionGoogleTokens]
          for (const oldId of oldUserIds) {
            for (const coll of colls) {
              try {
                let offset = 0
                while (true) {
                  const res: any = await dbList(e, coll, [['userId', oldId]], 100, offset).catch(() => ({ documents: [] }))
                  if (!res.documents?.length) break
                  for (const doc of res.documents) {
                    try { await dbUpdate(e, coll, doc.$id, { userId: user.id }) } catch {}
                  }
                  if (res.documents.length < 100) break
                  offset += res.documents.length
                }
              } catch {}
            }
          }
          // Delete duplicate profiles (keep primary)
          for (let i = 1; i < sorted.length; i++) {
            try { await dbDelete(e, e.appwriteCollectionProfiles, sorted[i].$id) } catch {}
          }
          // Return the reconciled primary (now with new userId)
          const updated = await getProfile(e, user.id)
          if (updated) return updated
          return { ...primary, userId: user.id }
        }
        // No old ids (should not happen), but return primary if it already matches
        if (primary.userId === user.id) return primary
      }
    } catch {}
  }

  // No existing by userId or email — create new
  profile = await fetch(`${e.appwriteEndpoint}/databases/${e.appwriteDatabaseId}/collections/${e.appwriteCollectionProfiles}/documents`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-appwrite-project': e.appwriteProjectId, 'x-appwrite-key': e.appwriteApiKey },
    body: JSON.stringify({ documentId: ID.unique(), data: { userId: user.id, email: user.email, name: user.name, restRatio: 5, theme: 'system', notificationsEnabled: false, soundEnabled: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } }),
  }).then(r => r.json())
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
