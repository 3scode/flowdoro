<script lang="ts">
  import { X } from 'lucide-svelte'

  let {
    open = false,
    title = '',
    onClose = () => {},
    children,
  }: {
    open?: boolean
    title?: string
    onClose?: () => void
    children?: import('svelte').Snippet
  } = $props()

  function handleBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }
  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose()
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="fixed inset-0 z-50 flex items-end md:items-center justify-center"
    role="dialog"
    aria-modal="true"
    aria-label={title}
    tabindex="-1"
    onkeydown={handleKey}
  >
    <button
      type="button"
      aria-label="Close"
      class="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onclick={handleBackdrop}
    ></button>
    <div
      class="relative w-full md:max-w-lg max-h-[85dvh] md:max-h-[80vh] bg-surface rounded-t-[20px] md:rounded-xl border border-border shadow-xl flex flex-col overflow-hidden animate-[sheetIn_0.3s_ease-out]"
      style="padding-bottom: max(0.75rem, env(safe-area-inset-bottom));"
    >
      <div class="shrink-0 flex flex-col items-center pt-3 pb-2 border-b border-border">
        <div class="w-9 h-1 rounded-full bg-border mb-3 md:hidden"></div>
        <div class="w-full flex items-center justify-between px-4">
          <h2 class="font-semibold text-base truncate pr-2">{title}</h2>
          <button
            class="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center hover:bg-border transition shrink-0"
            onclick={onClose}
            aria-label="Close sheet"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div class="flex-1 overflow-auto overscroll-contain p-4">
        {#if children}{@render children()}{/if}
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes sheetIn {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  @media (min-width: 768px) {
    @keyframes sheetIn {
      from {
        transform: translateY(16px) scale(0.98);
        opacity: 0;
      }
      to {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }
  }
</style>
