<script lang="ts">
  import { onMount } from 'svelte'
  import { auth } from '$lib/stores/auth'
  import { authClient } from '$lib/auth-client'
  import { toast } from '$lib/stores/toast'
  let { onNavigate } = $props<{ onNavigate: (p: string) => void }>()
  let email = $state('')
  let password = $state('')
  let error = $state('')
  let loading = $state(false)
  let oauthLoading = $state('')

  async function submit(e: Event) {
    e.preventDefault()
    error = ''; loading = true
    try { await auth.login(email, password); onNavigate('/dashboard') }
    catch (err: any) { error = err.message ?? 'Login failed' }
    finally { loading = false }
  }

  onMount(() => {
    const p = new URLSearchParams(window.location.search)
    const err = p.get('error')
    const errDesc = p.get('error_description')
    // Better Auth appends actual error after ?error=google → ?error=state_mismatch etc, so we need last value
    const allErrors = p.getAll('error')
    const realErr = allErrors.length > 1 ? allErrors[allErrors.length - 1] : err
    if (err) {
      let msg = errDesc || ''
      if (!msg) {
        if (realErr === 'account_not_linked' || err === 'account_not_linked') msg = 'Email sudah terdaftar pakai password. Login dengan password dulu, lalu hubungkan Google di Settings → Linked Accounts. Atau pakai provider yang sama saat daftar.'
        else if (realErr === 'unable_to_link_account') msg = 'Gagal menghubungkan akun — coba login password dulu lalu link dari Settings.'
        else if (realErr === 'access_denied' || err === 'access_denied') msg = 'Google login dibatalkan (access_denied) — coba lagi dan klik Allow'
        else if (realErr === 'state_mismatch' || realErr === 'state_not_found' || realErr === 'state_invalid') msg = `State mismatch (${realErr}) — cookie diblock browser / coba incognito allow 3rd-party cookies`
        else if (realErr === 'invalid_code' || realErr === 'invalid_grant') msg = `Token exchange gagal (${realErr}) — secret/redirect_uri mismatch`
        else if (err === 'google' && realErr === 'google') msg = 'Google login cancelled or failed — lihat Details di URL sebelum wipe'
        else msg = `OAuth error: ${realErr || err}${errDesc ? ' — ' + errDesc : ''}`
      }
      error = msg
      try { toast.error(msg) } catch {}
      // keep error in URL for 3s so devtools can see, then clean
      setTimeout(() => { try { window.history.replaceState({}, '', window.location.pathname) } catch {} }, 3000)
    }
  })

  async function social(provider: 'google' | 'github') {
    error = ''; oauthLoading = provider
    try {
      const cb = `${window.location.origin}/dashboard`
      const errorCb = `${window.location.origin}/login?error=${provider}`
      await (authClient as any).signIn.social({
        provider,
        callbackURL: cb,
        errorCallbackURL: errorCb,
        newUserCallbackURL: cb,
      })
    } catch (err: any) {
      error = err.message ?? `${provider} login failed`
    } finally {
      // Better-Auth redirects on success (page unload), so this only matters on error
      // but ensure spinner doesn't stuck forever if redirect blocked
      setTimeout(() => { if (oauthLoading === provider) oauthLoading = '' }, 3000)
      // immediate clear for error case; success case page will navigate away
      if (error) oauthLoading = ''
    }
  }
</script>

<div class="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-8 md:py-12" style="padding-top: max(2rem, env(safe-area-inset-top)); padding-bottom: max(2rem, env(safe-area-inset-bottom));">
  <h1 class="text-2xl font-bold text-primary mb-2 text-balance break-words">◉ Flowdoro</h1>
  <p class="text-sm leading-relaxed text-text-secondary mb-6 md:mb-8 text-balance break-words">Welcome back</p>
  <form onsubmit={submit} class="w-full max-w-sm rounded-2xl border border-border bg-surface p-5 md:p-6 flex flex-col gap-4 shadow-sm">
    {#if error}<div class="w-full text-sm leading-relaxed text-error bg-error/10 border border-error/20 rounded-xl px-3 py-3 break-words">{error}</div>{/if}
    <label class="flex flex-col gap-1.5">
      <span class="text-sm font-medium text-text-secondary break-words">Email</span>
      <input bind:value={email} type="email" required placeholder="you@example.com" autocomplete="email" inputmode="email" enterkeyhint="next" class="h-11 min-h-11 rounded-xl border border-border bg-surface px-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-[16px] md:text-sm" />
    </label>
    <label class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between gap-2">
        <span class="text-sm font-medium text-text-secondary break-words">Password</span>
        <button type="button" class="text-xs font-medium text-primary hover:underline min-h-6 px-1 -mr-1" onclick={() => onNavigate('/forgot-password')}>Forgot password?</button>
      </div>
      <input bind:value={password} type="password" required placeholder="••••••••" autocomplete="current-password" enterkeyhint="done" class="h-11 min-h-11 rounded-xl border border-border bg-surface px-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-[16px] md:text-sm" />
    </label>
    <button type="submit" disabled={loading} class="h-11 min-h-11 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 active:scale-[0.98] transition">
      {#if loading}Loading…{:else}Log In{/if}
    </button>
    <div class="flex items-center gap-3 my-1">
      <div class="h-px flex-1 bg-border"></div>
      <span class="text-xs text-text-secondary">or continue with</span>
      <div class="h-px flex-1 bg-border"></div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <button type="button" disabled={!!oauthLoading} onclick={() => social('google')} class="h-11 min-h-11 rounded-xl border border-border bg-surface font-medium flex items-center justify-center gap-2 hover:bg-surface-elevated active:scale-95 transition disabled:opacity-50">
        <span class="w-4 h-4 rounded-full bg-primary shrink-0"></span> {oauthLoading==='google' ? '…' : 'Google'}
      </button>
      <button type="button" disabled={!!oauthLoading} onclick={() => social('github')} class="h-11 min-h-11 rounded-xl border border-border bg-surface font-medium flex items-center justify-center gap-2 hover:bg-surface-elevated active:scale-95 transition disabled:opacity-50">
        <span class="w-4 h-4 rounded-full bg-text-primary shrink-0"></span> {oauthLoading==='github' ? '…' : 'GitHub'}
      </button>
    </div>
    <p class="w-full text-sm leading-relaxed text-center text-text-secondary text-balance break-words">Don't have an account? <button type="button" class="text-primary font-medium" onclick={() => onNavigate('/register')}>Sign Up</button></p>
  </form>
</div>
