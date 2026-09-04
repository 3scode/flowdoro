<script lang="ts">
  import { onMount } from 'svelte'
  import { auth } from '$lib/stores/auth'
  import { toast } from '$lib/stores/toast'
  let { onNavigate } = $props<{ onNavigate: (p: string) => void }>()
  let token = $state('')
  let tokenMissing = $state(false)
  let newPassword = $state('')
  let confirm = $state('')
  let error = $state('')
  let loading = $state(false)
  let strength = $derived(newPassword.length < 6 ? 'weak' : newPassword.length < 10 ? 'medium' : 'strong')

  onMount(() => {
    const params = new URLSearchParams(window.location.search)
    // Better Auth may also put token in hash fragment
    let t = params.get('token') ?? ''
    if (!t && window.location.hash) {
      try {
        const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash
        const hp = new URLSearchParams(hash)
        t = hp.get('token') ?? ''
      } catch {}
    }
    // also support ?token= inside callbackURL encoded
    if (!t) {
      try {
        const cb = params.get('callbackURL') ?? ''
        if (cb) {
          const inner = new URL(cb, window.location.origin)
          t = inner.searchParams.get('token') ?? ''
        }
      } catch {}
    }
    token = t
    if (!t) tokenMissing = true
  })

  async function submit(e: Event) {
    e.preventDefault()
    error = ''
    if (!token) { error = 'Invalid or missing reset token — request a new link.'; return }
    if (newPassword.length < 8) { error = 'Password min 8 chars'; return }
    if (newPassword !== confirm) { error = 'Passwords do not match'; return }
    loading = true
    try {
      await auth.resetPassword(token, newPassword)
      toast.success('Password reset! Please log in.')
      onNavigate('/login')
    } catch (err: any) {
      const msg = err.message ?? 'Reset failed'
      // map common Better Auth errors
      if (/invalid|expired|token/i.test(msg)) {
        error = 'Link expired or already used — request a new one.'
      } else if (/password.*short|too short/i.test(msg)) {
        error = 'Password too short — min 8 characters.'
      } else {
        error = msg
      }
      toast.error(error)
    } finally { loading = false }
  }
</script>

<div class="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-8 md:py-12" style="padding-top: max(2rem, env(safe-area-inset-top)); padding-bottom: max(2rem, env(safe-area-inset-bottom));">
  <h1 class="text-2xl font-bold text-primary mb-2 text-balance break-words">◉ Flowdoro</h1>
  <p class="text-sm leading-relaxed text-text-secondary mb-6 md:mb-8 text-balance break-words">Set new password</p>
  <form onsubmit={submit} class="w-full max-w-sm rounded-2xl border border-border bg-surface p-5 md:p-6 flex flex-col gap-4 shadow-sm">
    {#if tokenMissing}
      <div class="w-full text-sm leading-relaxed text-error bg-error/10 border border-error/20 rounded-xl px-3 py-3 break-words">Missing reset token. The link may be invalid. <button type="button" class="underline font-medium text-primary" onclick={() => onNavigate('/forgot-password')}>Request a new link</button></div>
    {/if}
    {#if error}<div class="w-full text-sm leading-relaxed text-error bg-error/10 border border-error/20 rounded-xl px-3 py-3 break-words">{error}</div>{/if}
    <label class="flex flex-col gap-1.5">
      <span class="text-sm font-medium text-text-secondary break-words">New Password</span>
      <input bind:value={newPassword} type="password" required placeholder="••••••••" autocomplete="new-password" enterkeyhint="next" class="h-11 min-h-11 rounded-xl border border-border bg-surface px-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-[16px] md:text-sm" />
      {#if newPassword}<div class="h-1 rounded-full bg-border overflow-hidden"><div class="h-full transition-all" class:bg-error={strength==='weak'} class:bg-warning={strength==='medium'} class:bg-success={strength==='strong'} style="width: {strength==='weak' ? '33%' : strength==='medium' ? '66%' : '100%'}"></div></div>
        <p class="text-xs {strength==='weak' ? 'text-error' : strength==='medium' ? 'text-warning' : 'text-success'}">{strength==='weak' ? 'Weak — add more characters' : strength==='medium' ? 'Medium — good, add symbols for strong' : 'Strong'}</p>
      {/if}
    </label>
    <label class="flex flex-col gap-1.5">
      <span class="text-sm font-medium text-text-secondary break-words">Confirm New Password</span>
      <input bind:value={confirm} type="password" required placeholder="••••••••" autocomplete="new-password" enterkeyhint="done" class="h-11 min-h-11 rounded-xl border border-border bg-surface px-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-[16px] md:text-sm {confirm && confirm !== newPassword ? 'border-error focus:border-error focus:ring-error/20' : ''}" />
      {#if confirm && confirm !== newPassword}<p class="text-xs text-error">Passwords do not match</p>{/if}
    </label>
    <p class="text-xs leading-relaxed text-text-secondary break-words">Min 8 characters. This will invalidate the reset link after use.</p>
    <button type="submit" disabled={loading || tokenMissing || !newPassword || newPassword !== confirm} class="h-11 min-h-11 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 active:scale-[0.98] transition">
      {#if loading}Resetting…{:else}Reset password{/if}
    </button>
    <div class="flex items-center gap-2 justify-center pt-1">
      <button type="button" class="text-sm font-medium text-text-secondary hover:text-primary min-h-8 px-2" onclick={() => onNavigate('/forgot-password')}>Request new link</button>
      <span class="text-text-secondary text-xs">·</span>
      <button type="button" class="text-sm font-medium text-primary hover:underline min-h-8 px-2" onclick={() => onNavigate('/login')}>Back to Log In</button>
    </div>
  </form>
</div>
