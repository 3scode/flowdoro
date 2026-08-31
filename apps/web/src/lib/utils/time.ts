<script lang="ts">
  export function formatDuration(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    if (h > 0) return `${h}h ${m}m`
    if (m > 0) return `${m}m ${s > 0 ? `${s}s` : ''}`.trim()
    return `${s}s`
  }

  export function formatTimer(totalSeconds: number): string {
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
    const s = String(totalSeconds % 60).padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  export function calculateRestEarned(focusSeconds: number, ratio: number): number {
    return Math.floor(focusSeconds / ratio)
  }

  export function calculateStreak(sessions: { startedAt: string }[], today = new Date()): number {
    const dates = new Set(sessions.map((s) => new Date(s.startedAt).toISOString().slice(0, 10)))
    let streak = 0
    const cursor = new Date(today)
    while (dates.has(cursor.toISOString().slice(0, 10))) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    }
    return streak
  }
