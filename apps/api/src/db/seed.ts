import { ID, Users, Account } from 'node-appwrite'
import { getDatabases, getUsers, getPublicClient, appwrite } from '../lib/appwrite'
import { env } from '../config/env'

const EMAIL = 'demo@flowdoro.app'
const PASSWORD = 'password123'

async function seed() {
  console.log('🌱 Seeding fresh Appwrite data...')
  const users = getUsers()
  const databases = getDatabases()

  let userId: string
  try {
    const existing = await users.list([], undefined, true)
    const found = existing.users.find((u) => u.email === EMAIL)
    userId = found ? found.$id : ''
  } catch {
    userId = ''
  }

  if (!userId) {
    const res = await users.create(ID.unique(), EMAIL, undefined, PASSWORD, 'Demo User')
    userId = res.$id
    console.log('  created user', userId)
  } else {
    console.log('  existing user', userId)
  }

  await databases.createDocument(appwrite.databaseId, appwrite.collections.profiles, ID.unique(), {
    userId,
    email: EMAIL,
    name: 'Demo User',
    restRatio: 5,
    theme: 'system',
    notificationsEnabled: false,
    soundEnabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }).catch((e) => console.log('  profile maybe exists', e?.message))

  const taskNames = ['Deep Work', 'Study', 'Design', 'Bug Fix', 'Writing']
  const taskIds: string[] = []
  for (const name of taskNames) {
    const t = await databases.createDocument(appwrite.databaseId, appwrite.collections.tasks, ID.unique(), {
      userId,
      name,
      createdAt: new Date().toISOString(),
    }).catch((e) => {
      console.log('  task maybe exists', e?.message)
      return null
    })
    if (t) taskIds.push(t.$id)
  }

  const now = new Date()
  for (let i = 0; i < 15; i++) {
    const d = new Date(now); d.setDate(d.getDate() - Math.floor(i / 3))
    const duration = 600 + Math.floor(Math.random() * 5400)
    const startedAt = d.toISOString()
    const endedAt = new Date(d.getTime() + duration * 1000).toISOString()
    const s = await databases.createDocument(appwrite.databaseId, appwrite.collections.sessions, ID.unique(), {
      userId,
      taskId: taskIds.length ? taskIds[i % taskIds.length] : null,
      status: 'completed',
      durationSeconds: duration,
      restEarnedSeconds: Math.floor(duration / 5),
      restTakenSeconds: Math.floor(duration / 5) - 30,
      startedAt,
      endedAt,
      createdAt: startedAt,
    })
    await databases.createDocument(appwrite.databaseId, appwrite.collections.events, ID.unique(), {
      sessionId: s.$id,
      eventType: 'focus_started',
      timestamp: startedAt,
      payload: '{}',
    }).catch(() => {})
    await databases.createDocument(appwrite.databaseId, appwrite.collections.events, ID.unique(), {
      sessionId: s.$id,
      eventType: 'session_ended',
      timestamp: endedAt,
      payload: '{}',
    }).catch(() => {})
  }

  console.log('✅ Seed done — login with', EMAIL, '/', PASSWORD)
  process.exit(0)
}

seed().catch((e) => { console.error(e); process.exit(1) })
