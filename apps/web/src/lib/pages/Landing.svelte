<script lang="ts">
  let { onNavigate } = $props<{ onNavigate: (p: string) => void }>()
</script>

<div class="min-h-[100dvh] flex flex-col">
  <nav class="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 max-w-6xl mx-auto w-full" style="padding-top: max(0.75rem, env(safe-area-inset-top));">
    <span class="text-lg md:text-xl font-bold text-primary flex items-center gap-2">◉ Flowdoro</span>
    <div class="flex gap-2 md:gap-3 items-center">
      <button class="px-3 md:px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary min-h-9" onclick={() => onNavigate('/login')}>Log In</button>
      <button class="px-4 md:px-5 py-2 md:py-2.5 rounded-full md:rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover active:scale-95 transition min-h-9" onclick={() => onNavigate('/register')}>Sign Up</button>
    </div>
  </nav>
  <section class="flex-1 flex flex-col items-center justify-center text-center px-4 md:px-6 py-10 md:py-16 gap-5 md:gap-6">
    <h1 class="text-[clamp(1.75rem,8vw,2.5rem)] md:text-5xl font-bold leading-tight text-balance break-words px-2">Work until your focus fades,<br /><span class="text-primary">rest in proportion.</span></h1>
    <p class="w-full max-w-xl text-[15px] md:text-lg leading-relaxed text-text-secondary text-balance break-words px-2">Stop fighting the clock. Start flowing with it. Count up from zero — never get interrupted by a rigid countdown.</p>
    <div class="w-[min(68vw,16rem)] h-[min(68vw,16rem)] md:w-64 md:h-64 aspect-square rounded-full border-4 border-primary/20 flex items-center justify-center relative shrink-0">
      <span class="text-[clamp(1.5rem,8vw,3rem)] font-mono font-bold">01:23:45</span>
      <span class="absolute -bottom-2 bg-secondary text-white text-xs px-3 py-1 rounded-full shadow-sm">Earned Rest: 16m</span>
    </div>
    <button class="mt-2 px-8 py-3.5 rounded-full bg-primary text-white font-semibold shadow-md hover:bg-primary-hover active:scale-95 transition min-h-12 text-[15px]" onclick={() => onNavigate('/register')}>Get Started — Free</button>
  </section>
  <section class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4 md:px-6 py-8 md:py-12 pb-[calc(2rem+env(safe-area-inset-bottom))]">
    {#each [{ n: '01', t: 'Start', d: 'Tap Start — timer counts up from zero' }, { n: '02', t: 'Focus', d: 'Work freely, no countdown pressure' }, { n: '03', t: 'Rest', d: 'Break auto-calculated at 5:1 ratio' }] as s}
      <div class="rounded-xl border border-border bg-surface p-6 text-center">
        <span class="text-3xl font-bold text-primary/30">{s.n}</span>
        <h3 class="font-semibold mt-2 text-balance break-words">{s.t}</h3>
        <p class="text-sm leading-relaxed text-text-secondary mt-1 text-balance break-words">{s.d}</p>
      </div>
    {/each}
  </section>
</div>
