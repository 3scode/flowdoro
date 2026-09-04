# BA-05: Sosial OAuth UI (Google + GitHub)

**ID:** BA-05
**Tech Spec:** §4, §5
**Prioritas:** 🟡 Mid
**Effort:** S
**Dep:** BA-04
**Status:** Pending

### Tujuan
Tambah tombol sosial di Login/Register sesuai `DESIGN.md:433`.

### File
- `apps/web/src/lib/pages/Login.svelte:1`
- `apps/web/src/lib/pages/Register.svelte:1`
- `apps/api-cloudflare/src/lib/auth.ts` (socialProviders sudah)
- Google Cloud Console + GitHub OAuth App

### Checklist
- [ ] `auth.ts` `socialProviders.google` + `github` sudah terisi dari `env.GOOGLE_*` + `env.GITHUB_*`
- [ ] `Login.svelte` tambah divider "or continue with" + 2 button: `on:click={async () => await authClient.signIn.social({provider:'google', callbackURL:'/dashboard'})}` + github
- [ ] `Register.svelte` sama + `provider` sama
- [ ] Buat GitHub OAuth App (homepage `https://flowdoro.pages.dev`, callback `https://flowdoro-api.email-trisno-sanjaya.workers.dev/api/auth/callback/github`)
- [ ] Update Google OAuth redirect di Console tambah `.../api/auth/callback/google` (jangan hapus lama calendar)
- [ ] Handle `callbackURL` redirect di `App.svelte` (sudah ada `navigate` logic)
- [ ] Styling pakai `lucide-svelte` icons, Tailwind 4, dark mode

### Acceptance
- [ ] Klik Google → redirect Google → balik `/dashboard` dengan session
- [ ] Klik GitHub → sama
- [ ] User baru via social otomatis buat Appwrite `profiles` doc via hook
- [ ] Login error tampil inline (sama kayak email/pass)
