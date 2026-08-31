<script lang="ts">
  import { onMount } from 'svelte'
  import { api } from '$lib/api/client'
  import { formatDuration } from '$lib/utils/time'
  let period = $state('week')
  let summary: any = $state(null)
  let history: any[] = $state([])
  let loading = $state(true)

  async function load() {
    loading = true
    try {
      const [s, h] = await Promise.all([
        api.get('/api/analytics/summary').catch(() => ({ data: null })),
        api.get(`/api/analytics/history?period=${period}`).catch(() => ({ data: [] })),
      ])
      summary = s.data; history = h.data ?? []
    } finally { loading = false }
  }
  onMount(load)
  $effect(() => { period; load() })
</script>

<div class="max-w-5xl mx-auto px-4 py-6 pb-20 md:pb-6 flex flex-col gap-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Analytics</h1>
    <div class="flex rounded-md border border-border overflow-hidden">
      {#each ['day','week','month'] as p}
        <button class="px-3 py-1.5 text-sm capitalize" class:bg-primary={period===p} class:text-white={period===p} onclick={() => period = p}>{p}</button>
      {/each}
    </div>
  </div>
  {#if loading}<div class="h-64 rounded-lg skeleton"></div>
  {:else if !summary}
    <div class="rounded-xl border border-dashed bg-surface p-12 text-center">
      <p class="font-semibold">Building your insights</p>
      <p class="text-sm text-text-secondary">Complete a few more sessions.</p>
    </div>
  {:else}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="rounded-lg border bg-surface p-4"><p class="text-xs text-text-secondary">Avg Focus</p><p class="text-xl font-bold">{formatDuration(summary.avgFocus)}</p></div>
      <div class="rounded-lg border bg-surface p-4"><p class="text-xs text-text-secondary">Total Focus</p><p class="text-xl font-bold">{formatDuration(summary.totalFocus)}</p></div>
      <div class="rounded-lg border bg-surface p-4"><p class="text-xs text-text-secondary">Best Day</p><p class="text-xl font-bold">{summary.bestDay ? formatDuration(summary.bestDay.value) : '—'}</p></div>
      <div class="rounded-lg border bg-surface p-4"><p class="text-xs text-text-secondary">Longest</p><p class="text-xl font-bold">{formatDuration(summary.longestSession)}</p></div>
    </div>
    <div class="rounded-lg border bg-surface p-4">
      <h3 class="font-semibold mb-3">Focus Trend</h3>
      {#if history.length === 0}<p class="text-sm text-text-secondary">No data for this period.</p>
      {:else}
        <div class="flex items-end gap-1 h-32">
          {#each history as pt}
            {@const max = Math.max(...history.map((p) => p.seconds), 1)}
            <div class="flex-1 flex flex-col items-center gap-1">
              <div class="w-full rounded-t bg-primary" style="height: {(pt.seconds / max) * 100}% ; min-height: 4px"></div>
              <span class="text-[10px] text-text-secondary">{pt.date.slice(5)}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>
