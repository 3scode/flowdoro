const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

// Better Auth uses httpOnly cookies (100% free D1) — no localStorage token needed.
// Legacy Appwrite Bearer fallback kept for migration period (read if present, but not written).
function getLegacyToken(): string {
  try { return localStorage.getItem('flowdoro_token') ?? '' } catch { return '' }
}

async function req(path: string, opts: RequestInit = {}) {
  const legacy = getLegacyToken()
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(legacy ? { Authorization: `Bearer ${legacy}` } : {}), ...(opts.headers ?? {}) },
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
  tasks: {
    list: (filter?: { status?: string; parentId?: string; listId?: string; starred?: boolean }) => {
      const params = new URLSearchParams()
      if (filter?.status) params.set('status', filter.status)
      if (filter?.parentId) params.set('parentId', filter.parentId)
      if (filter?.listId) params.set('listId', filter.listId)
      if (filter?.starred) params.set('starred', 'true')
      const qs = params.toString()
      return req(`/api/tasks${qs ? '?' + qs : ''}`)
    },
    create: (body: Record<string, any>) => req('/api/tasks', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Record<string, any>) => req(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    reorder: (tasks: { id: string; sortOrder: number }[]) => req('/api/tasks/reorder', { method: 'PUT', body: JSON.stringify({ tasks }) }),
    toggle: (id: string) => req(`/api/tasks/${id}/toggle`, { method: 'POST' }),
    star: (id: string) => req(`/api/tasks/${id}/star`, { method: 'POST' }),
    delete: (id: string) => req(`/api/tasks/${id}`, { method: 'DELETE' }),
  },
  lists: {
    list: () => req('/api/lists'),
    create: (name: string) => req('/api/lists', { method: 'POST', body: JSON.stringify({ name }) }),
    update: (id: string, body: { name?: string; sortOrder?: number }) => req(`/api/lists/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) => req(`/api/lists/${id}`, { method: 'DELETE' }),
  },
  tasksTimeStats: () => req('/api/analytics/tasks'),
  google: {
    connect: () => req('/api/google/connect'),
    status: () => req('/api/google/status'),
    disconnect: () => req('/api/google/disconnect', { method: 'POST' }),
  },
}
