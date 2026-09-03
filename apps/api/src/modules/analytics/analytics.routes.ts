import { Elysia } from 'elysia'
import { getDatabases, appwrite, Query } from '../../lib/appwrite'

function streakDays(list: { startedAt: string }[]) {
  const dates = new Set(list.map((s) => new Date(s.startedAt).toISOString().slice(0, 10)))
  let streak = 0
  const cur = new Date()
  while (dates.has(cur.toISOString().slice(0, 10))) { streak++; cur.setDate(cur.getDate() - 1) }
  return streak
}

async function listAllCompleted(userId: string): Promise<any[]> {
  const databases = getDatabases()
  const all: any[] = []
  let cursor = 0
  const limit = 100
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const res = await databases.listDocuments(appwrite.databaseId, appwrite.collections.sessions, [Query.equal('userId', userId), Query.equal('status', 'completed'), Query.limit(limit), Query.offset(cursor)], undefined, true)
    all.push(...res.documents)
    if (cursor + limit >= res.total) break
    cursor += limit
  }
  return all
}

export const analyticsRoutes = new Elysia({ prefix: '/api/analytics' })
  .get('/summary', async ({ user }: any) => {
    const all = await listAllCompleted(user.id)
    const todayStr = new Date().toISOString().slice(0, 10)
    const todaySessions = all.filter((s) => new Date(s.startedAt).toISOString().slice(0, 10) === todayStr)
    const todayFocus = todaySessions.reduce((a: number, s: any) => a + (s.durationSeconds ?? 0), 0)
    const totalFocus = all.reduce((a: number, s: any) => a + (s.durationSeconds ?? 0), 0)
    const avgFocus = all.length ? Math.round(totalFocus / all.length) : 0
    const longest = all.length ? Math.max(...all.map((s: any) => s.durationSeconds ?? 0)) : 0
    const byDay: Record<string, number> = {}
    for (const s of all) { const d = new Date(s.startedAt).toISOString().slice(0, 10); byDay[d] = (byDay[d] ?? 0) + (s.durationSeconds ?? 0) }
    let bestDay: any = null
    for (const [d, v] of Object.entries(byDay)) if (!bestDay || (v as number) > bestDay.value) bestDay = { date: d, value: v }
    return { success: true, data: { todayFocus, totalFocus, avgFocus, longestSession: longest, bestDay, streak: streakDays(all), totalSessions: all.length }, error: null, meta: null }
  })
  .get('/history', async ({ user, query }: any) => {
    const period = (query as any).period ?? 'week'
    const days = period === 'month' ? 30 : period === 'week' ? 7 : 1
    const from = new Date(); from.setDate(from.getDate() - days)
    const all = await listAllCompleted(user.id)
    const list = all.filter((s) => new Date(s.startedAt) >= from)
    const byDate: Record<string, number> = {}
    for (const s of list) { const d = new Date(s.startedAt).toISOString().slice(0, 10); byDate[d] = (byDate[d] ?? 0) + (s.durationSeconds ?? 0) }
    const points = Object.entries(byDate).map(([date, seconds]) => ({ date, seconds })).sort((a, b) => a.date.localeCompare(b.date))
    return { success: true, data: points, error: null, meta: null }
  })
  .get('/tasks', async ({ user }: any) => {
    // Return time-spent breakdown per taskId: { totalFocusSeconds, sessionCount, restEarnedSeconds }
    const all = await listAllCompleted(user.id)
    const byTask: Record<string, { totalFocusSeconds: number; sessionCount: number; restEarnedSeconds: number }> = {}
    for (const s of all) {
      const tid = s.taskId
      if (!tid) continue
      if (!byTask[tid]) byTask[tid] = { totalFocusSeconds: 0, sessionCount: 0, restEarnedSeconds: 0 }
      byTask[tid].totalFocusSeconds += s.durationSeconds ?? 0
      byTask[tid].sessionCount += 1
      byTask[tid].restEarnedSeconds += s.restEarnedSeconds ?? 0
    }
    return { success: true, data: byTask, error: null, meta: null }
  })
