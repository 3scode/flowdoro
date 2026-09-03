import { randomBytes, createCipheriv, createDecipheriv, createHash } from 'node:crypto'
import { env } from '../config/env'

const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(env.googleTokenEncryptionKey, 'hex')

if (env.googleTokenEncryptionKey === '00000000000000000000000000000000') {
  console.warn('[crypto] using default encryption key — must override before production')
}

export function encrypt(plaintext: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALGORITHM, KEY, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
}

export function decrypt(encrypted: string): string {
  const [ivHex, tagHex, dataHex] = encrypted.split(':')
  if (!ivHex || !tagHex || !dataHex) throw new Error('Invalid encrypted payload')
  const iv = Buffer.from(ivHex, 'hex')
  const tag = Buffer.from(tagHex, 'hex')
  const data = Buffer.from(dataHex, 'hex')
  const decipher = createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(tag)
  return decipher.update(data, 'utf8') + decipher.final('utf8')
}

export function computePkceVerifier(): string {
  return randomBytes(32).toString('base64url')
}

export function computePkceChallenge(verifier: string): string {
  return createHash('sha256').update(verifier).digest('base64url')
}
