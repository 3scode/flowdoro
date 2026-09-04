#!/usr/bin/env bun
// One-shot migration: Appwrite Users ($id) → Better Auth D1 user.id
// Updates all Appwrite collections' `userId` fields: profiles, tasks, sessions, lists, google_tokens
// Usage: bun run scripts/migrate-appwrite-to-better-auth.mjs
// Requires: .env (APPWRITE_*, BETTER_AUTH_URL, BETTER_AUTH_SECRET) + running wrangler dev (8787) + D1 migrated
import 'dotenv/config'
import { Client, Databases, Users, Query } from 'node-appwrite'

const env = {
  appwriteEndpoint: process.env.APPWRITE_ENDPOINT ?? 'https://sgp.cloud.appwrite.io/v1',
  appwriteProjectId: process.env.APPWRITE_PROJECT_ID ?? '',
  appwriteApiKey: process.env.APPWRITE_API_KEY ?? '',
  appwriteDatabaseId: process.env.APPWRITE_DATABASE_ID ?? 'flowdoro',
  cols: {
    profiles: process.env.APPWRITE_COLLECTION_PROFILES ?? 'profiles',
    tasks: process.env.APPWRITE_COLLECTION_TASKS ?? 'tasks',
    sessions: process.env.APPWRITE_COLLECTION_SESSIONS ?? 'sessions',
    events: process.env.APPWRITE_COLLECTION_EVENTS ?? 'session_events',
    lists: process.env.APPWRITE_COLLECTION_LISTS ?? 'lists',
    googleTokens: process.env.APPWRITE_COLLECTION_GOOGLE_TOKENS ?? 'google_tokens',
  },
  betterAuthUrl: process.env.BETTER_AUTH_URL ?? 'http://localhost:8787',
}

if (!env.appwriteProjectId || !env.appwriteApiKey) {
  console.error('Missing APPWRITE_PROJECT_ID / APPWRITE_API_KEY')
  process.exit(1)
}

const client = new Client().setEndpoint(env.appwriteEndpoint).setProject(env.appwriteProjectId).setKey(env.appwriteApiKey)
const users = new Users(client)
const databases = new Databases(client)

async function listAll(collection, queries = []) {
  const all = []
  let offset = 0
  const limit = 100
  while (true) {
    const res = await databases.listDocuments(env.appwriteDatabaseId, collection, [...queries, Query.limit(limit), Query.offset(offset)])
    all.push(...res.documents)
    if (all.length >= res.total) break
    offset += res.documents.length
    if (res.documents.length === 0) break
  }
  return all
}

async function ensureBetterAuthUser(email, name, tempPassword = 'TempPass123!') {
  // Try sign-up via Better Auth API (creates D1 user)
  const res = await fetch(`${env.betterAuthUrl}/api/auth/sign-up/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name ?? email, email, password: tempPassword }),
  })
  const body = await res.json().catch(() => null)
  if (res.ok) return body?.user?.id ?? body?.data?.user?.id ?? null
  // Already exists → fetch via getSession? Need to sign-in to get id
  if (/already|exists/i.test(body?.message ?? body?.error?.message ?? '')) {
    const signIn = await fetch(`${env.betterAuthUrl}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: tempPassword }),
    })
    const j = await signIn.json().catch(() => null)
    if (signIn.ok) return j?.user?.id ?? j?.data?.user?.id ?? null
    // If password mismatch, can't recover — return null for manual
    console.warn(`  Better Auth user exists but sign-in failed for ${email}:`, j)
    return null
  }
  console.warn(`  Better Auth sign-up failed for ${email}:`, body)
  return null
}

async function main() {
  console.log(`🔄 Migrate Appwrite → Better Auth at ${env.betterAuthUrl}`)
  console.log('  Appwrite', env.appwriteProjectId, env.appwriteDatabaseId)

  const appwriteUsers = await users.list([Query.limit(100)]).then(r => r.users).catch(() => [])
  console.log(`  Found ${appwriteUsers.length} Appwrite users`)

  const profiles = await listAll(env.cols.profiles)
  console.log(`  Found ${profiles.length} profiles`)

  // Build map oldId → email/name from profiles + Appwrite users
  const emailByOldId = new Map()
  for (const p of profiles) if (p.userId && p.email) emailByOldId.set(p.userId, { email: p.email, name: p.name })
  for (const u of appwriteUsers) if (!emailByOldId.has(u.$id)) emailByOldId.set(u.$id, { email: u.email, name: u.name })

  const map = new Map() // oldId → newId
  for (const [oldId, { email, name }] of emailByOldId.entries()) {
    console.log(`  → Ensure Better Auth for ${email} (Appwrite ${oldId})`)
    const newId = await ensureBetterAuthUser(email.toLowerCase(), name)
    if (newId) {
      map.set(oldId, newId)
      console.log(`    ${oldId} → ${newId}`)
    } else {
      console.warn(`    skip ${email} — no newId`)
    }
  }

  if (map.size === 0) {
    console.log('  No mappings — nothing to patch')
    return
  }

  // Patch collections
  const toPatch = [
    { col: env.cols.profiles, label: 'profiles' },
    { col: env.cols.tasks, label: 'tasks' },
    { col: env.cols.sessions, label: 'sessions' },
    { col: env.cols.lists, label: 'lists' },
    { col: env.cols.googleTokens, label: 'google_tokens' },
  ]

  for (const { col, label } of toPatch) {
    const docs = await listAll(col)
    let patched = 0
    for (const d of docs) {
      const old = d.userId
      const neo = map.get(old)
      if (!neo || neo === old) continue
      await databases.updateDocument(env.appwriteDatabaseId, col, d.$id, { userId: neo }).catch((e) => console.warn(`  patch ${label} ${d.$id} fail`, e?.message))
      patched++
    }
    console.log(`  ${label}: patched ${patched}/${docs.length}`)
  }

  console.log('✅ Migration done — verify: login via Better Auth, then check /api/tasks etc')
  console.log('  Map:', Object.fromEntries(map))
}

main().catch((e) => { console.error(e); process.exit(1) })
