import { ceilingHeight, walls, type Rect, type Wall } from '../data/floorplan'

export type Box = {
  id: string
  /** plan-space rect + vertical extent */
  rect: Rect
  y0: number
  y1: number
  kind: 'wall' | 'screen'
}

/**
 * Split each axis-aligned wall into solid boxes around its openings
 * (pieces beside, below and above each door/window).
 */
export function wallToBoxes(wall: Wall): Box[] {
  const H = wall.height ?? ceilingHeight
  const kind = wall.kind ?? 'wall'
  const alongX = wall.x1 - wall.x0 >= wall.z1 - wall.z0
  const [start, end] = alongX ? [wall.x0, wall.x1] : [wall.z0, wall.z1]
  const rectFor = (a: number, b: number): Rect =>
    alongX ? { x0: a, x1: b, z0: wall.z0, z1: wall.z1 } : { x0: wall.x0, x1: wall.x1, z0: a, z1: b }

  const boxes: Box[] = []
  const push = (a: number, b: number, y0: number, y1: number, suffix: string) => {
    if (b - a > 1e-3 && y1 - y0 > 1e-3) boxes.push({ id: `${wall.id}-${suffix}`, rect: rectFor(a, b), y0, y1, kind })
  }

  const openings = [...(wall.openings ?? [])].sort((a, b) => a.from - b.from)
  let cursor = start
  for (const o of openings) {
    push(cursor, o.from, 0, H, `solid-${o.id}`)
    push(o.from, o.to, 0, o.bottom, `below-${o.id}`)
    push(o.from, o.to, o.top, H, `above-${o.id}`)
    cursor = o.to
  }
  push(cursor, end, 0, H, 'solid-end')
  return boxes
}

export const wallBoxes: Box[] = walls.flatMap(wallToBoxes)

/** Rects that block walking: any wall piece that starts at the floor. */
export const colliders: Rect[] = wallBoxes.filter((b) => b.y0 < 0.01 && b.y1 > 0.3).map((b) => b.rect)
