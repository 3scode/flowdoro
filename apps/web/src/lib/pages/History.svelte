<script lang="ts">
  import { onMount } from 'svelte'
  import { api } from '$lib/api/client'
  import { formatDuration } from '$lib/utils/time'
  let sessions: any[] = $state([])
  let loading = $state(true)
  let page = $state(1)
  let hasMore = $state(true)
  let filterFrom = $state('')
  let filterTo = $state('')

  async function load(reset = false) {
    if (reset) { page = 1; sessions = [] }
    loading = true
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (filterFrom) params.set('from', filterFrom)
    if (filterTo) params.set('to', filterTo)
    try {
      const res = await api.get(`/api/sessions?${params}`)
      const list = res.data ?? []
      sessions = reset ? list : [...sessions, ...list]
      hasMore = list.length === 20
    } catch { hasMore = false } finally { loading = false }
  }
  onMount(() => load(true))
  function groupByDate(list: any[]) {
    const groups: Record<string, any[]> = {}
    for (const s of list) {
      const d = new Date(s.startedAt).toISOString().slice(0,10)
      const label = d === new Date().toISOString().slice(0,10) ? 'Today' : d
      ;(groups[label] ??= []).push(s)
    }
    return Object.entries(groups)
  }
</script>

<div class="max-w-3xl mx-auto px-4 py-6 pb-20 md:pb-6 flex flex-col gap-4">
  <h1 class="text-2xl font-bold">History</h1>
  <div class="flex gap-2">
    <input type="date" bind:value={filterFrom} class="h-9 rounded-md border border-border px-3 text-sm" />
    <input type="date" bind:value={filterTo} class="h-9 rounded-md border border-border px-3 text-sm" />
    <button class="px-4 py-2 rounded-md bg-primary text-white text-sm" onclick={() => load(true)}>Filter</button>
    <button class="px-4 py-2 rounded-md border border-border text-sm" onclick={() => { filterFrom=''; filterTo=''; load(true)}}>Clear</button>
  </div>
  {#if loading && sessions.length === 0}
    {#each [1,2,3,4] as _}<div class="h-16 rounded-lg skeleton"></div>{/each}
  {:else if sessions.length === 0}
    <div class="rounded-xl border border-dashed bg-surface p-12 text-center">
      <p class="font-semibold">No sessions yet</p>
      <p class="text-sm text-text-secondary">Your history will appear here.</p>
    </div>
  {:else}
    {#each groupByDate(sessions) as [date, list]}
      <p class="text-xs font-semibold text-text-secondary mt-2">{date}</p>
      {#each list as s}
        <div class="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3">
          <span class="text-sm font-medium">{formatDuration(s.durationSeconds)} · Rest {formatDuration(s.restEarnedSeconds)}</span>
          <span class="text-xs text-text-secondary">{new Date(s.startedAt).toLocaleTimeString()}</span>
        </div>
      {/each}
    {/each}
    {#if hasMore}<button class="mx-auto px-6 py-2 rounded-md border border-border text-sm" onclick={() => { page++; load() }}>Load More</button>{/if}
  {/if}
</div>
