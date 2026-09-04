<script lang="ts">
  import type { Component } from 'svelte'

  type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-outline'
  type Size = 'sm' | 'md' | 'lg'

  let {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    icon = undefined as Component | undefined,
    onClick = undefined as (() => void) | undefined,
    type = 'button' as string,
    class: cls = '',
    ...rest
  }: {
    variant?: Variant
    size?: Size
    disabled?: boolean
    loading?: boolean
    fullWidth?: boolean
    icon?: Component
    onClick?: () => void
    type?: string
    class?: string
  } = $props()

  const variantClasses: Record<Variant, string> = {
    primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm',
    secondary: 'border border-primary text-primary bg-transparent hover:bg-primary-light',
    ghost: 'text-primary bg-transparent hover:bg-primary-light',
    danger: 'bg-error text-white hover:opacity-90',
    'danger-outline': 'border border-error text-error bg-transparent hover:bg-error/10',
  }

  const sizeClasses: Record<Size, string> = {
    sm: 'min-h-9 h-9 px-3 text-xs gap-1.5',
    md: 'min-h-11 h-11 px-4 text-sm gap-2',
    lg: 'min-h-12 h-12 px-6 text-base gap-2',
  }
</script>

<button
  type={type}
  {disabled}
  class={[
    'inline-flex items-center justify-center font-semibold rounded-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed active:scale-97',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : 'w-fit',
    cls,
  ].join(' ')}
  onclick={!loading && !disabled ? onClick : undefined}
  aria-busy={loading}
  role="button"
  {...rest}
>
  {#if loading}
    <span class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
    <span class="sr-only">Loading…</span>
  {:else}
    {#if icon}
      {@const Icon = icon}
      <Icon size={size === 'sm' ? 14 : 18} />
    {/if}
    <slot />
  {/if}
</button>
