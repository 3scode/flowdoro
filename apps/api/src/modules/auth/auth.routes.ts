import { Elysia, t } from 'elysia'
import { ID, Account } from 'node-appwrite'
import { getAdminClient, getDatabases, getUsers, appwrite, Query } from '../../lib/appwrite'
import { env } from '../../config/env'
import { SESSION_COOKIE } from '../../middleware/auth'

function serializeProfile(doc: any) {
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

function setSessionCookie(cookie: any, sessionSecret: string) {
  ;(cookie as any)[SESSION_COOKIE]?.set({
    value: sessionSecret,
    httpOnly: true,
    sameSite: 'lax',
    secure: env.nodeEnv === 'production',
    maxAge: 7 * 24 * 3600,
    path: '/',
    // No domain — browser defaults to request host (works with Vite proxy)
  })
}

export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .post('/register', async ({ body, set, cookie }) => {
    const { name, email, password } = body as any
    if (!name || name.length < 2) { set.status = 422; return { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Name min 2 chars' }, meta: null } }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { set.status = 422; return { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Invalid email' }, meta: null } }
    if (!password || password.length < 8) { set.status = 422; return { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Password min 8 chars' }, meta: null } }

    let appwriteUser: any
    try {
      const users = getUsers()
      appwriteUser = await users.create(ID.unique(), email.toLowerCase(), undefined, password, name)
    } catch (e: any) {
      const msg = e?.message ?? ''
      if (/already|exists|in use/i.test(msg)) {
        set.status = 409
        return { success: false, data: null, error: { code: 'CONFLICT', message: 'Email already registered' }, meta: null }
      }
      throw e
    }

    try {
      const databases = getDatabases()
      await databases.createDocument(appwrite.databaseId, appwrite.collections.profiles, ID.unique(), {
        userId: appwriteUser.$id,
        email: email.toLowerCase(),
        name,
        restRatio: 5,
        theme: 'system',
        notificationsEnabled: false,
        soundEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    } catch (e) {
      console.error('profile create failed', e)
    }

    let sessionSecret = ''
    try {
      const account = new Account(getAdminClient())
      const session: any = await account.createEmailPasswordSession(email.toLowerCase(), password)
      sessionSecret = session.secret ?? ''
    } catch {
      sessionSecret = ''
    }

    if (sessionSecret) setSessionCookie(cookie, sessionSecret)

    const profile = serializeProfile({ $id: appwriteUser.$id, userId: appwriteUser.$id, email: email.toLowerCase(), name, avatarUrl: null, restRatio: 5, theme: 'system', notificationsEnabled: false, soundEnabled: false })
    // Return access_token for SPA Bearer token auth
    return { success: true, data: { ...profile, token: sessionSecret }, error: null, meta: null }
  }, { body: t.Object({ name: t.String(), email: t.String(), password: t.String() }) })

  .post('/login', async ({ body, set, cookie }) => {
    const { email, password } = body as any
    try {
      const account = new Account(getAdminClient())
      const session: any = await account.createEmailPasswordSession(email.toLowerCase(), password)
      if (session.secret) setSessionCookie(cookie, session.secret)
      const databases = getDatabases()
      const res = await databases.listDocuments(appwrite.databaseId, appwrite.collections.profiles, [Query.equal('email', email.toLowerCase())])
      const profile = serializeProfile(res.documents[0] ?? null)
      // Return access_token for SPA Bearer token auth
      return { success: true, data: { ...profile, token: session.secret ?? '' }, error: null, meta: null }
    } catch {
      set.status = 401
      return { success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' }, meta: null }
    }
  }, { body: t.Object({ email: t.String(), password: t.String() }) })

  .post('/logout', ({ cookie }) => {
    ;(cookie as any)[SESSION_COOKIE]?.remove()
    return { success: true, data: null, error: null, meta: null }
  })
