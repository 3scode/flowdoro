<script lang="ts">
  import { onMount } from 'svelte'
  import { CheckSquare, Check, Plus, CalendarDays, Clock, Trash2, X, Play, ChevronDown, ChevronRight, Timer, FolderOpen, Star } from 'lucide-svelte'
  import { api } from '$lib/api/client'
  import { formatDuration } from '$lib/utils/time'
  import { toast } from '$lib/stores/toast'
  import { auth } from '$lib/stores/auth'
  import Modal from '$lib/components/ui/Modal.svelte'
  import BottomSheet from '$lib/components/ui/BottomSheet.svelte'
  import TaskRow from '$lib/components/TaskRow.svelte'
  import Skeleton from '$lib/components/ui/Skeleton.svelte'

  type Task = { id: string; title: string; description: string | null; dueDate: string | null; dueTime: string | null; parentId: string | null; sortOrder: number; status: string; listId: string | null; starred: boolean; createdAt: string }
  type List = { id: string; name: string; sortOrder: number }
  type TimeStats = Record<string, { totalFocusSeconds: number; sessionCount: number; restEarnedSeconds: number }>

  let tasks: Task[] = $state([])
  let lists: List[] = $state([])
  let loading = $state(true)
  let filter = $state<'all' | 'starred' | 'today' | 'scheduled' | 'done'>('all')
  let activeListId = $state<string | null>(null)
  let selectedId = $state<string | null>(null)
  let expanded = $state<Set<string>>(new Set())
  let showCompleted = $state(false)
  let showAddForm = $state(false)
  let saving = $state(false)
  let listToDelete = $state<List | null>(null)
  let activeSubtaskId = $state<string | null>(null)
  let subtaskDraft = $state('')
  let savingSubtask = $state(false)

  let formTitle = $state('')
  let formDesc = $state('')
  let formDueDate = $state('')
  let formDueTime = $state('')
  let formListId = $state<string | null>(null)
  let newListName = $state('')
  let showNewList = $state(false)
  let showMobileLists = $state(false)

  let quickAddTitle = $state('')
  let quickListId = $state<string | null>(null)

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

  $effect(() => {
    quickListId = activeListId
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

  // persist active list across refreshes, default All Tasks (null)
  const STORAGE_LIST_KEY = 'flowdoro_activeListId'

  async function load() {
    loading = true
    try {
      // ensure auth token ready — wait for auth store if needed, but at least ensure token in localStorage
      // retry once if 401 due to race
      let tasksRes: any
      try {
        tasksRes = await api.tasks.list(activeListId !== null ? { listId: activeListId } : undefined)
      } catch (e: any) {
        if (e?.status === 401 || e?.code === 'UNAUTHORIZED') {
          // wait for auth to hydrate then retry once
          try { await auth.fetchMe() } catch {}
          tasksRes = await api.tasks.list(activeListId !== null ? { listId: activeListId } : undefined)
        } else throw e
      }
      const [listsRes, statsRes] = await Promise.all([
        api.lists.list().catch(() => ({ data: [] })),
        api.tasksTimeStats().catch(() => ({ data: {} })),
      ])
      const rawTasks = (tasksRes.data ?? []) as any[]
      // fetch subtasks for each top-level task (backend filters out parentId, so need separate calls)
      let subTasks: any[] = []
      if (rawTasks.length > 0) {
        try {
          const subResults = await Promise.all(
            rawTasks.map((p: any) => {
              const pid = p.$id ?? p.id
              return api.tasks.list({ parentId: pid } as any).catch(() => ({ data: [] as any[] }))
            })
          )
          for (const r of subResults) {
            const docs = (r as any).data ?? []
            subTasks.push(...docs)
          }
        } catch {}
      }
      const allRaw = [...rawTasks, ...subTasks]
      tasks = allRaw.map((t) => ({
        ...t,
        id: t.$id ?? t.id,
        title: t.title ?? t.name ?? '',
        status: t.completedAt ? 'done' : t.status ?? 'pending',
      })) as Task[]
      const rawLists = (listsRes.data ?? []) as any[]
      lists = rawLists.map((l) => ({ ...l, id: l.$id ?? l.id })) as List[]
      timeStats = statsRes.data ?? {}
      // restore persisted list if exists and still valid, otherwise keep All Tasks (null)
      if (activeListId !== null && !lists.some((l) => l.id === activeListId)) {
        activeListId = null
        localStorage.removeItem(STORAGE_LIST_KEY)
      }
      } catch (e: any) { tasks = []; toast.error(e.message ?? 'Failed to load tasks') } finally { loading = false }
  }

  onMount(async () => {
    // restore persisted activeListId (if any) before first load
    try {
      const saved = localStorage.getItem(STORAGE_LIST_KEY)
      if (saved) activeListId = saved
    } catch {}
    await load()
  })

  // persist activeListId changes
  $effect(() => {
    try {
      if (activeListId) localStorage.setItem(STORAGE_LIST_KEY, activeListId)
      else localStorage.removeItem(STORAGE_LIST_KEY)
    } catch {}
  })

  function resetForm() {
    formTitle = ''
    formDesc = ''
    formDueDate = ''
    formDueTime = ''
    formListId = activeListId
    quickListId = activeListId
  }

  async function createTask(fromQuickAdd = false) {
    if (!formTitle.trim() && !quickAddTitle.trim()) return
    saving = true
    const title = formTitle.trim() || quickAddTitle.trim()
    const listId = (fromQuickAdd ? quickListId : formListId) || null
    try {
      await api.tasks.create({ title, description: formDesc.trim() || null, dueDate: formDueDate || null, dueTime: formDueTime || null, listId })
      if (fromQuickAdd) { quickAddTitle = '' } else { showAddForm = false; resetForm() }
      toast.success('Task created')
      await load()
    } catch (e: any) { toast.error(e.message ?? 'Failed to create task') } finally { saving = false }
  }

  // inline subtask (replaces prompt)
  function openSubtask(parentId: string) {
    activeSubtaskId = parentId
    subtaskDraft = ''
    const s = new Set(expanded)
    s.add(parentId)
    expanded = s
  }
  function cancelSubtask() {
    activeSubtaskId = null
    subtaskDraft = ''
  }
  async function submitSubtask(parent: Task) {
    const title = subtaskDraft.trim()
    if (!title) return
    savingSubtask = true
    try {
      await api.tasks.create({ title, parentId: parent.id, listId: parent.listId })
      toast.success('Subtask created')
      subtaskDraft = ''
      // keep input open for rapid adding; keep parent expanded
      const s = new Set(expanded)
      s.add(parent.id)
      expanded = s
      await load()
    } catch (e: any) { toast.error(e.message ?? 'Failed') }
    finally { savingSubtask = false }
  }
  async function createSubtask(parent: Task) {
    // fallback for legacy call (e.g., if TaskRow still calls createSubtask) -> open inline
    openSubtask(parent.id)
  }

  async function deleteTask(task: Task) {
    try {
      await api.tasks.delete(task.id)
      if (selectedId === task.id) selectedId = null
      toast.success('Task deleted')
      await load()
    } catch (e: any) { toast.error(e.message ?? 'Failed to delete') }
  }

  async function toggleTask(task: Task) {
    try {
      const updated: any = await api.tasks.toggle(task.id)
      task.status = updated.data?.status ?? task.status
      toast.success(updated.data?.status === 'done' ? 'Task completed' : 'Task reopened')
      await load()
    } catch (e: any) { toast.error(e.message ?? 'Failed to toggle') }
  }

  async function toggleStar(task: Task) {
    try {
      const updated: any = await api.tasks.star(task.id)
      const newVal = updated.data?.starred ?? !task.starred
      task.starred = newVal
      // trigger Svelte 5 reactivity for deriveds (starredCount, getTasks)
      tasks = [...tasks]
      // also update any matching task in array (in case task ref is stale)
      const idx = tasks.findIndex((t) => t.id === task.id)
      if (idx !== -1) (tasks[idx] as any).starred = newVal
    } catch (e: any) { toast.error(e.message ?? 'Failed') }
  }

  async function moveTask(task: Task, newListId: string | null) {
    const prev = task.listId
    const normalized = newListId === '' ? null : newListId
    if ((prev ?? null) === (normalized ?? null)) return
    // optimistic
    task.listId = normalized
    try {
      await api.tasks.update(task.id, { listId: normalized })
      const targetName = normalized ? lists.find((l) => l.id === normalized)?.name ?? 'list' : 'All Tasks'
      toast.success(`Moved to ${targetName}`)
      await load()
    } catch (e: any) {
      task.listId = prev
      toast.error(e.message ?? 'Failed to move')
    }
  }

  async function updateTaskField(task: Task, field: string, value: any) {
    try {
      await api.tasks.update(task.id, { [field]: value })
      ;(task as any)[field] = value
    } catch (e: any) { toast.error(e.message ?? 'Save failed') }
  }

  async function openInFocus(task: Task) {
    window.location.href = `/focus?taskId=${encodeURIComponent(task.id)}`
  }

  function toggleExpand(id: string) {
    const s = new Set(expanded)
    if (s.has(id)) {
      s.delete(id)
      if (activeSubtaskId === id) { activeSubtaskId = null; subtaskDraft = '' }
    } else s.add(id)
    expanded = s
  }

  // auto-expand parents that have starred subtasks when Starred filter active
  $effect(() => {
    if (filter === 'starred') {
      const s = new Set(expanded)
      let changed = false
      for (const t of tasks) {
        if (!t.parentId) {
          const kids = childMap[t.id] ?? []
          if (kids.some((k) => k.starred && k.status !== 'done')) {
            if (!s.has(t.id)) { s.add(t.id); changed = true }
          }
        }
      }
      if (changed) expanded = s
    }
  })

  async function createList() {
    if (!newListName.trim()) return
    try {
      const res: any = await api.lists.create(newListName.trim())
      const newId = res.data?.$id ?? res.data?.id
      showNewList = false
      newListName = ''
      toast.success('List created')
      if (newId) activeListId = newId
      await load()
    } catch (e: any) { toast.error(e.message ?? 'Failed') }
  }

  function confirmDeleteList(list: List) {
    listToDelete = list
  }

  async function deleteList() {
    if (!listToDelete) return
    try {
      await api.lists.delete(listToDelete.id)
      if (activeListId === listToDelete.id) activeListId = null
      toast.success('List deleted')
      listToDelete = null
      await load()
    } catch (e: any) { toast.error(e.message ?? 'Failed') }
  }

  function getTasks(): { pending: Task[]; completed: Task[] } {
    const all = tasks.filter((t: Task) => !t.parentId)
    const pending = (list: Task[]) => list.filter((t: Task) => t.status !== 'done')
    const completed = (list: Task[]) => list.filter((t: Task) => t.status === 'done')
    if (filter === 'starred') {
      const starredParentIds = new Set(tasks.filter((t) => t.parentId && t.starred && t.status !== 'done').map((t) => t.parentId!))
      // show parent if itself starred or has a starred child (pending only)
      const starredAll = all.filter((t) => t.starred || starredParentIds.has(t.id))
      return { pending: pending(starredAll), completed: completed(all.filter((t: Task) => t.starred)) }
    }
    if (filter === 'today') {
      const today = new Date().toISOString().slice(0, 10)
      return { pending: pending(all.filter((t: Task) => t.dueDate === today)), completed: [] }
    }
    if (filter === 'scheduled') {
      const today = new Date().toISOString().slice(0, 10)
      return { pending: pending(all.filter((t: Task) => t.dueDate && t.dueDate >= today)), completed: [] }
    }
        if (filter === 'done') return { pending: [], completed: all.filter((t: Task) => t.status === 'done') }
    return { pending: pending(all), completed: completed(all) }
  }

  const pendingCount = $derived(tasks.filter((t: Task) => !t.parentId && t.status !== 'done').length)
  const starredCount = $derived(tasks.filter((t: Task) => t.starred && t.status !== 'done').length)
  const selectedTask = $derived<Task | null>(tasks.find((t: Task) => t.id === selectedId) ?? null)
</script>

<div class="w-full h-full min-h-0 bg-background text-text-primary flex flex-col">
  <div class="border-b border-border bg-surface px-3 md:px-4 py-3 flex items-center justify-between sticky top-0 z-20" style="padding-top: max(0.75rem, env(safe-area-inset-top));">
    <div class="flex items-center gap-2 min-w-0">
      <button class="md:hidden w-9 h-9 rounded-lg bg-surface-elevated flex items-center justify-center hover:bg-border transition shrink-0" onclick={() => showMobileLists = true} aria-label="Open lists">
        <FolderOpen size={18} />
      </button>
      <CheckSquare size={20} class="text-primary shrink-0 hidden md:block" />
      <h1 class="text-[18px] md:text-xl font-bold text-balance break-words truncate">Tasks</h1>
      <span class="hidden sm:inline text-xs text-text-secondary bg-surface-elevated px-2 py-0.5 rounded-full shrink-0">{pendingCount}</span>
      <span class="sm:hidden text-xs bg-primary text-white px-2 py-0.5 rounded-full shrink-0">{pendingCount}</span>
      {#if starredCount > 0}<span class="hidden md:inline text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">⭐ {starredCount}</span>{/if}
    </div>
    <button
      class="flex items-center gap-1.5 px-3 md:px-3 py-2 rounded-full md:rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover active:scale-95 transition min-h-9 shrink-0"
      onclick={() => { showAddForm = !showAddForm; if (showAddForm) resetForm() }}
    >
      <Plus size={16} /> <span class="hidden sm:inline">New Task</span><span class="sm:hidden">New</span>
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
          onclick={() => { filter = f.key; activeListId = null; selectedId = null; load() }}
        >{f.label}</button>
      {/each}

      <div class="mt-3 mb-1 px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center justify-between">
        <span>Lists</span>
        <button class="hover:text-text-primary transition" onclick={() => showNewList = !showNewList}><Plus size={14} /></button>
      </div>
      {#if showNewList}
        <div class="px-2 pb-2 flex items-center gap-1">
          <input bind:value={newListName} placeholder="List name" class="min-w-0 flex-1 h-8 rounded border border-border bg-background px-2 text-sm outline-none" onkeydown={(e) => e.key === 'Enter' && createList()} />
          <button class="h-8 px-2 text-xs bg-primary text-white rounded shrink-0" onclick={createList}>Add</button>
        </div>
      {/if}
      {#if loading && lists.length === 0}
        <div class="flex flex-col gap-1.5 px-1">
          {#each [1,2,3] as _}<Skeleton class="h-8 rounded-md" />{/each}
        </div>
      {:else}
        {#each lists as list}
          <div
            class="group flex items-center gap-1 px-3 py-2 rounded-md text-sm transition cursor-pointer hover:bg-surface-elevated"
            class:bg-primary-light={activeListId === list.id}
            class:text-primary={activeListId === list.id}
            class:text-text-secondary={activeListId !== list.id}
            onclick={() => { activeListId = list.id; filter = 'all'; selectedId = null; load() }}
          >
            <FolderOpen size={14} class="shrink-0" />
            <span class="flex-1 truncate text-balance break-words">{list.name}</span>
            <button
              class="opacity-0 group-hover:opacity-100 text-error hover:bg-error/10 rounded p-0.5 transition"
              onclick={(e) => { e.stopPropagation(); confirmDeleteList(list) }}
            ><Trash2 size={12} /></button>
          </div>
        {/each}
        {#if lists.length === 0 && !showNewList && !loading}
          <p class="px-3 py-2 text-xs text-text-secondary">No custom lists yet</p>
        {/if}
      {/if}
    </aside>

    <main class="flex-1 overflow-auto p-3 md:p-4 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-4 overscroll-contain">
      <div class="flex md:hidden gap-1.5 mb-3 overflow-x-auto pb-2 scrollbar-none snap-x -mx-3 px-3">
        {#each ['all' as const,'starred' as const,'today' as const,'scheduled' as const,'done' as const] as f}
          <button
            class="snap-start shrink-0 px-3.5 py-2 rounded-full text-sm font-medium border whitespace-nowrap min-h-9 transition"
            class:bg-primary={filter === f && activeListId === null}
            class:text-white={filter === f && activeListId === null}
            class:border-primary={filter === f && activeListId === null}
            class:bg-surface={filter !== f || activeListId !== null}
            class:text-text-secondary={filter !== f || activeListId !== null}
            class:border-border={filter !== f || activeListId !== null}
            onclick={() => { filter = f; activeListId = null; selectedId = null; load() }}
          >{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        {/each}
      </div>
      {#if activeListId}
        <div class="md:hidden mb-3 flex items-center gap-2 text-sm">
          <span class="flex-1 truncate bg-primary-light text-primary px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5"><FolderOpen size={14} />{lists.find(l=>l.id===activeListId)?.name ?? 'List'}</span>
          <button class="text-xs text-text-secondary px-2 py-1 rounded-md border" onclick={() => { activeListId=null; load() }}>Clear</button>
        </div>
      {/if}

      {#if loading && tasks.length === 0}
        <div class="mb-4 flex gap-2">
          <Skeleton class="flex-1 h-11 rounded-xl" />
          <Skeleton class="hidden sm:block w-24 h-11 rounded-xl" />
          <Skeleton class="w-16 h-11 rounded-xl" />
        </div>
      {:else}
      <div class="mb-4 flex gap-2">
        <input
          type="text"
          bind:value={quickAddTitle}
          placeholder={activeListId ? `Add to list…` : "Quick add task…"}
          enterkeyhint="done"
          autocomplete="off"
          class="flex-1 min-w-0 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[15px] md:text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-balance break-words min-h-11"
          onkeydown={(e) => e.key === 'Enter' && createTask(true)}
          onfocus={(e) => { const t = e.currentTarget; t?.select() }}
        />
        <select
          bind:value={quickListId}
          title="Assign to list"
          class="hidden sm:block rounded-xl border border-border bg-surface px-2 py-2.5 text-sm outline-none min-h-11"
          aria-label="Assign to list"
        >
          <option value="">No list</option>
          {#each lists as list}<option value={list.id}>{list.name}</option>{/each}
        </select>
        <button
          class="px-4 md:px-3 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-50 hover:bg-primary-hover active:scale-95 transition min-h-11 shrink-0"
          onclick={() => createTask(true)}
          disabled={!quickAddTitle.trim() || saving}
        >Add</button>
      </div>
      {/if}

      {#if showAddForm}
        <div class="mb-4 rounded-2xl border border-border bg-surface p-4 flex flex-col gap-3 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-base">New Task</span>
            <button class="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-text-secondary hover:text-text-primary active:scale-95 transition" onclick={() => { showAddForm = false; resetForm() }} aria-label="Close"><X size={16} /></button>
          </div>
          <input type="text" bind:value={formTitle} placeholder="Task title *" enterkeyhint="done" class="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-[15px] md:text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-balance break-words min-h-11" onkeydown={(e) => e.key === 'Enter' && createTask(false)} onfocus={(e) => { const t = e.currentTarget; t?.select() }} />
          <textarea bind:value={formDesc} placeholder="Description (optional)" rows={2} class="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-[15px] md:text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none text-balance break-words" />
          <div class="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <div class="flex items-center gap-2 flex-wrap">
              <CalendarDays size={16} class="text-text-secondary shrink-0" />
              <input type="date" bind:value={formDueDate} class="flex-1 min-w-[140px] rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-11" />
              <input type="time" bind:value={formDueTime} class="rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-11" />
            </div>
            <div class="flex items-center gap-2 flex-1">
              <FolderOpen size={16} class="text-text-secondary shrink-0" />
              <select bind:value={formListId} class="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-11" aria-label="Assign to list">
                <option value="">No list</option>
                {#each lists as list}<option value={list.id}>{list.name}</option>{/each}
              </select>
            </div>
          </div>
          <button class="self-stretch sm:self-end px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-50 min-h-11 active:scale-95 transition" onclick={() => createTask(false)} disabled={saving || !formTitle.trim()}>
            {saving ? 'Saving...' : 'Create Task'}
          </button>
        </div>
      {/if}

      {#if loading && tasks.length === 0}
        <div class="flex flex-col gap-2">{#each [1,2,3,4] as _}<Skeleton class="h-12 rounded-lg" />{/each}</div>
      {:else}
        {@const pending = getTasks().pending}
        {@const completed = getTasks().completed}
        {#if pending.length === 0 && completed.length === 0}
          <div class="w-full rounded-xl border border-dashed border-border bg-surface p-12 text-center">
            <p class="text-base font-semibold text-balance break-words">No tasks here</p>
            <p class="text-sm leading-relaxed text-text-secondary mt-1 text-balance break-words">
              {activeListId ? 'This list is empty. Create a task above.' : 'Create your first task to stay organized.'}
            </p>
            <button class="mt-4 px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold" onclick={() => { showAddForm = true; filter = 'all' }}>+ New Task</button>
          </div>
        {:else}
          <div class="flex flex-col gap-1.5">
            {#each pending as task (task.id)}
              <TaskRow
                {task}
                kids={filter === 'starred' ? (childMap[task.id] ?? []).filter((k) => k.starred && k.status !== 'done') : (childMap[task.id] ?? [])}
                hasKids={(filter === 'starred' ? (childMap[task.id] ?? []).filter((k) => k.starred && k.status !== 'done').length : (childMap[task.id] ?? []).length) > 0}
                isExp={filter === 'starred' ? ((childMap[task.id] ?? []).some((k) => k.starred && k.status !== 'done') || expanded.has(task.id)) : expanded.has(task.id)}
                {selectedId}
                {timeStats}
                {lists}
                {isOverdue}
                toggleTask={(t) => toggleTask(t)}
                toggleStar={(t) => toggleStar(t)}
                openInFocus={(t) => openInFocus(t)}
                createSubtask={(t) => createSubtask(t)}
                deleteTask={(t) => deleteTask(t)}
                toggleExpand={(id) => toggleExpand(id)}
                select={(id) => selectedId = id}
                onMove={(t, newId) => moveTask(t, newId)}
                activeSubtaskId={activeSubtaskId}
                subtaskDraft={subtaskDraft}
                savingSubtask={savingSubtask && activeSubtaskId === task.id}
                onOpenSubtask={(id) => openSubtask(id)}
                onSubmitSubtask={(p) => submitSubtask(p)}
                onCancelSubtask={() => cancelSubtask()}
                onDraftChange={(v) => subtaskDraft = v}
              />
            {/each}

            {#if completed.length > 0}
              <div class="mt-2 flex flex-col gap-1.5">
                <button
                  class="flex items-center gap-2 px-1 py-2 text-sm font-semibold text-text-secondary hover:text-text-primary transition select-none"
                  aria-expanded={showCompleted}
                  onclick={() => showCompleted = !showCompleted}
                >
                  {#if showCompleted}<ChevronDown size={16} />{:else}<ChevronRight size={16} />{/if}
                  <span>Selesai</span>
                  <span class="text-xs font-medium bg-surface-elevated px-2 py-0.5 rounded-full">{completed.length}</span>
                </button>
                {#if showCompleted}
                  {#each completed as task (task.id)}
                    <TaskRow
                      {task}
                      kids={childMap[task.id] ?? []}
                      hasKids={(childMap[task.id] ?? []).length > 0}
                      isExp={expanded.has(task.id) || (filter === 'starred' && (childMap[task.id] ?? []).some((k) => k.starred))}
                      {selectedId}
                      {timeStats}
                      {lists}
                      {isOverdue}
                      toggleTask={(t) => toggleTask(t)}
                      toggleStar={(t) => toggleStar(t)}
                      openInFocus={(t) => openInFocus(t)}
                      createSubtask={(t) => createSubtask(t)}
                      deleteTask={(t) => deleteTask(t)}
                      toggleExpand={(id) => toggleExpand(id)}
                      select={(id) => selectedId = id}
                      onMove={(t, newId) => moveTask(t, newId)}
                      activeSubtaskId={activeSubtaskId}
                      subtaskDraft={subtaskDraft}
                      savingSubtask={savingSubtask && activeSubtaskId === task.id}
                      onOpenSubtask={(id) => openSubtask(id)}
                      onSubmitSubtask={(p) => submitSubtask(p)}
                      onCancelSubtask={() => cancelSubtask()}
                      onDraftChange={(v) => subtaskDraft = v}
                    />
                  {/each}
                {/if}
              </div>
            {/if}
            {#if loading && tasks.length > 0}
              <div class="flex flex-col gap-1.5 mt-2">
                {#each [1,2] as _}<Skeleton class="h-12 rounded-lg" />{/each}
              </div>
            {/if}
          </div>
        {/if}
      {/if}
    </main>

    {#if selectedTask}
      <!-- Desktop detail -->
      <aside class="hidden lg:flex flex-col w-80 border-l border-border bg-surface p-4 gap-4 shrink-0 overflow-auto">
        <div class="flex items-center justify-between">
          <span class="font-semibold text-base">Task Details</span>
          <button class="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-text-secondary hover:text-text-primary transition" onclick={() => selectedId = null} aria-label="Close"><X size={16} /></button>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="task-check w-6 h-6 rounded border-2 flex items-center justify-center shrink-0"
            class:border-primary.bg-primary.text-white={selectedTask.status === 'done'}
            class:border-text-secondary={selectedTask.status !== 'done'}
            aria-pressed={selectedTask.status === 'done'}
            onclick={() => toggleTask(selectedTask)}
          >
            {#if selectedTask.status === 'done'}<span class="check-pop flex items-center justify-center"><Check size={14} strokeWidth={4} /></span>{/if}
          </button>
          <input type="text" value={selectedTask.title} class="flex-1 text-sm font-medium bg-transparent border-none outline-none text-balance break-words min-w-0" onchange={(e) => updateTaskField(selectedTask, 'title', (e.target as HTMLInputElement).value)} />
          <button class="w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0 hover:bg-yellow-500/20 transition" onclick={() => toggleStar(selectedTask!)} title="Star" aria-label="Star task"><Star size={16} class={selectedTask.starred ? 'fill-current' : ''} /></button>
        </div>
        <textarea value={selectedTask.description ?? ''} rows={4} class="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm resize-none outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-balance break-words" onchange={(e) => updateTaskField(selectedTask, 'description', (e.target as HTMLTextAreaElement).value)} />
        <div class="flex flex-wrap gap-3 text-sm">
          <div class="flex items-center gap-1 text-text-secondary">
            <CalendarDays size={14} />
            <input type="date" value={selectedTask.dueDate ?? ''} class="bg-transparent px-1 text-sm outline-none" onchange={(e) => updateTaskField(selectedTask, 'dueDate', (e.target as HTMLInputElement).value || null)} />
          </div>
          <div class="flex items-center gap-1 text-text-secondary">
            <Clock size={14} />
            <input type="time" value={selectedTask.dueTime ?? ''} class="bg-transparent px-1 text-sm outline-none" onchange={(e) => updateTaskField(selectedTask, 'dueTime', (e.target as HTMLInputElement).value || null)} />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <FolderOpen size={14} class="text-text-secondary shrink-0" />
          <select value={selectedTask.listId ?? ''} onchange={(e) => moveTask(selectedTask, (e.target as HTMLSelectElement).value || null)} class="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none min-h-11">
            <option value="">No list (All Tasks)</option>
            {#each lists as list}<option value={list.id}>{list.name}</option>{/each}
          </select>
        </div>
        {#if selectedTask && timeStats[selectedTask.id]}
          <div class="rounded-xl border border-border bg-surface-elevated p-3 flex items-center gap-3">
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
          <div class="rounded-xl border border-dashed border-border bg-surface-elevated p-3 text-center">
            <p class="text-xs text-text-secondary">No sessions logged yet</p>
          </div>
        {/if}

        <div class="flex gap-2">
          <button class="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover active:scale-95 transition min-h-11" onclick={() => openInFocus(selectedTask)}>
            <Play size={14} /> Start Focus
          </button>
          <button class="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border border-error text-error text-sm hover:bg-error/10 active:scale-95 transition min-h-11" onclick={() => deleteTask(selectedTask)}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </aside>
      <!-- Mobile bottom sheet -->
      <div class="lg:hidden">
        <BottomSheet open={!!selectedTask} title="Task Details" onClose={() => selectedId = null}>
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-2">
              <button
                class="task-check w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0"
                class:border-primary.bg-primary.text-white={selectedTask.status === 'done'}
                class:border-text-secondary={selectedTask.status !== 'done'}
                aria-pressed={selectedTask.status === 'done'}
                onclick={() => toggleTask(selectedTask)}
              >
                {#if selectedTask.status === 'done'}<span class="check-pop flex items-center justify-center"><Check size={14} strokeWidth={4} /></span>{/if}
              </button>
              <input type="text" value={selectedTask.title} class="flex-1 text-[15px] font-medium bg-transparent border-b border-border pb-1 outline-none focus:border-primary text-balance break-words" onchange={(e) => updateTaskField(selectedTask, 'title', (e.target as HTMLInputElement).value)} />
              <button class="w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center" onclick={() => toggleStar(selectedTask)}><Star size={16} class={selectedTask.starred ? 'fill-current' : ''} /></button>
            </div>
            <textarea value={selectedTask.description ?? ''} rows={3} placeholder="Description" class="w-full rounded-xl border border-border bg-background px-3 py-3 text-[15px] resize-none outline-none focus:ring-2 focus:ring-primary/20" onchange={(e) => updateTaskField(selectedTask, 'description', (e.target as HTMLTextAreaElement).value)} />
            <div class="grid grid-cols-2 gap-3">
              <label class="flex flex-col gap-1">
                <span class="text-xs text-text-secondary flex items-center gap-1"><CalendarDays size={12} /> Date</span>
                <input type="date" value={selectedTask.dueDate ?? ''} class="rounded-xl border border-border bg-background px-3 py-2.5 text-sm min-h-11" onchange={(e) => updateTaskField(selectedTask, 'dueDate', (e.target as HTMLInputElement).value || null)} />
              </label>
              <label class="flex flex-col gap-1">
                <span class="text-xs text-text-secondary flex items-center gap-1"><Clock size={12} /> Time</span>
                <input type="time" value={selectedTask.dueTime ?? ''} class="rounded-xl border border-border bg-background px-3 py-2.5 text-sm min-h-11" onchange={(e) => updateTaskField(selectedTask, 'dueTime', (e.target as HTMLInputElement).value || null)} />
              </label>
            </div>
            <label class="flex flex-col gap-1">
              <span class="text-xs text-text-secondary flex items-center gap-1"><FolderOpen size={12} /> List</span>
              <select value={selectedTask.listId ?? ''} onchange={(e) => moveTask(selectedTask, (e.target as HTMLSelectElement).value || null)} class="rounded-xl border border-border bg-background px-3 py-2.5 text-sm min-h-11">
                <option value="">No list</option>
                {#each lists as list}<option value={list.id}>{list.name}</option>{/each}
              </select>
            </label>
            {#if timeStats[selectedTask.id]}
              <div class="rounded-xl border border-border bg-surface-elevated p-3 flex items-center gap-3">
                <Timer size={18} class="text-primary shrink-0" />
                <div class="flex-1 grid grid-cols-3 gap-2 text-center">
                  <div><p class="text-[11px] text-text-secondary">Focus</p><p class="text-sm font-semibold">{formatDuration(timeStats[selectedTask.id].totalFocusSeconds)}</p></div>
                  <div><p class="text-[11px] text-text-secondary">Sessions</p><p class="text-sm font-semibold">{timeStats[selectedTask.id].sessionCount}</p></div>
                  <div><p class="text-[11px] text-text-secondary">Rest</p><p class="text-sm font-semibold">{formatDuration(timeStats[selectedTask.id].restEarnedSeconds)}</p></div>
                </div>
              </div>
            {/if}
            <div class="flex gap-3 pt-2">
              <button class="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary text-white text-[15px] font-semibold active:scale-95 transition min-h-12" onclick={() => openInFocus(selectedTask)}><Play size={16} /> Start Focus</button>
              <button class="px-4 flex items-center justify-center gap-1.5 py-3 rounded-xl border border-error text-error active:scale-95 transition min-h-12" onclick={() => deleteTask(selectedTask)}><Trash2 size={16} /></button>
            </div>
          </div>
        </BottomSheet>
      </div>
    {/if}
  </div>

  <!-- Mobile lists drawer -->
  <BottomSheet open={showMobileLists} title="Lists & Filters" onClose={() => showMobileLists = false}>
    <div class="flex flex-col gap-1">
      {#each [
        { key: 'all' as const, label: 'All Tasks' },
        { key: 'starred' as const, label: '⭐ Starred' },
        { key: 'today' as const, label: "Today's Focus" },
        { key: 'scheduled' as const, label: 'Scheduled' },
        { key: 'done' as const, label: 'Completed' },
      ] as f}
        <button
          class="flex items-center gap-2 px-3 py-3 rounded-xl text-[15px] transition text-left min-h-11"
          class:bg-primary={filter === f.key && activeListId === null}
          class:text-white={filter === f.key && activeListId === null}
          class:text-text-secondary={filter !== f.key || activeListId !== null}
          class:bg-surface-elevated={filter !== f.key || activeListId !== null}
          onclick={() => { filter = f.key; activeListId = null; selectedId = null; showMobileLists=false; load() }}
        >{f.label}</button>
      {/each}
      <div class="mt-4 mb-1 px-1 text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center justify-between">
        <span>Lists</span>
        <button class="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center hover:text-text-primary transition" onclick={() => showNewList = !showNewList}><Plus size={14} /></button>
      </div>
      {#if showNewList}
        <div class="px-1 pb-2 flex items-center gap-2">
          <input bind:value={newListName} placeholder="List name" enterkeyhint="done" class="min-w-0 flex-1 h-11 rounded-xl border border-border bg-background px-3 text-[15px] outline-none focus:ring-2 focus:ring-primary/20" onkeydown={(e) => e.key === 'Enter' && createList()} />
          <button class="h-11 px-4 text-sm bg-primary text-white rounded-xl shrink-0 font-medium" onclick={createList}>Add</button>
        </div>
      {/if}
      {#if loading && lists.length === 0}
        <div class="flex flex-col gap-1.5">
          {#each [1,2,3] as _}<Skeleton class="h-11 rounded-xl" />{/each}
        </div>
      {:else}
        {#each lists as list}
          <button
            class="flex items-center gap-2 px-3 py-3 rounded-xl text-[15px] transition text-left min-h-11 w-full"
            class:bg-primary-light={activeListId === list.id}
            class:text-primary={activeListId === list.id}
            class:bg-surface-elevated={activeListId !== list.id}
            class:text-text-secondary={activeListId !== list.id}
            onclick={() => { activeListId = list.id; filter = 'all'; selectedId = null; showMobileLists=false; load() }}
          >
            <FolderOpen size={16} class="shrink-0" />
            <span class="flex-1 truncate text-left">{list.name}</span>
            <span class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-error/10 text-error" onclick={(e) => { e.stopPropagation(); showMobileLists=false; confirmDeleteList(list) }}><Trash2 size={14} /></span>
          </button>
        {/each}
        {#if lists.length === 0 && !showNewList && !loading}
          <p class="px-3 py-3 text-sm text-text-secondary">No custom lists yet</p>
        {/if}
      {/if}
    </div>
  </BottomSheet>

  <Modal
    open={listToDelete !== null}
    title="Delete list?"
    variant="danger"
    confirmLabel="Delete"
    onClose={() => (listToDelete = null)}
    onConfirm={deleteList}
  >
    <p>Tasks in "<strong>{listToDelete?.name}</strong>" will be unlinked but not deleted.</p>
  </Modal>
</div>
