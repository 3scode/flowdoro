<script lang="ts">
  import { onMount } from 'svelte'
  import { api } from '$lib/api/client'
  let user: any = $state(null)
  let restRatio = $state(5)
  let theme = $state('system')
  let saving = $state(false)
  let msg = $state('')
  let googleStatus = $state<{ connected: boolean; calendarId?: string; expiresAt?: string }>({ connected: false })
  let googleLoading = $state(true)
  let googleConnecting = $state(false)

  onMount(async () => {
    try { const res = await api.get('/api/me'); user = res.data; restRatio = user.restRatio ?? 5; theme = user.theme ?? 'system' } catch {}
    try {
      const res: any = await api.google.status()
      googleStatus = res.data ?? { connected: false }
    } catch { googleStatus = { connected: false } } finally { googleLoading = false }
    const params = new URLSearchParams(window.location.search)
    if (params.get('google') === 'connected') {
      try { const res: any = await api.google.status(); googleStatus = res.data } catch {}
      window.history.replaceState({}, '', '/settings')
    }
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

  async function connectGoogle() {
    googleConnecting = true
    try {
      const res: any = await api.google.connect()
      if (res.data?.url) window.location.href = res.data.url
    } catch (e: any) {
      alert(e.message ?? 'Failed to connect Google')
    } finally { googleConnecting = false }
  }

  async function disconnectGoogle() {
    try {
      await api.google.disconnect()
      googleStatus = { connected: false }
    } catch (e: any) {
      alert(e.message ?? 'Disconnect failed')
    }
  }
</script>

<div class="w-full max-w-2xl mx-auto px-4 py-6 pb-20 md:pb-6 flex flex-col gap-6">
  <h1 class="w-full text-2xl font-bold text-balance break-words">Settings</h1>
  <section class="w-full rounded-xl border border-border bg-surface p-6 flex flex-col gap-4">
    <h2 class="w-full font-semibold text-balance break-words">Profile</h2>
    {#if user}
      <p class="w-full text-sm leading-relaxed break-words"><span class="text-text-secondary">Name:</span> {user.name}</p>
      <p class="w-full text-sm leading-relaxed break-words"><span class="text-text-secondary">Email:</span> {user.email}</p>
    {:else}<p class="w-full text-sm leading-relaxed text-text-secondary break-words">Loading...</p>{/if}
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
      {#if saving}Saving...{:else}Save{/if}
    </button>
    {#if msg}<p class="w-full text-sm leading-relaxed text-success break-words">{msg}</p>{/if}
  </section>
  <section class="w-full rounded-xl border border-border bg-surface p-6 flex flex-col gap-4">
    <h2 class="w-full font-semibold text-balance break-words">Google Calendar</h2>
    {#if googleLoading}
      <p class="text-sm text-text-secondary">Checking...</p>
    {:else if googleStatus.connected}
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium">Connected</p>
          <p class="text-xs text-text-secondary mt-0.5">{googleStatus.calendarId ?? 'primary'} calendar</p>
        </div>
        <button class="px-3 py-1.5 rounded-md border border-error text-error text-sm hover:bg-error/10 transition" onclick={disconnectGoogle}>Disconnect</button>
      </div>
    {:else}
      <p class="text-sm text-text-secondary">Connect your Google account to sync tasks with Google Calendar.</p>
      <button class="self-start px-4 py-2 rounded-md bg-primary text-white text-sm font-medium disabled:opacity-50" onclick={connectGoogle} disabled={googleConnecting}>
        {#if googleConnecting}Connecting...{:else}Connect Google Calendar{/if}
      </button>
    {/if}
  </section>
  <section class="w-full rounded-xl border border-border bg-surface p-6">
    <h2 class="w-full font-semibold text-balance break-words">About</h2>
    <p class="w-full text-sm leading-relaxed text-text-secondary mt-1 text-balance break-words">Flowdoro v1.0.0 — Proportional rest timer.</p>
  </section>
</div>
