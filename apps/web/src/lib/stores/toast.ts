import { writable } from 'svelte/store'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: number
  message: string
  variant: ToastVariant
  duration: number
}

let nextId = 0

function createToastStore() {
  const { subscribe, update } = writable<ToastItem[]>([])

  function add(message: string, variant: ToastVariant, duration = 3000) {
    const id = nextId++
    update((items) => [...items, { id, message, variant, duration }])
    return id
  }

  function dismiss(id: number) {
    update((items) => items.filter((t) => t.id !== id))
  }

  return {
    subscribe,
    success: (msg: string, duration?: number) => add(msg, 'success', duration),
    error: (msg: string, duration?: number) => add(msg, 'error', duration),
    warning: (msg: string, duration?: number) => add(msg, 'warning', duration),
    info: (msg: string, duration?: number) => add(msg, 'info', duration),
    dismiss,
  }
}

export const toast = createToastStore()
