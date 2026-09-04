<script lang="ts">
  import { onMount } from 'svelte'
  import { api } from '$lib/api/client'
  import { formatDuration } from '$lib/utils/time'
  import Skeleton from '$lib/components/ui/Skeleton.svelte'
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

<div class="w-full max-w-3xl mx-auto px-4 py-6 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-6 flex flex-col gap-4">
  <h1 class="w-full text-[22px] md:text-2xl font-bold text-balance break-words">History</h1>
  <div class="flex flex-col sm:flex-row gap-2">
    <div class="flex gap-2 flex-1">
      <input type="date" bind:value={filterFrom} class="flex-1 min-w-0 h-11 rounded-xl border border-border bg-surface px-3 text-sm md:text-sm" />
      <input type="date" bind:value={filterTo} class="flex-1 min-w-0 h-11 rounded-xl border border-border bg-surface px-3 text-sm md:text-sm" />
    </div>
    <div class="flex gap-2">
      <button class="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium min-h-11 active:scale-95 transition" onclick={() => load(true)}>Filter</button>
      <button class="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-border bg-surface text-sm font-medium min-h-11 active:scale-95 transition" onclick={() => { filterFrom=''; filterTo=''; load(true)}}>Clear</button>
    </div>
  </div>
  {#if loading && sessions.length === 0}
    {#each [1,2,3,4] as _}<Skeleton class="h-16 rounded-xl" />{/each}
  {:else if sessions.length === 0}
    <div class="w-full rounded-2xl border border-dashed border-border bg-surface p-8 md:p-12 text-center">
      <p class="w-full font-semibold text-balance break-words">No sessions yet</p>
      <p class="w-full text-sm leading-relaxed text-text-secondary text-balance break-words">Your history will appear here.</p>
    </div>
  {:else}
    {#each groupByDate(sessions) as [date, list]}
      <p class="w-full text-xs font-semibold text-text-secondary mt-3 break-words tracking-wide uppercase">{date}</p>
      {#each list as s}
        <div class="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface px-4 py-3.5 min-h-14">
          <span class="text-sm font-medium break-words">{formatDuration(s.durationSeconds)} · Rest {formatDuration(s.restEarnedSeconds)}</span>
          <span class="text-xs text-text-secondary break-words shrink-0">{new Date(s.startedAt).toLocaleTimeString()}</span>
        </div>
      {/each}
    {/each}
    {#if hasMore}
      <button class="mx-auto px-6 py-3 rounded-xl border border-border bg-surface text-sm font-medium min-h-11 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50" disabled={loading} onclick={() => { page++; load() }}>
        {#if loading}<span class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span> Loading…{:else}Load More{/if}
      </button>
    {/if}
    {#if loading && sessions.length > 0}
      <div class="flex flex-col gap-2">
        {#each [1,2] as _}<Skeleton class="h-16 rounded-xl" />{/each}
      </div>
    {/if}
  {/if}
</div>
