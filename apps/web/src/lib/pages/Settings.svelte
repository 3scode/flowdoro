<script lang="ts">
  import { onMount } from 'svelte'
  import { api } from '$lib/api/client'
  import { auth } from '$lib/stores/auth'
  import { toast } from '$lib/stores/toast'
  import Modal from '$lib/components/ui/Modal.svelte'
  import Skeleton from '$lib/components/ui/Skeleton.svelte'
  let user: any = $state(null)
  let userLoading = $state(true)
  let restRatio = $state(5)
  let theme = $state('system')
  let saving = $state(false)
  let googleStatus = $state<{ connected: boolean; calendarId?: string; expiresAt?: string }>({ connected: false })
  let googleLoading = $state(true)
  let googleConnecting = $state(false)
  let linkedAccounts: any[] = $state([])
  let accountsLoading = $state(true)
  let linkingProvider = $state('')

  // change password states
  let currentPassword = $state('')
  let newPassword = $state('')
  let confirmPassword = $state('')
  let changing = $state(false)
  let showChangeModal = $state(false)
  let oauthNoPassword = $state(false)
  let strength = $derived(newPassword.length < 6 ? 'weak' : newPassword.length < 10 ? 'medium' : 'strong')

  onMount(async () => {
    try { const res = await api.get('/api/me'); user = res.data; restRatio = user.restRatio ?? 5; theme = user.theme ?? 'system' } catch {} finally { userLoading = false }
    try {
      const res: any = await api.google.status()
      googleStatus = res.data ?? { connected: false }
    } catch { googleStatus = { connected: false } } finally { googleLoading = false }
    try {
      const acc: any = await auth.listAccounts()
      linkedAccounts = Array.isArray(acc) ? acc : (acc?.data ?? [])
    } catch { linkedAccounts = [] } finally { accountsLoading = false }
    const params = new URLSearchParams(window.location.search)
    if (params.get('google') === 'connected') {
      try { const res: any = await api.google.status(); googleStatus = res.data } catch {}
      window.history.replaceState({}, '', '/settings')
      toast.success('Google Calendar connected!')
    }
    if (params.get('linked')) {
      const p = params.get('linked')
      window.history.replaceState({}, '', '/settings')
      toast.success(`${p} account linked!`)
      try {
        const acc: any = await auth.listAccounts()
        linkedAccounts = Array.isArray(acc) ? acc : (acc?.data ?? [])
      } catch {}
    }
    if (params.get('error') === 'account_not_linked') {
      toast.error('Gagal link — coba login password dulu lalu link dari sini')
    }
  })

  async function linkAccount(provider: string) {
    linkingProvider = provider
    try {
      await auth.linkSocial(provider)
      // linkSocial will redirect to Google, no toast here
    } catch (e: any) {
      toast.error(e.message ?? `Failed to link ${provider}`)
      linkingProvider = ''
    }
  }

  async function save() {
    saving = true
    try {
      await api.patch('/api/me', { restRatio, theme })
      toast.success('Saved!')
      document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches))
      localStorage.setItem('flowdoro-theme', theme)
    } catch (e: any) { toast.error(e.message ?? 'Save failed') }
    finally { saving = false }
  }

  async function connectGoogle() {
    googleConnecting = true
    try {
      const res: any = await api.google.connect()
      if (res.data?.url) window.location.href = res.data.url
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to connect Google')
    } finally { googleConnecting = false }
  }

  async function disconnectGoogle() {
    try {
      await api.google.disconnect()
      googleStatus = { connected: false }
      toast.success('Google disconnected')
    } catch (e: any) {
      toast.error(e.message ?? 'Disconnect failed')
    }
  }

  function goForgot() {
    history.pushState({}, '', '/forgot-password')
    window.dispatchEvent(new PopStateEvent('popstate'))
    window.scrollTo(0, 0)
  }

  async function handleChangePassword(e?: Event) {
    if (e) e.preventDefault()
    if (!currentPassword || !newPassword) { toast.error('Isi semua field'); return }
    if (newPassword.length < 8) { toast.error('Password min 8 chars'); return }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return }
    changing = true
    oauthNoPassword = false
    try {
      await auth.changePassword(currentPassword, newPassword)
      toast.success('Password updated — device lain telah logout')
      currentPassword = ''; newPassword = ''; confirmPassword = ''
      showChangeModal = false
    } catch (err: any) {
      const code = err.code ?? ''
      const msg = err.message ?? 'Failed to change password'
      if (code === 'CREDENTIAL_ACCOUNT_NOT_FOUND' || /credential/i.test(msg)) {
        oauthNoPassword = true
        toast.error('Akun Google/GitHub belum punya password — gunakan Forgot Password')
      } else if (/invalid.*password|incorrect|INVALID_PASSWORD/i.test(msg) || code === 'INVALID_PASSWORD') {
        toast.error('Password lama salah')
      } else if (/too short|PASSWORD_TOO_SHORT/i.test(msg)) {
        toast.error('Password baru terlalu pendek — min 8')
      } else {
        toast.error(msg)
      }
    } finally { changing = false }
  }
