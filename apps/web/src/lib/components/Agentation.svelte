<script lang="ts">
  import { onMount } from 'svelte'

  let container: HTMLDivElement | null = $state(null)
  let mounted = $state(false)

  onMount(() => {
    if (!import.meta.env.DEV) return

    let root: any = null
    let cancelled = false

    async function mountAgentation() {
      try {
        const [React, ReactDOMClient, mod] = await Promise.all([
          import('react'),
          import('react-dom/client'),
          import('agentation'),
        ])
        if (cancelled || !container) return
        const { Agentation } = mod as any
        // Agentation is a React component that renders via portal, so container is just anchor
        root = (ReactDOMClient as any).createRoot(container)
        // pass no props — works with defaults, dev-only
        root.render((React as any).createElement(Agentation))
        mounted = true
      } catch (e) {
        console.warn('[Agentation] failed to mount', e)
      }
    }

    mountAgentation()

    return () => {
      cancelled = true
      try {
        root?.unmount()
      } catch {}
    }
  })
</script>

{#if import.meta.env.DEV}
  <div bind:this={container} style="display: contents" aria-hidden="true"></div>
{/if}
