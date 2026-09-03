// In Cloudflare Workers with nodejs_compat, env vars are on c.env, NOT process.env
// This module provides helpers to extract them from the Hono context
export function getBindings(c: any) {
  return c.env
}

export function getEnvFromContext(c: any) {
  const e = c.env
  return {
    nodeEnv: e.NODE_ENV ?? 'development',
    appUrl: e.APP_URL ?? 'https://flowdoro.pages.dev',
    corsOrigin: e.CORS_ORIGIN ?? 'https://flowdoro.pages.dev',
    apiUrl: e.API_URL ?? '',
    restRatioDefault: Number(e.REST_RATIO_DEFAULT ?? 5),
    logLevel: e.LOG_LEVEL ?? 'info',
    appwriteEndpoint: e.APPWRITE_ENDPOINT ?? 'https://sgp.cloud.appwrite.io/v1',
    appwriteProjectId: e.APPWRITE_PROJECT_ID ?? '',
    appwriteApiKey: e.APPWRITE_API_KEY ?? '',
    appwriteDatabaseId: e.APPWRITE_DATABASE_ID ?? 'flowdoro',
    appwriteCollectionProfiles: e.APPWRITE_COLLECTION_PROFILES ?? 'profiles',
    appwriteCollectionTasks: e.APPWRITE_COLLECTION_TASKS ?? 'tasks',
    appwriteCollectionSessions: e.APPWRITE_COLLECTION_SESSIONS ?? 'sessions',
    appwriteCollectionEvents: e.APPWRITE_COLLECTION_EVENTS ?? 'session_events',
    appwriteCollectionLists: e.APPWRITE_COLLECTION_LISTS ?? 'lists',
    appwriteBucketAvatars: e.APPWRITE_BUCKET_AVATARS ?? 'avatars',
  }
}
