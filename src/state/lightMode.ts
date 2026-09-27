/** Day / evening lighting mode, shared by the scene lights, lamps and the control panel. */
import { useSyncExternalStore } from 'react'

export type LightMode = 'day' | 'evening'

let mode: LightMode = 'day'
const listeners = new Set<() => void>()

export function setLightMode(m: LightMode) {
  mode = m
  listeners.forEach((l) => l())
}

export function useLightMode() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => mode,
  )
}
