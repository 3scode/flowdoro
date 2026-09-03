import 'dotenv/config'

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  appUrl: process.env.APP_URL ?? 'http://localhost:5173',
  apiUrl: process.env.API_URL ?? 'http://localhost:3000',
  restRatioDefault: Number(process.env.REST_RATIO_DEFAULT ?? 5),
  resendApiKey: process.env.RESEND_API_KEY ?? '',
  logLevel: process.env.LOG_LEVEL ?? 'info',
  // Appwrite Cloud
  appwriteEndpoint: process.env.APPWRITE_ENDPOINT ?? 'https://cloud.appwrite.io/v1',
  appwriteProjectId: process.env.APPWRITE_PROJECT_ID ?? '',
  appwriteApiKey: process.env.APPWRITE_API_KEY ?? '',
  appwriteDatabaseId: process.env.APPWRITE_DATABASE_ID ?? 'flowdoro',
  appwriteCollectionProfiles: process.env.APPWRITE_COLLECTION_PROFILES ?? 'profiles',
  appwriteCollectionTasks: process.env.APPWRITE_COLLECTION_TASKS ?? 'tasks',
  appwriteCollectionSessions: process.env.APPWRITE_COLLECTION_SESSIONS ?? 'sessions',
  appwriteCollectionEvents: process.env.APPWRITE_COLLECTION_EVENTS ?? 'session_events',
  appwriteCollectionGoogleTokens: process.env.APPWRITE_COLLECTION_GOOGLE_TOKENS ?? 'google_tokens',
  appwriteCollectionLists: process.env.APPWRITE_COLLECTION_LISTS ?? 'lists',
  appwriteBucketAvatars: process.env.APPWRITE_BUCKET_AVATARS ?? 'avatars',
  // Google Calendar (free tier)
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI ?? '',
  googleTokenEncryptionKey: process.env.GOOGLE_TOKEN_ENCRYPTION_KEY ?? '',
} as const
