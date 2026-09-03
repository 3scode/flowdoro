<script lang="ts">
  import { timer } from '$lib/stores/timer'
  import { formatTimer, formatDuration } from '$lib/utils/time'
  import { api } from '$lib/api/client'
  import { onMount } from 'svelte'
  import { CheckSquare } from 'lucide-svelte'

  let elapsed = $state(0)
  let state = $state('idle' as string)
  let earnedRest = $state(0)
  let breakRemaining = $state(0)
  let sessionId = $state<string | null>(null)
  let selectedTaskId = $state<string | null>(null)
  let selectedTaskTitle = $state('')
  let tasks = $state<any[]>([])
  let showTaskDropdown = $state(false)
  const progress = $derived(Math.min(100, (elapsed % 300) / 300 * 100))

  timer.elapsed.subscribe((v) => (elapsed = v))
  timer.state.subscribe((v) => (state = v))
  timer.earnedRest.subscribe((v) => (earnedRest = v))
  timer.breakRemaining.subscribe((v) => (breakRemaining = v))

  onMount(async () => {
    try {
      const res: any = await api.tasks.list()
      tasks = res.data ?? []
    } catch {}
    // check URL for pre-selected taskId
    const params = new URLSearchParams(window.location.search)
    const tid = params.get('taskId')
    if (tid) {
      const found = (tasks as any[]).find((t) => t.id === tid)
      if (found) { selectedTaskId = tid; selectedTaskTitle = found.title }
    }
  })

  const pendingTasks = $derived(tasks.filter((t) => t.status !== 'done'))

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

  function skipBreak() { timer.skipBreak() }
  function pause() { timer.pause() }
  function resume() { timer.resume() }
  function reset() { timer.reset(); sessionId = null }
</script>

<div class="w-full max-w-lg mx-auto flex flex-col items-center gap-6 py-8 px-4">
  <h1 class="w-full text-2xl font-bold text-center text-balance break-words">Focus</h1>

  {#if state === 'idle'}
    <div class="w-full relative">
      <button
        type="button"
        class="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-surface text-sm hover:border-primary transition"
        onclick={() => showTaskDropdown = !showTaskDropdown}
      >
        <span class="flex items-center gap-2 truncate">
          {#if selectedTaskId}
            <CheckSquare size={14} class="text-primary shrink-0" />
            {selectedTaskTitle}
          {:else}
            <span class="text-text-secondary">Select a task (optional)</span>
          {/if}
        </span>
        <span class="text-text-secondary text-xs">▼</span>
      </button>
      {#if showTaskDropdown}
        <div class="absolute z-50 top-full left-0 right-0 mt-1 rounded-lg border border-border bg-surface shadow-lg max-h-60 overflow-auto">
          {#if pendingTasks.length === 0}
            <p class="px-4 py-3 text-sm text-text-secondary">No active tasks. Go to Tasks to create one.</p>
          {:else}
            <button
              class="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-elevated flex items-center gap-2 transition"
              onclick={() => { selectedTaskId = null; selectedTaskTitle = ''; showTaskDropdown = false }}
            >
              <span class="text-text-secondary">No task</span>
            </button>
            {#each pendingTasks as task}
              <button
                class="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-elevated flex items-center gap-2 transition"
                class:bg-primary-light={selectedTaskId === task.id}
                onclick={() => { selectedTaskId = task.id; selectedTaskTitle = task.title; showTaskDropdown = false }}
              >
                <CheckSquare size={14} class="text-primary shrink-0" /> {task.title}
                {#if task.dueDate}<span class="text-xs text-text-secondary ml-auto">{task.dueDate}</span>{/if}
              </button>
            {/each}
          {/if}
        </div>
      {/if}
    </div>
  {/if}

  {#if state === 'break'}
    <div class="flex flex-col items-center gap-4 py-12">
      <div class="w-64 h-64 rounded-full border-8 border-secondary flex flex-col items-center justify-center bg-surface">
        <span class="text-5xl font-mono font-bold">{formatTimer(breakRemaining)}</span>
        <span class="text-sm text-text-secondary mt-2">Break Time</span>
      </div>
      <p class="w-full text-sm leading-relaxed text-text-secondary text-center text-balance break-words">You focused for {formatDuration(elapsed)}</p>
      {#if selectedTaskTitle}<p class="text-xs text-text-secondary">Task: {selectedTaskTitle}</p>{/if}
      <button class="px-6 py-2 rounded-md border border-border text-sm" onclick={skipBreak}>Skip Break</button>
    </div>
  {:else}
    <div class="w-72 h-72 rounded-full border-8 flex flex-col items-center justify-center relative bg-surface" style="border-color: {state === 'running' ? '#0D9488' : '#E2E8F0'}">
      <span class="text-5xl font-mono font-bold tracking-tight break-words" aria-live="polite">{formatTimer(elapsed)}</span>
      <span class="text-sm text-text-secondary mt-1 break-words">Focus Time</span>
      {#if state !== 'idle'}<span class="mt-2 text-xs font-medium bg-secondary text-white px-3 py-1 rounded-full break-words">Earned Rest: {formatDuration(earnedRest)}</span>{/if}
      {#if selectedTaskTitle && state !== 'idle'}<span class="mt-1 text-xs text-text-secondary flex items-center gap-1"><CheckSquare size={12} /> {selectedTaskTitle}</span>{/if}
    </div>
    <div class="flex gap-3">
      {#if state === 'idle'}
        <button data-testid="focus-primary" class="px-8 py-3 rounded-md bg-primary text-white font-semibold shadow hover:bg-primary-hover" onclick={start}>▶ Start Focus</button>
      {:else if state === 'running'}
        <button class="px-6 py-3 rounded-md border border-border bg-surface" onclick={pause}>⏸ Pause</button>
        <button class="px-6 py-3 rounded-md bg-error text-white font-semibold" onclick={stop}>■ Stop & Rest</button>
      {:else if state === 'paused'}
        <button class="px-6 py-3 rounded-md bg-primary text-white font-semibold" onclick={resume}>▶ Resume</button>
        <button class="px-6 py-3 rounded-md bg-error text-white" onclick={stop}>■ Stop</button>
        <button class="px-6 py-3 rounded-md border border-border text-sm" onclick={reset}>Reset</button>
      {/if}
    </div>
    <div class="w-full rounded-lg border border-border bg-surface px-4 py-3 flex justify-between gap-2 text-sm">
      <span class="text-text-secondary break-words">Press Space to {state === 'running' ? 'pause' : 'start'}</span>
      <span class="text-text-secondary break-words">S to stop</span>
    </div>
  {/if}
</div>
