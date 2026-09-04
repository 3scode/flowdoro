<script lang="ts">
  import { X } from 'lucide-svelte'

  type Variant = 'default' | 'danger'

  let {
    open = false,
    title = '',
    variant = 'default' as Variant,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    children,
    onClose = () => {},
    onConfirm = undefined as (() => void) | undefined,
  }: {
    open?: boolean
    title?: string
    variant?: Variant
    confirmLabel?: string
    cancelLabel?: string
    children?: import('svelte').Snippet
    onClose?: () => void
    onConfirm?: (() => void) | undefined
  } = $props()

  function handleBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose()
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    onclick={handleBackdrop}
    onkeydown={handleKeydown}
  >
    <div
      class="w-full max-w-md rounded-2xl bg-surface p-5 md:p-6 shadow-xl animate-in max-h-[90dvh] overflow-auto overscroll-contain"
      class:border-l-4={variant === 'danger'}
      class:border-error={variant === 'danger'}
    >
      <div class="flex items-start justify-between gap-4">
        <h2 id="modal-title" class="text-lg font-semibold text-text-primary pr-2">{title}</h2>
        <button
          class="w-9 h-9 rounded-full bg-surface-elevated flex items-center justify-center text-text-secondary hover:bg-border shrink-0 transition"
          onclick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>
      <div class="mt-4 text-sm text-text-secondary">
        {#if children}
          {@render children()}
        {/if}
      </div>
      {#if onConfirm}
        <div class="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button class="px-5 py-3 rounded-xl text-sm font-medium border border-border bg-surface hover:bg-surface-elevated active:scale-95 transition min-h-11" onclick={onClose}>
            {cancelLabel}
          </button>
          <button
            class="px-5 py-3 rounded-xl text-sm font-semibold text-white active:scale-95 transition min-h-11"
            class:bg-error={variant === 'danger'}
            class:hover:bg-error={variant === 'danger'}
            class:bg-primary={variant !== 'danger'}
            class:hover:bg-primary-hover={variant !== 'danger'}
            onclick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      {/if}
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
