<script lang="ts">
  import { auth } from '$lib/stores/auth'
  let { onNavigate } = $props<{ onNavigate: (p: string) => void }>()
  let name = $state(''), email = $state(''), password = $state('')
  let error = $state(''), loading = $state(false)
  let strength = $derived(password.length < 6 ? 'weak' : password.length < 10 ? 'medium' : 'strong')
  async function submit(e: Event) {
    e.preventDefault(); error=''; loading=true
    try { await auth.register(name, email, password); onNavigate('/dashboard') }
    catch (err: any) { error = err.message ?? 'Registration failed' }
    finally { loading=false }
  }
</script>

<div class="min-h-screen flex flex-col items-center justify-center px-4 py-12">
  <h1 class="text-2xl font-bold text-primary mb-2">◉ Flowdoro</h1>
  <p class="text-sm text-text-secondary mb-8">Create your account</p>
  <form onsubmit={submit} class="w-full max-w-sm rounded-xl border border-border bg-surface p-6 flex flex-col gap-4 shadow-sm">
    {#if error}<div class="text-sm text-error bg-error/10 border border-error/20 rounded-md px-3 py-2">{error}</div>{/if}
    <label class="flex flex-col gap-1.5">
      <span class="text-sm font-medium text-text-secondary">Full Name</span>
      <input bind:value={name} required placeholder="John Doe" class="h-11 rounded-md border border-border bg-surface px-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </label>
    <label class="flex flex-col gap-1.5">
      <span class="text-sm font-medium text-text-secondary">Email</span>
      <input bind:value={email} type="email" required placeholder="you@example.com" class="h-11 rounded-md border border-border bg-surface px-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </label>
    <label class="flex flex-col gap-1.5">
      <span class="text-sm font-medium text-text-secondary">Password</span>
      <input bind:value={password} type="password" required placeholder="••••••••" class="h-11 rounded-md border border-border bg-surface px-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
      {#if password}<div class="h-1 rounded-full bg-border overflow-hidden"><div class="h-full transition-all" class:bg-error={strength==='weak'} class:bg-warning={strength==='medium'} class:bg-success={strength==='strong'} style="width: {strength==='weak' ? '33%' : strength==='medium' ? '66%' : '100%'}"></div></div>{/if}
    </label>
    <button type="submit" disabled={loading} class="h-11 rounded-md bg-primary text-white font-semibold disabled:opacity-50">
      {#if loading}Loading…{:else}Create Account{/if}
    </button>
    <p class="text-sm text-center text-text-secondary">Already have an account? <button type="button" class="text-primary font-medium" onclick={() => onNavigate('/login')}>Log In</button></p>
  </form>
</div>
