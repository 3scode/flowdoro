<script lang="ts">
  import type { Component } from 'svelte'

  let {
    label = '',
    value = '',
    icon = undefined as Component | undefined,
    highlight = false,
    onClick = undefined as (() => void) | undefined,
  }: {
    label: string
    value: string
    icon?: Component
    highlight?: boolean
    onClick?: () => void
  } = $props()
</script>

<div
  role={onClick ? 'button' : 'article'}
  tabindex={onClick ? 0 : undefined}
  onclick={onClick}
  onkeydown={onClick ? (e: KeyboardEvent) => e.key === 'Enter' && onClick() : undefined}
  class="rounded-lg border p-4 flex flex-col gap-2 transition-all"
  class:bg-surface={!highlight}
  class:shadow-sm={!highlight}
  class:bg-primary-light={highlight}
  class:border-primary={highlight}
  class:cursor-pointer={!!onClick}
  class:hover:shadow-md={!!onClick}
>
  <div class="flex items-center gap-2 text-text-secondary text-sm">
    {#if icon}
      {@const Icon = icon}
      <Icon size={18} />
    {/if}
    <span>{label}</span>
  </div>
  <span class="text-2xl font-bold text-text-primary">{value}</span>
</div>
