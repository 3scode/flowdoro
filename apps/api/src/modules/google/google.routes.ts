import { Elysia, type Context } from 'elysia'
import { appwrite, getDatabases, Query } from '../../lib/appwrite'
import * as google from '../../lib/google'
import * as calendar from '../../lib/calendar'

export const googleRoutes = new Elysia({ prefix: '/api/google' })

  .get('/connect', async ({ user, set }: any) => {
    if (!user) {
      set.status = 401
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, data: null, meta: null }
    }
    const { url } = await google.getConnectUrl(user.id)
    return { success: true, data: { url }, error: null, meta: null }
  })

  .get('/callback', async ({ query, redirect }: any) => {
    const code = query.code as string | undefined
    const state = query.state as string | undefined
    if (!code || !state) {
      return { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Missing code or state' }, meta: null }
    }
    try {
      await google.exchangeCode(code, state)
      const decoded = JSON.parse(atob(state)) as { userId: string }
      await calendar.backfillUserTasks(decoded.userId)
      const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173'
      throw new Error(`__REDIRECT:${frontendUrl}/settings?google=connected`)
    } catch (e: any) {
      if (e.message.startsWith('__REDIRECT:')) {
        return redirect(e.message.replace('__REDIRECT:', ''))
      }
      return { success: false, data: null, error: { code: 'INTERNAL_ERROR', message: e.message ?? 'Google OAuth failed' }, meta: null }
    }
  })

  .get('/status', async ({ user, set }: any) => {
    if (!user) {
      set.status = 401
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, data: null, meta: null }
    }
    const status = await google.getStatus(user.id)
    return { success: true, data: status, error: null, meta: null }
  })

  .post('/disconnect', async ({ user }: any) => {
    if (!user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, data: null, meta: null }
    }
    const databases = getDatabases()
    const tasks = await databases.listDocuments(appwrite.databaseId, appwrite.collections.tasks, [Query.equal('userId', user.id)])
    for (const task of tasks.documents) {
      if (task.googleEventId) {
        await databases.updateDocument(appwrite.databaseId, appwrite.collections.tasks, task.$id, { googleEventId: null, updatedAt: new Date().toISOString() })
      }
    }
    await google.disconnect(user.id)
    return { success: true, data: null, error: null, meta: null }
  })
