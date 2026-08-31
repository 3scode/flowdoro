import 'dotenv/config'

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://flowdoro:flowdoro@localhost:5432/flowdoro',
  databaseSsl: (process.env.DATABASE_SSL ?? 'false') === 'true',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  cookieSecure: (process.env.COOKIE_SECURE ?? 'false') === 'true',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS ?? 12),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  appUrl: process.env.APP_URL ?? 'http://localhost:5173',
  apiUrl: process.env.API_URL ?? 'http://localhost:3000',
  restRatioDefault: Number(process.env.REST_RATIO_DEFAULT ?? 5),
  resendApiKey: process.env.RESEND_API_KEY ?? '',
  r2AccountId: process.env.R2_ACCOUNT_ID ?? '',
  r2AccessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
  r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
  r2Bucket: process.env.R2_BUCKET ?? 'flowdoro-avatars',
  r2PublicUrl: process.env.R2_PUBLIC_URL ?? '',
  logLevel: process.env.LOG_LEVEL ?? 'info',
} as const
