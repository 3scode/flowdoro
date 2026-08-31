import { Elysia } from 'elysia'
import { jwtVerify, SignJWT } from 'jose'
import { env } from '../config/env'

const secret = new TextEncoder().encode(env.jwtSecret)

export async function signToken(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(env.jwtExpiresIn)
    .sign(secret)
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret)
  return payload as { id: string; email: string }
}

export const authGuard = new Elysia()
  .derive(async ({ cookie, headers, set }) => {
    const token = (cookie as any)?.token?.value ?? headers['authorization']?.replace('Bearer ', '')
    if (!token) {
      set.status = 401
      throw new Error('UNAUTHORIZED')
    }
    try {
      const payload = await verifyToken(token)
      return { user: payload }
    } catch {
      set.status = 401
      throw new Error('UNAUTHORIZED')
    }
  })