</script>

<div class="w-full max-w-2xl mx-auto px-4 py-6 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-6 flex flex-col gap-5 md:gap-6">
  <h1 class="w-full text-[22px] md:text-2xl font-bold text-balance break-words">Settings</h1>
  <section class="w-full rounded-2xl border border-border bg-surface p-5 md:p-6 flex flex-col gap-4">
    <h2 class="w-full font-semibold text-balance break-words">Profile</h2>
    {#if userLoading}
      <div class="flex flex-col gap-3">
        <Skeleton class="h-4 w-48" />
        <Skeleton class="h-4 w-64" />
      </div>
    {:else if user}
      <p class="w-full text-sm leading-relaxed break-words"><span class="text-text-secondary">Name:</span> {user.name}</p>
      <p class="w-full text-sm leading-relaxed break-words"><span class="text-text-secondary">Email:</span> {user.email}</p>
    {:else}
      <p class="w-full text-sm leading-relaxed text-text-secondary break-words">Failed to load profile.</p>
    {/if}
  </section>
  <section class="w-full rounded-2xl border border-border bg-surface p-5 md:p-6 flex flex-col gap-4">
    <div class="flex items-center justify-between gap-2">
      <h2 class="font-semibold text-balance break-words">Security</h2>
      <button class="text-xs font-medium text-primary hover:underline min-h-8 px-2 shrink-0" onclick={() => showChangeModal = true}>Open in modal</button>
    </div>
    {#if oauthNoPassword}
      <div class="rounded-xl bg-warning/10 border border-warning/20 px-3 py-3 text-sm leading-relaxed text-text-primary break-words">
        Akun Google/GitHub belum punya password.
        <button class="text-primary font-medium underline ml-1" onclick={goForgot}>Set via Forgot Password</button>
      </div>
      <form onsubmit={handleChangePassword} class="flex flex-col gap-3 opacity-60 pointer-events-none">
        <label class="flex flex-col gap-1.5">
          <span class="text-sm font-medium text-text-secondary">Current Password</span>
          <input type="password" disabled placeholder="••••••••" class="h-11 min-h-11 rounded-xl border border-border bg-surface px-3.5 outline-none text-[16px] md:text-sm opacity-50" />
        </label>
        <label class="flex flex-col gap-1.5">
          <span class="text-sm font-medium text-text-secondary">New Password</span>
          <input type="password" disabled placeholder="••••••••" class="h-11 min-h-11 rounded-xl border border-border bg-surface px-3.5 outline-none text-[16px] md:text-sm opacity-50" />
        </label>
        <button disabled class="h-11 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 min-h-11">Update Password</button>
      </form>
    {:else}
      <form onsubmit={handleChangePassword} class="flex flex-col gap-3">
        <label class="flex flex-col gap-1.5">
          <span class="text-sm font-medium text-text-secondary break-words">Current Password</span>
          <input bind:value={currentPassword} type="password" required placeholder="••••••••" autocomplete="current-password" class="h-11 min-h-11 rounded-xl border border-border bg-surface px-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-[16px] md:text-sm" />
        </label>
        <label class="flex flex-col gap-1.5">
          <span class="text-sm font-medium text-text-secondary break-words">New Password</span>
          <input bind:value={newPassword} type="password" required placeholder="••••••••" autocomplete="new-password" class="h-11 min-h-11 rounded-xl border border-border bg-surface px-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-[16px] md:text-sm" />
          {#if newPassword}<div class="h-1 rounded-full bg-border overflow-hidden"><div class="h-full transition-all" class:bg-error={strength==='weak'} class:bg-warning={strength==='medium'} class:bg-success={strength==='strong'} style="width: {strength==='weak' ? '33%' : strength==='medium' ? '66%' : '100%'}"></div></div><p class="text-xs {strength==='weak' ? 'text-error' : strength==='medium' ? 'text-warning' : 'text-success'}">{strength==='weak' ? 'Weak — add more characters' : strength==='medium' ? 'Medium — good, add symbols for strong' : 'Strong'} — min 8 chars</p>{/if}
        </label>
        <label class="flex flex-col gap-1.5">
          <span class="text-sm font-medium text-text-secondary break-words">Confirm New Password</span>
          <input bind:value={confirmPassword} type="password" required placeholder="••••••••" autocomplete="new-password" class="h-11 min-h-11 rounded-xl border border-border bg-surface px-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-[16px] md:text-sm {confirmPassword && confirmPassword !== newPassword ? 'border-error focus:border-error focus:ring-error/20' : ''}" />
          {#if confirmPassword && confirmPassword !== newPassword}<p class="text-xs text-error">Passwords do not match</p>{/if}
        </label>
        <button type="submit" disabled={changing || !currentPassword || !newPassword || newPassword !== confirmPassword} class="h-11 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 active:scale-[0.98] transition min-h-11">
          {#if changing}Updating…{:else}Update Password{/if}
        </button>
        <p class="text-xs leading-relaxed text-text-secondary break-words">Mengganti password akan logout device lain untuk keamanan.</p>
      </form>
    {/if}
  </section>
  <section class="w-full rounded-2xl border border-border bg-surface p-5 md:p-6 flex flex-col gap-4">
    <h2 class="w-full font-semibold text-balance break-words">Preferences</h2>
    {#if userLoading}
      <div class="flex flex-col gap-3">
        <Skeleton class="h-11 rounded-xl" />
        <Skeleton class="h-8 rounded-lg w-40" />
        <Skeleton class="h-11 rounded-xl" />
        <Skeleton class="h-11 rounded-xl" />
      </div>
    {:else}
    <label class="flex items-center justify-between gap-3">
      <span class="text-[15px] md:text-sm break-words font-medium">Rest Ratio</span>
      <select bind:value={restRatio} class="h-11 rounded-xl border border-border bg-surface px-3 text-sm min-w-[120px]">
        <option value={3}>1 / 3</option>
        <option value={4}>1 / 4</option>
        <option value={5}>1 / 5 (default)</option>
        <option value={6}>1 / 6</option>
      </select>
    </label>
    <p class="w-full text-xs leading-relaxed text-text-secondary break-words bg-surface-elevated rounded-lg px-3 py-2">Example: 30 min focus → {Math.floor(1800 / restRatio / 60)} min rest</p>
    <label class="flex items-center justify-between gap-3">
      <span class="text-[15px] md:text-sm break-words font-medium">Theme</span>
      <select bind:value={theme} class="h-11 rounded-xl border border-border bg-surface px-3 text-sm min-w-[120px]">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </label>
    <button class="h-11 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 active:scale-[0.98] transition min-h-11 mt-1 flex items-center justify-center gap-2" onclick={save} disabled={saving}>
      {#if saving}<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Saving...{:else}Save{/if}
    </button>
    {/if}
  </section>
  <section class="w-full rounded-2xl border border-border bg-surface p-5 md:p-6 flex flex-col gap-4">
    <h2 class="w-full font-semibold text-balance break-words">Linked Accounts</h2>
    {#if accountsLoading}
      <div class="flex flex-col gap-2">
        <Skeleton class="h-6 w-40" />
        <Skeleton class="h-10 rounded-xl" />
        <Skeleton class="h-10 rounded-xl" />
      </div>
    {:else}
      <p class="text-sm leading-relaxed text-text-secondary break-words">Hubungkan Google/GitHub ke akun yang sama (email harus sama) agar bisa login pakai salah satu.</p>
      {@const hasGoogle = linkedAccounts.some((a: any) => a.providerId === 'google' || a.provider === 'google')}
      {@const hasGithub = linkedAccounts.some((a: any) => a.providerId === 'github' || a.provider === 'github')}
      {@const hasPassword = linkedAccounts.some((a: any) => a.providerId === 'credential' || a.providerId === 'email') || true}
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between rounded-xl border border-border bg-surface-elevated px-4 py-3">
          <div><p class="text-sm font-medium">Email / Password</p><p class="text-xs text-text-secondary">{hasPassword ? 'Connected' : 'Not connected'} — {user?.email ?? ''}</p></div>
          <span class="text-xs px-2.5 py-1 rounded-full bg-success/10 text-success font-medium">{hasPassword ? 'Active' : 'Setup'}</span>
        </div>
        <div class="flex items-center justify-between rounded-xl border border-border bg-surface-elevated px-4 py-3">
          <div><p class="text-sm font-medium">Google</p><p class="text-xs text-text-secondary">{hasGoogle ? 'Connected' : 'Not connected'}</p></div>
          {#if hasGoogle}<span class="text-xs px-2.5 py-1 rounded-full bg-success/10 text-success font-medium">Linked</span>{:else}<button class="px-4 py-2 rounded-full bg-primary text-white text-xs font-medium hover:bg-primary-hover disabled:opacity-50 min-h-8" disabled={!!linkingProvider} onclick={() => linkAccount('google')}>{linkingProvider==='google' ? 'Linking...' : 'Link Google'}</button>{/if}
        </div>
        <div class="flex items-center justify-between rounded-xl border border-border bg-surface-elevated px-4 py-3">
          <div><p class="text-sm font-medium">GitHub</p><p class="text-xs text-text-secondary">{hasGithub ? 'Connected' : 'Not connected'}</p></div>
          {#if hasGithub}<span class="text-xs px-2.5 py-1 rounded-full bg-success/10 text-success font-medium">Linked</span>{:else}<button class="px-4 py-2 rounded-full border border-border bg-surface text-xs font-medium hover:bg-surface-elevated disabled:opacity-50 min-h-8" disabled={!!linkingProvider} onclick={() => linkAccount('github')}>{linkingProvider==='github' ? 'Linking...' : 'Link GitHub'}</button>{/if}
        </div>
      </div>
      <p class="text-xs leading-relaxed text-text-secondary break-words">Setelah link, kamu bisa login pakai Google/GitHub atau password dengan email yang sama.</p>
    {/if}
  </section>
  <section class="w-full rounded-2xl border border-border bg-surface p-5 md:p-6 flex flex-col gap-4">
    <h2 class="w-full font-semibold text-balance break-words">Google Calendar</h2>
    {#if googleLoading}
      <div class="flex flex-col gap-3">
        <Skeleton class="h-4 w-32" />
        <Skeleton class="h-16 rounded-xl" />
      </div>
    {:else if googleStatus.connected}
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium">Connected</p>
          <p class="text-xs text-text-secondary mt-0.5">{googleStatus.calendarId ?? 'primary'} calendar</p>
        </div>
        <button class="px-4 py-2 rounded-full border border-error text-error text-sm hover:bg-error/10 active:scale-95 transition min-h-9" onclick={disconnectGoogle}>Disconnect</button>
      </div>
    {:else}
      <p class="text-sm leading-relaxed text-text-secondary">Connect your Google account to sync tasks with Google Calendar.</p>
      <button class="self-stretch sm:self-start px-5 py-3 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-50 min-h-11 active:scale-95 transition" onclick={connectGoogle} disabled={googleConnecting}>
        {#if googleConnecting}Connecting...{:else}Connect Google Calendar{/if}
      </button>
    {/if}
  </section>
  <section class="w-full rounded-2xl border border-border bg-surface p-5 md:p-6">
    <h2 class="w-full font-semibold text-balance break-words">About</h2>
    <p class="w-full text-sm leading-relaxed text-text-secondary mt-1 text-balance break-words">Flowdoro v1.0.0 — Proportional rest timer.</p>
  </section>
</div>

<Modal open={showChangeModal} title="Change Password" onClose={() => showChangeModal = false}>
  {#if oauthNoPassword}
    <p class="leading-relaxed break-words">Akun Google/GitHub belum punya password — gunakan Forgot Password di halaman Login untuk set password baru.</p>
    <div class="mt-4 flex justify-end gap-2">
      <button class="px-5 py-3 rounded-xl border border-border bg-surface font-medium min-h-11" onclick={() => showChangeModal = false}>Close</button>
      <button class="px-5 py-3 rounded-xl bg-primary text-white font-semibold min-h-11" onclick={() => { showChangeModal = false; goForgot() }}>Go to Forgot Password</button>
    </div>
  {:else}
    <form onsubmit={handleChangePassword} class="flex flex-col gap-3 mt-1">
      <label class="flex flex-col gap-1.5 text-left">
        <span class="text-sm font-medium">Current Password</span>
        <input bind:value={currentPassword} type="password" required placeholder="••••••••" autocomplete="current-password" class="h-11 rounded-xl border border-border bg-surface px-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
      </label>
      <label class="flex flex-col gap-1.5 text-left">
        <span class="text-sm font-medium">New Password</span>
        <input bind:value={newPassword} type="password" required placeholder="••••••••" autocomplete="new-password" class="h-11 rounded-xl border border-border bg-surface px-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        {#if newPassword}<div class="h-1 rounded-full bg-border overflow-hidden"><div class="h-full transition-all" class:bg-error={strength==='weak'} class:bg-warning={strength==='medium'} class:bg-success={strength==='strong'} style="width: {strength==='weak' ? '33%' : strength==='medium' ? '66%' : '100%'}"></div></div>{/if}
      </label>
      <label class="flex flex-col gap-1.5 text-left">
        <span class="text-sm font-medium">Confirm New Password</span>
        <input bind:value={confirmPassword} type="password" required placeholder="••••••••" autocomplete="new-password" class="h-11 rounded-xl border border-border bg-surface px-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 {confirmPassword && confirmPassword !== newPassword ? 'border-error' : ''}" />
        {#if confirmPassword && confirmPassword !== newPassword}<p class="text-xs text-error">Passwords do not match</p>{/if}
      </label>
      <p class="text-xs text-text-secondary text-left">Min 8 chars. Device lain akan logout.</p>
      <div class="flex gap-2 justify-end mt-2">
        <button type="button" class="px-5 py-3 rounded-xl border border-border bg-surface font-medium min-h-11" onclick={() => showChangeModal = false}>Cancel</button>
        <button type="submit" disabled={changing || !currentPassword || !newPassword || newPassword !== confirmPassword} class="px-5 py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 min-h-11">{changing ? 'Updating…' : 'Update Password'}</button>
      </div>
    </form>
  {/if}
</Modal>
