import { Elysia, t } from 'elysia'
import { hash, compare } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { users } from '../../db/schema'
import { signToken } from '../../middleware/auth'
import { env } from '../../config/env'

const loginAttempts = new Map<string, { count: number; until: number }>()

function checkRateLimit(key: string): boolean {
  const entry = loginAttempts.get(key)
  if (!entry) return true
  if (Date.now() > entry.until) { loginAttempts.delete(key); return true }
  if (entry.count >= 5) return false
  return true
}

export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .post('/register', async ({ body, set, cookie }) => {
    const { name, email, password } = body as any
    if (!name || name.length < 2) { set.status = 422; return { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Name min 2 chars' }, meta: null } }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { set.status = 422; return { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Invalid email' }, meta: null } }
    if (!password || password.length < 8) { set.status = 422; return { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Password min 8 chars' }, meta: null } }
    const existing = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.email, email) })
    if (existing) { set.status = 409; return { success: false, data: null, error: { code: 'CONFLICT', message: 'Email already registered' }, meta: null } }
    const passwordHash = await hash(password, env.bcryptRounds)
    const [user] = await db.insert(users).values({ name, email: email.toLowerCase(), passwordHash }).returning()
    const token = await signToken({ id: user.id, email: user.email })
    ;(cookie as any).token?.set({ value: token, httpOnly: true, sameSite: 'lax', secure: env.cookieSecure, maxAge: 7 * 24 * 3600, path: '/' })
    return { success: true, data: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, restRatio: user.restRatio, theme: user.theme }, error: null, meta: null }
  }, { body: t.Object({ name: t.String(), email: t.String(), password: t.String() }) })

  .post('/login', async ({ body, set, cookie, request }) => {
    const { email, password } = body as any
    const ip = request.headers.get('x-forwarded-for') ?? 'local'
    if (!checkRateLimit(ip)) { set.status = 429; return { success: false, data: null, error: { code: 'RATE_LIMITED', message: 'Too many attempts, try again in 15 minutes' }, meta: null } }
    const user = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.email, email.toLowerCase()) })
    if (!user || !user.passwordHash) {
      const e = loginAttempts.get(ip) ?? { count: 0, until: Date.now() + 15 * 60 * 1000 }
      e.count++; loginAttempts.set(ip, e)
      set.status = 401; return { success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' }, meta: null }
    }
    const ok = await compare(password, user.passwordHash)
    if (!ok) {
      const e = loginAttempts.get(ip) ?? { count: 0, until: Date.now() + 15 * 60 * 1000 }
      e.count++; loginAttempts.set(ip, e)
      set.status = 401; return { success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' }, meta: null }
    }
    loginAttempts.delete(ip)
    const token = await signToken({ id: user.id, email: user.email })
    ;(cookie as any).token?.set({ value: token, httpOnly: true, sameSite: 'lax', secure: env.cookieSecure, maxAge: 7 * 24 * 3600, path: '/' })
    return { success: true, data: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, restRatio: user.restRatio, theme: user.theme }, error: null, meta: null }
  }, { body: t.Object({ email: t.String(), password: t.String() }) })

  .post('/logout', ({ cookie }) => {
    ;(cookie as any).token?.remove()
    return { success: true, data: null, error: null, meta: null }
  })
