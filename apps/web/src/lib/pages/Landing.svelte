<script lang="ts">
  let { onNavigate } = $props<{ onNavigate: (p: string) => void }>()
</script>

<div class="min-h-screen flex flex-col">
  <nav class="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
    <span class="text-xl font-bold text-primary flex items-center gap-2">◉ Flowdoro</span>
    <div class="flex gap-3">
      <button class="px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary" onclick={() => onNavigate('/login')}>Log In</button>
      <button class="px-5 py-2 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover" onclick={() => onNavigate('/register')}>Sign Up</button>
    </div>
  </nav>
  <section class="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 gap-6">
    <h1 class="text-4xl md:text-5xl font-bold leading-tight">Work until your focus fades,<br /><span class="text-primary">rest in proportion.</span></h1>
    <p class="text-lg text-text-secondary max-w-xl">Stop fighting the clock. Start flowing with it. Count up from zero — never get interrupted by a rigid countdown.</p>
    <div class="w-64 h-64 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
      <span class="text-5xl font-mono font-bold">01:23:45</span>
      <span class="absolute -bottom-2 bg-secondary text-white text-xs px-3 py-1 rounded-full">Earned Rest: 16m</span>
    </div>
    <button class="mt-4 px-8 py-3 rounded-md bg-primary text-white font-semibold shadow-md hover:bg-primary-hover" onclick={() => onNavigate('/register')}>Get Started — Free</button>
  </section>
  <section class="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 px-6 py-12">
    {#each [{ n: '01', t: 'Start', d: 'Tap Start — timer counts up from zero' }, { n: '02', t: 'Focus', d: 'Work freely, no countdown pressure' }, { n: '03', t: 'Rest', d: 'Break auto-calculated at 5:1 ratio' }] as s}
      <div class="rounded-xl border border-border bg-surface p-6 text-center">
        <span class="text-3xl font-bold text-primary/30">{s.n}</span>
        <h3 class="font-semibold mt-2">{s.t}</h3>
        <p class="text-sm text-text-secondary mt-1">{s.d}</p>
      </div>
    {/each}
  </section>
</div>
