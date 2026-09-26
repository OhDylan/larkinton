/**
 * Architectural layout of the unit, derived entirely from `dimensions.ts`.
 * No raw measurements live here — only topology (which wall is where, which
 * openings it has, which rooms exist).
 */
import { dimensions as D } from './dimensions'

const { x: X, z: Z, overall, ceilingHeight: H } = D

export type Rect = { x0: number; x1: number; z0: number; z1: number }

export type WindowStyle = {
  cols: number
  transom: boolean // top fixed row
  bottomRow: boolean // bottom fixed row (living room only)
}

export type Opening = {
  id: string
  kind: 'door' | 'window' | 'opening'
  /** start/end along the wall's long axis (absolute x or z coordinate) */
  from: number
  to: number
  bottom: number
  top: number
  window?: WindowStyle
}

export type Wall = Rect & {
  id: string
  /** default: ceiling height */
  height?: number
  openings?: Opening[]
  kind?: 'wall' | 'screen'
}

export type DoorLeaf = {
  id: string
  /** hinge position on the floor */
  hinge: [number, number]
  /** unit direction the OPEN leaf extends from the hinge (as drawn on the plan) */
  openDir: [number, number]
  /** unit direction the CLOSED leaf extends from the hinge (across the opening) */
  closedDir: [number, number]
  width: number
  color: 'main' | 'interior'
}

export type FloorKind = 'porcelain' | 'wetTile' | 'common' | 'concrete'
export type Floor = Rect & { id: string; kind: FloorKind; y?: number }

export type Room = {
  id: string
  label: string
  /** label anchor (plan x, z) */
  at: [number, number]
  secondary?: boolean
}

const ext = D.wall.exterior
const doorH = D.doors.height
const W = D.windows

