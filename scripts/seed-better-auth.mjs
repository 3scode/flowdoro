#!/usr/bin/env bun
// Seed Better Auth (D1) + Appwrite app data — 100% free path
// Usage: bun run scripts/seed-better-auth.mjs  (requires .env + running wrangler dev or BETTER_AUTH_URL)
// Creates Better Auth user via API, then app data via Appwrite
import 'dotenv/config'

const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL ?? process.env.APP_URL ?? 'http://localhost:8787'
const EMAIL = process.env.SEED_EMAIL ?? 'demo@flowdoro.app'
const PASSWORD = process.env.SEED_PASSWORD ?? 'password123'
const NAME = 'Demo User'

async function seed() {
  console.log(`🌱 Seeding Better Auth + Appwrite at ${BETTER_AUTH_URL} — ${EMAIL}`)

  // 1) Better Auth sign-up via API (creates D1 user + session cookie)
  const signUpRes = await fetch(`${BETTER_AUTH_URL}/api/auth/sign-up/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: NAME, email: EMAIL, password: PASSWORD }),
  })
  const signUpBody = await signUpRes.json().catch(() => null)
  if (!signUpRes.ok) {
    const msg = signUpBody?.message ?? signUpBody?.error?.message ?? `${signUpRes.status}`
    if (/already|exists/i.test(msg)) console.log('  Better Auth user already exists', EMAIL)
    else console.warn('  Better Auth sign-up failed (maybe D1 not migrated — run POST /api/auth/migrate):', signUpBody)
  } else {
    console.log('  Better Auth user created', signUpBody?.user?.id ?? EMAIL)
  }

  // 2) Get session to prove cookie works
  const cookie = signUpRes.headers.get('set-cookie') ?? ''
  if (cookie) {
    const sessionRes = await fetch(`${BETTER_AUTH_URL}/api/auth/get-session`, {
      headers: { Cookie: cookie.split(';')[0] },
    })
    const j = await sessionRes.json().catch(() => null)
    console.log('  get-session:', sessionRes.ok ? `ok user=${j?.user?.id ?? j?.data?.user?.id}` : `fail ${sessionRes.status}`)
  }

  // 3) Appwrite app data (keep using existing seed.mjs logic)
  // Delegate to old seed for tasks/sessions — but need userId mapping
  // For simplicity, run via node-appwrite directly with Better Auth user id if available
  try {
    const { Client, Databases, ID } = await import('node-appwrite')
    const env = {
      appwriteEndpoint: process.env.APPWRITE_ENDPOINT ?? 'https://sgp.cloud.appwrite.io/v1',
      appwriteProjectId: process.env.APPWRITE_PROJECT_ID ?? '',
      appwriteApiKey: process.env.APPWRITE_API_KEY ?? '',
      appwriteDatabaseId: process.env.APPWRITE_DATABASE_ID ?? 'flowdoro',
      appwriteCollectionProfiles: process.env.APPWRITE_COLLECTION_PROFILES ?? 'profiles',
      appwriteCollectionTasks: process.env.APPWRITE_COLLECTION_TASKS ?? 'tasks',
      appwriteCollectionSessions: process.env.APPWRITE_COLLECTION_SESSIONS ?? 'sessions',
      appwriteCollectionEvents: process.env.APPWRITE_COLLECTION_EVENTS ?? 'session_events',
      appwriteCollectionLists: process.env.APPWRITE_COLLECTION_LISTS ?? 'lists',
    }
    if (!env.appwriteProjectId || !env.appwriteApiKey) {
      console.log('  Skip Appwrite seed — missing APPWRITE_*')
      return
    }
    const client = new Client().setEndpoint(env.appwriteEndpoint).setProject(env.appwriteProjectId).setKey(env.appwriteApiKey)
    const databases = new Databases(client)

    // Try to resolve Better Auth user id via get-session or via D1 direct?
    // Fallback: list profiles by email to get userId
    let userId = signUpBody?.user?.id ?? ''
    if (!userId) {
      try {
        const fetched = await fetch(`${BETTER_AUTH_URL}/api/auth/get-session`, { headers: { Cookie: cookie.split(';')[0] } }).then(r => r.json()).catch(() => null)
        userId = fetched?.user?.id ?? fetched?.data?.user?.id ?? ''
      } catch {}
    }
    if (!userId) {
      // Fallback: try to find existing profile by email
      const { Query } = await import('node-appwrite')
      const res = await databases.listDocuments(env.appwriteDatabaseId, env.appwriteCollectionProfiles, [Query.equal('email', EMAIL)]).catch(() => ({ documents: [] }))
      userId = res.documents?.[0]?.userId ?? ''
      if (userId) console.log('  Found existing profile userId', userId)
    }
    if (!userId) {
      console.warn('  Could not resolve userId for Appwrite seed — run seed.mjs separately')
      return
    }

    // Copy of seed.mjs app data (idempotent-ish)
    await databases.createDocument(env.appwriteDatabaseId, env.appwriteCollectionProfiles, ID.unique(), {
      userId, email: EMAIL, name: NAME, restRatio: 5, theme: 'system', notificationsEnabled: false, soundEnabled: false,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }).catch((e) => console.log('  profile maybe exists', e?.message))

    const taskNames = ['Deep Work', 'Study', 'Design', 'Bug Fix', 'Writing']
    const taskIds = []
    for (let i = 0; i < taskNames.length; i++) {
      const t = await databases.createDocument(env.appwriteDatabaseId, env.appwriteCollectionTasks, ID.unique(), {
        userId, name: taskNames[i], title: taskNames[i], starred: i === 0, createdAt: new Date().toISOString(),
      }).catch(() => null)
      if (t) taskIds.push(t.$id)
    }
    const now = new Date()
    for (let i = 0; i < 15; i++) {
      const d = new Date(now); d.setDate(d.getDate() - Math.floor(i / 3))
      const duration = 600 + Math.floor(Math.random() * 5400)
      const startedAt = d.toISOString()
      const endedAt = new Date(d.getTime() + duration * 1000).toISOString()
      const s = await databases.createDocument(env.appwriteDatabaseId, env.appwriteCollectionSessions, ID.unique(), {
        userId, taskId: taskIds.length ? taskIds[i % taskIds.length] : null, status: 'completed', durationSeconds: duration, restEarnedSeconds: Math.floor(duration / 5), restTakenSeconds: Math.floor(duration / 5) - 30, startedAt, endedAt, createdAt: startedAt,
      })
      await databases.createDocument(env.appwriteDatabaseId, env.appwriteCollectionEvents, ID.unique(), { sessionId: s.$id, eventType: 'focus_started', timestamp: startedAt, payload: '{}' }).catch(() => {})
      await databases.createDocument(env.appwriteDatabaseId, env.appwriteCollectionEvents, ID.unique(), { sessionId: s.$id, eventType: 'session_ended', timestamp: endedAt, payload: '{}' }).catch(() => {})
    }
    console.log('✅ Seed done — login with', EMAIL, '/', PASSWORD, '(Better Auth + Appwrite)')
  } catch (e) {
    console.warn('  Appwrite seed skip:', e?.message ?? e)
  }
}

seed().catch((e) => { console.error(e); process.exit(1) })
