# BA-01: Infra D1 + Secrets + Env

**ID:** BA-01
**Tech Spec:** `.agents/tech-specs/2026/BETTER-AUTH-D1.md` §5, §7
**Prioritas:** 🔴 High
**Effort:** M
**Dep:** —
**Status:** Pending

### Tujuan
Siapkan Cloudflare D1 binding untuk Better Auth tanpa nambah biaya.

### File
- `apps/api-cloudflare/wrangler.toml:1`
- `apps/api-cloudflare/src/lib/env.ts:7`
- `.env.example:1`
- `.dev.vars` (copy dari .env)

### Checklist
- [ ] `bunx wrangler d1 create flowdoro-auth` (local + remote) → catat `database_id`
- [ ] `wrangler.toml` tambah `[[d1_databases]] binding="DB" database_name="flowdoro-auth" database_id="..."`
- [ ] `env.ts` tambah `betterAuthSecret`, `betterAuthUrl`, `githubClientId/Secret`, `db` passthrough
- [ ] `.env.example` tambah `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GITHUB_CLIENT_ID/SECRET`, `D1_DATABASE_ID`
- [ ] `wrangler secret put BETTER_AUTH_SECRET` (local `.dev.vars` isi dummy `openssl rand -hex 32`)
- [ ] `wrangler secret put GITHUB_CLIENT_ID/SECRET` placeholder
- [ ] Update `BETTER_AUTH_URL` ke `https://flowdoro-api.email-trisno-sanjaya.workers.dev` di prod vars, `http://localhost:8787` di dev
- [ ] `GOOGLE_REDIRECT_URI` split: `BETTER_AUTH` pakai `/api/auth/callback/google`, Calendar tetap `/api/google/callback`

### Acceptance
- [ ] `wrangler d1 execute flowdoro-auth --local --command "SELECT 1"` sukses
- [ ] `bun run --cwd apps/api-cloudflare typecheck` lolos dengan `env.DB: D1Database`
- [ ] `.env.example` lengkap, tidak bocor secret

### Referensi
- Better Auth D1 docs: `betterAuth({database: env.DB})` tanpa adapter
