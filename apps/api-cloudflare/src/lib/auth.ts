import { betterAuth } from "better-auth"
import type { D1Database } from "@cloudflare/workers-types"

// Factory: call per-request so env.DB binding is available
export function createAuth(env: any) {
  const secret = env.BETTER_AUTH_SECRET ?? env.betterAuthSecret ?? ""
  const rawBase = env.BETTER_AUTH_URL ?? env.betterAuthUrl ?? env.APP_URL ?? "http://localhost:8787"
  const baseURL = String(rawBase).replace(/\/$/, "")

  // Warn if secret missing (dev fallback)
  if (!secret) console.warn("[better-auth] BETTER_AUTH_SECRET is empty — set via wrangler secret put or .dev.vars")

  const trustedOrigins = [
    env.CORS_ORIGIN ?? env.corsOrigin,
    env.APP_URL ?? env.appUrl,
    env.FRONTEND_URL ?? "http://localhost:5173",
    "http://localhost:5173",
    "http://localhost:8787",
    "https://flowdoro-web.pages.dev",
    "https://96f159ba.flowdoro-web.pages.dev",
    "https://flowdoro.email-trisno-sanjaya.pages.dev",
    "https://flowdoro.3scode.my.id",
    "https://api.flowdoro.3scode.my.id",
    baseURL,
  ].filter(Boolean) as string[]

  const db = (env.DB ?? env.db) as D1Database | undefined
  if (!db) console.warn("[better-auth] D1 binding DB is undefined — run with wrangler dev (needs [[d1_databases]])")

  return betterAuth({
    baseURL,
    secret,
    // D1 native — Better Auth 1.3+ detects D1Database directly (no adapter needed, uses batch API)
    database: db as any,
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      resetPasswordTokenExpiresIn: 60 * 60 * 24, // 24 jam sesuai PRD
      sendResetPassword: async ({ user, url, token }: any) => {
        const resendKey = env.RESEND_API_KEY ?? env.resendApiKey ?? ''
        const fromEmail = env.RESEND_FROM_EMAIL ?? env.resendFromEmail ?? 'Flowdoro <noreply@flowdoro.3scode.my.id>'
        const frontendUrl = env.FRONTEND_URL ?? env.frontendUrl ?? env.APP_URL ?? env.appUrl ?? 'https://flowdoro.3scode.my.id'
        // Better Auth `url` already contains token & callback; if redirectTo was /reset-password, rewrite to frontend URL
        let resetUrl = url as string
        try {
          // url biasanya `${baseURL}/api/auth/reset-password?token=...`
          // Kita mau frontend link: `${frontendUrl}/reset-password?token=...`
          const u = new URL(url)
          const tokenFromUrl = u.searchParams.get('token') ?? token
          if (tokenFromUrl) {
            resetUrl = `${frontendUrl.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(tokenFromUrl)}`
          }
        } catch {}
        if (!resendKey) {
          console.log(`[mock email] reset for ${user.email}: ${resetUrl} token=${token}`)
          return
        }
        try {
          const html = `
            <div style="font-family:Inter,system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#0F172A">
              <h1 style="color:#0D9488;margin:0 0 8px">◉ Flowdoro</h1>
              <p style="margin:0 0 16px;color:#64748B">Reset your password</p>
              <p style="margin:0 0 16px;line-height:1.6">Hi ${user.name ?? user.email}, klik tombol di bawah untuk reset password Flowdoro kamu. Link berlaku <b>24 jam</b> dan hanya sekali pakai.</p>
              <p style="margin:24px 0"><a href="${resetUrl}" style="display:inline-block;background:#0D9488;color:#fff;text-decoration:none;padding:12px 24px;border-radius:12px;font-weight:600">Reset Password</a></p>
              <p style="margin:0 0 8px;color:#64748B;font-size:13px;line-height:1.5">Atau copy link ini:<br><a href="${resetUrl}" style="color:#0D9488;word-break:break-all">${resetUrl}</a></p>
              <p style="margin:16px 0 0;color:#94A3B8;font-size:12px">Abaikan email ini jika kamu tidak minta reset password.</p>
            </div>`
          const text = `Reset Flowdoro password: ${resetUrl} (berlaku 24 jam, sekali pakai)`
          const resp = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: fromEmail, to: [user.email], subject: 'Reset your Flowdoro password', html, text }),
          })
          if (!resp.ok) {
            const body = await resp.text().catch(() => '')
            console.error('[better-auth] sendResetPassword Resend error', resp.status, body)
          } else {
            console.log(`[better-auth] reset email sent to ${user.email}`)
          }
        } catch (err: any) {
          console.error('[better-auth] sendResetPassword failed', err?.message ?? err)
        }
      },
      onPasswordReset: async ({ user }: any) => {
        console.log(`[better-auth] password reset done for ${user.email}`)
      },
    },
    socialProviders: {
      ...((env.GOOGLE_CLIENT_ID ?? env.googleClientId) && (env.GOOGLE_CLIENT_SECRET ?? env.googleClientSecret)
        ? {
            google: {
              clientId: env.GOOGLE_CLIENT_ID ?? env.googleClientId,
              clientSecret: env.GOOGLE_CLIENT_SECRET ?? env.googleClientSecret,
            },
          }
        : {}),
      ...((env.GITHUB_CLIENT_ID ?? env.githubClientId) && (env.GITHUB_CLIENT_SECRET ?? env.githubClientSecret)
        ? {
            github: {
              clientId: env.GITHUB_CLIENT_ID ?? env.githubClientId,
              clientSecret: env.GITHUB_CLIENT_SECRET ?? env.githubClientSecret,
            },
          }
        : {}),
    },
    trustedOrigins,
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ["google", "github"],
        // allow linking same-email google/github to existing password user (all users currently emailVerified=0)
        requireLocalEmailVerified: false,
        updateUserInfoOnLink: true,
        allowDifferentEmails: false,
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days like previous Appwrite session
      updateAge: 60 * 60 * 24, // 1 day
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
      },
    },
    advanced: {
      useSecureCookies: baseURL.startsWith("https://"),
      defaultCookieAttributes: {
        httpOnly: true,
        secure: baseURL.startsWith("https://"),
        // Lax works for same-site, but workers.dev vs pages.dev is cross-site → need None for prod https, Lax for http local
        sameSite: baseURL.startsWith("https://") ? "none" : "lax",
        path: "/",
      },
      // For Cloudflare Workers background tasks (e.g., after hooks)
      // Better Auth will use `waitUntil` if available; we pass via context
      database: {
        // D1 default already batch atomic; no extra config needed
      },
    },
    // Hook to auto-create Appwrite `profiles` doc for every new user (email or social) + reconcile old Appwrite data
    databaseHooks: {
      user: {
        create: {
          after: async (user: any) => {
            try {
              const { dbCreate, dbList, dbUpdate } = await import("./appwrite")
              const e = env
              const appwriteEnv = {
                appwriteEndpoint: e.APPWRITE_ENDPOINT ?? e.appwriteEndpoint,
                appwriteProjectId: e.APPWRITE_PROJECT_ID ?? e.appwriteProjectId,
                appwriteApiKey: e.APPWRITE_API_KEY ?? e.appwriteApiKey,
                appwriteDatabaseId: e.APPWRITE_DATABASE_ID ?? e.appwriteDatabaseId ?? "flowdoro",
                appwriteCollectionProfiles: e.APPWRITE_COLLECTION_PROFILES ?? e.appwriteCollectionProfiles ?? "profiles",
                appwriteCollectionTasks: e.APPWRITE_COLLECTION_TASKS ?? e.appwriteCollectionTasks ?? "tasks",
                appwriteCollectionSessions: e.APPWRITE_COLLECTION_SESSIONS ?? e.appwriteCollectionSessions ?? "sessions",
                appwriteCollectionEvents: e.APPWRITE_COLLECTION_EVENTS ?? e.appwriteCollectionEvents ?? "session_events",
                appwriteCollectionLists: e.APPWRITE_COLLECTION_LISTS ?? e.appwriteCollectionLists ?? "lists",
                appwriteCollectionGoogleTokens: e.APPWRITE_COLLECTION_GOOGLE_TOKENS ?? e.appwriteCollectionGoogleTokens ?? "google_tokens",
                appwriteBucketAvatars: e.APPWRITE_BUCKET_AVATARS ?? e.appwriteBucketAvatars ?? "avatars",
              } as any

              const emailLower = (user.email ?? "").toLowerCase()
              console.log(`[better-auth] hook after user.create email=${emailLower} id=${user.id}`)
              if (!emailLower) return

              // Check by userId first (idempotent)
              const byUserId = await dbList(appwriteEnv, appwriteEnv.appwriteCollectionProfiles, [["userId", user.id]]).catch((e) => { console.log('[better-auth] byUserId error', e?.message); return { documents: [] as any[] } })
              console.log(`[better-auth] byUserId ${user.id} found ${byUserId.documents?.length ?? 0}`)
              if (byUserId.documents?.length) return

              // Check by email — if exists with different userId, reconcile (migrate old data to new D1 id)
              let byEmail = await dbList(appwriteEnv, appwriteEnv.appwriteCollectionProfiles, [["email", emailLower]]).catch((e) => { console.log('[better-auth] byEmail error', e?.message); return { documents: [] as any[] } })
              console.log(`[better-auth] byEmail ${emailLower} found ${byEmail.documents?.length ?? 0} docs:`, byEmail.documents?.map((d:any)=>({id:d.$id, userId:d.userId})))
              // Fallback: if 0 but expected old data, try client-side filter (handles eventual consistency / query quirks)
              if (!byEmail.documents?.length) {
                try {
                  const all = await dbList(appwriteEnv, appwriteEnv.appwriteCollectionProfiles, [], 100, 0).catch((e) => { console.log('[better-auth] byEmail fallback all error', e?.message); return { documents: [] as any[] } })
                  console.log(`[better-auth] byEmail fallback all fetched ${all.documents?.length ?? 0} total`)
                  const filtered = (all.documents || []).filter((d: any) => (d.email ?? '').toLowerCase() === emailLower)
                  console.log(`[better-auth] byEmail fallback filtered ${filtered.length} for ${emailLower}`)
                  if (filtered.length) {
                    console.log(`[better-auth] byEmail fallback found ${filtered.length} via client filter`)
                    byEmail = { documents: filtered, total: filtered.length } as any
                  }
                } catch (e:any) { console.log('[better-auth] fallback catch', e?.message) }
              }
              if (byEmail.documents?.length) {
                // Use the most recent profile by email as base, update its userId to new D1 id
                const sorted = [...byEmail.documents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                const primary = sorted[0]
                const oldUserIds = [...new Set(sorted.map((d) => d.userId).filter((id) => id !== user.id))]
                // Update primary profile to new userId
                try { await dbUpdate(appwriteEnv, appwriteEnv.appwriteCollectionProfiles, primary.$id, { userId: user.id, updatedAt: new Date().toISOString() }) } catch {}
                // Migrate tasks/lists/sessions/google_tokens from old ids to new
                const collectionsToMigrate = [
                  appwriteEnv.appwriteCollectionTasks,
                  appwriteEnv.appwriteCollectionLists,
                  appwriteEnv.appwriteCollectionSessions,
                  appwriteEnv.appwriteCollectionGoogleTokens,
                ]
                for (const oldId of oldUserIds) {
                  for (const coll of collectionsToMigrate) {
                    try {
                      // Fetch all docs for old userId (paginated)
                      let offset = 0
                      while (true) {
                        const { dbList: dl } = await import("./appwrite")
                        const res: any = await dl(appwriteEnv, coll, [["userId", oldId]], 100, offset).catch(() => ({ documents: [], total: 0 }))
                        if (!res.documents?.length) break
                        for (const doc of res.documents) {
                          try { await dbUpdate(appwriteEnv, coll, doc.$id, { userId: user.id }) } catch {}
                        }
                        if (res.documents.length < 100) break
                        offset += res.documents.length
                      }
                    } catch {}
                  }
                }
                // Delete duplicate profiles (keep primary)
                for (let i = 1; i < sorted.length; i++) {
                  try {
                    const { dbDelete } = await import("./appwrite")
                    await dbDelete(appwriteEnv, appwriteEnv.appwriteCollectionProfiles, sorted[i].$id)
                  } catch {}
                }
                console.log(`[better-auth] reconciled ${emailLower}: ${oldUserIds.join(",")} -> ${user.id}`)
                return
              }

              // No existing by email — create new
              await dbCreate(appwriteEnv, appwriteEnv.appwriteCollectionProfiles, {
                userId: user.id,
                email: emailLower,
                name: user.name ?? user.email ?? "User",
                avatarUrl: user.image ?? null,
                restRatio: 5,
                theme: "system",
                notificationsEnabled: false,
                soundEnabled: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              })
            } catch (err: any) {
              console.error("[better-auth] profiles auto-create failed", err?.message ?? err)
            }
          },
        },
      },
    },
    // Rate limit handled by Better Auth memory store (Workers memory per isolate)
    rateLimit: {
      enabled: true,
      window: 10,
      max: 100,
      storage: "memory" as const,
    },
  })
}

// Helper for Hono routes to get session
export async function getBetterAuthSession(c: any) {
  const env = c.get("env")
  const auth = createAuth(env)
  // Better Auth expects Headers object; pass raw request headers
  const session = await (auth as any).api.getSession({
    headers: c.req.header(),
  })
  return session
}
