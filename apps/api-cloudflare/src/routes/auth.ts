import { Hono } from 'hono'
import { ID } from 'appwrite'
import { dbCreate, dbList } from '../lib/appwrite'
import { json, getSessionToken } from '../lib/response'

type User = { id: string; email: string; name: string }
type Env = { Bindings: any; Variables: { user: User; env: any } }

function serializeProfile(doc: any) {
  if (!doc) return null
  return {
    id: doc.$id, userId: doc.userId, email: doc.email, name: doc.name,
    avatarUrl: doc.avatarUrl ?? null, restRatio: doc.restRatio ?? 5,
    theme: doc.theme ?? 'system', notificationsEnabled: doc.notificationsEnabled ?? false,
    soundEnabled: doc.soundEnabled ?? false, createdAt: doc.createdAt, updatedAt: doc.updatedAt,
  }
}

function extractSecretFromCookie(cookieHeader: string, projectId: string): string {
  const regex = new RegExp(`a_session_${projectId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=(.+?);`)
  const match = cookieHeader.match(regex)
  return match?.[1] ?? ''
}

const auth = new Hono<Env>()

auth.post('/register', async (c) => {
  const { name, email, password }: any = await c.req.json().catch(() => ({}))
  if (!name || name.length < 2) return json(c, { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Name min 2 chars' }, meta: null }, 422)
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(c, { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Invalid email' }, meta: null }, 422)
  if (!password || password.length < 8) return json(c, { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Password min 8 chars' }, meta: null }, 422)

  const emailLower = email.toLowerCase()
  const e = c.get('env')
  try {
    const createRes = await fetch(`${e.appwriteEndpoint}/users`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-appwrite-project': e.appwriteProjectId, 'x-appwrite-key': e.appwriteApiKey },
      body: JSON.stringify({ userId: ID.unique(), email: emailLower, password, name }),
    })
    if (!createRes.ok) {
      const errBody: any = await createRes.json().catch(() => ({}))
      if (/already|exists/i.test(errBody?.message ?? '')) return json(c, { success: false, data: null, error: { code: 'CONFLICT', message: 'Email already registered' }, meta: null }, 409)
      throw new Error(errBody?.message ?? 'Registration failed')
    }
    const user: any = await createRes.json()
    await dbCreate(e, e.appwriteCollectionProfiles, {
      userId: user.$id, email: emailLower, name, restRatio: 5, theme: 'system',
      notificationsEnabled: false, soundEnabled: false,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }).catch((err: any) => console.error('profile create failed', err?.message))

    const loginRes = await fetch(`${e.appwriteEndpoint}/account/sessions/email`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-appwrite-project': e.appwriteProjectId },
      body: JSON.stringify({ email: emailLower, password }),
    })
    if (!loginRes.ok) throw new Error('Login failed after registration')
    await loginRes.json()
    // Extract session secret from Set-Cookie header (Appwrite returns secret there, not in JSON body)
    const cookieHdr = loginRes.headers.get('set-cookie') ?? ''
    const sessionSecret = extractSecretFromCookie(cookieHdr, e.appwriteProjectId)
    const profile = serializeProfile({ $id: user.$id, userId: user.$id, email: emailLower, name, avatarUrl: null, restRatio: 5, theme: 'system', notificationsEnabled: false, soundEnabled: false })
    return c.json({ success: true, data: { ...profile, token: sessionSecret }, error: null, meta: null }, 201)
  } catch (err: any) {
    console.error('register failed', err.message)
    return json(c, { success: false, data: null, error: { code: 'INTERNAL_ERROR', message: err?.message ?? 'Registration failed' }, meta: null }, 500)
  }
})

auth.post('/login', async (c) => {
  const { email, password }: any = await c.req.json().catch(() => ({}))
  if (!email || !password) return json(c, { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Email and password required' }, meta: null }, 422)
  const emailLower = email.toLowerCase()
  const e = c.get('env')
  try {
    const loginRes = await fetch(`${e.appwriteEndpoint}/account/sessions/email`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-appwrite-project': e.appwriteProjectId },
      body: JSON.stringify({ email: emailLower, password }),
    })
    if (!loginRes.ok) throw new Error('Invalid credentials')
    await loginRes.json()
    // Extract session secret from Set-Cookie header (Appwrite returns secret there, not in JSON body)
    const cookieHdr = loginRes.headers.get('set-cookie') ?? ''
    const sessionSecret = extractSecretFromCookie(cookieHdr, e.appwriteProjectId)
    const profile = await dbList(e, e.appwriteCollectionProfiles, [['email', emailLower]]).then(r => r.documents?.[0] ?? null)
    return c.json({ success: true, data: { ...serializeProfile(profile), token: sessionSecret }, error: null, meta: null }, 200)
  } catch {
    return json(c, { success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' }, meta: null }, 401)
  }
})

auth.post('/logout', async (c) => {
  const e = c.get('env')
  const token = getSessionToken(c.req.raw, e.appwriteProjectId)
  if (token) {
    try {
      await fetch(`${e.appwriteEndpoint}/account/sessions/current`, {
        method: 'DELETE',
        headers: { 'x-appwrite-project': e.appwriteProjectId, 'cookie': `a_session_${e.appwriteProjectId}=${token}` },
      })
    } catch {}
  }
  return c.json({ success: true, data: null, error: null, meta: null }, 200)
})

export default auth
