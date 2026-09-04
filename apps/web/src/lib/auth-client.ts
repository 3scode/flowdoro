import { createAuthClient } from "better-auth/svelte"

const rawBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "")
if (!rawBase) {
  // fallback to relative "/api" via Vite proxy for local dev — prod build must set VITE_API_URL
  console.warn("[auth-client] VITE_API_URL kosong — fallback ke relative, pastikan Vite proxy /api → localhost:8787 untuk local, prod build via deploy-web.sh")
}
export const authClient = createAuthClient({
  baseURL: rawBase,
  fetchOptions: {
    credentials: "include" as const,
  },
})

// Re-export useful helpers for legacy stores
export const { signIn, signUp, signOut, useSession, getSession } = authClient as any
export const linkSocial = (params: { provider: string; callbackURL?: string }) => (authClient as any).linkSocial(params)
export const listAccounts = () => (authClient as any).listAccounts?.() ?? (authClient as any).account?.list?.() ?? Promise.resolve([])
export const unlinkAccount = (params: { providerId: string; accountId?: string }) => (authClient as any).unlinkAccount?.(params) ?? (authClient as any).account?.unlink?.(params)
