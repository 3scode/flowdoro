<script lang="ts">
  import { onMount } from 'svelte'
  import { auth } from '$lib/stores/auth'
  import Landing from '$lib/pages/Landing.svelte'
  import Login from '$lib/pages/Login.svelte'
  import Register from '$lib/pages/Register.svelte'
  import ForgotPassword from '$lib/pages/ForgotPassword.svelte'
  import ResetPassword from '$lib/pages/ResetPassword.svelte'
  import Dashboard from '$lib/pages/Dashboard.svelte'
  import Focus from '$lib/pages/Focus.svelte'
  import History from '$lib/pages/History.svelte'
  import Analytics from '$lib/pages/Analytics.svelte'
  import Settings from '$lib/pages/Settings.svelte'
  import Tasks from '$lib/pages/Tasks.svelte'
  import Navigation from '$lib/components/layout/Navigation.svelte'
  import ToastContainer from '$lib/components/ui/ToastContainer.svelte'
  import Skeleton from '$lib/components/ui/Skeleton.svelte'
  import { toast } from '$lib/stores/toast'

  let path = $state(window.location.pathname)
  let user: any = $state(null)
  let authLoading = $state(true)
  auth.subscribe((v) => (user = v))

  const publicPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password']

  function navigate(p: string) {
    history.pushState({}, '', p)
    path = p
    window.scrollTo(0, 0)
  }

  onMount(() => {
    const saved = localStorage.getItem('flowdoro-theme') ?? 'dark'
    const isDark = saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', isDark)
    // handle OAuth error redirect (e.g. ?error=access_denied&error_description=...)
    try {
      const p = new URLSearchParams(window.location.search)
      const err = p.get('error')
      if (err) {
        const desc = p.get('error_description')
        const all = p.getAll('error')
        const real = all.length > 1 ? all[all.length - 1] : err
        let msg = desc || ''
        if (!msg) {
          if (real === 'account_not_linked' || err === 'account_not_linked') msg = 'Email sudah terdaftar pakai password — login password dulu lalu link Google di Settings'
          else if (real === 'unable_to_link_account') msg = 'Gagal link akun — coba login password dulu'
          else if (real === 'access_denied') msg = 'Google login dibatalkan (access_denied)'
          else if (real === 'state_mismatch' || real === 'state_not_found' || real === 'state_invalid') msg = `State mismatch (${real}) — cookie blocked`
          else if (err !== 'google' && real) msg = `OAuth error: ${real}`
        }
        if (msg) toast.error(msg)
        setTimeout(() => { try { window.history.replaceState({}, '', window.location.pathname) } catch {} }, 3000)
      }
    } catch {}
    auth.fetchMe().finally(() => (authLoading = false))
    window.addEventListener('popstate', () => (path = window.location.pathname))
    // keyboard shortcuts for focus page — ignore when typing
    window.addEventListener('keydown', (e) => {
      if (path !== '/focus') return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return
      if (e.code === 'Space') { e.preventDefault(); document.querySelector<HTMLButtonElement>('[data-testid="focus-primary"]')?.click() }
    })
  })

  const isPublic = $derived(publicPaths.some((p) => path === p || path.startsWith(p + '?') || path.startsWith(p + '/')) || publicPaths.includes(path))
  const needsAuth = $derived(!isPublic && !user && path !== '/')
  // Better Auth uses httpOnly cookie — no localStorage token needed; keep legacy fallback for migration
  $effect(() => {
    if (!isPublic && !user) {
      const hasLegacy = (() => { try { return !!localStorage.getItem('flowdoro_token') } catch { return false } })()
      if (hasLegacy) auth.fetchMe().finally(() => (authLoading = false))
    }
  })
</script>

{#if path === '/'}
  <Landing onNavigate={navigate} />
{:else if path === '/login'}
  <Login onNavigate={navigate} />
{:else if path === '/register'}
  <Register onNavigate={navigate} />
{:else if path === '/forgot-password' || path.startsWith('/forgot-password')}
  <ForgotPassword onNavigate={navigate} />
{:else if path === '/reset-password' || path.startsWith('/reset-password')}
  <ResetPassword onNavigate={navigate} />
{:else}
  <div class="h-[100dvh] h-dvh flex bg-background text-text-primary overflow-hidden">
    <Navigation currentPath={path} onNavigate={navigate} />
    <div class="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
      <header class="shrink-0 sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80 px-3 md:px-4 py-2.5 md:py-3" style="padding-top: max(0.75rem, env(safe-area-inset-top)); padding-left: max(1rem, env(safe-area-inset-left)); padding-right: max(1rem, env(safe-area-inset-right));">
        <button class="font-bold text-primary text-[15px] flex items-center gap-1.5 min-h-9 px-1 -ml-1 rounded-md hover:bg-surface-elevated transition" onclick={() => navigate('/dashboard')}>◉ Flowdoro</button>
        <div class="flex items-center gap-1.5 md:gap-2">
          {#if authLoading && !user}
            <Skeleton class="h-8 w-24 rounded-full" />
            <Skeleton class="h-8 w-16 rounded-full" />
          {:else}
            <button class="text-sm text-text-secondary truncate max-w-[110px] md:max-w-[160px] min-h-9 px-2.5 rounded-full md:rounded-md hover:bg-surface-elevated active:scale-95 transition" onclick={() => navigate('/dashboard')}>{user?.name ?? 'Guest'}</button>
            {#if user}<button class="text-xs font-medium text-error min-h-9 px-3 rounded-full border border-error/20 hover:bg-error/10 active:scale-95 transition" onclick={async () => { await auth.logout(); navigate('/') }}>Logout</button>{/if}
          {/if}
        </div>
      </header>
      <main class="flex-1 overflow-y-auto overscroll-contain min-h-0">
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

<ToastContainer />
