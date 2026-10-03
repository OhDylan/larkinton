/** Floor finish in the dry areas: the existing porcelain tiles, medium-oak boards, or grey microcement. */
import { useSyncExternalStore } from 'react'

export type FloorFinish = 'tile' | 'wood' | 'concrete'

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
