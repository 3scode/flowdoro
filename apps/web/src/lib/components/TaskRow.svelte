<script lang="ts">
  import { Check, Play, ChevronDown, ChevronRight, Plus, Star, Timer, Trash2, FolderOpen, X } from 'lucide-svelte'
  import { formatDuration } from '$lib/utils/time'

  type Task = { id: string; title: string; description: string | null; dueDate: string | null; dueTime: string | null; parentId: string | null; sortOrder: number; status: string; listId: string | null; starred: boolean; createdAt: string }
  type Kid = Task
  type List = { id: string; name: string; sortOrder: number }
  type TimeStats = Record<string, { totalFocusSeconds: number; sessionCount: number; restEarnedSeconds: number }>

  let {
    task,
    kids = [],
    hasKids = false,
    isExp = false,
    selectedId,
    timeStats = {} as TimeStats,
    lists = [],
    isOverdue,
    toggleTask,
    toggleStar,
    openInFocus,
    createSubtask,
    deleteTask,
    toggleExpand,
    select,
    onMove,
    activeSubtaskId = null,
    subtaskDraft = '',
    savingSubtask = false,
    onOpenSubtask,
    onSubmitSubtask,
    onCancelSubtask,
    onDraftChange,
  }: {
    task: Task
    kids?: Kid[]
    hasKids?: boolean
    isExp?: boolean
    selectedId?: string | null
    timeStats?: TimeStats
    lists?: List[]
    isOverdue: (t: Task) => boolean
    toggleTask: (t: Task) => void
    toggleStar: (t: Task) => void
    openInFocus: (t: Task) => void
    createSubtask: (t: Task) => void
    deleteTask: (t: Task) => void
    toggleExpand: (id: string) => void
    select: (id: string | null) => void
    onMove?: (task: Task, newListId: string | null) => void
    activeSubtaskId?: string | null
    subtaskDraft?: string
    savingSubtask?: boolean
    onOpenSubtask?: (id: string) => void
    onSubmitSubtask?: (parent: Task) => void
    onCancelSubtask?: () => void
    onDraftChange?: (v: string) => void
  } = $props()
</script>

<div role="listitem" tabindex="0" onkeydown={(e) => e.key === 'Enter' && selectedId === task.id && select(null)}
  class="group flex items-center gap-1.5 md:gap-2 rounded-xl border hover:border-border hover:bg-surface md:hover:bg-surface-elevated transition px-1.5 md:px-1 py-1.5 md:py-1"
  class:border-primary={selectedId === task.id}
  class:bg-primary-light={selectedId === task.id}
  class:border-transparent={selectedId !== task.id}
  class:bg-surface={selectedId !== task.id}
  onclick={() => select(selectedId === task.id ? null : task.id)}
