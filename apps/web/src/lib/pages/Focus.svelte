<script lang="ts">
  import { timer } from '$lib/stores/timer'
  import { formatTimer, formatDuration } from '$lib/utils/time'
  import { api } from '$lib/api/client'
  import { toast } from '$lib/stores/toast'
  import { onMount } from 'svelte'
  import { CheckSquare } from 'lucide-svelte'
  import Skeleton from '$lib/components/ui/Skeleton.svelte'

  let elapsed = $state(0)
  let state = $state('idle' as string)
  let earnedRest = $state(0)
  let breakRemaining = $state(0)
  let sessionId = $state<string | null>(null)
  let selectedTaskId = $state<string | null>(null)
  let selectedTaskTitle = $state('')
  let tasks = $state<any[]>([])
  let tasksLoading = $state(true)
  let showTaskDropdown = $state(false)
  const progress = $derived(Math.min(100, (elapsed % 300) / 300 * 100))

  timer.elapsed.subscribe((v) => (elapsed = v))
  timer.state.subscribe((v) => (state = v))
  timer.earnedRest.subscribe((v) => (earnedRest = v))
  timer.breakRemaining.subscribe((v) => (breakRemaining = v))

  onMount(async () => {
    tasksLoading = true
    try {
      const res: any = await api.tasks.list()
      const raw = (res.data ?? []) as any[]
      tasks = raw.map((t) => ({ ...t, id: t.$id ?? t.id, title: t.title ?? t.name ?? '', status: t.completedAt ? 'done' : t.status ?? 'pending' }))
      // check URL for pre-selected taskId after tasks loaded (avoid race)
      const params = new URLSearchParams(window.location.search)
      const tid = params.get('taskId')
      if (tid) {
        const found = (tasks as any[]).find((t) => t.id === tid)
        if (found) { selectedTaskId = tid; selectedTaskTitle = found.title }
      }
    } catch {} finally { tasksLoading = false }
  })

  const pendingTasks = $derived(tasks.filter((t) => t.status !== 'done' && !t.parentId))

  async function start() {
    try {
      const body: Record<string, any> = {}
      if (selectedTaskId) body.taskId = selectedTaskId
      const res: any = await api.post('/api/sessions', body)
      sessionId = res.data?.id ?? null
    } catch {}
    timer.start()
  }

  async function stop() {
    if (sessionId) {
      try { await api.patch(`/api/sessions/${sessionId}`, { status: 'completed', durationSeconds: elapsed, endedAt: new Date().toISOString() }) } catch {}
    }
    timer.stopAndBreak()
    sessionId = null
  }

  async function finish() {
    if (selectedTaskId) {
      try {
        await api.tasks.toggle(selectedTaskId)
        toast.success('Task selesai ✔')
      } catch {
        toast.error('Gagal menandai task')
      }
    }
    await stop()
  }

  function skipBreak() { timer.skipBreak() }
  function pause() { timer.pause() }
  function resume() { timer.resume() }
  function reset() { timer.reset(); sessionId = null }
</script>

