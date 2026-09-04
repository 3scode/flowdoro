#!/usr/bin/env bun
// Seed Appwrite Cloud — ported from apps/api/src/db/seed.ts (removed with Bun+Elysia deprecation)
// Usage: bun run scripts/seed.mjs  OR  bun run seed:dev   (reads .env from root)
import 'dotenv/config'
import { Client, Databases, Users, ID, Query } from 'node-appwrite'

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
  console.error('Missing APPWRITE_PROJECT_ID or APPWRITE_API_KEY in .env')
  process.exit(1)
}

function getAdminClient() {
  return new Client().setEndpoint(env.appwriteEndpoint).setProject(env.appwriteProjectId).setKey(env.appwriteApiKey)
}
function getDatabases() { return new Databases(getAdminClient()) }
function getUsers() { return new Users(getAdminClient()) }
const appwrite = { databaseId: env.appwriteDatabaseId, collections: { profiles: env.appwriteCollectionProfiles, tasks: env.appwriteCollectionTasks, sessions: env.appwriteCollectionSessions, events: env.appwriteCollectionEvents, lists: env.appwriteCollectionLists } }

const EMAIL = 'demo@flowdoro.app'
const PASSWORD = 'password123'

async function seed() {
  console.log('🌱 Seeding fresh Appwrite data...')
  console.log(`  endpoint=${env.appwriteEndpoint} project=${env.appwriteProjectId} db=${env.appwriteDatabaseId}`)
  const users = getUsers()
  const databases = getDatabases()

  let userId = ''
  try {
    const existing = await users.list([], undefined, true)
    const found = existing.users.find((u) => u.email === EMAIL)
    userId = found ? found.$id : ''
  } catch { userId = '' }

  if (!userId) {
    const res = await users.create(ID.unique(), EMAIL, undefined, PASSWORD, 'Demo User')
    userId = res.$id
    console.log('  created user', userId)
  } else {
    console.log('  existing user', userId)
  }

  await databases.createDocument(appwrite.databaseId, appwrite.collections.profiles, ID.unique(), {
    userId, email: EMAIL, name: 'Demo User', restRatio: 5, theme: 'system', notificationsEnabled: false, soundEnabled: false,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  }).catch((e) => console.log('  profile maybe exists', e?.message))

  const taskNames = ['Deep Work', 'Study', 'Design', 'Bug Fix', 'Writing']
  const taskIds = []
  for (let i = 0; i < taskNames.length; i++) {
    const t = await databases.createDocument(appwrite.databaseId, appwrite.collections.tasks, ID.unique(), {
      userId, name: taskNames[i], title: taskNames[i], starred: i === 0, createdAt: new Date().toISOString(),
    }).catch((e) => { console.log('  task maybe exists', e?.message); return null })
    if (t) taskIds.push(t.$id)
  }

  const now = new Date()
  for (let i = 0; i < 15; i++) {
    const d = new Date(now); d.setDate(d.getDate() - Math.floor(i / 3))
    const duration = 600 + Math.floor(Math.random() * 5400)
    const startedAt = d.toISOString()
    const endedAt = new Date(d.getTime() + duration * 1000).toISOString()
    const s = await databases.createDocument(appwrite.databaseId, appwrite.collections.sessions, ID.unique(), {
      userId, taskId: taskIds.length ? taskIds[i % taskIds.length] : null, status: 'completed', durationSeconds: duration, restEarnedSeconds: Math.floor(duration / 5), restTakenSeconds: Math.floor(duration / 5) - 30, startedAt, endedAt, createdAt: startedAt,
    })
    await databases.createDocument(appwrite.databaseId, appwrite.collections.events, ID.unique(), { sessionId: s.$id, eventType: 'focus_started', timestamp: startedAt, payload: '{}' }).catch(() => {})
    await databases.createDocument(appwrite.databaseId, appwrite.collections.events, ID.unique(), { sessionId: s.$id, eventType: 'session_ended', timestamp: endedAt, payload: '{}' }).catch(() => {})
  }

  console.log('✅ Seed done — login with', EMAIL, '/', PASSWORD)
  process.exit(0)
}

seed().catch((e) => { console.error(e); process.exit(1) })
