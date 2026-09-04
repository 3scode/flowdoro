import { Hono } from 'hono'
import { dbListAll } from '../lib/appwrite'
import { authMiddleware } from '../middleware/auth'

type User = { id: string; email: string; name: string }
type Env = { Bindings: any; Variables: { user: User; env: any } }

const analytics = new Hono<Env>().use('*', authMiddleware)

function streakDays(list: { startedAt: string }[]) {
  const dates = new Set(list.map(s => new Date(s.startedAt).toISOString().slice(0, 10)))
  let streak = 0
  const cur = new Date()
  while (dates.has(cur.toISOString().slice(0, 10))) { streak++; cur.setDate(cur.getDate() - 1) }
  return streak
}

async function listAllCompleted(e: any, userId: string): Promise<any[]> {
  const r = await dbListAll(e, e.appwriteCollectionSessions, [
    ['userId', userId], ['status', 'completed'],
  ], 100)
  return r.documents
}

analytics.get('/summary', async (c) => {
  const e = c.get('env')
  const all = await listAllCompleted(e, c.get('user').id)
  const todayStr = new Date().toISOString().slice(0, 10)
  const todaySessions = all.filter(s => new Date(s.startedAt).toISOString().slice(0, 10) === todayStr)
  const todayFocus = todaySessions.reduce((a: number, s: any) => a + (s.durationSeconds ?? 0), 0)
  const totalFocus = all.reduce((a: number, s: any) => a + (s.durationSeconds ?? 0), 0)
  const avgFocus = all.length ? Math.round(totalFocus / all.length) : 0
  const longest = all.length ? Math.max(...all.map((s: any) => s.durationSeconds ?? 0)) : 0
  const byDay: Record<string, number> = {}
  for (const s of all) { const d = new Date(s.startedAt).toISOString().slice(0, 10); byDay[d] = (byDay[d] ?? 0) + (s.durationSeconds ?? 0) }
  let bestDay: any = null
  for (const [d, v] of Object.entries(byDay)) if (!bestDay || (v as number) > bestDay.value) bestDay = { date: d, value: v }
  return c.json({ success: true, data: { todayFocus, totalFocus, avgFocus, longestSession: longest, bestDay, streak: streakDays(all), totalSessions: all.length }, error: null, meta: null })
})

analytics.get('/history', async (c) => {
  const e = c.get('env')
  const url = new URL(c.req.url)
  const period = url.searchParams.get('period') ?? 'week'
  const days = period === 'month' ? 30 : period === 'week' ? 7 : 1
  const from = new Date(); from.setDate(from.getDate() - days)
  const all = await listAllCompleted(e, c.get('user').id)
  const list = all.filter(s => new Date(s.startedAt) >= from)
  const byDate: Record<string, number> = {}
  for (const s of list) { const d = new Date(s.startedAt).toISOString().slice(0, 10); byDate[d] = (byDate[d] ?? 0) + (s.durationSeconds ?? 0) }
  const points = Object.entries(byDate).map(([date, seconds]) => ({ date, seconds })).sort((a, b) => a.date.localeCompare(b.date))
    return c.json({ success: true, data: points, error: null, meta: null })
})

analytics.get('/tasks', async (c) => {
  const e = c.get('env')
  const all = await listAllCompleted(e, c.get('user').id)
  const byTask: Record<string, { totalFocusSeconds: number; sessionCount: number; restEarnedSeconds: number }> = {}
  for (const s of all) {
    const tid = s.taskId
    if (!tid) continue
    if (!byTask[tid]) byTask[tid] = { totalFocusSeconds: 0, sessionCount: 0, restEarnedSeconds: 0 }
    byTask[tid].totalFocusSeconds += s.durationSeconds ?? 0
    byTask[tid].sessionCount += 1
    byTask[tid].restEarnedSeconds += s.restEarnedSeconds ?? 0
  }
  return c.json({ success: true, data: byTask, error: null, meta: null })
})

export default analytics