// ---------------------------------------------------------------- walls
export const walls: Wall[] = [
  // ---- exterior shell
  {
    id: 'ext-top',
    x0: 0, x1: overall.width, z0: 0, z1: ext,
    openings: [
      { id: 'win-living', kind: 'window', from: W.living.x0, to: W.living.x1, bottom: W.living.sill, top: W.living.head,
        window: { cols: W.living.cols, transom: true, bottomRow: true } },
      { id: 'win-master', kind: 'window', from: W.master.x0, to: W.master.x1, bottom: W.master.sill, top: W.master.head,
        window: { cols: W.master.cols, transom: true, bottomRow: false } },
    ],
  },
  { id: 'ext-left', x0: 0, x1: ext, z0: ext, z1: overall.depth },
  {
    id: 'ext-right',
    x0: X.eastInner, x1: overall.width, z0: ext, z1: Z.kitchenNorth,
    openings: [
      { id: 'win-bath', kind: 'window', from: W.bath.z0, to: W.bath.z1, bottom: W.bath.sill, top: W.bath.head,
        window: { cols: 1, transom: false, bottomRow: false } },
      { id: 'win-bed2', kind: 'window', from: W.bed2.z0, to: W.bed2.z1, bottom: W.bed2.sill, top: W.bed2.head,
        window: { cols: W.bed2.cols, transom: true, bottomRow: false } },
    ],
  },
  // bottom exterior wall: kitchen + yard + AC ledge (starts right of the entry block)
  { id: 'ext-bottom', x0: X.entryBlockE, x1: overall.width, z0: Z.southInner, z1: overall.depth },
  // solid block right of the main door (plan shows a column / riser box here)
  { id: 'entry-block', x0: X.entryBlockW, x1: X.entryBlockE, z0: Z.entryDoorN, z1: overall.depth },
  // main door line: header only above the door
  {
    id: 'entry-door-line',
    x0: ext, x1: X.entryBlockW, z0: Z.entryDoorN, z1: Z.entryDoorS,
    openings: [{ id: 'door-main', kind: 'door', from: ext, to: X.entryBlockW, bottom: 0, top: doorH }],
  },

  // ---- living/dining | bedrooms partition (gap = hallway opening)
  { id: 'partition-north', x0: X.partitionW, x1: X.partitionE, z0: ext, z1: Z.corridorNorth },
  { id: 'partition-south', x0: X.partitionW, x1: X.partitionE, z0: Z.corridorSouth, z1: Z.kitchenNorth },
  // header over hallway opening (height = dropped corridor ceiling)
  {
    id: 'hall-opening-header',
    x0: X.partitionW, x1: X.partitionE, z0: Z.corridorNorth, z1: Z.corridorSouth,
    openings: [{ id: 'hall-opening', kind: 'opening', from: Z.corridorNorth, to: Z.corridorSouth, bottom: 0, top: D.bulkheads.corridorCeiling }],
  },

  // ---- bedroom 1 bottom wall (door on the hallway side)
  {
    id: 'bed1-south',
    x0: X.partitionE, x1: X.eastInner, z0: Z.bed1South, z1: Z.corridorNorth,
    openings: [{ id: 'door-bed1', kind: 'door', from: D.doors.bed1.x0, to: D.doors.bed1.x1, bottom: 0, top: doorH }],
  },
  // ---- bath west wall (door from hallway)
  {
    id: 'bath-west',
    x0: X.bathWestW, x1: X.bathWestE, z0: Z.corridorNorth, z1: Z.bed2North,
    openings: [{ id: 'door-bath', kind: 'door', from: D.doors.bath.z0, to: D.doors.bath.z1, bottom: 0, top: doorH }],
  },
  // ---- bath | bedroom 2
  { id: 'bath-south', x0: X.bathWestE, x1: X.eastInner, z0: Z.bathSouth, z1: Z.bed2North },
  // pipe shaft / wall mass beside the shower (hatched box on plan) — assumed solid
  { id: 'bath-shaft', x0: X.showerGlass, x1: X.eastInner, z0: Z.showerSouth, z1: Z.bathSouth },
  // header over bedroom 2 door (no wall on the plan here, only the door)
  {
    id: 'bed2-door-line',
    x0: X.partitionE, x1: X.bathWestW, z0: Z.corridorSouth - 0.07, z1: Z.corridorSouth + 0.07,
    openings: [{ id: 'door-bed2', kind: 'door', from: X.partitionE, to: X.bathWestW, bottom: 0, top: doorH }],
  },

  // ---- bedroom 2 | kitchen & yard
  { id: 'bed2-south', x0: X.partitionW, x1: X.eastInner, z0: Z.bed2South, z1: Z.kitchenNorth },

  // ---- kitchen | yard (door + small window)
  {
    id: 'kitchen-yard',
    x0: X.kitchenYardW, x1: X.kitchenYardE, z0: Z.kitchenNorth, z1: Z.southInner,
    openings: [
      { id: 'door-yard', kind: 'door', from: D.doors.yard.z0, to: D.doors.yard.z1, bottom: 0, top: doorH },
      { id: 'win-kitchen', kind: 'window', from: W.kitchen.z0, to: W.kitchen.z1, bottom: W.kitchen.sill, top: W.kitchen.head,
        window: { cols: 1, transom: true, bottomRow: false } },
    ],
  },
  // ---- yard | AC ledge
  { id: 'yard-ac', x0: X.yardAcW, x1: X.yardAcE, z0: Z.kitchenNorth, z1: Z.southInner },
  // AC ledge outer edge: plan shows thin lines (louvres/railing) — modelled as a screen
  { id: 'ac-screen', x0: X.eastInner + 0.05, x1: overall.width - 0.05, z0: Z.kitchenNorth, z1: overall.depth, kind: 'screen',
    height: D.acLedge.screenHeight },
]

// ---------------------------------------------------------------- door leaves (default open, as drawn)
const t = D.doors.leafThickness
export const doorLeaves: DoorLeaf[] = [
  // main door: hinge bottom-left, opens against left wall
  { id: 'leaf-main', hinge: [ext + t / 2, Z.entryDoorN], openDir: [0, -1], closedDir: [1, 0], width: D.doors.main.x1 - D.doors.main.x0, color: 'main' },
  // bedroom 1: hinge at left of opening, swings north into bedroom 1
  { id: 'leaf-bed1', hinge: [D.doors.bed1.x0 + t / 2, Z.bed1South], openDir: [0, -1], closedDir: [1, 0], width: D.doors.bed1.x1 - D.doors.bed1.x0, color: 'interior' },
  // bedroom 2: hinge at left of opening, swings south into bedroom 2
  { id: 'leaf-bed2', hinge: [D.doors.bed2.x0 + t / 2, Z.corridorSouth], openDir: [0, 1], closedDir: [1, 0], width: D.doors.bed2.x1 - D.doors.bed2.x0, color: 'interior' },
  // bath: hinge at top of opening, swings east into the bath
  { id: 'leaf-bath', hinge: [X.bathWestE, D.doors.bath.z0 - t / 2], openDir: [1, 0], closedDir: [0, 1], width: D.doors.bath.z1 - D.doors.bath.z0, color: 'interior' },
  // yard: hinge at top of opening, swings east into the yard
  { id: 'leaf-yard', hinge: [X.kitchenYardE, D.doors.yard.z0 - t / 2], openDir: [1, 0], closedDir: [0, 1], width: D.doors.yard.z1 - D.doors.yard.z0, color: 'interior' },
]

