import { writable } from 'svelte/store'
import { api } from '$lib/api/client'

export interface User { id: string; name: string; email: string; avatarUrl?: string; restRatio: number; theme: string }

function createAuth() {
  const { subscribe, set } = writable<User | null>(null)
  return {
    subscribe,
    async fetchMe() {
      try {
        const res = await api.get('/api/me')
        set(res.data)
        return res.data
      } catch { set(null); return null }
    },
    async login(email: string, password: string) {
      const res = await api.post('/api/auth/login', { email, password })
      const user = res.data
      if (user?.token) localStorage.setItem('flowdoro_token', user.token)
      set(user)
      return user
    },
    async register(name: string, email: string, password: string) {
      const res = await api.post('/api/auth/register', { name, email, password })
      const user = res.data
      if (user?.token) localStorage.setItem('flowdoro_token', user.token)
      set(user)
      return user
    },
    async logout() {
      await api.post('/api/auth/logout')
      localStorage.removeItem('flowdoro_token')
      set(null)
    },
    set,
  }
}

export const auth = createAuth()
