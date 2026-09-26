/**
 * Central dimension config for the Larkinton 2R1B unit (all values in METRES).
 *
 * Coordinate system (matches the floor plan as drawn):
 *   origin = outer top-left corner of the plan's 6800 x 8900 rectangle
 *   +x     = to the right on the plan ("east")
 *   +z     = down the plan ("south")
 *   +y     = up
 * The plan has no north arrow, so "north/east" here just mean plan-top/plan-right.
 *
 * Source key used in comments:
 *   [PLAN]  explicitly dimensioned on the floor plan
 *   [SCALE] measured off the floor plan using its scale (~10.8 mm per image px,
 *           derived from the 6800 / 8900 dimension lines). Accuracy roughly ±50 mm.
 *   [PHOTO] estimated from the reference photos
 *   [ASSUMED] not determinable from references; typical value for Malaysian condos
 *
 * Edit values here; everything else (walls, openings, rooms, collisions) is derived.
 */
export const dimensions = {
  overall: {
    width: 6.8, // [PLAN] 6800
    depth: 8.9, // [PLAN] 8900
  },

  // [PHOTO]/[ASSUMED] Living-room photo: corridor opening (~2.1 m) vs. ceiling ratio
  // gives ~2.75 m. Needs a tape-measure check.
  ceilingHeight: 2.75,

  wall: {
    exterior: 0.15, // [SCALE] ~12-14 px on plan
  },

  /** Vertical grid lines: x of wall faces, measured from the left outer face. */
  x: {
    westInner: 0.15, // inner face of left exterior wall
    partitionW: 3.02, // [SCALE] living/dining | bedrooms partition, living side
    partitionE: 3.16, // [SCALE] bedroom side
    bathWestW: 4.05, // [SCALE] corridor | bath wall
    bathWestE: 4.21,
    showerGlass: 5.83, // [SCALE] thin line in bath = shower screen
    kitchenYardW: 4.64, // [SCALE] kitchen | yard wall
    kitchenYardE: 4.75,
    yardAcW: 5.83, // [SCALE] yard | AC ledge wall
    yardAcE: 5.93,
    eastInner: 6.65, // inner face of right exterior wall
    entryBlockW: 1.24, // [SCALE] solid block right of the main door (column / riser)
    entryBlockE: 2.16,
  },

  /** Horizontal grid lines: z of wall faces, measured from the top outer face. */
  z: {
    northInner: 0.15,
    bed1South: 2.95, // [SCALE] bedroom 1 | corridor/bath wall
    corridorNorth: 3.11,
    corridorSouth: 4.21, // [SCALE] line of bedroom 2 door
    showerSouth: 4.07, // [SCALE] shower zone / pipe shaft boundary
    bathSouth: 4.45, // [SCALE] bath | bedroom 2 wall
    bed2North: 4.61,
    bed2South: 7.07, // [SCALE] bedroom 2 | kitchen/yard wall
    kitchenNorth: 7.21,
    entryDoorN: 8.22, // [SCALE] main door wall line (door sits here, not on the outer face)
    entryDoorS: 8.37,
    southInner: 8.75, // inner face of bottom exterior wall
  },

  doors: {
    height: 2.1, // [ASSUMED] standard door height
    leafThickness: 0.04,
    // Openings, [SCALE] from door-swing arcs on the plan
    main: { x0: 0.22, x1: 1.24 }, // ~1.0 m leaf, swings in against left wall
    bed1: { x0: 3.18, x1: 4.03 }, // in bedroom-1 south wall, swings into bedroom 1
    bed2: { x0: 3.18, x1: 4.03 }, // at corridor south edge, swings into bedroom 2
    bath: { z0: 3.26, z1: 3.99 }, // in bath west wall, swings into bath
    yard: { z0: 7.37, z1: 8.13 }, // in kitchen/yard wall, swings into yard
  },

  windows: {
    // Horizontal extents are [SCALE] from the plan; heights are [PHOTO] estimates.
    living: { x0: 0.22, x1: 2.89, sill: 0.45, head: 2.15, cols: 4 }, // 4 panels, transom + bottom row (photo)
    master: { x0: 4.13, x1: 5.69, sill: 0.8, head: 2.1, cols: 2 }, // 2 panels + transom (photo)
    bed2: { z0: 5.1, z1: 5.8, sill: 0.8, head: 2.1, cols: 1 }, // 1 panel + transom (photo)
    bath: { z0: 3.26, z1: 3.8, sill: 1.5, head: 2.1, cols: 1 }, // small high window (photo)
    kitchen: { z0: 8.33, z1: 8.73, sill: 1.0, head: 2.1, cols: 1 }, // into yard, narrow + transom (photo)
    frameDepth: 0.08,
    frameWidth: 0.05,
  },

  kitchen: {
    // [PHOTO] Only a wall-hung sink slab on brackets exists; no cabinets.
    // Position along the bottom wall is estimated: it sits near the yard-wall corner.
    sink: { x0: 3.6, x1: 4.6, depth: 0.5, height: 0.85, slab: 0.04 },
    backsplashHeight: 1.5, // [PHOTO] wall tiles stop around 1.5 m
  },

  bath: {
    showerScreenHeight: 2.0, // [PHOTO] glass screen visible; height assumed
    // [PHOTO] toilet visible at the far right of the bath doorway. Exact position estimated.
    toilet: { x: 5.45 },
    // [ASSUMED] basin not visible in any photo; placeholder only.
    basin: { x: 4.6 },
  },

  bulkheads: {
    // [PHOTO] Dropped ceiling over the hallway to the bedrooms/bath is visible
    // in the living/dining photos. Drop depth estimated.
    corridorCeiling: 2.45,
    // [PHOTO] A beam/bulkhead appears across the dining→kitchen transition (hallway
    // photo). Position assumed in line with the bedroom-2 bottom wall; depth estimated.
    kitchenBeamBottom: 2.45,
  },

  acLedge: {
    floorDrop: 0.1, // [ASSUMED] AC ledges usually sit slightly lower than the unit
    screenHeight: 2.75, // [ASSUMED] plan shows a louvred/railed edge on the right
  },

  walkthrough: {
    eyeHeight: 1.65,
    speed: 2.2, // m/s
    radius: 0.2, // collision radius
  },
} as const

export type Dimensions = typeof dimensions
