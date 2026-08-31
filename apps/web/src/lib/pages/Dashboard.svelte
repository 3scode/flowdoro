<script lang="ts">
  import { onMount } from 'svelte'
  import { api } from '$lib/api/client'
  import { formatDuration } from '$lib/utils/time'

  let { onNavigate } = $props<{ onNavigate: (p: string) => void }>()
  let summary: any = $state(null)
  let recent: any[] = $state([])
  let loading = $state(true)

  onMount(async () => {
    try {
      const [s, r] = await Promise.all([
        api.get('/api/analytics/summary').catch(() => ({ data: { todayFocus: 0, totalFocus: 0, streak: 0, totalSessions: 0 } })),
        api.get('/api/sessions?limit=5').catch(() => ({ data: [] })),
      ])
      summary = s.data
      recent = r.data ?? []
    } finally { loading = false }
  })
</script>

<div class="max-w-5xl mx-auto px-4 py-6 pb-20 md:pb-6 flex flex-col gap-6">
  <h1 class="text-2xl font-bold">Dashboard</h1>
  {#if loading}
    <div class="grid grid-cols-3 gap-4">
      {#each [1,2,3] as _}<div class="h-24 rounded-lg skeleton"></div>{/each}
    </div>
  {:else if !summary || summary.totalSessions === 0}
    <div class="rounded-xl border border-dashed border-border bg-surface p-12 text-center flex flex-col items-center gap-3">
      <span class="text-4xl">⏱</span>
      <h3 class="font-semibold">Ready to focus?</h3>
      <p class="text-sm text-text-secondary">Start your first focus session. Work as long as you need.</p>
      <button class="px-6 py-2 rounded-md bg-primary text-white text-sm font-semibold" onclick={() => onNavigate('/focus')}>Start Focusing</button>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="rounded-lg border border-border bg-surface p-4">
        <p class="text-sm text-text-secondary">Today's Focus</p>
        <p class="text-2xl font-bold mt-1">{formatDuration(summary.todayFocus)}</p>
      </div>
      <div class="rounded-lg border border-border bg-surface p-4">
        <p class="text-sm text-text-secondary">Total Focus</p>
        <p class="text-2xl font-bold mt-1">{formatDuration(summary.totalFocus)}</p>
      </div>
      <div class="rounded-lg border border-border bg-surface p-4 flex items-center justify-between">
        <div><p class="text-sm text-text-secondary">Streak</p><p class="text-2xl font-bold mt-1">{summary.streak} days</p></div>
        <span class="text-2xl">🔥</span>
      </div>
    </div>
    <button class="w-full py-3 rounded-lg bg-primary text-white font-semibold flex items-center justify-center gap-2" onclick={() => onNavigate('/focus')}>▶ Start Focusing</button>
    <div class="rounded-lg border border-border bg-surface p-4">
      <h3 class="font-semibold mb-3">Recent Sessions</h3>
      {#if recent.length === 0}
        <p class="text-sm text-text-secondary">No sessions yet today.</p>
      {:else}
        <div class="flex flex-col gap-2">
          {#each recent as s}
            <div class="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              <span>{formatDuration(s.durationSeconds)} · Rest {formatDuration(s.restEarnedSeconds)}</span>
              <span class="text-text-secondary">{new Date(s.startedAt).toLocaleTimeString()}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>
