/**
 * Phase 2 — interior design layout (all values in METRES, same coordinates as
 * data/dimensions.ts: +x = plan right, +z = plan down, origin = outer top-left corner).
 *
 * Style brief: cozy · Nordic · natural oak · a touch of wabi-sabi · "designer studio".
 * Floors keep the existing porcelain tiles.
 *
 * Every piece is a plan rect (x0..x1, z0..z1) plus a height. Edit numbers here;
 * the furniture components and walkthrough colliders read from this file.
 */
import { dimensions as D } from '../data/dimensions'
import type { Rect } from '../data/floorplan'

const { x: X, z: Z } = D

export type Piece = Rect & { h: number; y0?: number }

export const layout = {
  // ---------------------------------------------------------------- entrance
  entry: {
    // Floating oak shoe cabinet on the face of the block right of the main door
    // (you see it on your right as you step in). Clear of the door swing.
    shoeCabinet: { x0: X.entryBlockW + 0.02, x1: X.entryBlockE - 0.02, z0: Z.entryDoorN - 0.35, z1: Z.entryDoorN, y0: 0.15, h: 0.9 },
    mirror: { cx: (X.entryBlockW + X.entryBlockE) / 2, y: 1.6, r: 0.3 },
  },

  // ---------------------------------------------------------------- kitchen (upper + lower run on the bottom wall)
  kitchen: {
    base: { x0: X.entryBlockE, x1: X.kitchenYardW, z0: Z.southInner - 0.6, z1: Z.southInner, h: 0.89 },
    // uppers stop short of the yard wall so they don't cover the small kitchen window
    upper: { x0: X.entryBlockE, x1: 4.2, z0: Z.southInner - 0.35, z1: Z.southInner, y0: 1.5, h: 0.75 },
    sinkX: D.kitchen.sink.x1 - 0.3, // keeps the existing sink/plumbing position
    hobX: 2.85,
  },

  // ---------------------------------------------------------------- island (peninsula off the right-hand wall as you leave the kitchen)
  island: {
    // top: 1.30 x 0.75, 0.92 high; body set back 0.25 on the seating (north) side for knees
    top: { x0: X.partitionW - 1.3, x1: X.partitionW, z0: 6.1, z1: 6.85, h: 0.92 },
    bodyZ0: 6.35,
    stools: [
      [X.partitionW - 1.0, 5.83],
      [X.partitionW - 0.42, 5.83],
    ] as [number, number][],
    seatH: 0.65,
  },

  // ---------------------------------------------------------------- living
  living: {
    // window seat (飘窗) along the whole 4-panel window; seat top = window sill (0.45)
    windowSeat: { x0: X.westInner, x1: X.partitionW, z0: Z.northInner, z1: Z.northInner + 0.55, h: D.windows.living.sill },
    loveseat: { x0: 0.55, x1: 2.05, z0: 2.2, z1: 3.05, h: 0.78 }, // 2-seater, faces the window seat
    coffeeTable: { cx: 1.3, cz: 1.5, r: 0.3, h: 0.38 },
    rug: { x0: 0.42, x1: 2.3, z0: 0.85, z1: 3.2 },
    credenza: { x0: X.partitionW - 0.4, x1: X.partitionW, z0: 0.95, z1: 2.25, h: 0.55 }, // low oak sideboard (no TV wall)
    floorLamp: [2.32, 2.85] as [number, number],
    plant: [0.35, 2.75] as [number, number],
    art: { z0: 1.05, z1: 2.15, y0: 0.95, y1: 1.75 }, // on the right-hand (partition) wall above the sideboard
    // open oak shelving on the left wall of the dining zone
    shelf: { x0: X.westInner, x1: X.westInner + 0.35, z0: 3.9, z1: 5.5, h: 1.8 },
  },

  // ---------------------------------------------------------------- master bedroom
  master: {
    // wardrobe straight ahead when you walk in (left of the window), bed right beside it
    wardrobe: { x0: X.partitionE, x1: 4.06, z0: Z.northInner, z1: Z.northInner + 0.6, h: 2.4 },
    // Malaysian queen mattress 152 x 190 cm; frame 162 x 205 cm; low headboard sits under the 0.8 m sill
    bed: { x0: 4.16, x1: 5.78, z0: Z.northInner, z1: Z.northInner + 2.05, h: 0.78 },
    mattress: { w: 1.52, l: 1.9 },
    nightstand: { x0: 5.88, x1: 6.33, z0: 0.2, z1: 0.6, h: 0.5 },
    rug: { x0: 3.95, x1: 6.1, z0: 1.3, z1: 2.75 },
  },

  // ---------------------------------------------------------------- bathroom (keeps toilet + basin + existing shower)
  bath: {
    vanity: { x0: 4.3, x1: 4.9, z0: Z.bathSouth - 0.42, z1: Z.bathSouth, y0: 0.45, h: 0.35 },
    // one long horizontal mirror across the basin/toilet wall
    mirror: { x0: 4.28, x1: 5.76, y0: 1.0, y1: 1.72 },
  },

  // ---------------------------------------------------------------- bedroom 2 → studio / workshop
  studio: {
    // 1.8 m workbench on the far wall, right-hand side as you walk in; window stays clear in the middle
    desk: { x0: X.partitionE + 0.1, x1: X.partitionE + 1.9, z0: Z.bed2South - 0.7, z1: Z.bed2South, h: 0.76 },
    pegboard: { y0: 0.95, y1: 2.05 },
    chair: [4.16, 6.0] as [number, number],
    cart: { x0: 5.16, x1: 5.61, z0: 6.6, z1: 6.98, h: 0.78 },
    // small sofa bed opposite the workbench, against the bath wall
    sofaBed: { x0: 4.55, x1: 6.15, z0: Z.bed2North, z1: Z.bed2North + 0.85, h: 0.75 },
    plant: [6.38, 6.8] as [number, number],
  },
} as const

const circle = (c: readonly [number, number], r: number): Rect => ({ x0: c[0] - r, x1: c[0] + r, z0: c[1] - r, z1: c[1] + r })

/** Footprints that block walking in walkthrough mode (floor-standing / low pieces only). */
export const furnitureColliders: Rect[] = [
  layout.entry.shoeCabinet,
  layout.kitchen.base,
  { ...layout.island.top, z0: layout.island.bodyZ0 },
  ...layout.island.stools.map((s) => circle(s, 0.18)),
  layout.living.windowSeat,
  layout.living.loveseat,
  circle([layout.living.coffeeTable.cx, layout.living.coffeeTable.cz], layout.living.coffeeTable.r),
  layout.living.credenza,
  circle(layout.living.floorLamp, 0.15),
  circle(layout.living.plant, 0.18),
  layout.living.shelf,
  layout.master.wardrobe,
  layout.master.bed,
  layout.master.nightstand,
  layout.bath.vanity,
  layout.studio.desk,
  layout.studio.cart,
  layout.studio.sofaBed,
  circle(layout.studio.plant, 0.18),
]
