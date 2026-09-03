import { Elysia } from 'elysia'
import { Account } from 'node-appwrite'
import { getSessionClient, getProfile } from '../lib/appwrite'

export const SESSION_COOKIE = 'token'

export async function getUserFromSession(sessionSecret: string) {
  const account = new Account(getSessionClient(sessionSecret))
  const session = await account.get()
  return { id: session.$id, email: session.email, name: session.name }
}

export const authGuard = new Elysia()
  .derive(async ({ cookie, headers, set }) => {
    const secret = (cookie as any)?.token?.value ?? headers['authorization']?.replace('Bearer ', '') ?? ''
    if (!secret) {
      set.status = 401
      throw new Error('UNAUTHORIZED')
    }
    try {
      const account = new Account(getSessionClient(secret))
      const session = await account.get()
      let profile: any = null
      try {
        profile = await getProfile(session.$id)
      } catch {
        profile = null
      }
      return { user: { id: session.$id, email: session.email, name: session.name, profile } }
    } catch {
      set.status = 401
      throw new Error('UNAUTHORIZED')
    }
  })
