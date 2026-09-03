import { google } from 'googleapis'
import { getDatabases, appwrite, Query } from './appwrite'
import { encrypt, decrypt, computePkceVerifier } from './crypto'
import { env } from '../config/env'

export interface StoredToken {
  accessToken: string
  refreshToken: string
  expiresAt: number
  calendarId: string
  scope: string
}

interface EncryptedDoc {
  userId: string
  encryptedAccessToken: string
  encryptedRefreshToken: string
  scope: string
  calendarId: string
  expiresAt: string
}

export function buildOAuth2Client(accessToken?: string) {
  const oAuth2Client = new google.auth.OAuth2(env.googleClientId, env.googleClientSecret, env.googleRedirectUri)
  if (accessToken) oAuth2Client.setCredentials({ access_token: accessToken })
  return oAuth2Client
}

async function getEncryptedDoc(userId: string): Promise<any | null> {
  const databases = getDatabases()
  const res = await databases.listDocuments(appwrite.databaseId, appwrite.collections.googleTokens, [Query.equal('userId', userId)])
  return res.documents[0] ?? null
}

async function upsertEncryptedDoc(userId: string, doc: Omit<EncryptedDoc, '$id'>): Promise<void> {
  const databases = getDatabases()
  const existing = await getEncryptedDoc(userId)
  if (existing) {
    await databases.updateDocument(appwrite.databaseId, appwrite.collections.googleTokens, existing.$id, { ...doc, updatedAt: new Date().toISOString() })
  } else {
    await databases.createDocument(appwrite.databaseId, appwrite.collections.googleTokens, userId, doc)
  }
}

async function deleteEncryptedDoc(userId: string): Promise<void> {
  const databases = getDatabases()
  const existing = await getEncryptedDoc(userId)
  if (existing) await databases.deleteDocument(appwrite.databaseId, appwrite.collections.googleTokens, existing.$id)
}

export async function getConnectUrl(userId: string): Promise<{ url: string; pkceVerifier: string }> {
  const pkceVerifier = computePkceVerifier()
  const oAuth2Client = new google.auth.OAuth2(env.googleClientId, env.googleClientSecret, env.googleRedirectUri)
  const state = btoa(JSON.stringify({ userId, pkceVerifier }))
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.events'],
    prompt: 'consent',
    state,
  })
  return { url, pkceVerifier }
}

export async function exchangeCode(code: string, state: string): Promise<StoredToken> {
  const decoded = JSON.parse(atob(state)) as { userId: string; pkceVerifier: string }
  const oAuth2Client = buildOAuth2Client()
  // ponytail: use any cast — googleapis TokenResponse typing changed between versions
  const tokenRes: any = await oAuth2Client.getToken({ code, codeVerifier: decoded.pkceVerifier })
  const tokens = tokenRes.tokens
  if (!tokens.refresh_token) throw new Error('No refresh token received from Google')
  const expiresAt = typeof tokens.expiry_date === 'number' ? tokens.expiry_date : Date.now() + (tokens.expires_in ?? 3600) * 1000
  const calendarId = 'primary'
  await upsertEncryptedDoc(decoded.userId, {
    userId: decoded.userId,
    encryptedAccessToken: encrypt(tokens.access_token ?? ''),
    encryptedRefreshToken: encrypt(tokens.refresh_token ?? ''),
    scope: 'https://www.googleapis.com/auth/calendar.events',
    calendarId,
    expiresAt: new Date(expiresAt).toISOString(),
  })
  return { accessToken: tokens.access_token ?? '', refreshToken: tokens.refresh_token ?? '', expiresAt, calendarId, scope: '' }
}

export async function refreshTokenIfExpired(userId: string): Promise<string> {
  const enc = await getEncryptedDoc(userId)
  if (!enc) throw new Error('No Google token for user')
  const now = Date.now()
  if (now >= new Date(enc.expiresAt).getTime() - 60_000) {
    const client = buildOAuth2Client()
    client.setCredentials({ refresh_token: decrypt(enc.encryptedRefreshToken) })
    const tokenRes: any = await client.getAccessToken()
    const credentials = tokenRes.credentials
    const newExpiresAt = credentials.expiry_date ?? enc.expiresAt
    await upsertEncryptedDoc(userId, {
      userId,
      encryptedAccessToken: encrypt(credentials.access_token),
      encryptedRefreshToken: decrypt(enc.encryptedRefreshToken),
      scope: enc.scope,
      calendarId: enc.calendarId,
      expiresAt: new Date(newExpiresAt).toISOString(),
    })
    return credentials.access_token
  }
  return decrypt(enc.encryptedAccessToken)
}

export async function getStatus(userId: string): Promise<{ connected: boolean; calendarId?: string; expiresAt?: string }> {
  const doc = await getEncryptedDoc(userId)
  return { connected: !!doc, calendarId: doc?.calendarId, expiresAt: doc?.expiresAt }
}

export async function disconnect(userId: string): Promise<void> {
  await deleteEncryptedDoc(userId)
}
