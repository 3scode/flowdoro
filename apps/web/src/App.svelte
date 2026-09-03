<script lang="ts">
  import { onMount } from 'svelte'
  import { auth } from '$lib/stores/auth'
  import Landing from '$lib/pages/Landing.svelte'
  import Login from '$lib/pages/Login.svelte'
  import Register from '$lib/pages/Register.svelte'
  import Dashboard from '$lib/pages/Dashboard.svelte'
  import Focus from '$lib/pages/Focus.svelte'
  import History from '$lib/pages/History.svelte'
  import Analytics from '$lib/pages/Analytics.svelte'
  import Settings from '$lib/pages/Settings.svelte'
  import Tasks from '$lib/pages/Tasks.svelte'
  import Navigation from '$lib/components/layout/Navigation.svelte'
  import Agentation from '$lib/components/Agentation.svelte'

  let path = $state(window.location.pathname)
  let user: any = $state(null)
  auth.subscribe((v) => (user = v))

  const publicPaths = ['/', '/login', '/register']

  function navigate(p: string) {
    history.pushState({}, '', p)
    path = p
    window.scrollTo(0, 0)
  }

  onMount(() => {
    const saved = localStorage.getItem('flowdoro-theme') ?? 'dark'
    const isDark = saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', isDark)
    auth.fetchMe()
    window.addEventListener('popstate', () => (path = window.location.pathname))
    // keyboard shortcuts for focus page
    window.addEventListener('keydown', (e) => {
      if (path !== '/focus') return
      if (e.code === 'Space') { e.preventDefault(); document.querySelector<HTMLButtonElement>('[data-testid="focus-primary"]')?.click() }
    })
  })

  const isPublic = $derived(publicPaths.includes(path))
  const needsAuth = $derived(!isPublic && !user && path !== '/')
  $effect(() => {
    if (!isPublic && localStorage.getItem('flowdoro_token')) {
      auth.fetchMe()
    }
  })
</script>

{#if path === '/'}
  <Landing onNavigate={navigate} />
{:else if path === '/login'}
  <Login onNavigate={navigate} />
{:else if path === '/register'}
  <Register onNavigate={navigate} />
{:else}
  <div class="min-h-screen flex bg-background text-text-primary">
    <Navigation currentPath={path} onNavigate={navigate} />
    <div class="flex-1 flex flex-col min-w-0">
      <header class="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <span class="font-bold text-primary">◉ Flowdoro</span>
        <div class="flex items-center gap-3">
          <button class="text-sm text-text-secondary" onclick={() => navigate('/dashboard')}>{user?.name ?? 'Guest'}</button>
          {#if user}<button class="text-xs text-error" onclick={async () => { await auth.logout(); navigate('/') }}>Logout</button>{/if}
        </div>
      </header>
      <main class="flex-1 overflow-auto">
        {#if path === '/dashboard'}<Dashboard onNavigate={navigate} />
        {:else if path === '/focus'}<Focus />
        {:else if path === '/history'}<History />
        {:else if path === '/analytics'}<Analytics />
        {:else if path === '/settings'}<Settings />
        {:else if path === '/tasks'}<Tasks />
        {:else}
          <div class="p-12 text-center"><p>Page not found</p><button class="text-primary" onclick={() => navigate('/dashboard')}>Go to Dashboard</button></div>
        {/if}
      </main>
    </div>
  </div>
{/if}

{#if import.meta.env.DEV}
  <Agentation />
{/if}
