export const SESSION_COOKIE_PREFIX = 'a_session_'

let corsHeaders: Headers | null = null

export function captureCorsHeaders(h: Headers) {
  corsHeaders = h
}

export function json(
  c: any,
  data: unknown,
  status = 200,
  extraHeaders?: Record<string, string>,
) {
  const h = new Headers({ 'content-type': 'application/json', ...extraHeaders })
  if (corsHeaders) {
    for (const [k, v] of corsHeaders) h.set(k, v)
    corsHeaders = null
  }
  return c.json(data, status as any, Object.fromEntries(h.entries()))
}

export function setSessionCookie(resHeaders: Headers, projectId: string, secret: string, production: boolean) {
  resHeaders.set(
    'Set-Cookie',
    `${SESSION_COOKIE_PREFIX}${projectId}=${secret}; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Lax; ${production ? 'Secure' : ''}`,
  )
}

export function clearSessionCookie(resHeaders: Headers, projectId: string) {
  resHeaders.set('Set-Cookie', `${SESSION_COOKIE_PREFIX}${projectId}=; Path=/; Max-Age=0; SameSite=Lax`)
}

export function getSessionToken(req: Request, projectId: string): string {
  const cookieHeader = req.headers.get('cookie') ?? ''
  const match = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE_PREFIX}${projectId}=(.*?)$`))
  if (match?.[1]) return match[1]
  const fallback = cookieHeader.match(/(?:^|; )token=(.*?)$/)
  if (fallback?.[1]) return fallback[1]
  const auth = req.headers.get('authorization') ?? ''
  return auth.startsWith('Bearer ') ? auth.slice(7) : ''
}

