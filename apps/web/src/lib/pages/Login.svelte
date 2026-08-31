<script lang="ts">
  import { auth } from '$lib/stores/auth'
  let { onNavigate } = $props<{ onNavigate: (p: string) => void }>()
  let email = $state('')
  let password = $state('')
  let error = $state('')
  let loading = $state(false)

  async function submit(e: Event) {
    e.preventDefault()
    error = ''; loading = true
    try { await auth.login(email, password); onNavigate('/dashboard') }
    catch (err: any) { error = err.message ?? 'Login failed' }
    finally { loading = false }
  }
</script>

<div class="min-h-screen flex flex-col items-center justify-center px-4 py-12">
  <h1 class="text-2xl font-bold text-primary mb-2 text-balance break-words">◉ Flowdoro</h1>
  <p class="text-sm leading-relaxed text-text-secondary mb-8 text-balance break-words">Welcome back</p>
  <form onsubmit={submit} class="w-full max-w-sm rounded-xl border border-border bg-surface p-6 flex flex-col gap-4 shadow-sm">
    {#if error}<div class="w-full text-sm leading-relaxed text-error bg-error/10 border border-error/20 rounded-md px-3 py-2 break-words">{error}</div>{/if}
    <label class="flex flex-col gap-1.5">
      <span class="text-sm font-medium text-text-secondary break-words">Email</span>
      <input bind:value={email} type="email" required placeholder="you@example.com" class="h-11 rounded-md border border-border bg-surface px-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </label>
    <label class="flex flex-col gap-1.5">
      <span class="text-sm font-medium text-text-secondary break-words">Password</span>
      <input bind:value={password} type="password" required placeholder="••••••••" class="h-11 rounded-md border border-border bg-surface px-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </label>
    <button type="submit" disabled={loading} class="h-11 rounded-md bg-primary text-white font-semibold disabled:opacity-50">
      {#if loading}Loading…{:else}Log In{/if}
    </button>
    <p class="w-full text-sm leading-relaxed text-center text-text-secondary text-balance break-words">Don't have an account? <button type="button" class="text-primary font-medium" onclick={() => onNavigate('/register')}>Sign Up</button></p>
  </form>
</div>
