<script lang="ts">
  import { toast, type ToastItem } from '$lib/stores/toast'
  import Toast from './Toast.svelte'

  let items: ToastItem[] = $state([])

  $effect(() => {
    const unsub = toast.subscribe((v) => (items = v))
    return unsub
  })
</script>

<div class="fixed z-50 flex flex-col-reverse gap-2 max-w-sm w-full pointer-events-none left-4 right-4 mx-auto md:left-auto md:right-4 md:mx-0" style="bottom: calc(5.5rem + env(safe-area-inset-bottom));">
  <style>
    @media (min-width: 768px) {
      div { bottom: 1rem !important; }
    }
  </style>
  {#each items as t (t.id)}
    <div class="pointer-events-auto">
      <Toast
        message={t.message}
        variant={t.variant}
        duration={t.duration}
        onDismiss={() => toast.dismiss(t.id)}
      />
    </div>
  {/each}
</div>
