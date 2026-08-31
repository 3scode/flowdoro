import { db } from './index'
import { users, tasks, sessions, sessionEvents } from './schema'
import { hash } from 'bcryptjs'

async function seed() {
  console.log('🌱 Seeding...')
  const passwordHash = await hash('password123', 10)

  const [user] = await db.insert(users).values({
    email: 'demo@flowdoro.app',
    passwordHash,
    name: 'Demo User',
  }).returning().onConflictDoNothing()
  const userId = user?.id ?? (await db.query.users.findFirst({ where: (u, { eq }) => eq(u.email, 'demo@flowdoro.app') }))?.id
  if (!userId) { console.log('No user'); return }

  const taskNames = ['Deep Work', 'Study', 'Design', 'Bug Fix', 'Writing']
  for (const name of taskNames) {
    await db.insert(tasks).values({ userId, name }).onConflictDoNothing()
  }

  const now = new Date()
  for (let i = 0; i < 15; i++) {
    const d = new Date(now); d.setDate(d.getDate() - Math.floor(i / 3))
    const duration = 600 + Math.floor(Math.random() * 5400)
    const s = await db.insert(sessions).values({
      userId, status: 'completed', durationSeconds: duration,
      restEarnedSeconds: Math.floor(duration / 5), restTakenSeconds: Math.floor(duration / 5) - 30,
      startedAt: d, endedAt: new Date(d.getTime() + duration * 1000),
    }).returning()
    if (s[0]) {
      await db.insert(sessionEvents).values([
        { sessionId: s[0].id, eventType: 'focus_started', timestamp: d },
        { sessionId: s[0].id, eventType: 'session_ended', timestamp: new Date(d.getTime() + duration * 1000) },
      ])
    }
  }
  console.log('✅ Seed done')
  process.exit(0)
}

seed().catch((e) => { console.error(e); process.exit(1) })
