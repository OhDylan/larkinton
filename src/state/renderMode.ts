/** Live (rasterized, interactive) vs photo (progressive path-traced) rendering, plus path-tracer progress for the UI. */
import { useSyncExternalStore } from 'react'

export type RenderMode = 'live' | 'photo'
export type PhotoStatus = { phase: 'idle' | 'preparing' | 'rendering'; samples: number }

let mode: RenderMode = 'live'
let status: PhotoStatus = { phase: 'idle', samples: 0 }
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())
const subscribe = (l: () => void) => (listeners.add(l), () => listeners.delete(l))

export function setRenderMode(m: RenderMode) {
  mode = m
  emit()
}
export const useRenderMode = () => useSyncExternalStore(subscribe, () => mode)

export function setPhotoStatus(s: PhotoStatus) {
  if (s.phase === status.phase && s.samples === status.samples) return
  status = s
  emit()
}
export const usePhotoStatus = () => useSyncExternalStore(subscribe, () => status)
