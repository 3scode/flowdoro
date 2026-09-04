<script lang="ts">
  import { auth } from '$lib/stores/auth'
  import { toast } from '$lib/stores/toast'
  let { onNavigate } = $props<{ onNavigate: (p: string) => void }>()
  let email = $state('')
  let error = $state('')
  let loading = $state(false)
  let success = $state(false)
  let cooldown = $state(0)
  let cooldownTimer: any = null

  function startCooldown() {
    cooldown = 30
    if (cooldownTimer) clearInterval(cooldownTimer)
    cooldownTimer = setInterval(() => {
      cooldown -= 1
      if (cooldown <= 0) { clearInterval(cooldownTimer); cooldownTimer = null }
    }, 1000)
  }

  async function submit(e: Event) {
    e.preventDefault()
    if (!email) { error = 'Email required'; return }
    error = ''; loading = true
    try {
      await auth.requestPasswordReset(email.trim().toLowerCase())
      success = true
      toast.success('Check your email — reset link sent!')
      startCooldown()
    } catch (err: any) {
      // anti-enumeration: Better Auth returns success even if email not found, but handle errors anyway
      error = err.message ?? 'Failed to send reset email'
      toast.error(error)
    } finally { loading = false }
  }
</script>

<div class="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-8 md:py-12" style="padding-top: max(2rem, env(safe-area-inset-top)); padding-bottom: max(2rem, env(safe-area-inset-bottom));">
  <h1 class="text-2xl font-bold text-primary mb-2 text-balance break-words">◉ Flowdoro</h1>
  <p class="text-sm leading-relaxed text-text-secondary mb-6 md:mb-8 text-balance break-words">Reset your password</p>
  <form onsubmit={submit} class="w-full max-w-sm rounded-2xl border border-border bg-surface p-5 md:p-6 flex flex-col gap-4 shadow-sm">
    {#if error}<div class="w-full text-sm leading-relaxed text-error bg-error/10 border border-error/20 rounded-xl px-3 py-3 break-words">{error}</div>{/if}
    {#if success}
      <div class="w-full text-sm leading-relaxed text-success bg-success/10 border border-success/20 rounded-xl px-3 py-3 break-words">
        If an account exists for <span class="font-medium">{email}</span>, we sent a reset link. Check your inbox (and spam). Link valid 24h, once only.
      </div>
    {/if}
    <p class="text-sm leading-relaxed text-text-secondary break-words">Enter your email and we'll send you a link to reset your password.</p>
    <label class="flex flex-col gap-1.5">
      <span class="text-sm font-medium text-text-secondary break-words">Email</span>
      <input bind:value={email} type="email" required placeholder="you@example.com" autocomplete="email" inputmode="email" enterkeyhint="done" class="h-11 min-h-11 rounded-xl border border-border bg-surface px-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-[16px] md:text-sm" />
    </label>
    <button type="submit" disabled={loading || (!success && !email) || cooldown > 0} class="h-11 min-h-11 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 active:scale-[0.98] transition">
      {#if loading}Sending…{:else if success && cooldown > 0}Resend in {cooldown}s{:else if success}Resend link{:else}Send reset link{/if}
    </button>
    {#if success}
      <p class="text-xs text-text-secondary text-center leading-relaxed">Didn't get it? Check spam or wait {cooldown > 0 ? `${cooldown}s to resend` : 'and resend'}.</p>
    {/if}
    <div class="flex items-center gap-2 justify-center pt-1">
      <button type="button" class="text-sm font-medium text-primary hover:underline min-h-8 px-2" onclick={() => onNavigate('/login')}>Back to Log In</button>
      <span class="text-text-secondary text-xs">·</span>
      <button type="button" class="text-sm font-medium text-text-secondary hover:text-primary min-h-8 px-2" onclick={() => onNavigate('/register')}>Create account</button>
    </div>
  </form>
</div>
