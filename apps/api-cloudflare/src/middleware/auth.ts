import type { MiddlewareHandler } from 'hono'
import { getSessionToken } from '../lib/response'

type User = { id: string; email: string; name: string; profile: any }
type Env = { Bindings: any; Variables: { user: User; env: any } }

export const authMiddleware: MiddlewareHandler<Env> = async (c, next) => {
  const e = c.get('env')

  // 1) Try Better Auth session (cookie httpOnly) — 100% free D1 path
  try {
    // Only attempt if D1 binding exists (otherwise skip to Appwrite fallback)
    if (e.DB) {
      const { createAuth } = await import('../lib/auth')
      const auth = createAuth(e)
      const session = await (auth as any).api.getSession({ headers: c.req.header() })
      if (session?.user) {
        c.set('user', { id: session.user.id, email: session.user.email, name: session.user.name ?? session.user.email, profile: null })
        await next()
        return
      }
    }
  } catch (err: any) {
    // Fall through to Appwrite fallback — don't throw yet
    // console.debug('[auth] better-auth miss', err?.message)
  }

  // 2) Fallback: legacy Appwrite session token (Bearer or a_session_ cookie) for migration period
  const token = getSessionToken(c.req.raw, e.appwriteProjectId)
  if (!token) return c.json({ success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null }, 401)
  try {
    const accountRes = await fetch(`${e.appwriteEndpoint}/account`, {
      headers: { 'x-appwrite-project': e.appwriteProjectId, 'cookie': `a_session_${e.appwriteProjectId}=${token}` },
    })
    if (!accountRes.ok) throw new Error('Invalid session')
    const account: any = await accountRes.json()
    c.set('user', { id: account.$id, email: account.email, name: account.name ?? account.email, profile: null })
    await next()
    return
  } catch {
    return c.json({ success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null }, 401)
  }
}
