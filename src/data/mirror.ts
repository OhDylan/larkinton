/**
 * The unit is Type Ba: the left-right mirror image of the published Type B plan.
 * All data (dimensions, layout) stays in the coordinates of the published plan; the whole model
 * is mirrored at render time (plan x → width − x). Set MIRRORED = false for the original Type B.
 */
import { dimensions as D } from './dimensions'

export const MIRRORED = true

/** plan x (as drawn on the Type B plan) ↔ world x (as built). The mapping is its own inverse. */
export const toWorldX = (x: number) => (MIRRORED ? D.overall.width - x : x)
export const toPlanX = toWorldX
