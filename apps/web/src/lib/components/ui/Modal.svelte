<script lang="ts">
  import { X } from 'lucide-svelte'

  type Variant = 'default' | 'danger'

  let {
    open = false,
    title = '',
    variant = 'default' as Variant,
    onClose = () => {},
  }: {
    open?: boolean
    title?: string
    variant?: Variant
    onClose?: () => void
  } = $props()

  function handleBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose()
  }
</script>

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-primary/60 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    onclick={handleBackdrop}
    onkeydown={handleKeydown}
  >
    <div
      class="w-full max-w-md rounded-xl bg-surface p-6 shadow-xl animate-in"
      class:border-l-4={variant === 'danger'}
      class:border-error={variant === 'danger'}
    >
      <div class="flex items-start justify-between gap-4">
        <h2 id="modal-title" class="text-lg font-semibold text-text-primary">{title}</h2>
        <button
          class="rounded-md p-1 text-text-secondary hover:bg-surface-elevated"
          onclick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
      <div class="mt-4">
        <slot />
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-in { animation: modalIn 0.2s ease-out; }
</style>
