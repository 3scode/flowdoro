import { ID } from 'appwrite'

export type EnvVars = {
  appwriteEndpoint: string
  appwriteProjectId: string
  appwriteApiKey: string
  appwriteDatabaseId: string
  appwriteCollectionProfiles: string
  appwriteCollectionTasks: string
  appwriteCollectionSessions: string
  appwriteCollectionEvents: string
  appwriteCollectionLists: string
  appwriteCollectionGoogleTokens: string
  appwriteBucketAvatars: string
  googleClientId: string
  googleClientSecret: string
  googleRedirectUri: string
  googleTokenEncryptionKey: string
}

const HEADERS = (e: EnvVars) => ({
  'content-type': 'application/json',
  'x-appwrite-project': e.appwriteProjectId,
  'x-appwrite-key': e.appwriteApiKey,
})
const BASE = (e: EnvVars) => `${e.appwriteEndpoint}/databases/${e.appwriteDatabaseId}`

// Build queries array as JSON strings (Appwrite REST API format) — use queries[] for all including limit/offset (Appwrite v1.5+)
function buildQueries(queries: [string, string | number, string?][], limit: number, offset: number) {
  const all: string[] = []
  queries.forEach(([attr, val]) => {
    all.push(JSON.stringify({ method: 'equal', attribute: attr, values: [String(val)] }))
  })
  all.push(JSON.stringify({ method: 'limit', values: [limit] }))
  all.push(JSON.stringify({ method: 'offset', values: [offset] }))
  return all.map((json) => `queries[]=${encodeURIComponent(json)}`).join('&')
}

export async function dbList(e: EnvVars, collection: string, queries: [string, string | number][] = [], limit = 25, offset = 0) {
  const qs = buildQueries(queries, limit, offset)
  const res = await fetch(`${BASE(e)}/collections/${collection}/documents?${qs}`, { headers: HEADERS(e) })
  return res.json() as Promise<{ documents: any[]; total: number }>
}

export async function dbListAll(e: EnvVars, collection: string, queries: [string, string | number][] = [], limit = 25) {
  let offset = 0
  let all: any[] = []
  let total = Infinity
  while (all.length < total) {
    const r = await dbList(e, collection, queries, limit, offset)
    if (!r.documents || r.documents.length === 0) break
    all.push(...r.documents)
    total = r.total ?? all.length
    if (all.length >= total) break
    offset += r.documents.length
  }
  return { documents: all, total: all.length } as { documents: any[]; total: number }
}

export async function dbGet(e: EnvVars, collection: string, docId: string) {
  const res = await fetch(`${BASE(e)}/collections/${collection}/documents/${docId}`, { headers: HEADERS(e) })
  if (!res.ok) throw Object.assign(new Error('not found'), { status: res.status })
  return res.json() as Promise<any>
}

export async function dbCreate(e: EnvVars, collection: string, data: any) {
  const res = await fetch(`${BASE(e)}/collections/${collection}/documents`, {
    method: 'POST', headers: HEADERS(e),
    body: JSON.stringify({ documentId: ID.unique(), data }),
  })
  return res.json() as Promise<any>
}

export async function dbUpdate(e: EnvVars, collection: string, docId: string, data: any) {
  const res = await fetch(`${BASE(e)}/collections/${collection}/documents/${docId}`, {
    method: 'PATCH', headers: HEADERS(e),
    body: JSON.stringify({ data }),
  })
  if (!res.ok) {
    const err: any = await res.json().catch(() => ({}))
    throw Object.assign(new Error(err?.message ?? 'update failed'), { status: res.status, detail: err })
  }
  return res.json() as Promise<any>
}

export async function dbDelete(e: EnvVars, collection: string, docId: string) {
  await fetch(`${BASE(e)}/collections/${collection}/documents/${docId}`, { method: 'DELETE', headers: HEADERS(e) })
}

export async function getProfile(e: EnvVars, userId: string) {
  const r = await dbList(e, e.appwriteCollectionProfiles, [['userId', userId]])
  return r.documents[0] ?? null
}

export { ID }