// ---------------------------------------------------------------- floors
export const floors: Floor[] = [
  { id: 'floor-main-north', kind: 'porcelain', x0: 0, x1: overall.width, z0: 0, z1: Z.kitchenNorth },
  { id: 'floor-main-south', kind: 'porcelain', x0: 0, x1: X.yardAcE, z0: Z.kitchenNorth, z1: Z.entryDoorS },
  { id: 'floor-kitchen-strip', kind: 'porcelain', x0: X.entryBlockW, x1: X.yardAcE, z0: Z.entryDoorS, z1: overall.depth },
  // overlays (slightly raised to avoid z-fighting)
  { id: 'floor-bath', kind: 'wetTile', x0: X.bathWestE, x1: X.eastInner, z0: Z.corridorNorth, z1: Z.bathSouth, y: 0.004 },
  { id: 'floor-yard', kind: 'wetTile', x0: X.kitchenYardE, x1: X.yardAcW, z0: Z.kitchenNorth, z1: Z.southInner, y: 0.004 },
  // outside the unit
  { id: 'floor-vestibule', kind: 'common', x0: ext, x1: X.entryBlockW, z0: Z.entryDoorS, z1: overall.depth + 1.2 },
  { id: 'floor-ac-ledge', kind: 'concrete', x0: X.yardAcE, x1: overall.width, z0: Z.kitchenNorth, z1: overall.depth, y: -D.acLedge.floorDrop },
]

/** Areas that get a ceiling slab (the unit interior incl. yard). */
export const ceilings: Rect[] = [
  { x0: 0, x1: overall.width, z0: 0, z1: Z.kitchenNorth },
  { x0: 0, x1: X.yardAcE, z0: Z.kitchenNorth, z1: Z.entryDoorS },
  { x0: X.entryBlockW, x1: X.yardAcE, z0: Z.entryDoorS, z1: overall.depth },
]

/** Dropped ceilings / beams observed in photos (see dimensions.bulkheads). */
export const bulkheads: (Rect & { bottom: number })[] = [
  { x0: X.partitionW, x1: X.bathWestW, z0: Z.corridorNorth, z1: Z.corridorSouth, bottom: D.bulkheads.corridorCeiling },
  { x0: ext, x1: X.partitionW, z0: Z.bed2South, z1: Z.kitchenNorth, bottom: D.bulkheads.kitchenBeamBottom },
]

// ---------------------------------------------------------------- rooms
const mid = (a: number, b: number) => (a + b) / 2
export const rooms: Room[] = [
  { id: 'living', label: 'Living Room', at: [mid(ext, X.partitionW), 1.6] },
  { id: 'dining', label: 'Dining', at: [mid(ext, X.partitionW), 5.0], secondary: true },
  { id: 'kitchen', label: 'Kitchen', at: [3.1, mid(Z.kitchenNorth, Z.southInner)] },
  { id: 'entrance', label: 'Entrance', at: [mid(ext, X.entryBlockW), 7.75] },
  { id: 'master', label: 'Master Bedroom', at: [mid(X.partitionE, X.eastInner), mid(ext, Z.bed1South)] },
  { id: 'bed2', label: 'Bedroom 2 / Studio', at: [mid(X.partitionE, X.eastInner), mid(Z.bed2North, Z.bed2South)] },
  { id: 'bath', label: 'Bathroom', at: [mid(X.bathWestE, X.showerGlass), mid(Z.corridorNorth, Z.bathSouth)] },
  { id: 'hall', label: 'Hallway', at: [mid(X.partitionE, X.bathWestW), mid(Z.corridorNorth, Z.corridorSouth)], secondary: true },
  { id: 'yard', label: 'Yard', at: [mid(X.kitchenYardE, X.yardAcW), 8.0], secondary: true },
  { id: 'ac', label: 'AC Ledge', at: [mid(X.yardAcE, overall.width), 8.0], secondary: true },
]

export const planCenter: [number, number] = [overall.width / 2, overall.depth / 2]
export const ceilingHeight = H
