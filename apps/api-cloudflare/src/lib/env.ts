// In Cloudflare Workers with nodejs_compat, env vars are on c.env, NOT process.env
// This module provides helpers to extract them from the Hono context
export function getBindings(c: any) {
  return c.env
}

export function getEnvFromContext(c: any) {
  const e = c.env
  return {
    nodeEnv: e.NODE_ENV ?? 'development',
    appUrl: e.APP_URL ?? 'https://flowdoro.3scode.my.id',
    corsOrigin: e.CORS_ORIGIN ?? 'https://flowdoro.3scode.my.id',
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
    appwriteCollectionGoogleTokens: e.APPWRITE_COLLECTION_GOOGLE_TOKENS ?? 'google_tokens',
    appwriteBucketAvatars: e.APPWRITE_BUCKET_AVATARS ?? 'avatars',
    googleClientId: e.GOOGLE_CLIENT_ID ?? '',
    googleClientSecret: e.GOOGLE_CLIENT_SECRET ?? '',
    googleRedirectUri: (e.GOOGLE_REDIRECT_URI ?? 'https://api.flowdoro.3scode.my.id/api/google/callback').replace(/\/$/, ''),
    googleTokenEncryptionKey: e.GOOGLE_TOKEN_ENCRYPTION_KEY ?? '00000000000000000000000000000000',
    betterAuthSecret: e.BETTER_AUTH_SECRET ?? '',
    betterAuthUrl: (e.BETTER_AUTH_URL ?? e.APP_URL ?? 'http://localhost:8787').replace(/\/$/, ''),
    resendApiKey: e.RESEND_API_KEY ?? '',
    resendFromEmail: e.RESEND_FROM_EMAIL ?? 'Flowdoro <noreply@flowdoro.3scode.my.id>',
    frontendUrl: (e.FRONTEND_URL ?? e.APP_URL ?? 'https://flowdoro.3scode.my.id').replace(/\/$/, ''),
    githubClientId: e.GITHUB_CLIENT_ID ?? '',
    githubClientSecret: e.GITHUB_CLIENT_SECRET ?? '',
    // D1 binding is available as e.DB (D1Database) — not a string, passed directly to Better Auth
    DB: e.DB as D1Database | undefined,
  }
}
