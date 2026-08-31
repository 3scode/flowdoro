<script lang="ts">
  type Variant = 'default' | 'elevated' | 'interactive' | 'glass'

  let {
    variant = 'default',
    padding = 'md' as 'none' | 'sm' | 'md' | 'lg',
    onClick = undefined as (() => void) | undefined,
    class: cls = '',
    tag = 'div' as string,
    ...rest
  }: {
    variant?: Variant
    padding?: 'none' | 'sm' | 'md' | 'lg'
    onClick?: () => void
    class?: string
    tag?: string
  } = $props()

  const variantClasses: Record<Variant, string> = {
    default: 'bg-surface border border-border shadow-sm',
    elevated: 'bg-surface shadow-md',
    interactive: 'bg-surface border border-border shadow-sm hover:shadow-md hover:-translate-y-px cursor-pointer',
    glass: 'bg-surface/80 backdrop-blur-md border border-white/10',
  }

  const paddingClasses: Record<string, string> = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  const classes = $derived(
    [
      'rounded-lg transition-all duration-200',
      variantClasses[variant],
      paddingClasses[padding],
      cls,
    ].join(' ')
  )
</script>

{#if onClick}
  <div role="button" tabindex="0" class={classes} onclick={onClick} onkeydown={(e) => e.key === 'Enter' && onClick()} {...rest}>
    <slot />
  </div>
{:else}
  <div class={classes} {...rest}>
    <slot />
  </div>
{/if}
