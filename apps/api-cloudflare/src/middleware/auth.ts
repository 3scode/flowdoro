import type { MiddlewareHandler } from 'hono'
import { getSessionToken } from '../lib/response'

type User = { id: string; email: string; name: string; profile: any }
type Env = { Bindings: any; Variables: { user: User; env: any } }

export const authMiddleware: MiddlewareHandler<Env> = async (c, next) => {
  const e = c.get('env')
  const token = getSessionToken(c.req.raw, e.appwriteProjectId)
  if (!token) return c.json({ success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null }, 401)
  try {
    const accountRes = await fetch(`${e.appwriteEndpoint}/account`, {
      headers: { 'x-appwrite-project': e.appwriteProjectId, 'cookie': `a_session_${e.appwriteProjectId}=${token}` },
    })
    if (!accountRes.ok) throw new Error('Invalid session')
    const session: any = await accountRes.json()
    const q = encodeURIComponent(session.$id)
    const profilesRes = await fetch(
      `${e.appwriteEndpoint}/databases/${e.appwriteDatabaseId}/collections/${e.appwriteCollectionProfiles}/documents?queries[0][attribute]=userId&queries[0][type]=string&queries[0][value]=${q}`,
      { headers: { 'x-appwrite-project': e.appwriteProjectId, 'x-appwrite-key': e.appwriteApiKey } },
    )
    const profiles: any = await profilesRes.json()
    c.set('user', { id: session.$id, email: session.email, name: session.name, profile: profiles.documents?.[0] ?? null })
    await next()
  } catch {
    return c.json({ success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null }, 401)
  }
}
