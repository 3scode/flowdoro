<script lang="ts">
  /**
   * Generic skeleton placeholder — wraps `.skeleton` (shimmer) dari app.css:129
   * Flexible: terima `class` & `style` untuk sizing, plus opsi circle/text
   */
  let {
    class: cls = '',
    style = '',
    circle = false,
    lines = 0,
    ...rest
  }: {
    class?: string
    style?: string
    circle?: boolean
    lines?: number
    [key: string]: any
  } = $props()
</script>

{#if lines > 1}
  <div class="flex flex-col gap-2" aria-hidden="true" aria-busy="true">
    {#each Array(lines) as _, i}
      <div
        class="skeleton {circle ? 'rounded-full' : ''} {cls}"
        style={`${style}${i === lines - 1 ? 'width:60%;' : ''}`}
        {...rest}
      ></div>
    {/each}
  </div>
{:else}
  <div
    class="skeleton {circle ? 'rounded-full' : ''} {cls}"
    style={style}
    aria-hidden="true"
    aria-busy="true"
    {...rest}
  ></div>
{/if}
