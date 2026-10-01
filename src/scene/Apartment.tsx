import { StaticMerge } from '../furniture/StaticMerge'
import { Doors } from './Doors'
import { Fixtures } from './Fixtures'
import { Ceiling, Floors } from './FloorsAndCeiling'
import { Walls } from './Walls'
import { Windows } from './Windows'

/**
 * The empty architectural shell (Phase 1). Furniture is layered on separately.
 * Static parts are merged into a few meshes for speed (re-merged when the design toggle swaps
 * fixtures); doors stay separate because they swing and are clickable.
 */
export function Apartment({ showCeiling, designed }: { showCeiling: boolean; designed: boolean }) {
  return (
    <group>
      <StaticMerge key={designed ? 'designed' : 'shell'}>
        <Floors />
        <Walls />
        <Windows />
        <Fixtures designed={designed} />
      </StaticMerge>
      <Doors />
      {showCeiling && (
        <StaticMerge>
          <Ceiling />
        </StaticMerge>
      )}
    </group>
  )
}
