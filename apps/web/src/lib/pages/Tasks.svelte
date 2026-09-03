<script lang="ts">
  import { onMount } from 'svelte'
  import { CheckSquare, Plus, CalendarDays, Clock, Flag, Trash2, X, Play, ChevronDown, ChevronRight, Timer, FolderOpen, Star } from 'lucide-svelte'
  import { api } from '$lib/api/client'
  import { formatDuration } from '$lib/utils/time'

  type Task = { id: string; title: string; description: string | null; dueDate: string | null; dueTime: string | null; priority: number; parentId: string | null; sortOrder: number; status: string; listId: string | null; starred: boolean; createdAt: string }
  type List = { id: string; name: string; sortOrder: number }
  type TimeStats = Record<string, { totalFocusSeconds: number; sessionCount: number; restEarnedSeconds: number }>

  let tasks: Task[] = $state([])
  let lists: List[] = $state([])
  let loading = $state(true)
  let filter = $state<'all' | 'starred' | 'today' | 'scheduled' | 'done'>('all')
  let activeListId = $state<string | null>(null)
  let selectedId = $state<string | null>(null)
  let expanded = $state<Set<string>>(new Set())
  let showAddForm = $state(false)
  let saving = $state(false)
  let toast = $state('')

  let formTitle = $state('')
  let formDesc = $state('')
  let formDueDate = $state('')
  let formDueTime = $state('')
  let formPriority = $state(0)
  let newListName = $state('')
  let showNewList = $state(false)

  let quickAddTitle = $state('')

  const priorities = [
    { value: 0, label: 'None', color: 'bg-gray-300 dark:bg-gray-600' },
    { value: 1, label: 'Low', color: 'bg-blue-400' },
    { value: 2, label: 'Medium', color: 'bg-yellow-400' },
    { value: 3, label: 'High', color: 'bg-red-400' },
  ]

  let timeStats: TimeStats = $state({})
  // children per parentId, rebuilt reactively
  let childMap: Record<string, Task[]> = $state({})

  $effect(() => {
    const m: Record<string, Task[]> = {}
    for (const t of tasks) {
      if (t.parentId) {
        ;(m[t.parentId] ??= []).push(t)
      }
    }
    childMap = m
  })

  function isOverdue(task: Task): boolean {
    if (!task.dueDate || task.status === 'done') return false
    const now = new Date()
    const today = now.toISOString().slice(0, 10)
    if (task.dueDate < today) return true
    if (task.dueDate === today && task.dueTime) {
      const dt = new Date(`${task.dueDate}T${task.dueTime}`)
      if (dt < now) return true
    }
    return false
  }

  async function load() {
    loading = true
    try {
      const [tasksRes, listsRes, statsRes] = await Promise.all([
        api.tasks.list(),
        api.lists.list().catch(() => ({ data: [] })),
        api.tasksTimeStats().catch(() => ({ data: {} })),
      ])
      tasks = (tasksRes.data ?? []) as Task[]
      lists = listsRes.data ?? []
      timeStats = statsRes.data ?? {}
      if (activeListId === null && lists.length > 0) activeListId = lists[0].id
    } catch { tasks = [] } finally { loading = false }
  }

  onMount(() => load())

  function resetForm() {
    formTitle = ''
    formDesc = ''
    formDueDate = ''
    formDueTime = ''
    formPriority = 0
  }

  async function createTask(fromQuickAdd = false) {
    if (!formTitle.trim() && !quickAddTitle.trim()) return
    saving = true
    const title = formTitle.trim() || quickAddTitle.trim()
    try {
      await api.tasks.create({ title, description: formDesc.trim() || null, dueDate: formDueDate || null, dueTime: formDueTime || null, priority: formPriority, listId: activeListId })
      if (fromQuickAdd) { quickAddTitle = '' } else { showAddForm = false; resetForm() }
      showToast('Task created')
      await load()
    } catch (e: any) { showToast(e.message ?? 'Failed to create task') } finally { saving = false }
  }

  async function createSubtask(parent: Task) {
    const title = prompt(`Subtask for "${parent.title}"`)
    if (!title?.trim()) return
    try {
      await api.tasks.create({ title: title.trim(), parentId: parent.id, listId: parent.listId })
      showToast('Subtask created')
      await load()
    } catch (e: any) { showToast(e.message ?? 'Failed') }
  }

  async function deleteTask(task: Task) {
    try {
      await api.tasks.delete(task.id)
      if (selectedId === task.id) selectedId = null
      showToast('Task deleted')
      await load()
    } catch (e: any) { showToast(e.message ?? 'Failed to delete') }
  }

  async function toggleTask(task: Task) {
    try {
      const updated: any = await api.tasks.toggle(task.id)
      task.status = updated.data?.status ?? task.status
      showToast(updated.data?.status === 'done' ? 'Task completed' : 'Task reopened')
      await load()
    } catch (e: any) { showToast(e.message ?? 'Failed to toggle') }
  }

  async function toggleStar(task: Task) {
    try {
      const updated: any = await api.tasks.star(task.id)
      task.starred = updated.data?.starred ?? !task.starred
    } catch (e: any) { showToast(e.message ?? 'Failed') }
  }

  async function updateTaskField(task: Task, field: string, value: any) {
    try {
      await api.tasks.update(task.id, { [field]: value })
      ;(task as any)[field] = value
    } catch (e: any) { showToast(e.message ?? 'Save failed') }
  }

  async function openInFocus(task: Task) {
    window.location.href = `/focus?taskId=${encodeURIComponent(task.id)}`
  }

  function showToast(msg: string) {
    toast = msg
    setTimeout(() => (toast = ''), 2500)
  }

  function toggleExpand(id: string) {
    const s = expanded
    if (s.has(id)) s.delete(id); else s.add(id)
    expanded = s
  }

  async function createList() {
    if (!newListName.trim()) return
    try {
      await api.lists.create(newListName.trim())
      showNewList = false
      newListName = ''
      showToast('List created')
      await load()
    } catch (e: any) { showToast(e.message ?? 'Failed') }
  }

  async function deleteList(list: List) {
    if (!confirm(`Delete "${list.name}"? Tasks will be unlinked.`)) return
    try {
      await api.lists.delete(list.id)
      if (activeListId === list.id) activeListId = lists[0]?.id ?? null
      showToast('List deleted')
      await load()
    } catch (e: any) { showToast(e.message ?? 'Failed') }
  }

  function getFilteredTasks(): Task[] {
    const all = tasks.filter((t: Task) => !t.parentId)
    const inList = activeListId === null ? all : all.filter((t: Task) => t.listId === activeListId)
    if (filter === 'starred') return inList.filter((t: Task) => t.starred)
    if (filter === 'today') {
      const today = new Date().toISOString().slice(0, 10)
      return inList.filter((t: Task) => t.dueDate === today && t.status !== 'done')
    }
    if (filter === 'scheduled') {
      const today = new Date().toISOString().slice(0, 10)
      return inList.filter((t: Task) => t.dueDate && t.dueDate >= today && t.status !== 'done')
    }
    if (filter === 'done') return inList.filter((t: Task) => t.status === 'done')
    return inList
  }

  const pendingCount = $derived(tasks.filter((t: Task) => !t.parentId && t.status !== 'done').length)
  const starredCount = $derived(tasks.filter((t: Task) => !t.parentId && t.starred && t.status !== 'done').length)
  const selectedTask = $derived<Task | null>(tasks.find((t: Task) => t.id === selectedId) ?? null)