<div class="w-full max-w-lg mx-auto flex flex-col items-center gap-5 md:gap-6 py-6 md:py-8 px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-8">
  <h1 class="w-full text-[clamp(1.5rem,6vw,1.5rem)] md:text-2xl font-bold text-center text-balance break-words">Focus</h1>

  {#if state === 'idle'}
    {#if tasksLoading}
      <Skeleton class="w-full h-12 rounded-xl" />
    {:else}
    <div class="w-full relative">
      <button
        type="button"
        class="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-border bg-surface text-sm hover:border-primary active:scale-[0.98] transition min-h-12"
        onclick={() => showTaskDropdown = !showTaskDropdown}
        aria-expanded={showTaskDropdown}
        aria-haspopup="listbox"
      >
        <span class="flex items-center gap-2 truncate min-w-0">
          {#if selectedTaskId}
            <CheckSquare size={16} class="text-primary shrink-0" />
            <span class="truncate font-medium">{selectedTaskTitle}</span>
          {:else}
            <span class="text-text-secondary">Select a task (optional)</span>
          {/if}
        </span>
        <span class="text-text-secondary text-xs ml-2 shrink-0 transition-transform" class:rotate-180={showTaskDropdown}>▼</span>
      </button>
      {#if showTaskDropdown}
        <!-- backdrop for mobile -->
        <button type="button" aria-label="Close" class="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" onclick={() => showTaskDropdown = false}></button>
        <div class="absolute z-50 top-full left-0 right-0 mt-2 rounded-xl border border-border bg-surface shadow-xl max-h-[50dvh] md:max-h-60 overflow-auto overscroll-contain">
          {#if tasksLoading}
            <div class="p-2 flex flex-col gap-1.5">
              {#each [1,2,3] as _}<Skeleton class="h-11 rounded-lg" />{/each}
            </div>
          {:else if pendingTasks.length === 0}
            <p class="px-4 py-4 text-sm text-text-secondary text-center">No active tasks. Go to Tasks to create one.</p>
          {:else}
            <button
              class="w-full text-left px-4 py-3 text-sm hover:bg-surface-elevated active:bg-surface-elevated flex items-center gap-2 transition min-h-11"
              onclick={() => { selectedTaskId = null; selectedTaskTitle = ''; showTaskDropdown = false }}
            >
              <span class="text-text-secondary">No task</span>
            </button>
            {#each pendingTasks as task}
              <button
                class="w-full text-left px-4 py-3 text-sm hover:bg-surface-elevated active:bg-surface-elevated flex items-center gap-2 transition min-h-11"
                class:bg-primary-light={selectedTaskId === task.id}
                class:text-primary={selectedTaskId === task.id}
                onclick={() => { selectedTaskId = task.id; selectedTaskTitle = task.title; showTaskDropdown = false }}
              >
                <CheckSquare size={14} class="text-primary shrink-0" />
                <span class="truncate flex-1">{task.title}</span>
                {#if task.dueDate}<span class="text-xs text-text-secondary ml-auto shrink-0">{task.dueDate}</span>{/if}
              </button>
            {/each}
          {/if}
        </div>
      {/if}
    </div>
    {/if}
  {/if}

  {#if state === 'break'}
    <div class="flex flex-col items-center gap-5 md:gap-4 py-8 md:py-12 w-full">
      <div class="w-[min(68vw,16rem)] h-[min(68vw,16rem)] md:w-64 md:h-64 aspect-square rounded-full border-[8px] border-secondary flex flex-col items-center justify-center bg-surface shadow-lg shrink-0">
        <span class="text-[clamp(1.75rem,10vw,3rem)] font-mono font-bold leading-none">{formatTimer(breakRemaining)}</span>
        <span class="text-sm text-text-secondary mt-2">Break Time</span>
      </div>
      <p class="w-full text-sm leading-relaxed text-text-secondary text-center text-balance break-words px-4">You focused for {formatDuration(elapsed)}</p>
      {#if selectedTaskTitle}<p class="text-xs text-text-secondary text-center truncate max-w-full px-4">Task: {selectedTaskTitle}</p>{/if}
      <button class="px-6 py-3 rounded-full border border-border bg-surface text-sm font-medium min-h-11 hover:bg-surface-elevated active:scale-95 transition" onclick={skipBreak}>Skip Break</button>
    </div>
  {:else}
    <!-- Fluid timer: 68vw on mobile, fixed 288px on md -->
    <div class="w-[min(78vw,18rem)] h-[min(78vw,18rem)] md:w-72 md:h-72 aspect-square rounded-full border-[8px] flex flex-col items-center justify-center relative bg-surface shadow-sm shrink-0" style="border-color: {state === 'running' ? '#0D9488' : '#E2E8F0'}">
      <span class="text-[clamp(1.75rem,11vw,3rem)] font-mono font-bold tracking-tight break-words leading-none px-2 text-center" aria-live="polite">{formatTimer(elapsed)}</span>
      <span class="text-sm text-text-secondary mt-1 break-words">Focus Time</span>
      {#if state !== 'idle'}<span class="mt-2 text-xs font-medium bg-secondary text-white px-3.5 py-1.5 rounded-full break-words shadow-sm">Earned Rest: {formatDuration(earnedRest)}</span>{/if}
      {#if selectedTaskTitle && state !== 'idle'}<span class="mt-1.5 text-xs text-text-secondary flex items-center gap-1 max-w-[80%] truncate"><CheckSquare size={12} class="shrink-0" /> <span class="truncate">{selectedTaskTitle}</span></span>{/if}
    </div>
    <!-- Controls: wrap on small, thumb-friendly -->
    <div class="flex flex-wrap justify-center gap-2.5 md:gap-3 w-full px-2">
      {#if state === 'idle'}
        <button data-testid="focus-primary" class="px-8 py-3.5 rounded-full bg-primary text-white font-semibold shadow-md hover:bg-primary-hover active:scale-95 transition min-h-12 text-[15px] flex items-center gap-2" onclick={start}>▶ Start Focus</button>
      {:else if state === 'running'}
        <button class="px-5 md:px-6 py-3 rounded-full border-2 border-border bg-surface font-medium min-h-11 hover:bg-surface-elevated active:scale-95 transition" onclick={pause}>⏸ Pause</button>
        <button class="px-5 md:px-6 py-3 rounded-full bg-error text-white font-semibold min-h-11 hover:opacity-90 active:scale-95 transition shadow-sm" onclick={stop}>■ Stop & Rest</button>
        {#if selectedTaskId}
          <button class="px-5 py-3 rounded-full bg-secondary text-white font-semibold min-h-11 hover:opacity-90 active:scale-95 transition shadow-sm" onclick={finish}>✓ Finish</button>
        {/if}
      {:else if state === 'paused'}
        <button class="px-6 py-3 rounded-full bg-primary text-white font-semibold min-h-11 shadow-sm hover:bg-primary-hover active:scale-95 transition" onclick={resume}>▶ Resume</button>
        <button class="px-6 py-3 rounded-full bg-error text-white font-medium min-h-11 hover:opacity-90 active:scale-95 transition" onclick={stop}>■ Stop</button>
        <button class="px-5 py-3 rounded-full border border-border bg-surface text-sm font-medium min-h-11 hover:bg-surface-elevated active:scale-95 transition" onclick={reset}>Reset</button>
      {/if}
    </div>
    <div class="w-full rounded-xl border border-border bg-surface px-4 py-3 flex flex-col sm:flex-row sm:justify-between gap-1.5 text-sm">
      <span class="text-text-secondary break-words text-xs sm:text-sm">Press <kbd class="px-1.5 py-0.5 bg-surface-elevated rounded text-xs border">Space</kbd> to {state === 'running' ? 'pause' : 'start'}</span>
      <span class="text-text-secondary break-words text-xs sm:text-sm hidden sm:inline">S to stop</span>
    </div>
  {/if}
</div>
