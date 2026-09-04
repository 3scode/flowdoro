function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  return bytes
}
function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
}
function base64UrlEncode(bytes: Uint8Array): string {
  let bin = ''
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}
async function getKey(hexKey: string): Promise<CryptoKey> {
  const raw = hexToBytes(hexKey)
  return crypto.subtle.importKey('raw', raw as any, { name: 'AES-GCM' } as any, false, ['encrypt', 'decrypt'])
}
function getHexKey(e: any): string {
  return e.googleTokenEncryptionKey ?? e.GOOGLE_TOKEN_ENCRYPTION_KEY ?? '00000000000000000000000000000000'
}

export async function encrypt(plaintext: string, e: any): Promise<string> {
  const hex = getHexKey(e)
  if (hex === '00000000000000000000000000000000') console.warn('[crypto] using default encryption key')
  const key = await getKey(hex)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const enc = new TextEncoder().encode(plaintext)
  const buf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as any }, key, enc as any)
  const combined = new Uint8Array(buf) // ciphertext + 16 tag
  const tag = combined.slice(combined.length - 16)
  const cipher = combined.slice(0, combined.length - 16)
  return `${bytesToHex(iv)}:${bytesToHex(tag)}:${bytesToHex(cipher)}`
}

export async function decrypt(ciphertext: string, e: any): Promise<string> {
  const [ivHex, tagHex, dataHex] = ciphertext.split(':')
  if (!ivHex || !tagHex || !dataHex) throw new Error('Invalid encrypted payload')
  const hex = getHexKey(e)
  const key = await getKey(hex)
  const iv = hexToBytes(ivHex)
  const tag = hexToBytes(tagHex)
  const data = hexToBytes(dataHex)
  const combined = new Uint8Array(data.length + tag.length)
  combined.set(data, 0)
  combined.set(tag, data.length)
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv as any }, key, combined as any)
  return new TextDecoder().decode(plain)
}

export function computePkceVerifier(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return base64UrlEncode(bytes)
}

export async function computePkceChallenge(verifier: string): Promise<string> {
  const enc = new TextEncoder().encode(verifier)
  const hash = await crypto.subtle.digest('SHA-256', enc)
  return base64UrlEncode(new Uint8Array(hash))
}
