<script lang="ts">
  import { onMount } from 'svelte'
  import { api } from '$lib/api/client'
  import { formatDuration } from '$lib/utils/time'
  import Skeleton from '$lib/components/ui/Skeleton.svelte'

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

<div class="w-full max-w-5xl mx-auto px-4 py-6 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-6 flex flex-col gap-5 md:gap-6">
  <h1 class="w-full text-[22px] md:text-2xl font-bold text-balance break-words">Dashboard</h1>
  {#if loading}
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {#each [1,2,3] as _}<Skeleton class="h-24 rounded-xl" />{/each}
    </div>
    <Skeleton class="h-12 rounded-xl w-full" />
    <div class="rounded-xl border border-border bg-surface p-4 flex flex-col gap-2">
      <Skeleton class="h-6 w-32 rounded-md mb-1" />
      {#each [1,2,3,4,5] as _}<Skeleton class="h-14 rounded-xl" />{/each}
    </div>
  {:else if !summary || summary.totalSessions === 0}
    <div class="w-full rounded-2xl border border-dashed border-border bg-surface p-8 md:p-12 text-center flex flex-col items-center gap-3">
      <span class="text-4xl">⏱</span>
      <h3 class="w-full font-semibold text-balance break-words">Ready to focus?</h3>
      <p class="w-full text-sm leading-relaxed text-text-secondary text-balance break-words px-4">Start your first focus session. Work as long as you need.</p>
      <button class="mt-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-semibold min-h-11 active:scale-95 transition shadow-sm" onclick={() => onNavigate('/focus')}>Start Focusing</button>
    </div>
  {:else}
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      <div class="rounded-xl md:rounded-lg border border-border bg-surface p-3.5 md:p-4">
        <p class="text-xs md:text-sm leading-relaxed text-text-secondary break-words">Today's Focus</p>
        <p class="text-xl md:text-2xl font-bold mt-1 break-words">{formatDuration(summary.todayFocus)}</p>
      </div>
      <div class="rounded-xl md:rounded-lg border border-border bg-surface p-3.5 md:p-4">
        <p class="text-xs md:text-sm leading-relaxed text-text-secondary break-words">Total Focus</p>
        <p class="text-xl md:text-2xl font-bold mt-1 break-words">{formatDuration(summary.totalFocus)}</p>
      </div>
      <div class="col-span-2 md:col-span-1 rounded-xl md:rounded-lg border border-border bg-surface p-3.5 md:p-4 flex items-center justify-between">
        <div><p class="text-xs md:text-sm leading-relaxed text-text-secondary break-words">Streak</p><p class="text-xl md:text-2xl font-bold mt-1 break-words">{summary.streak} days</p></div>
        <span class="text-2xl">🔥</span>
      </div>
    </div>
    <button class="w-full py-3.5 rounded-xl md:rounded-lg bg-primary text-white font-semibold flex items-center justify-center gap-2 min-h-12 active:scale-[0.98] transition shadow-sm" onclick={() => onNavigate('/focus')}>▶ Start Focusing</button>
    <div class="rounded-xl border border-border bg-surface p-4">
      <h3 class="w-full font-semibold mb-3 text-balance break-words">Recent Sessions</h3>
      {#if recent.length === 0}
        <p class="w-full text-sm leading-relaxed text-text-secondary text-balance break-words">No sessions yet today.</p>
      {:else}
        <div class="flex flex-col gap-2">
          {#each recent as s}
            <div class="flex items-center justify-between rounded-xl border border-border bg-surface-elevated/50 px-3 py-3 text-sm gap-2 min-h-11">
              <span class="break-words font-medium">{formatDuration(s.durationSeconds)} · Rest {formatDuration(s.restEarnedSeconds)}</span>
              <span class="text-text-secondary break-words shrink-0 text-xs">{new Date(s.startedAt).toLocaleTimeString()}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>