</script>

<div class="w-full min-h-screen bg-background text-text-primary flex flex-col">
  <div class="border-b border-border bg-surface px-4 py-3 flex items-center justify-between sticky top-0 z-20">
    <div class="flex items-center gap-3">
      <CheckSquare size={20} class="text-primary shrink-0" />
      <h1 class="text-lg font-bold text-balance break-words">Tasks</h1>
      <span class="text-xs text-text-secondary bg-surface-elevated px-2 py-0.5 rounded-full">{pendingCount} pending</span>
      {#if starredCount > 0}<span class="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">⭐ {starredCount}</span>{/if}
    </div>
    <button
      class="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-hover transition"
      onclick={() => { showAddForm = !showAddForm; if (showAddForm) resetForm() }}
    >
      <Plus size={16} /> New Task
    </button>
  </div>

  <div class="flex flex-1 overflow-hidden">
    <aside class="hidden md:flex flex-col w-48 border-r border-border bg-surface p-2 gap-1 shrink-0">
      {#each [
        { key: 'all' as const, label: 'All Tasks' },
        { key: 'starred' as const, label: '⭐ Starred' },
        { key: 'today' as const, label: "Today's Focus" },
        { key: 'scheduled' as const, label: 'Scheduled' },
        { key: 'done' as const, label: 'Completed' },
      ] as f}
        <button
          class="flex items-center gap-2 px-3 py-2 rounded-md text-sm transition text-left"
          class:bg-primary-light={filter === f.key && activeListId === null}
          class:text-primary={filter === f.key && activeListId === null}
          class:text-text-secondary={filter !== f.key || activeListId !== null}
          class:hover:bg-surface-elevated={true}
          onclick={() => { filter = f.key; activeListId = null; selectedId = null }}
        >{f.label}</button>
      {/each}

      <div class="mt-3 mb-1 px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center justify-between">
        <span>Lists</span>
        <button class="hover:text-text-primary transition" onclick={() => showNewList = !showNewList}><Plus size={14} /></button>
      </div>
      {#if showNewList}
        <div class="px-2 pb-2 flex gap-1">
          <input bind:value={newListName} placeholder="List name" class="flex-1 rounded border border-border bg-background px-2 py-1 text-sm outline-none" onkeydown={(e) => e.key === 'Enter' && createList()} />
          <button class="text-xs px-2 py-1 bg-primary text-white rounded" onclick={createList}>Add</button>
        </div>
      {/if}
      {#each lists as list}
        <div
          class="group flex items-center gap-1 px-3 py-2 rounded-md text-sm transition cursor-pointer hover:bg-surface-elevated"
          class:bg-primary-light={activeListId === list.id}
          class:text-primary={activeListId === list.id}
          class:text-text-secondary={activeListId !== list.id}
          onclick={() => { activeListId = list.id; filter = 'all'; selectedId = null }}
        >
          <FolderOpen size={14} class="shrink-0" />
          <span class="flex-1 truncate text-balance break-words">{list.name}</span>
          <button
            class="opacity-0 group-hover:opacity-100 text-error hover:bg-error/10 rounded p-0.5 transition"
            onclick={(e) => { e.stopPropagation(); deleteList(list) }}
          ><Trash2 size={12} /></button>
        </div>
      {/each}
      {#if lists.length === 0 && !showNewList}
        <p class="px-3 py-2 text-xs text-text-secondary">No custom lists yet</p>
      {/if}
    </aside>

    <main class="flex-1 overflow-auto p-4 pb-24 md:pb-4">
      <div class="flex md:hidden gap-1 mb-4 overflow-x-auto pb-2">
        {#each ['all' as const,'starred' as const,'today' as const,'scheduled' as const,'done' as const] as f}
          <button
            class="px-3 py-1.5 rounded-full text-sm border border-border whitespace-nowrap"
            class:bg-primary={filter === f && activeListId === null}
            class:text-white={filter === f && activeListId === null}
            class:text-text-secondary={filter !== f || activeListId !== null}
            onclick={() => { filter = f; activeListId = null; selectedId = null }}
          >{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        {/each}
      </div>

      <div class="mb-4 flex gap-2">
        <input
          type="text"
          bind:value={quickAddTitle}
          placeholder={activeListId ? `Quick add in list…` : "Quick add task…"}
          class="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary text-balance break-words"
          onkeydown={(e) => e.key === 'Enter' && createTask(true)}
          onfocus={(e) => { const t = e.currentTarget; t?.select() }}
        />
        <button
          class="px-3 py-2 rounded-md bg-primary text-white text-sm font-medium disabled:opacity-50 hover:bg-primary-hover transition"
          onclick={() => createTask(true)}
          disabled={!quickAddTitle.trim() || saving}
        >Add</button>
      </div>

      {#if showAddForm}
        <div class="mb-4 rounded-xl border border-border bg-surface p-4 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-sm">New Task</span>
            <button class="text-text-secondary hover:text-text-primary" onclick={() => { showAddForm = false; resetForm() }}><X size={16} /></button>
          </div>
          <input type="text" bind:value={formTitle} placeholder="Task title *" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary text-balance break-words" onkeydown={(e) => e.key === 'Enter' && createTask(false)} onfocus={(e) => { const t = e.currentTarget; t?.select() }} />
          <textarea bind:value={formDesc} placeholder="Description (optional)" rows={2} class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary resize-none text-balance break-words" />
          <div class="flex flex-wrap gap-3">
            <div class="flex items-center gap-2">
              <CalendarDays size={14} class="text-text-secondary" />
              <input type="date" bind:value={formDueDate} class="rounded-md border border-border bg-background px-2 py-1 text-sm" />
              <input type="time" bind:value={formDueTime} class="rounded-md border border-border bg-background px-2 py-1 text-sm" />
            </div>
            <div class="flex items-center gap-2">
              <Flag size={14} class="text-text-secondary" />
              <select bind:value={formPriority} class="rounded-md border border-border bg-background px-2 py-1 text-sm">
                {#each priorities as p}<option value={p.value}>{p.label}</option>{/each}
              </select>
            </div>
          </div>
          <button class="self-end px-4 py-2 rounded-md bg-primary text-white text-sm font-medium disabled:opacity-50" onclick={() => createTask(false)} disabled={saving || !formTitle.trim()}>
            {saving ? 'Saving...' : 'Create Task'}
          </button>
        </div>
      {/if}

      {#if loading && tasks.length === 0}
        <div class="flex flex-col gap-2">{#each [1,2,3,4] as _}<div class="h-12 rounded-lg skeleton"></div>{/each}</div>
      {:else if getFilteredTasks().length === 0}
        <div class="w-full rounded-xl border border-dashed border-border bg-surface p-12 text-center">
          <p class="font-semibold text-balance break-words">No tasks here</p>
          <p class="text-sm leading-relaxed text-text-secondary mt-1 text-balance break-words">
            {activeListId ? 'This list is empty. Create a task above.' : 'Create your first task to stay organized.'}
          </p>
          <button class="mt-4 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium" onclick={() => { showAddForm = true; filter = 'all' }}>+ New Task</button>
        </div>
      {:else}
        <div class="flex flex-col gap-1">
          {#each getFilteredTasks() as task (task.id)}
            {@const kids = childMap[task.id] ?? []}
            {@const hasKids = kids.length > 0}
            {@const isExp = expanded.has(task.id)}
            <div role="listitem" tabindex="0" onkeydown={(e) => e.key === 'Enter' && selectedId === task.id && (selectedId = null)}
              class="group flex items-stretch gap-2 rounded-lg border border-transparent hover:border-border hover:bg-surface-elevated transition"
              onclick={() => selectedId = selectedId === task.id ? null : task.id}
            >
              {#if hasKids}
                <button
                  class="shrink-0 w-7 h-7 rounded flex items-center justify-center hover:bg-border/30 transition mt-0.5"
                  onclick={(e) => { e.stopPropagation(); toggleExpand(task.id) }}
                >
                  {#if isExp}<ChevronDown size={16} />{:else}<ChevronRight size={16} />{/if}
                </button>
              {:else}
                <div class="shrink-0 w-7"></div>
              {/if}

              <button
                class="shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition mt-0.5"
                class:border-primary.bg-primary.text-white={task.status === 'done'}
                class:border-text-secondary.hover:border-primary={task.status !== 'done'}
                onclick={(e) => { e.stopPropagation(); toggleTask(task) }}
              >
                {#if task.status === 'done'}<CheckSquare size={12} class="text-white" />{/if}
              </button>

              <div class="flex-1 min-w-0 py-1.5">
                <div class="flex items-center gap-2">
                  <p class="text-sm font-medium truncate text-balance break-words" class:line-through={task.status === 'done'} class:text-error={isOverdue(task)}>{task.title}</p>
                  {#if task.priority > 0}<span class="shrink-0 w-2 h-2 rounded-full {priorities[task.priority]?.color ?? 'bg-gray-300'}" title="{priorities[task.priority]?.label}"></span>{/if}
                </div>
                {#if task.description}<p class="text-xs text-text-secondary truncate">{task.description}</p>{/if}
                <div class="flex items-center gap-3 mt-0.5">
                  {#if task.dueDate}
                    <span class="text-xs flex items-center gap-1 {isOverdue(task) ? 'text-error' : 'text-text-secondary'}">
                      <Clock size={12} />{task.dueDate}{task.dueTime ? ' ' + task.dueTime : ''}
                      {#if isOverdue(task)}<span class="font-semibold">Overdue</span>{/if}
                    </span>
                  {/if}
                  {#if timeStats[task.id] && timeStats[task.id].totalFocusSeconds > 0}
                    <span class="text-xs text-text-secondary flex items-center gap-1"><Timer size={12} />{formatDuration(timeStats[task.id].totalFocusSeconds)}</span>
                  {/if}
                  {#if timeStats[task.id] && timeStats[task.id].sessionCount > 0}
                    <span class="text-xs text-text-secondary">{timeStats[task.id].sessionCount} sessions</span>
                  {/if}
                </div>
              </div>

              <div class="shrink-0 flex items-center gap-1 pr-1 opacity-0 group-hover:opacity-100 transition">
                <button class="p-1.5 rounded hover:bg-yellow-500/10 text-yellow-500 transition" onclick={(e) => { e.stopPropagation(); toggleStar(task) }} title="Star">
                  <Star size={14} class={task.starred ? 'fill-current' : ''} />
                </button>
                <button class="p-1.5 rounded hover:bg-primary/10 text-primary transition" onclick={(e) => { e.stopPropagation(); openInFocus(task) }} title="Start focus">
                  <Play size={14} />
                </button>
                <button class="p-1.5 rounded hover:bg-blue-500/10 text-blue-500 transition" onclick={(e) => { e.stopPropagation(); createSubtask(task) }} title="Add subtask">
                  <Plus size={14} />
                </button>
                <button class="p-1.5 rounded hover:bg-error/10 text-error transition" onclick={(e) => { e.stopPropagation(); deleteTask(task) }} title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {#if hasKids && isExp}
              {#each kids as kid (kid.id)}
                <div role="listitem" tabindex="0" onkeydown={(e) => e.key === 'Enter' && selectedId === kid.id && (selectedId = null)}
                  class="group flex items-center gap-2 ml-9 pl-3 border-l-2 border-border/50 py-1.5 rounded-r-lg hover:bg-surface-elevated transition"
                  onclick={() => selectedId = selectedId === kid.id ? null : kid.id}
                >
                  <button
                    class="shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition"
                    class:border-primary.bg-primary.text-white={kid.status === 'done'}
                    class:border-text-secondary.hover:border-primary={kid.status !== 'done'}
                    onclick={(e) => { e.stopPropagation(); toggleTask(kid) }}
                  >
                    {#if kid.status === 'done'}<CheckSquare size={10} class="text-white" />{/if}
                  </button>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm truncate text-balance break-words" class:line-through={kid.status === 'done'} class:text-error={isOverdue(kid)}>{kid.title}</p>
                  </div>
                  {#if timeStats[kid.id] && timeStats[kid.id].totalFocusSeconds > 0}<span class="text-xs text-text-secondary"><Timer size={12} />{formatDuration(timeStats[kid.id].totalFocusSeconds)}</span>{/if}
                  <div class="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button class="p-1 rounded hover:bg-primary/10 text-primary" onclick={(e) => { e.stopPropagation(); openInFocus(kid) }}><Play size={13} /></button>
                    <button class="p-1 rounded hover:bg-error/10 text-error" onclick={(e) => { e.stopPropagation(); deleteTask(kid) }}><Trash2 size={13} /></button>
                  </div>
                </div>
              {/each}
            {/if}
          {/each}
        </div>
      {/if}
    </main>

    {#if selectedTask}
      <aside class="hidden lg:flex flex-col w-80 border-l border-border bg-surface p-4 gap-4 shrink-0 overflow-auto">
        <div class="flex items-center justify-between">
          <span class="font-semibold text-sm">Task Details</span>
          <button class="text-text-secondary hover:text-text-primary" onclick={() => selectedId = null}><X size={16} /></button>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="w-6 h-6 rounded border-2 flex items-center justify-center shrink-0"
            class:border-primary.bg-primary.text-white={selectedTask.status === 'done'}
            class:border-text-secondary={selectedTask.status !== 'done'}
            onclick={() => toggleTask(selectedTask)}
          >
            {#if selectedTask.status === 'done'}<CheckSquare size={12} class="text-white" />{/if}
          </button>
          <input type="text" value={selectedTask.title} class="flex-1 text-sm font-medium bg-transparent border-none outline-none text-balance break-words" onchange={(e) => updateTaskField(selectedTask, 'title', (e.target as HTMLInputElement).value)} />
        </div>
        <textarea value={selectedTask.description ?? ''} rows={4} class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none outline-none focus:ring-1 focus:ring-primary text-balance break-words" onchange={(e) => updateTaskField(selectedTask, 'description', (e.target as HTMLTextAreaElement).value)} />
        <div class="flex flex-wrap gap-3 text-sm">
          <div class="flex items-center gap-1 text-text-secondary">
            <CalendarDays size={14} />
            <input type="date" value={selectedTask.dueDate ?? ''} class="bg-transparent px-1 text-sm outline-none" onchange={(e) => updateTaskField(selectedTask, 'dueDate', (e.target as HTMLInputElement).value || null)} />
          </div>
          <div class="flex items-center gap-1 text-text-secondary">
            <Clock size={14} />
            <input type="time" value={selectedTask.dueTime ?? ''} class="bg-transparent px-1 text-sm outline-none" onchange={(e) => updateTaskField(selectedTask, 'dueTime', (e.target as HTMLInputElement).value || null)} />
          </div>
          <div class="flex items-center gap-1 text-text-secondary">
            <Flag size={14} />
            <select value={selectedTask.priority ?? 0} class="bg-transparent px-1 text-sm outline-none" onchange={(e) => updateTaskField(selectedTask, 'priority', Number((e.target as HTMLSelectElement).value))}>
              {#each priorities as p}<option value={p.value}>{p.label}</option>{/each}
            </select>
          </div>
        </div>
        {#if selectedTask && timeStats[selectedTask.id]}
          <div class="rounded-lg border border-border bg-surface-elevated p-3 flex items-center gap-3">
            <Timer size={18} class="text-primary shrink-0" />
            <div>
              <p class="text-xs text-text-secondary">Total Focus</p>
              <p class="text-sm font-semibold">{formatDuration(timeStats[selectedTask.id].totalFocusSeconds)}</p>
            </div>
            <div class="ml-auto text-right">
              <p class="text-xs text-text-secondary">Sessions</p>
              <p class="text-sm font-semibold">{timeStats[selectedTask.id].sessionCount}</p>
            </div>
            <div class="ml-3 text-right">
              <p class="text-xs text-text-secondary">Rest Earned</p>
              <p class="text-sm font-semibold">{formatDuration(timeStats[selectedTask.id].restEarnedSeconds)}</p>
            </div>
          </div>
        {:else}
          <div class="rounded-lg border border-dashed border-border bg-surface-elevated p-3 text-center">
            <p class="text-xs text-text-secondary">No sessions logged yet</p>
          </div>
        {/if}

        <div class="flex gap-2">
          <button class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-hover transition" onclick={() => openInFocus(selectedTask)}>
            <Play size={14} /> Start Focus
          </button>
          <button class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md border border-error text-error text-sm hover:bg-error/10 transition" onclick={() => deleteTask(selectedTask)}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </aside>
    {/if}
  </div>

  {#if toast}
    <div class="fixed bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-surface-elevated border border-border text-sm shadow-lg">{toast}</div>
  {/if}
</div>
