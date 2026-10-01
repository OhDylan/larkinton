/** Floor finish in the dry areas: the existing porcelain tiles, or a medium-oak wood floor. */
import { useSyncExternalStore } from 'react'

export type FloorFinish = 'tile' | 'wood'

let finish: FloorFinish = 'tile'
const listeners = new Set<() => void>()

export function setFloorFinish(f: FloorFinish) {
  finish = f
  listeners.forEach((l) => l())
}
export function useFloorFinish() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => finish,
  )
}
