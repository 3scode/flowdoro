<script lang="ts">
  import { onMount } from 'svelte'
  let theme = 'dark'

  onMount(() => {
    const saved = localStorage.getItem('flowdoro-theme')
    if (saved) theme = saved
    document.documentElement.classList.toggle('dark', theme !== 'light')
  })
</script>

<main class="min-h-screen flex flex-col items-center justify-center gap-4">
  <h1 class="text-4xl font-bold text-primary">Flowdoro</h1>
  <p class="text-text-secondary">Work until your focus fades, rest in proportion.</p>
</main>
