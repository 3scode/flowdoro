import { dbList, dbCreate, dbUpdate, dbDelete } from './appwrite'
import { encrypt, decrypt, computePkceVerifier, computePkceChallenge } from './crypto'

export interface StoredToken {
  accessToken: string
  refreshToken: string
  expiresAt: number
  calendarId: string
  scope: string
}

async function getEncryptedDoc(e: any, userId: string): Promise<any | null> {
  const r = await dbList(e, e.appwriteCollectionGoogleTokens, [['userId', userId]])
  return r.documents[0] ?? null
}

async function upsertEncryptedDoc(e: any, userId: string, doc: Record<string, any>): Promise<void> {
  const existing = await getEncryptedDoc(e, userId)
  if (existing) {
    await dbUpdate(e, e.appwriteCollectionGoogleTokens, existing.$id, { ...doc, updatedAt: new Date().toISOString() })
  } else {
    // use userId as documentId for easy lookup (like old code used userId as ID)
    const { ID } = await import('appwrite')
    await dbCreate(e, e.appwriteCollectionGoogleTokens, { ...doc, updatedAt: new Date().toISOString() })
  }
}

async function deleteEncryptedDoc(e: any, userId: string): Promise<void> {
  const existing = await getEncryptedDoc(e, userId)
  if (existing) await dbDelete(e, e.appwriteCollectionGoogleTokens, existing.$id)
}

export async function getConnectUrl(e: any, userId: string): Promise<{ url: string }> {
  const verifier = computePkceVerifier()
  const challenge = await computePkceChallenge(verifier)
  const state = btoa(JSON.stringify({ userId, pkceVerifier: verifier }))
  const params = new URLSearchParams({
    client_id: e.googleClientId,
    redirect_uri: e.googleRedirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/calendar.events',
    access_type: 'offline',
    prompt: 'consent',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  })
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  return { url }
}

export async function exchangeCode(e: any, code: string, state: string): Promise<StoredToken> {
  const decoded = JSON.parse(atob(state)) as { userId: string; pkceVerifier: string }
  const body = new URLSearchParams({
    client_id: e.googleClientId,
    client_secret: e.googleClientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: e.googleRedirectUri,
    code_verifier: decoded.pkceVerifier,
  })
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  if (!res.ok) {
    const err: any = await res.json().catch(() => ({}))
    throw new Error(err?.error_description ?? err?.error ?? 'Token exchange failed')
  }
  const tokens: any = await res.json()
  if (!tokens.refresh_token) throw new Error('No refresh token received from Google — try disconnect and reconnect')
  const expiresAt = Date.now() + (tokens.expires_in ?? 3600) * 1000
  const calendarId = 'primary'
  await upsertEncryptedDoc(e, decoded.userId, {
    userId: decoded.userId,
    encryptedAccessToken: await encrypt(tokens.access_token ?? '', e),
    encryptedRefreshToken: await encrypt(tokens.refresh_token ?? '', e),
    scope: 'https://www.googleapis.com/auth/calendar.events',
    calendarId,
    expiresAt: new Date(expiresAt).toISOString(),
  })
  return { accessToken: tokens.access_token ?? '', refreshToken: tokens.refresh_token ?? '', expiresAt, calendarId, scope: '' }
}

export async function refreshTokenIfExpired(e: any, userId: string): Promise<string> {
  const enc = await getEncryptedDoc(e, userId)
  if (!enc) throw new Error('No Google token for user')
  const expiresAt = new Date(enc.expiresAt).getTime()
  if (Date.now() < expiresAt - 60_000) {
    return decrypt(enc.encryptedAccessToken, e)
  }
  // refresh
  const refreshToken = await decrypt(enc.encryptedRefreshToken, e)
  const body = new URLSearchParams({
    client_id: e.googleClientId,
    client_secret: e.googleClientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  })
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  if (!res.ok) {
    const err: any = await res.json().catch(() => ({}))
    throw new Error(err?.error_description ?? 'Failed to refresh token')
  }
  const tokens: any = await res.json()
  const newExpiresAt = Date.now() + (tokens.expires_in ?? 3600) * 1000
  await upsertEncryptedDoc(e, userId, {
    userId,
    encryptedAccessToken: await encrypt(tokens.access_token ?? '', e),
    encryptedRefreshToken: enc.encryptedRefreshToken, // keep same encrypted refresh
    scope: enc.scope,
    calendarId: enc.calendarId,
    expiresAt: new Date(newExpiresAt).toISOString(),
  })
  return tokens.access_token
}

export async function getStatus(e: any, userId: string): Promise<{ connected: boolean; calendarId?: string; expiresAt?: string }> {
  const doc = await getEncryptedDoc(e, userId)
  if (!doc) return { connected: false }
  return { connected: true, calendarId: doc.calendarId ?? 'primary', expiresAt: doc.expiresAt }
}

export async function disconnect(e: any, userId: string): Promise<void> {
  await deleteEncryptedDoc(e, userId)
}
