import { writable } from 'svelte/store'
import { api } from '$lib/api/client'
import { authClient } from '$lib/auth-client'

export interface User { id: string; name: string; email: string; avatarUrl?: string; restRatio: number; theme: string }

function createAuth() {
  const { subscribe, set } = writable<User | null>(null)
  return {
    subscribe,
    async fetchMe() {
      try {
        // Prefer Better Auth getSession (cookie) — fallback to legacy /api/me for Appwrite users
        const session: any = await (authClient as any).getSession().catch(() => null)
        if (session?.data?.user) {
          const u = session.data.user
          const mapped: User = { id: u.id, name: u.name ?? u.email, email: u.email, avatarUrl: u.image ?? undefined, restRatio: 5, theme: 'system' }
          // Try to enrich with Appwrite profile (restRatio etc) if available
          try {
            const me = await api.get('/api/me')
            if (me?.data) Object.assign(mapped, { restRatio: me.data.restRatio ?? 5, theme: me.data.theme ?? 'system', avatarUrl: me.data.avatarUrl ?? mapped.avatarUrl, name: me.data.name ?? mapped.name })
          } catch {}
          set(mapped)
          return mapped
        }
        // Fallback: legacy /api/me (Appwrite Bearer)
        const res = await api.get('/api/me')
        set(res.data)
        return res.data
      } catch { set(null); return null }
    },
    async login(email: string, password: string) {
      // Better Auth primary (100% free D1, httpOnly cookie)
      const res: any = await (authClient as any).signIn.email({ email, password })
      if (!res?.error) {
        const user = res?.data?.user ?? null
        if (user) {
          const mapped: User = { id: user.id, name: user.name ?? user.email, email: user.email, avatarUrl: user.image ?? undefined, restRatio: 5, theme: 'system' }
          // Enrich via /api/me (triggers reconcile if needed)
          try { const me = await api.get('/api/me'); if (me?.data) Object.assign(mapped, { restRatio: me.data.restRatio ?? 5, theme: me.data.theme ?? 'system', avatarUrl: me.data.avatarUrl ?? mapped.avatarUrl, name: me.data.name ?? mapped.name }) } catch {}
          set(mapped as any)
          try { localStorage.removeItem('flowdoro_token') } catch {}
          return mapped as any
        }
      }
      // If Better Auth sign-in failed, try Appwrite legacy for migration (old users with Appwrite password not yet in D1)
      const code = res?.error?.code ?? ''
      if (code === 'INVALID_EMAIL_OR_PASSWORD' || code === 'USER_NOT_FOUND' || code === 'INVALID_CREDENTIALS' || !res?.error) {
        try {
          const legacy: any = await api.post('/api/auth/login', { email, password })
          // Legacy success means Appwrite password valid — now migrate to D1
          if (legacy?.data) {
            const legacyName = legacy.data.name ?? email
            // Try to create D1 user with same password (reconcile hook will migrate tasks)
            try {
              const signUp: any = await (authClient as any).signUp.email({ name: legacyName, email, password })
              if (!signUp?.error) {
                // Now sign-in via Better Auth to get proper session
                const retry: any = await (authClient as any).signIn.email({ email, password })
                const u = retry?.data?.user
                if (u) {
                  const mapped: User = { id: u.id, name: u.name ?? u.email, email: u.email, avatarUrl: u.image ?? undefined, restRatio: 5, theme: 'system' }
                  try { const me = await api.get('/api/me'); if (me?.data) Object.assign(mapped, { restRatio: me.data.restRatio ?? 5, theme: me.data.theme ?? mapped.theme }) } catch {}
                  set(mapped as any)
                  try { localStorage.removeItem('flowdoro_token') } catch {}
                  return mapped as any
                }
              }
            } catch {}
            // If signUp failed (e.g., already exists in D1 after race), try signIn again
            try {
              const retry2: any = await (authClient as any).signIn.email({ email, password })
              if (!retry2?.error && retry2?.data?.user) {
                const u = retry2.data.user
                const mapped: User = { id: u.id, name: u.name ?? u.email, email: u.email, avatarUrl: u.image ?? undefined, restRatio: 5, theme: 'system' }
                set(mapped as any)
                try { localStorage.removeItem('flowdoro_token') } catch {}
                return mapped as any
              }
            } catch {}
          }
        } catch {}
      }
      throw { status: 401, code: res?.error?.code ?? 'UNAUTHORIZED', message: res?.error?.message ?? 'Invalid email or password' }
    },
    async register(name: string, email: string, password: string) {
      const res: any = await (authClient as any).signUp.email({ name, email, password })
      if (!res?.error) {
        const user = res?.data?.user ?? null
        if (user) {
          const mapped: User = { id: user.id, name: user.name ?? user.email, email: user.email, avatarUrl: user.image ?? undefined, restRatio: 5, theme: 'system' }
          try { const me = await api.get('/api/me'); if (me?.data) Object.assign(mapped, { restRatio: me.data.restRatio ?? 5 }) } catch {}
          set(mapped as any)
          try { localStorage.removeItem('flowdoro_token') } catch {}
          return mapped as any
        }
        return user
      }
      // If USER_ALREADY_EXISTS, try sign-in (maybe already migrated)
      const code = res?.error?.code ?? ''
      if (code === 'USER_ALREADY_EXISTS' || code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
        try {
          const retry: any = await (authClient as any).signIn.email({ email, password })
          if (!retry?.error && retry?.data?.user) {
            const u = retry.data.user
            const mapped: User = { id: u.id, name: u.name ?? u.email, email: u.email, avatarUrl: u.image ?? undefined, restRatio: 5, theme: 'system' }
            set(mapped as any)
            return mapped as any
          }
        } catch {}
      }
      throw { status: 422, code: res?.error?.code ?? 'VALIDATION_ERROR', message: res?.error?.message ?? 'Registration failed' }
    },
    async logout() {
      try { await (authClient as any).signOut() } catch {}
      // Also clear legacy Appwrite session & localStorage
      try { await api.post('/api/auth/logout').catch(() => {}) } catch {}
      try { localStorage.removeItem('flowdoro_token') } catch {}
      set(null)
    },
    async changePassword(currentPassword: string, newPassword: string) {
      const res: any = await (authClient as any).changePassword({ currentPassword, newPassword, revokeOtherSessions: true })
      if (res?.error) throw { status: 400, code: res.error.code ?? 'VALIDATION_ERROR', message: res.error.message ?? 'Failed to change password' }
      return res?.data
    },
    async requestPasswordReset(email: string) {
      // Better Auth 1.7 canonical is requestPasswordReset -> /request-password-reset ; keep forgetPassword alias fallback
      const client: any = authClient as any
      const payload = { email, redirectTo: `${window.location.origin}/reset-password` }
      let res: any = null
      if (typeof client.requestPasswordReset === 'function') {
        res = await client.requestPasswordReset(payload)
      } else if (typeof client.forgetPassword === 'function') {
        res = await client.forgetPassword(payload)
      } else {
        // raw fetch fallback to canonical endpoint
        const base = ((import.meta as any).env?.VITE_API_URL ?? '').replace(/\/$/, '')
        const r = await fetch(`${base}/api/auth/request-password-reset`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        const j = await r.json().catch(() => null)
        if (!r.ok) throw { status: r.status, code: j?.code ?? 'VALIDATION_ERROR', message: j?.message ?? 'Failed to send reset email' }
        return j
      }
      if (res?.error) throw { status: 422, code: res.error.code ?? 'VALIDATION_ERROR', message: res.error.message ?? 'Failed to send reset email' }
      return res?.data
    },
    async resetPassword(token: string, newPassword: string) {
      const res: any = await (authClient as any).resetPassword({ token, newPassword })
      // fallback for older Better Auth where field is `password` not `newPassword`
      if (res?.error && /password/i.test(res.error.message ?? '')) {
        const alt: any = await (authClient as any).resetPassword({ token, password: newPassword } as any).catch(() => null)
        if (alt && !alt?.error) return alt?.data
      }
      if (res?.error) throw { status: 422, code: res.error.code ?? 'VALIDATION_ERROR', message: res.error.message ?? 'Reset failed' }
      return res?.data
    },
    async linkSocial(provider: string) {
      const cb = `${window.location.origin}/settings?linked=${provider}`
      const res: any = await (authClient as any).linkSocial({ provider, callbackURL: cb })
      if (res?.error) throw { status: 400, code: res.error.code ?? 'VALIDATION_ERROR', message: res.error.message ?? `Failed to link ${provider}` }
      return res?.data
    },
    async listAccounts() {
      try {
        const res: any = await (authClient as any).listAccounts?.()
        if (res?.data) return res.data
        if (Array.isArray(res)) return res
      } catch {}
      return []
    },
    async unlinkAccount(providerId: string) {
      const res: any = await (authClient as any).unlinkAccount?.({ providerId }) ?? (authClient as any).account?.unlink?.({ providerId })
      if (res?.error) throw { status: 400, code: res.error.code ?? 'VALIDATION_ERROR', message: res.error.message ?? 'Unlink failed' }
      return res?.data
    },
    set,
  }
}

export const auth = createAuth()
