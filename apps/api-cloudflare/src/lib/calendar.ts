import { dbList, dbUpdate } from './appwrite'
import { refreshTokenIfExpired } from './google'

type TaskLike = Record<string, any>

async function getValidToken(e: any, userId: string): Promise<string> {
  return refreshTokenIfExpired(e, userId)
}

async function upsertGoogleEventId(e: any, userId: string, taskId: string, eventId: string): Promise<void> {
  const r = await dbList(e, e.appwriteCollectionTasks, [['userId', userId]])
  const found = r.documents.find((d: any) => (d.$id ?? d.id) === taskId)
  if (found) {
    await dbUpdate(e, e.appwriteCollectionTasks, found.$id ?? taskId, { googleEventId: eventId, updatedAt: new Date().toISOString() })
  }
}

async function clearGoogleEventId(e: any, userId: string, taskId: string): Promise<void> {
  const r = await dbList(e, e.appwriteCollectionTasks, [['userId', userId]])
  const found = r.documents.find((d: any) => (d.$id ?? d.id) === taskId)
  if (found) await dbUpdate(e, e.appwriteCollectionTasks, found.$id ?? taskId, { googleEventId: null, updatedAt: new Date().toISOString() })
}

export async function syncTaskToCalendar(e: any, task: TaskLike): Promise<void> {
  if (!task.dueDate || !task.title || task.status === 'done' || !task.userId) return
  if (task.completedAt) return
  try {
    const accessToken = await getValidToken(e, task.userId)
    const dueAt = task.dueTime ? `${task.dueDate}T${task.dueTime}` : task.dueDate
    const startDateTime = new Date(dueAt).toISOString()
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const event = {
      summary: task.title,
      description: task.description ?? undefined,
      start: { dateTime: startDateTime, timeZone },
      end: { dateTime: new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000).toISOString(), timeZone },
    }
    if (task.googleEventId) {
      await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${task.googleEventId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
        body: JSON.stringify(event),
      })
    } else {
      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
        body: JSON.stringify(event),
      })
      if (!res.ok) return
      const created: any = await res.json()
      const eventId = created?.id as string | undefined
      if (!eventId) return
      await upsertGoogleEventId(e, task.userId, task.$id ?? task.id ?? '', eventId)
    }
  } catch {}
}

export async function deleteTaskFromCalendar(e: any, task: TaskLike): Promise<void> {
  if (!task.googleEventId || !task.userId) return
  try {
    const accessToken = await getValidToken(e, task.userId)
    await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${task.googleEventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    await clearGoogleEventId(e, task.userId, task.$id ?? task.id ?? '')
  } catch {}
}

export async function backfillUserTasks(e: any, userId: string): Promise<{ created: number; skipped: number }> {
  const r = await dbList(e, e.appwriteCollectionTasks, [['userId', userId]])
  const pending = r.documents.filter((t: any) => !t.completedAt && t.status !== 'done' && t.dueDate)
  let created = 0
  let skipped = 0
  for (const doc of pending) {
    if (doc.googleEventId) { skipped++; continue }
    try {
      await syncTaskToCalendar(e, doc)
      created++
    } catch { skipped++ }
  }
  return { created, skipped }
}
