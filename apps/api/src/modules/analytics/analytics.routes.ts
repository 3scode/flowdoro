import { Elysia } from 'elysia'
import { eq, and, gte, sql } from 'drizzle-orm'
import { db } from '../../db'
import { sessions } from '../../db/schema'
import { verifyToken } from '../../middleware/auth'

async function getUser(headers: any, cookie: any) {
  const token = cookie?.token?.value ?? headers['authorization']?.replace('Bearer ', '')
  if (!token) throw new Error('UNAUTHORIZED')
  return await verifyToken(token)
}

function streakDays(list: { startedAt: Date }[]) {
  const dates = new Set(list.map((s) => s.startedAt.toISOString().slice(0, 10)))
  let streak = 0
  const cur = new Date()
  while (dates.has(cur.toISOString().slice(0, 10))) { streak++; cur.setDate(cur.getDate() - 1) }
  return streak
}

export const analyticsRoutes = new Elysia({ prefix: '/api/analytics' })
  .get('/summary', async ({ headers, cookie, set, query }) => {
    try {
      const user = await getUser(headers as any, cookie)
      const all = await db.select().from(sessions).where(and(eq(sessions.userId, user.id), eq(sessions.status, 'completed')))
      const todayStr = new Date().toISOString().slice(0, 10)
      const todaySessions = all.filter((s) => s.startedAt.toISOString().slice(0, 10) === todayStr)
      const todayFocus = todaySessions.reduce((a, s) => a + s.durationSeconds, 0)
      const totalFocus = all.reduce((a, s) => a + s.durationSeconds, 0)
      const avgFocus = all.length ? Math.round(totalFocus / all.length) : 0
      const longest = all.length ? Math.max(...all.map((s) => s.durationSeconds)) : 0
      // best day
      const byDay: Record<string, number> = {}
      for (const s of all) { const d = s.startedAt.toISOString().slice(0, 10); byDay[d] = (byDay[d] ?? 0) + s.durationSeconds }
      let bestDay: any = null
      for (const [d, v] of Object.entries(byDay)) if (!bestDay || v > bestDay.value) bestDay = { date: d, value: v }
      return { success: true, data: { todayFocus, totalFocus, avgFocus, longestSession: longest, bestDay, streak: streakDays(all), totalSessions: all.length }, error: null, meta: null }
    } catch (e: any) { if (e.message === 'UNAUTHORIZED') { set.status = 401; return { success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null } } throw e }
  })
  .get('/history', async ({ headers, cookie, set, query }) => {
    try {
      const user = await getUser(headers as any, cookie)
      const period = (query as any).period ?? 'week'
      const days = period === 'month' ? 30 : period === 'week' ? 7 : 1
      const from = new Date(); from.setDate(from.getDate() - days)
      const list = await db.select().from(sessions).where(and(eq(sessions.userId, user.id), eq(sessions.status, 'completed'), gte(sessions.startedAt, from)))
      const byDate: Record<string, number> = {}
      for (const s of list) { const d = s.startedAt.toISOString().slice(0, 10); byDate[d] = (byDate[d] ?? 0) + s.durationSeconds }
      const points = Object.entries(byDate).map(([date, seconds]) => ({ date, seconds })).sort((a, b) => a.date.localeCompare(b.date))
      return { success: true, data: points, error: null, meta: null }
    } catch (e: any) { if (e.message === 'UNAUTHORIZED') { set.status = 401; return { success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, meta: null } } throw e }
  })
