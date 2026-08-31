import { writable, derived } from 'svelte/store'
import { calculateRestEarned } from '$lib/utils/time'

type TimerState = 'idle' | 'running' | 'paused' | 'break'

function createTimer() {
  const state = writable<TimerState>('idle')
  const elapsed = writable(0)
  const restRatio = writable(5)
  const breakRemaining = writable(0)
  let startTs = 0
  let raf = 0
  let pausedTotal = 0
  let breakRaf = 0

  function tick() {
    elapsed.set(Math.floor((Date.now() - startTs - pausedTotal) / 1000))
    raf = requestAnimationFrame(tick)
  }

  const earnedRest = derived([elapsed, restRatio], ([$e, $r]) => calculateRestEarned($e, $r))

  return {
    state, elapsed, restRatio, breakRemaining, earnedRest,
    start() {
      startTs = Date.now()
      pausedTotal = 0
      elapsed.set(0)
      state.set('running')
      cancelAnimationFrame(raf)
      tick()
    },
    pause() {
      const wasRunning = (() => { let v: TimerState = 'idle'; state.subscribe((s) => (v = s))(); return v })() === 'running'
      if (wasRunning) {
        cancelAnimationFrame(raf)
        state.set('paused')
        // record pause start
        ;(this as any)._pauseStart = Date.now()
      }
    },
    resume() {
      const ps = (this as any)._pauseStart
      if (ps) { pausedTotal += Date.now() - ps; (this as any)._pauseStart = 0 }
      state.set('running')
      tick()
    },
    stopAndBreak() {
      cancelAnimationFrame(raf)
      let e = 0; elapsed.subscribe((v) => (e = v))()
      let r = 5; restRatio.subscribe((v) => (r = v))()
      const rest = calculateRestEarned(e, r)
      state.set('break')
      breakRemaining.set(rest)
      const endAt = Date.now() + rest * 1000
      function breakTick() {
        const rem = Math.max(0, Math.ceil((endAt - Date.now()) / 1000))
        breakRemaining.set(rem)
        if (rem > 0) breakRaf = requestAnimationFrame(breakTick)
        else { state.set('idle'); elapsed.set(0) }
      }
      breakTick()
    },
    skipBreak() {
      cancelAnimationFrame(breakRaf)
      state.set('idle'); elapsed.set(0); breakRemaining.set(0)
    },
    reset() {
      cancelAnimationFrame(raf); cancelAnimationFrame(breakRaf)
      state.set('idle'); elapsed.set(0); breakRemaining.set(0)
    },
  }
}

export const timer = createTimer()
