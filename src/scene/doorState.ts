/**
 * Shared open/closed state for the door leaves.
 * - React UI subscribes via `useDoorState()`.
 * - The scene writes each leaf's animated openness (0 = closed, 1 = open) every frame.
 * - Walkthrough collision reads `doorColliders()` so closed doors block the way.
 */
import { useSyncExternalStore } from 'react'
import { doorLeaves, type Rect } from '../data/floorplan'

type State = Record<string, boolean>

// Default: all open, as drawn on the plan.
let state: State = Object.fromEntries(doorLeaves.map((d) => [d.id, true]))
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export function setDoorOpen(id: string, open: boolean) {
  state = { ...state, [id]: open }
  emit()
}
export const toggleDoor = (id: string) => setDoorOpen(id, !state[id])
export function setAllDoors(open: boolean) {
  state = Object.fromEntries(doorLeaves.map((d) => [d.id, open]))
  emit()
}
export const getDoorState = () => state

export function useDoorState() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => state,
  )
}

/** Animated openness per leaf, written by <Doors /> each frame. */
export const openness: Record<string, number> = Object.fromEntries(doorLeaves.map((d) => [d.id, 1]))

// Thin rect across each doorway, used as a collider while the leaf isn't (nearly) fully open.
const half = 0.06
const doorwayRects: Record<string, Rect> = Object.fromEntries(
  doorLeaves.map((d) => {
    const [hx, hz] = d.hinge
    const ex = hx + d.closedDir[0] * d.width
    const ez = hz + d.closedDir[1] * d.width
    return [d.id, { x0: Math.min(hx, ex) - half, x1: Math.max(hx, ex) + half, z0: Math.min(hz, ez) - half, z1: Math.max(hz, ez) + half }]
  }),
)

export function doorColliders(): Rect[] {
  return doorLeaves.filter((d) => openness[d.id] < 0.9).map((d) => doorwayRects[d.id])
}
