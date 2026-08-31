<script lang="ts">
  import { onMount } from 'svelte'
  import { api } from '$lib/api/client'
  import { auth } from '$lib/stores/auth'
  let user: any = $state(null)
  let restRatio = $state(5)
  let theme = $state('system')
  let saving = $state(false)
  let msg = $state('')

  onMount(async () => {
    try { const res = await api.get('/api/me'); user = res.data; restRatio = user.restRatio ?? 5; theme = user.theme ?? 'system' } catch {}
  })

  async function save() {
    saving = true; msg = ''
    try {
      await api.patch('/api/me', { restRatio, theme })
      msg = 'Saved!'
      document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches))
      localStorage.setItem('flowdoro-theme', theme)
    } catch (e: any) { msg = e.message ?? 'Save failed' }
    finally { saving = false; setTimeout(() => (msg = ''), 2000) }
  }
</script>

<div class="w-full max-w-2xl mx-auto px-4 py-6 pb-20 md:pb-6 flex flex-col gap-6">
  <h1 class="w-full text-2xl font-bold text-balance break-words">Settings</h1>
  <section class="w-full rounded-xl border border-border bg-surface p-6 flex flex-col gap-4">
    <h2 class="w-full font-semibold text-balance break-words">Profile</h2>
    {#if user}
      <p class="w-full text-sm leading-relaxed break-words"><span class="text-text-secondary">Name:</span> {user.name}</p>
      <p class="w-full text-sm leading-relaxed break-words"><span class="text-text-secondary">Email:</span> {user.email}</p>
    {:else}<p class="w-full text-sm leading-relaxed text-text-secondary break-words">Loading…</p>{/if}
  </section>
  <section class="w-full rounded-xl border border-border bg-surface p-6 flex flex-col gap-4">
    <h2 class="w-full font-semibold text-balance break-words">Preferences</h2>
    <label class="flex items-center justify-between gap-2">
      <span class="text-sm break-words">Rest Ratio</span>
      <select bind:value={restRatio} class="h-9 rounded-md border border-border bg-surface px-3 text-sm">
        <option value={3}>1 / 3</option>
        <option value={4}>1 / 4</option>
        <option value={5}>1 / 5 (default)</option>
        <option value={6}>1 / 6</option>
      </select>
    </label>
    <p class="w-full text-xs leading-relaxed text-text-secondary break-words">Example: 30 min focus → {Math.floor(1800 / restRatio / 60)} min rest</p>
    <label class="flex items-center justify-between gap-2">
      <span class="text-sm break-words">Theme</span>
      <select bind:value={theme} class="h-9 rounded-md border border-border bg-surface px-3 text-sm">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </label>
    <button class="h-10 rounded-md bg-primary text-white font-semibold disabled:opacity-50" onclick={save} disabled={saving}>
      {#if saving}Saving…{:else}Save{/if}
    </button>
    {#if msg}<p class="w-full text-sm leading-relaxed text-success break-words">{msg}</p>{/if}
  </section>
  <section class="w-full rounded-xl border border-border bg-surface p-6">
    <h2 class="w-full font-semibold text-balance break-words">About</h2>
    <p class="w-full text-sm leading-relaxed text-text-secondary mt-1 text-balance break-words">Flowdoro v1.0.0 — Proportional rest timer.</p>
  </section>
</div>
