<script lang="ts">
  import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-svelte'

  type Variant = 'success' | 'error' | 'warning' | 'info'

  let {
    message = '',
    variant = 'info' as Variant,
    duration = 3000,
    action = undefined as { label: string; onClick: () => void } | undefined,
    onDismiss = () => {},
  }: {
    message: string
    variant: Variant
    duration: number
    action?: { label: string; onClick: () => void }
    onDismiss: () => void
  } = $props()

  const variantStyles: Record<Variant, string> = {
    success: 'border-success bg-success/10 text-success',
    error: 'border-error bg-error/10 text-error',
    warning: 'border-warning bg-warning/10 text-warning',
    info: 'border-primary bg-primary-light text-primary',
  }

  $effect(() => {
    if (duration > 0) {
      const t = setTimeout(onDismiss, duration)
      return () => clearTimeout(t)
    }
  })
</script>

<div
  role="status"
  aria-live="polite"
  class="flex items-start gap-3 rounded-lg border-l-4 bg-surface p-4 shadow-lg {variantStyles[variant]}"
>
  <span class="shrink-0">
    {#if variant === 'success'}<CheckCircle size={20} />
    {:else if variant === 'error'}<XCircle size={20} />
    {:else if variant === 'warning'}<AlertTriangle size={20} />
    {:else}<Info size={20} />{/if}
  </span>
  <p class="flex-1 text-sm text-text-primary">{message}</p>
  {#if action}
    <button class="text-sm font-semibold underline" onclick={action.onClick}>{action.label}</button>
  {/if}
  <button onclick={onDismiss} aria-label="Dismiss" class="shrink-0 text-text-secondary">
    <X size={16} />
  </button>
</div>
