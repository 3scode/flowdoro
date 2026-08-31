const API_BASE = import.meta.env.VITE_API_URL ?? ''

async function req(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers ?? {}) },
    ...opts,
  })
  const json = await res.json().catch(() => null)
  if (!res.ok) throw { status: res.status, ...json?.error }
  return json
}

export const api = {
  get: (p: string) => req(p),
  post: (p: string, body?: unknown) => req(p, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: (p: string, body?: unknown) => req(p, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  del: (p: string) => req(p, { method: 'DELETE' }),
}
