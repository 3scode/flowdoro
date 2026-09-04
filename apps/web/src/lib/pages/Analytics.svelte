<script lang="ts">
  import { onMount } from 'svelte'
  import { api } from '$lib/api/client'
  import { formatDuration } from '$lib/utils/time'
  import Skeleton from '$lib/components/ui/Skeleton.svelte'
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

<div class="w-full max-w-5xl mx-auto px-4 py-6 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-6 flex flex-col gap-5 md:gap-6">
  <div class="flex flex-col sm:flex-row sm:items-center gap-3">
    <h1 class="text-[22px] md:text-2xl font-bold text-balance break-words">Analytics</h1>
    <div class="flex gap-1 p-1 bg-surface-elevated rounded-full w-fit" role="group" aria-label="Time period">
      {#each ['day','week','month'] as p}
        <button
          class="px-4 py-2 text-sm capitalize rounded-full transition-all duration-150 min-h-9 font-medium"
          class:bg-primary={period===p}
          class:text-white={period===p}
          class:shadow-sm={period===p}
          class:bg-transparent={period!==p}
          class:text-text-secondary={period!==p}
          class:hover:bg-surface={period!==p}
          aria-pressed={period===p}
          onclick={() => period = p}>{p}</button>
      {/each}
    </div>
  </div>
  {#if loading}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {#each [1,2,3,4] as _}<Skeleton class="h-24 rounded-xl" />{/each}
    </div>
    <div class="rounded-xl border border-border bg-surface p-4 flex flex-col gap-3">
      <Skeleton class="h-6 w-32 rounded-md" />
      <div class="flex items-end gap-1 h-36">
        {#each [40, 70, 55, 85, 60, 30, 65] as h}
          <Skeleton class="flex-1 rounded-t" style="height: {h}%" />
        {/each}
      </div>
    </div>
  {:else if !summary}
    <div class="w-full rounded-2xl border border-dashed border-border bg-surface p-8 md:p-12 text-center">
      <p class="w-full font-semibold text-balance break-words">Building your insights</p>
      <p class="w-full text-sm leading-relaxed text-text-secondary text-balance break-words">Complete a few more sessions.</p>
    </div>
  {:else}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <div class="rounded-xl border border-border bg-surface p-3.5 md:p-4"><p class="text-xs leading-relaxed text-text-secondary break-words">Avg Focus</p><p class="text-lg md:text-xl font-bold break-words">{formatDuration(summary.avgFocus)}</p></div>
      <div class="rounded-xl border border-border bg-surface p-3.5 md:p-4"><p class="text-xs leading-relaxed text-text-secondary break-words">Total Focus</p><p class="text-lg md:text-xl font-bold break-words">{formatDuration(summary.totalFocus)}</p></div>
      <div class="rounded-xl border border-border bg-surface p-3.5 md:p-4"><p class="text-xs leading-relaxed text-text-secondary break-words">Best Day</p><p class="text-lg md:text-xl font-bold break-words">{summary.bestDay ? formatDuration(summary.bestDay.value) : '—'}</p></div>
      <div class="rounded-xl border border-border bg-surface p-3.5 md:p-4"><p class="text-xs leading-relaxed text-text-secondary break-words">Longest</p><p class="text-lg md:text-xl font-bold break-words">{formatDuration(summary.longestSession)}</p></div>
    </div>
    <div class="rounded-xl border border-border bg-surface p-4">
      <h3 class="w-full font-semibold mb-3 text-balance break-words">Focus Trend</h3>
      {#if history.length === 0}<p class="w-full text-sm leading-relaxed text-text-secondary text-balance break-words">No data for this period.</p>
      {:else}
        <div class="flex items-end gap-1 h-36 md:h-32 overflow-x-auto scrollbar-none pb-2">
          {#each history as pt}
            {@const max = Math.max(...history.map((p) => p.seconds), 1)}
            <div class="flex-1 flex flex-col items-center gap-1">
              <div class="w-full rounded-t bg-primary" style="height: {(pt.seconds / max) * 100}% ; min-height: 4px"></div>
              <span class="text-[10px] leading-relaxed text-text-secondary break-words">{pt.date.slice(5)}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>
