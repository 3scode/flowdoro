<script lang="ts">
  import { Eye, EyeOff } from 'lucide-svelte'
  import type { Component } from 'svelte'

  type FieldType = 'text' | 'email' | 'password' | 'number'

  let {
    label = '',
    value = '',
    type = 'text' as FieldType,
    placeholder = '',
    error = '',
    success = '',
    disabled = false,
    required = false,
    icon = undefined as Component | undefined,
    bind:value: _bindValue,
    name = '',
    autocomplete = '' as string,
    ...rest
  }: {
    label?: string
    value?: string
    type?: FieldType
    placeholder?: string
    error?: string
    success?: string
    disabled?: boolean
    required?: boolean
    icon?: Component
    name?: string
    autocomplete?: string
  } = $props()

  let showPassword = $state(false)
  let inputType = $derived(type === 'password' && showPassword ? 'text' : type)
</script>

<div class="flex flex-col gap-1.5 w-full">
  {#if label}
    <label for={name} class="text-sm font-medium text-text-secondary">{label}</label>
  {/if}
  <div class="relative flex items-center">
    {#if icon}
      {@const Icon = icon}
      <Icon class="absolute left-3 text-text-secondary" size={18} />
    {/if}
    <input
      {name}
      id={name}
      bind:value
      {type: inputType}
      {placeholder}
      {disabled}
      {required}
      {autocomplete}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${name}-error` : undefined}
      class={[
        'w-full h-11 rounded-md border bg-surface text-text-primary placeholder:text-text-secondary/60 outline-none transition-colors',
        icon ? 'pl-10' : 'pl-3.5',
        'pr-3.5',
        error ? 'border-error' : success ? 'border-success' : 'border-border',
        'focus:border-primary focus:ring-2 focus:ring-primary/30',
        disabled && 'opacity-50 cursor-not-allowed',
      ].join(' ')}
      {...rest}
    />
    {#if type === 'password'}
      <button
        type="button"
        class="absolute right-3 text-text-secondary hover:text-text-primary"
        onclick={() => (showPassword = !showPassword)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {#if showPassword}
          <EyeOff size={18} />
        {:else}
          <Eye size={18} />
        {/if}
      </button>
    {/if}
  </div>
  {#if error}
    <p id={`${name}-error`} class="text-xs text-error" role="alert">{error}</p>
  {:else if success}
    <p class="text-xs text-success">{success}</p>
  {/if}
</div>
