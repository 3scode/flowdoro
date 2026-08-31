<script lang="ts">
  import { LayoutDashboard, Timer, History, BarChart3, Settings, LogOut } from 'lucide-svelte'

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/focus', label: 'Focus', icon: Timer },
    { path: '/history', label: 'History', icon: History },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  let { currentPath = '/dashboard', onNavigate = (_p: string) => {} } : { currentPath?: string, onNavigate?: (p: string) => void } = $props()
</script>

<nav class="hidden md:flex flex-col gap-1 p-4 w-56 shrink-0 border-r border-border bg-surface" role="navigation" aria-label="Main navigation">
  <div class="flex items-center gap-2 px-2 py-4 text-lg font-bold text-primary">
    <Timer size={24} /> Flowdoro
  </div>
  {#each navItems as item}
    {@const active = currentPath === item.path}
    <button
      class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition"
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

<nav class="flex md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-surface" role="navigation" aria-label="Main navigation">
  {#each navItems as item}
    {@const active = currentPath === item.path}
    <button
      class="flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium"
      class:text-primary={active}
      class:text-text-secondary={!active}
      onclick={() => onNavigate(item.path)}
      aria-label={item.label}
      aria-current={active ? 'page' : undefined}
    >
      <item.icon size={20} /> {item.label}
    </button>
  {/each}
</nav>
