import { Elysia, t } from 'elysia'
import { ID } from 'node-appwrite'
import { getDatabases, getStorage, getProfile, appwrite } from '../../lib/appwrite'
import { env } from '../../config/env'

function serialize(doc: any) {
  if (!doc) return null
  return {
    id: doc.$id,
    userId: doc.userId,
    email: doc.email,
    name: doc.name,
    avatarUrl: doc.avatarUrl ?? null,
    restRatio: doc.restRatio ?? 5,
    theme: doc.theme ?? 'system',
    notificationsEnabled: doc.notificationsEnabled ?? false,
    soundEnabled: doc.soundEnabled ?? false,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

async function ensureProfile(user: any): Promise<any> {
  const databases = getDatabases()
  let profile = await getProfile(user.id)
  if (!profile) {
    profile = await databases.createDocument(appwrite.databaseId, appwrite.collections.profiles, ID.unique(), {
      userId: user.id,
      email: user.email,
      name: user.name,
      restRatio: 5,
      theme: 'system',
      notificationsEnabled: false,
      soundEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }
  return profile
}

export const profileRoutes = new Elysia()
  
  .get('/api/me', async ({ user, set }: any) => {
    let profile: any
    try {
      profile = await ensureProfile(user)
    } catch {
      set.status = 404
      return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'User not found' }, meta: null }
    }
    return { success: true, data: serialize(profile), error: null, meta: null }
  })
  .patch('/api/me', async ({ user, body }: any) => {
    const databases = getDatabases()
    const profile = await ensureProfile(user)
    const updates: any = {}
    const b = body as any
    if (b.name !== undefined) updates.name = b.name
    if (b.restRatio !== undefined) updates.restRatio = b.restRatio
    if (b.theme !== undefined) updates.theme = b.theme
    if (b.notificationsEnabled !== undefined) updates.notificationsEnabled = b.notificationsEnabled
    if (b.soundEnabled !== undefined) updates.soundEnabled = b.soundEnabled
    updates.updatedAt = new Date().toISOString()
    const updated = await databases.updateDocument(appwrite.databaseId, appwrite.collections.profiles, profile.$id, updates)
    return { success: true, data: serialize(updated), error: null, meta: null }
  }, { body: t.Object({ name: t.Optional(t.String()), restRatio: t.Optional(t.Number()), theme: t.Optional(t.String()), notificationsEnabled: t.Optional(t.Boolean()), soundEnabled: t.Optional(t.Boolean()) }) })
  .post('/api/me/avatar', async ({ user, body }: any) => {
    const databases = getDatabases()
    const storage = getStorage()
    const profile = await ensureProfile(user)
    const b = body as any
    const buf = b?.file?.arrayBuffer ? await b.file.arrayBuffer() : null
    const name = b?.file?.name
    let avatarUrl = profile.avatarUrl ?? null
    if (buf && name) {
      const up = await storage.createFile(appwrite.buckets.avatars, ID.unique(), new File([buf as BlobPart], name))
      avatarUrl = `${env.appwriteEndpoint}/storage/buckets/${appwrite.buckets.avatars}/files/${up.$id}/view?project=${env.appwriteProjectId}`
    } else if (b?.avatarUrl !== undefined) {
      avatarUrl = b.avatarUrl
    }
    try {
      const updated = await databases.updateDocument(appwrite.databaseId, appwrite.collections.profiles, profile.$id, { avatarUrl, updatedAt: new Date().toISOString() })
      return { success: true, data: serialize(updated), error: null, meta: null }
    } catch (e) {
      console.error('profile update failed', e)
      return { success: true, data: serialize(profile), error: null, meta: null }
    }
  }, { body: t.Object({ file: t.Optional(t.Any()), avatarUrl: t.Optional(t.String()) }) })
