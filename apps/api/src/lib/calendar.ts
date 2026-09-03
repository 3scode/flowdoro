import { google } from 'googleapis'
import { buildOAuth2Client, refreshTokenIfExpired } from './google'
import { appwrite, Query, getDatabases } from './appwrite'

type TaskLike = Record<string, any>

async function getValidToken(userId: string): Promise<string> {
  return refreshTokenIfExpired(userId)
}

export async function syncTaskToCalendar(task: TaskLike): Promise<void> {
  if (!task.dueDate || !task.title || task.status === 'done' || !task.userId) return
  try {
    const accessToken = await getValidToken(task.userId)
    const client = buildOAuth2Client(accessToken)
    const calendarApi = google.calendar({ version: 'v3', auth: client })
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
      // ponytail: update call — newer googleapis uses .resource param
      ;(calendarApi as any).events.update({ calendarId: 'primary', eventId: task.googleEventId, resource: event })
    } else {
      const created = await (calendarApi as any).events.insert({ calendarId: 'primary', resource: event })
      const eventId = created?.data?.id as string | undefined
      if (!eventId) return
      await upsertGoogleEventId(task.userId, task.$id ?? '', eventId)
    }
  } catch {
    // ponytail: add structured error logging when monitoring is added
  }
}

export async function deleteTaskFromCalendar(task: TaskLike): Promise<void> {
  if (!task.googleEventId || !task.userId) return
  try {
    const accessToken = await getValidToken(task.userId)
    const client = buildOAuth2Client(accessToken)
    const calendarApi = google.calendar({ version: 'v3', auth: client })
    await (calendarApi as any).events.delete({ calendarId: 'primary', eventId: task.googleEventId })
    await clearGoogleEventId(task.userId, task.$id ?? '')
  } catch {
    // ponytail: add structured error logging when monitoring is added
  }
}

async function upsertGoogleEventId(userId: string, taskId: string, eventId: string): Promise<void> {
  const databases = getDatabases()
  const res = await databases.listDocuments(appwrite.databaseId, appwrite.collections.tasks, [Query.equal('userId', userId), Query.equal('$id', taskId)])
  if (res.documents[0]) {
    await databases.updateDocument(appwrite.databaseId, appwrite.collections.tasks, taskId, { googleEventId: eventId, updatedAt: new Date().toISOString() })
  }
}

async function clearGoogleEventId(userId: string, taskId: string): Promise<void> {
  const databases = getDatabases()
  await databases.updateDocument(appwrite.databaseId, appwrite.collections.tasks, taskId, { googleEventId: null, updatedAt: new Date().toISOString() })
}

export async function backfillUserTasks(userId: string): Promise<{ created: number; skipped: number }> {
  const databases = getDatabases()
  // ponytail: use Query.notEqual once SDK supports it; current workaround fetches all pending and filters in JS
  const res = await databases.listDocuments(appwrite.databaseId, appwrite.collections.tasks, [Query.equal('userId', userId)])
  const pending = res.documents.filter((t: any) => t.status !== 'done' && t.dueDate)
  let created = 0
  let skipped = 0
  for (const doc of pending) {
    if (doc.googleEventId) { skipped++; continue }
    try {
      await syncTaskToCalendar(doc)
      created++
    } catch {
      skipped++
    }
  }
  return { created, skipped }
}
