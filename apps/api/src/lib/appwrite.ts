import { Client, Databases, Users, Storage, Account, ID, Query } from 'node-appwrite'
import { env } from '../config/env'

// Fully-served client with API key (admin: creates users, docs, files)
export function getAdminClient() {
  return new Client().setEndpoint(env.appwriteEndpoint).setProject(env.appwriteProjectId).setKey(env.appwriteApiKey)
}

// Session-scoped client using a session secret (for account.get() in authGuard)
export function getSessionClient(sessionSecret: string) {
  const client = new Client().setEndpoint(env.appwriteEndpoint).setProject(env.appwriteProjectId)
  if (sessionSecret) client.setSession(sessionSecret)
  return client
}

// Plain client (no key, no session) for password login via Account.createEmailPasswordSession
export function getPublicClient() {
  return new Client().setEndpoint(env.appwriteEndpoint).setProject(env.appwriteProjectId)
}

export function getDatabases() {
  return new Databases(getAdminClient())
}

export function getUsers() {
  return new Users(getAdminClient())
}

export function getStorage() {
  return new Storage(getAdminClient())
}

export function getAccount() {
  return new Account(getPublicClient())
}

export async function getProfile(userId: string) {
  const databases = getDatabases()
  const res = await databases.listDocuments(
    appwrite.databaseId,
    appwrite.collections.profiles,
    [Query.equal('userId', userId)],
  )
  return res.documents[0] ?? null
}

export const appwrite = {
  databaseId: env.appwriteDatabaseId,
  collections: {
    profiles: env.appwriteCollectionProfiles,
    tasks: env.appwriteCollectionTasks,
    sessions: env.appwriteCollectionSessions,
    events: env.appwriteCollectionEvents,
    googleTokens: env.appwriteCollectionGoogleTokens,
    lists: env.appwriteCollectionLists,
  },
  buckets: {
    avatars: env.appwriteBucketAvatars,
  },
}

export { ID, Query }
