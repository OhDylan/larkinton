/**
 * Phase 2 hook: interior design / furniture lives here, completely separate from
 * the architectural shell in /scene. Nothing is placed yet.
 *
 * Planned items (see brief): projector setup, living-room window bench,
 * 2-person kitchen island + bar stools, kitchen storage, entry shoe cabinet,
 * queen bed (master), desk + robotics workbench (bedroom 2).
 */
export type FurnitureItem = {
  id: string
  kind: string
  /** plan position (x, z) in metres, same coordinate system as data/dimensions.ts */
  position: [number, number]
  /** rotation about the vertical axis, radians */
  rotation?: number
  size: [number, number, number] // width, height, depth
}

export const furniture: FurnitureItem[] = []

export function Furniture() {
  return null
}