>
  {#if hasKids}
    <button
      class="shrink-0 w-8 h-8 md:w-7 md:h-7 rounded-lg flex items-center justify-center hover:bg-border/30 active:bg-border/50 transition"
      onclick={(e) => { e.stopPropagation(); toggleExpand(task.id) }}
      aria-label="Expand subtasks"
    >
      {#if isExp}<ChevronDown size={16} />{:else}<ChevronRight size={16} />{/if}
    </button>
  {:else}
    <div class="shrink-0 w-1 md:w-2"></div>
  {/if}

  <button
    class="task-check shrink-0 w-6 h-6 md:w-5 md:h-5 rounded-md md:rounded border-2 flex items-center justify-center"
    class:border-primary.bg-primary.text-white={task.status === 'done'}
    class:border-text-secondary.hover:border-primary={task.status !== 'done'}
    aria-pressed={task.status === 'done'}
    aria-label={task.status === 'done' ? 'Tandai belum selesai' : 'Tandai selesai'}
    onclick={(e) => { e.stopPropagation(); toggleTask(task) }}
  >
    {#if task.status === 'done'}<span class="check-pop flex items-center justify-center"><Check size={12} strokeWidth={4} /></span>{/if}
  </button>

  <div class="flex-1 min-w-0 py-1 md:py-2">
    <div class="flex items-center gap-2">
      <p class="text-[14px] md:text-sm font-semibold leading-tight break-words line-clamp-2 md:truncate text-balance" class:line-through={task.status === 'done'} class:text-error={isOverdue(task)} class:opacity-60={task.status === 'done'}>{task.title}</p>
      {#if task.starred}<Star size={12} class="text-yellow-500 fill-yellow-500 shrink-0" />{/if}
    </div>
    {#if task.description}<p class="text-xs text-text-secondary truncate hidden md:block">{task.description}</p>{/if}
    {#if task.dueDate}
      <p class="text-[11px] md:text-xs flex items-center gap-1 mt-0.5 {isOverdue(task) ? 'text-error' : 'text-text-secondary'}">
        {task.dueDate}{task.dueTime ? ' ' + task.dueTime : ''}
        {#if isOverdue(task)}<span class="font-semibold">Overdue</span>{/if}
      </p>
    {/if}
    {#if timeStats[task.id]?.totalFocusSeconds > 0 || timeStats[task.id]?.sessionCount > 0}
      <p class="text-[11px] md:text-xs text-text-secondary flex items-center gap-1 mt-0.5">
        {#if timeStats[task.id]?.totalFocusSeconds > 0}<span class="flex items-center gap-1"><Timer size={10} />{formatDuration(timeStats[task.id].totalFocusSeconds)}</span>{/if}
        {#if timeStats[task.id]?.sessionCount > 0}<span class="ml-1">{timeStats[task.id].sessionCount} ses</span>{/if}
      </p>
    {/if}
  </div>

  <div class="shrink-0 flex items-center gap-0.5 md:gap-1 pr-0.5 transition opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
    {#if lists.length > 0 && onMove}
      <select
        value={task.listId ?? ''}
        onchange={(e) => { const v = (e.target as HTMLSelectElement).value || null; if (v !== (task.listId ?? '')) onMove(task, v) }}
        onclick={(e) => e.stopPropagation()}
        title="Move to list"
        class="hidden sm:block h-8 rounded-lg border border-border bg-background text-xs px-1.5 max-w-[90px] md:max-w-[110px] truncate focus:ring-1 focus:ring-primary outline-none"
      >
        <option value="">No list</option>
        {#each lists as list}<option value={list.id}>{list.name}</option>{/each}
      </select>
    {/if}
    <button class="w-8 h-8 md:w-7 md:h-7 rounded-lg flex items-center justify-center hover:bg-yellow-500/10 active:bg-yellow-500/20 text-yellow-500 transition" onclick={(e) => { e.stopPropagation(); toggleStar(task) }} title="Star" aria-label="Star task">
      <Star size={14} class={task.starred ? 'fill-current' : ''} />
    </button>
    <button class="w-8 h-8 md:w-7 md:h-7 rounded-lg flex items-center justify-center hover:bg-primary/10 active:bg-primary/20 text-primary transition" onclick={(e) => { e.stopPropagation(); openInFocus(task) }} title="Start focus" aria-label="Start focus">
      <Play size={14} />
    </button>
    <button class="flex w-7 h-7 rounded-lg items-center justify-center hover:bg-blue-500/10 active:bg-blue-500/20 text-blue-500 transition" onclick={(e) => { e.stopPropagation(); if (onOpenSubtask) onOpenSubtask(task.id); else createSubtask(task) }} title="Add subtask" aria-label="Add subtask">
      <Plus size={14} />
    </button>
    <button class="w-8 h-8 md:w-7 md:h-7 rounded-lg flex items-center justify-center hover:bg-error/10 active:bg-error/20 text-error transition" onclick={(e) => { e.stopPropagation(); deleteTask(task) }} title="Delete" aria-label="Delete task">
      <Trash2 size={14} />
    </button>
  </div>
</div>

{#if isExp}
  {#each kids as kid (kid.id)}
    <div role="listitem" tabindex="0" onkeydown={(e) => e.key === 'Enter' && selectedId === kid.id && select(null)}
      class="group flex items-center gap-2 ml-7 md:ml-9 pl-3 border-l-2 border-border/50 py-2 md:py-1.5 rounded-r-lg hover:bg-surface-elevated active:bg-surface-elevated transition min-h-11"
      onclick={() => select(selectedId === kid.id ? null : kid.id)}
    >
      <button
        class="task-check shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center"
        class:border-primary.bg-primary.text-white={kid.status === 'done'}
        class:border-text-secondary.hover:border-primary={kid.status !== 'done'}
        aria-pressed={kid.status === 'done'}
        aria-label={kid.status === 'done' ? 'Tandai belum selesai' : 'Tandai selesai'}
        onclick={(e) => { e.stopPropagation(); toggleTask(kid) }}
      >
        {#if kid.status === 'done'}<span class="check-pop flex items-center justify-center"><Check size={10} strokeWidth={4} /></span>{/if}
      </button>
      <div class="flex-1 min-w-0 flex items-center gap-1.5">
        <p class="text-sm font-medium truncate text-balance break-words flex-1" class:line-through={kid.status === 'done'} class:text-error={isOverdue(kid)}>{kid.title}</p>
        {#if kid.starred}<Star size={10} class="text-yellow-500 fill-yellow-500 shrink-0" />{/if}
      </div>
      {#if timeStats[kid.id]?.totalFocusSeconds > 0}<span class="text-xs text-text-secondary shrink-0"><Timer size={12} />{formatDuration(timeStats[kid.id].totalFocusSeconds)}</span>{/if}
      <div class="shrink-0 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
        <button class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-yellow-500/10 active:bg-yellow-500/20 text-yellow-500 transition" onclick={(e) => { e.stopPropagation(); toggleStar(kid) }} title="Star" aria-label="Star subtask"><Star size={13} class={kid.starred ? 'fill-current' : ''} /></button>
        <button class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary/10 active:bg-primary/20 text-primary" onclick={(e) => { e.stopPropagation(); openInFocus(kid) }} aria-label="Focus subtask"><Play size={13} /></button>
        <button class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-error/10 active:bg-error/20 text-error" onclick={(e) => { e.stopPropagation(); deleteTask(kid) }} aria-label="Delete subtask"><Trash2 size={13} /></button>
      </div>
    </div>
  {/each}
  {#if activeSubtaskId === task.id}
    <div class="flex items-center gap-2 ml-7 md:ml-9 pl-3 border-l-2 border-border/50 py-1.5" onclick={(e) => e.stopPropagation()} role="group" aria-label="Add subtask">
      <input
        value={subtaskDraft}
        oninput={(e) => onDraftChange?.((e.target as HTMLInputElement).value)}
        placeholder="Add subtask…"
        enterkeyhint="done"
        autocomplete="off"
        autofocus
        class="flex-1 min-w-0 h-10 md:h-9 rounded-xl border border-border bg-surface px-3.5 text-[15px] md:text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-text-secondary/60"
        onkeydown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); onSubmitSubtask?.(task) }
          else if (e.key === 'Escape') { e.preventDefault(); onCancelSubtask?.() }
        }}
      />
      <button
        class="px-4 h-10 md:h-9 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-50 hover:bg-primary-hover active:scale-95 transition shrink-0 min-w-[56px]"
        disabled={!subtaskDraft.trim() || savingSubtask}
        onclick={(e) => { e.stopPropagation(); onSubmitSubtask?.(task) }}
      >{savingSubtask ? '...' : 'Add'}</button>
      <button
        class="w-9 h-9 md:w-8 md:h-8 rounded-full bg-surface-elevated flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-border shrink-0 transition"
        onclick={(e) => { e.stopPropagation(); onCancelSubtask?.() }}
        aria-label="Cancel"
      ><X size={14} /></button>
    </div>
  {:else}
    <button
      class="flex items-center gap-2 ml-7 md:ml-9 pl-3 border-l-2 border-border/50 w-[calc(100%-1.75rem)] md:w-[calc(100%-2.25rem)] rounded-xl border border-dashed border-border bg-surface/50 hover:bg-primary-light/50 hover:border-primary/30 hover:text-primary text-sm text-text-secondary transition min-h-10 md:min-h-9 px-3 mt-1 text-left"
      onclick={(e) => { e.stopPropagation(); onOpenSubtask?.(task.id) }}
    ><Plus size={14} class="shrink-0" /> Add subtask</button>
  {/if}
{/if}
