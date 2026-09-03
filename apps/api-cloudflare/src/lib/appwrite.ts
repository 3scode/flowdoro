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
  appwriteBucketAvatars: string
}

const HEADERS = (e: EnvVars) => ({
  'content-type': 'application/json',
  'x-appwrite-project': e.appwriteProjectId,
  'x-appwrite-key': e.appwriteApiKey,
})
const BASE = (e: EnvVars) => `${e.appwriteEndpoint}/databases/${e.appwriteDatabaseId}`

// Build queries array as JSON strings (Appwrite REST API format)
function buildQueries(queries: [string, string | number, string?][]) {
  return queries.map(([attr, val, type = 'string'], i) => {
    const method = type === 'number' ? 'equal' : 'equal'
    const json = JSON.stringify({ method, attribute: attr, values: [String(val)] })
    return `queries[${i}]=${encodeURIComponent(json)}`
  }).join('&')
}

export async function dbList(e: EnvVars, collection: string, queries: [string, string | number][] = [], limit = 100, offset = 0) {
  const qs = queries.length ? buildQueries(queries.map(([a, v]) => [a, v, 'string'] as [string, string | number, string])) : ''
  const limitQs = `limit=${limit}&offset=${offset}`
  const res = await fetch(`${BASE(e)}/collections/${collection}/documents${qs ? '?' + qs + '&' : '?'}${limitQs}`, { headers: HEADERS(e) })
  return res.json() as Promise<{ documents: any[]; total: number }>
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
    body: JSON.stringify(data),
  })
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
