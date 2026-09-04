<script lang="ts">
  import { LayoutDashboard, Timer, History, BarChart3, Settings, LogOut, CheckSquare } from 'lucide-svelte'

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/focus', label: 'Focus', icon: Timer },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/history', label: 'History', icon: History },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  let { currentPath = '/dashboard', onNavigate = (_p: string) => {} } : { currentPath?: string, onNavigate?: (p: string) => void } = $props()
</script>

<nav class="hidden md:flex flex-col gap-1 p-4 w-56 lg:w-60 shrink-0 border-r border-border bg-surface" role="navigation" aria-label="Main navigation">
  <div class="flex items-center gap-2 px-2 py-4 text-lg font-bold text-primary">
    <Timer size={24} /> Flowdoro
  </div>
  {#each navItems as item}
    {@const active = currentPath === item.path}
    <button
      class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition min-h-11"
      class:bg-primary-light={active}
      class:text-primary={active}
      class:text-text-secondary={!active}
      class:hover:bg-surface-elevated={!active}
      aria-current={active ? 'page' : undefined}
      onclick={() => onNavigate(item.path)}
    >
      <item.icon size={18} /> {item.label}
    </button>
  {/each}
</nav>

<nav class="flex md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80" role="navigation" aria-label="Main navigation" style="padding-bottom: env(safe-area-inset-bottom);">
  <div class="grid grid-cols-6 w-full gap-0">
    {#each navItems as item}
      {@const active = currentPath === item.path}
      <button
        class="flex flex-col items-center justify-center gap-1 py-2.5 px-1 min-h-[56px] min-w-0 font-medium transition relative"
        class:text-primary={active}
        class:text-text-secondary={!active}
        onclick={() => onNavigate(item.path)}
        aria-label={item.label}
        aria-current={active ? 'page' : undefined}
      >
        {#if active}<span class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"></span>{/if}
        <item.icon size={20} strokeWidth={active ? 2.2 : 1.8} />
        <span class="text-[10px] leading-none truncate w-full text-center">{item.label}</span>
      </button>
    {/each}
  </div>
</nav>
