<script lang="ts">
  import { Clock, Coffee } from 'lucide-svelte'
  import { formatDuration } from '$lib/utils/time'

  let {
    session,
    compact = false,
    onClick = undefined as (() => void) | undefined,
  }: {
    session: { taskName?: string; durationSeconds: number; restEarnedSeconds: number; startedAt: string }
    compact?: boolean
    onClick?: () => void
  } = $props()

  const dateLabel = $derived(new Date(session.startedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
</script>

<div
  role="listitem"
  tabindex={onClick ? 0 : undefined}
  onclick={onClick}
  onkeydown={onClick ? (e: KeyboardEvent) => e.key === 'Enter' && onClick() : undefined}
  class="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition hover:bg-surface-elevated hover:shadow-sm"
  class:cursor-pointer={!!onClick}
>
  <div class="flex items-center gap-3">
    <span class="w-2 h-2 rounded-full bg-success shrink-0"></span>
    <div class="flex flex-col">
      <span class="text-sm font-medium text-text-primary">{session.taskName ?? 'No task'}</span>
      <span class="text-xs text-text-secondary">{dateLabel}</span>
    </div>
  </div>
  <div class="flex items-center gap-4 text-xs text-text-secondary">
    <span class="flex items-center gap-1"><Clock size={14} /> {formatDuration(session.durationSeconds)}</span>
    <span class="flex items-center gap-1"><Coffee size={14} /> {formatDuration(session.restEarnedSeconds)}</span>
  </div>
</div>
