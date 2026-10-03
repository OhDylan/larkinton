/**
 * Phase 2 — interior design layout (all values in METRES, same coordinates as
 * data/dimensions.ts: +x = plan right, +z = plan down, origin = outer top-left corner).
 *
 * Style: warm minimal between mid-century and wabi-sabi / zen.
 * Floors keep the existing porcelain tiles.
 *
 * Every piece is a plan rect (x0..x1, z0..z1) plus a height. Edit numbers here;
 * the furniture components and walkthrough colliders read from this file.
 */
import { dimensions as D } from '../data/dimensions'
import type { Rect } from '../data/floorplan'

const { x: X, z: Z } = D
const H = D.ceilingHeight

export type Piece = Rect & { h: number; y0?: number }

export const layout = {
  // ---------------------------------------------------------------- entrance
  entry: {
    // floating shoe cabinet on the face of the block right of the main door
    shoeCabinet: { x0: X.entryBlockW + 0.02, x1: X.entryBlockE - 0.02, z0: Z.entryDoorN - 0.35, z1: Z.entryDoorN, y0: 0.18, h: 0.85 },
    mirror: { cx: (X.entryBlockW + X.entryBlockE) / 2, y: 1.62, r: 0.3 },
  },

  // ---------------------------------------------------------------- kitchen (upper + lower run on the bottom wall)
  kitchen: {
    // tall fridge housing at the entrance end of the run; the cabinet above it hides the DB box
    fridge: { x0: X.entryBlockE, x1: X.entryBlockE + 0.74, z0: Z.southInner - 0.72, z1: Z.southInner, h: 1.85 },
    base: { x0: X.entryBlockE + 0.74, x1: X.kitchenYardW, z0: Z.southInner - 0.6, z1: Z.southInner, h: 0.9 },
    // uppers stop short of the yard wall so they don't cover the small kitchen window
    upper: { x0: X.entryBlockE + 0.74, x1: 4.2, z0: Z.southInner - 0.36, z1: Z.southInner, y0: 1.5, h: 2.45 - 1.5 },
    sinkX: D.kitchen.sink.x1 - 0.3, // keeps the existing sink/plumbing position
    hobX: 3.3, // single-zone "domino" induction hob, 0.29 m wide
  },

  // ---------------------------------------------------------------- yard: front-load washer with a dryer stacked on top
  yard: {
    // south-east corner of the yard, clear of the yard door's swing (radius ~0.76 m from its hinge)
    laundry: { x0: X.yardAcW - 0.62, x1: X.yardAcW - 0.02, z0: Z.southInner - 0.62, z1: Z.southInner - 0.02, h: 1.72 },
  },

  // ---------------------------------------------------------------- island (peninsula off the right-hand wall as you leave the kitchen)
  island: {
    top: { x0: X.partitionW - 1.3, x1: X.partitionW, z0: 6.1, z1: 6.85, h: 0.92 },
    bodyZ0: 6.35, // body set back 0.25 on the seating (north) side for knees
    stools: [
      [X.partitionW - 1.0, 5.85],
      [X.partitionW - 0.42, 5.85],
    ] as [number, number][],
    seatH: 0.65,
  },

  // ---------------------------------------------------------------- dining: full-height joinery wall (left wall)
  diningWall: {
    x0: X.westInner, x1: X.westInner + 0.4, z0: 3.45, z1: 6.95, h: H,
    shelvesZ1: 4.85, // open asymmetric shelving z0..shelvesZ1
    nicheZ1: 5.95, // tea / coffee niche shelvesZ1..nicheZ1; tall pantry beyond
  },

  // ---------------------------------------------------------------- living
  living: {
    // window seat (飘窗) along the whole 4-panel window; seat top = window sill (0.45)
    windowSeat: { x0: X.westInner, x1: X.partitionW, z0: Z.northInner, z1: Z.northInner + 0.55, h: D.windows.living.sill },
    // 2-seater against the right-hand (partition) wall, facing the left wall
    // curved velvet sofa, 2.19 m long x 1.02 m deep, from the window seat to just short of the hallway opening
    sofa: { x0: X.partitionW - 1.05, x1: X.partitionW, z0: 0.9, z1: 3.09, h: 0.79 },
    // left wall kept clear for a projector screen / future TV
    projectionWall: { z0: 1.2, z1: 3.0 },
    // low round stone table, ~0.38 m clear in front of the sofa, ~0.58 m to the left wall
    coffeeTable: { cx: 1.16, cz: 2.0, r: 0.43, h: 0.29 },
    sideTable: [X.partitionW - 0.42, 0.93] as [number, number], // stacked-stone side table, between sofa and window seat
    rug: { x0: 0.75, x1: 2.55, z0: 1.05, z1: 3.05 },
    plant: [0.45, 0.98] as [number, number],
    fan: [1.55, 1.95] as [number, number],
    acZ: (Z.corridorNorth + Z.corridorSouth) / 2, // AC point above the hallway opening
  },

  // ---------------------------------------------------------------- master bedroom
  master: {
    // wardrobe along the left wall: its side panel is what you see as you walk in
    wardrobe: { x0: X.partitionE, x1: X.partitionE + 0.6, z0: Z.northInner, z1: 2.05, h: H },
    // Malaysian queen mattress 152 x 190 cm; frame 162 x 205 cm.
    // Headboard against the right-hand (east) wall, centred on it; the bed runs towards the wardrobe.
    bed: { x0: X.eastInner - 2.05, x1: X.eastInner, z0: 0.74, z1: 2.36, h: 1.05 },
    mattress: { w: 1.52, l: 1.9 },
    // one nightstand each side of the bed, hung off the wood headboard wall
    nightstands: [
      { x0: X.eastInner - 0.42, x1: X.eastInner - 0.03, z0: 0.22, z1: 0.66, h: 0.5 },
      { x0: X.eastInner - 0.42, x1: X.eastInner - 0.03, z0: 2.44, z1: 2.88, h: 0.5 },
    ],
    // wood-panelled headboard wall with a slim display ledge
    headboardWall: { z0: 0.2, z1: 2.9, y1: 1.2, t: 0.03 },
    rug: { x0: 3.95, x1: 5.95, z0: 0.45, z1: 2.65 },
    // AC point on the wall shared with the bath/hallway, near the east corner
    ac: { x: X.eastInner - 0.55, y: 2.42 },
  },

  // ---------------------------------------------------------------- bathroom (keeps toilet + basin + existing shower)
  bath: {
    vanity: { x0: 4.3, x1: 4.9, z0: Z.bathSouth - 0.42, z1: Z.bathSouth, y0: 0.45, h: 0.37 },
    mirror: { x0: 4.28, x1: 5.76, y0: 1.02, y1: 1.72 }, // one long horizontal mirror
  },

  // ---------------------------------------------------------------- bedroom 2 → studio / workshop
  studio: {
    // 1.8 m workbench on the far wall, right-hand side as you walk in; window stays clear in the middle
    desk: { x0: X.partitionE + 0.1, x1: X.partitionE + 1.9, z0: Z.bed2South - 0.7, z1: Z.bed2South, h: 0.76 },
    pegboard: { y0: 0.95, y1: 2.05 },
    chair: [4.0, 6.0] as [number, number],
    cart: { x0: 5.16, x1: 5.61, z0: 6.6, z1: 6.98, h: 0.78 },
    // sofa bed (daybed: single mattress + back cushions) opposite the workbench, against the bath wall
    sofaBed: { x0: 4.25, x1: 6.15, z0: Z.bed2North, z1: Z.bed2North + 0.9, h: 0.9 },
    plant: [6.38, 6.8] as [number, number],
  },
} as const

const circle = (c: readonly [number, number], r: number): Rect => ({ x0: c[0] - r, x1: c[0] + r, z0: c[1] - r, z1: c[1] + r })

/** Footprints that block walking in walkthrough mode (floor-standing / low pieces only). */
export const furnitureColliders: Rect[] = [
  layout.entry.shoeCabinet,
  layout.kitchen.base,
  layout.kitchen.fridge,
  layout.yard.laundry,
  { ...layout.island.top, z0: layout.island.bodyZ0 },
  layout.diningWall,
  layout.living.windowSeat,
  layout.living.sofa,
  circle([layout.living.coffeeTable.cx, layout.living.coffeeTable.cz], layout.living.coffeeTable.r),
  ...layout.island.stools.map((s) => circle(s, 0.2)),
  circle(layout.living.plant, 0.2),
  layout.master.wardrobe,
  layout.master.bed,
  ...layout.master.nightstands,
  layout.bath.vanity,
  layout.studio.desk,
  layout.studio.cart,
  layout.studio.sofaBed,
  circle(layout.studio.plant, 0.2),
]
