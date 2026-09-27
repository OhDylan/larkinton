import { Doors } from './Doors'
import { Fixtures } from './Fixtures'
import { Ceiling, Floors } from './FloorsAndCeiling'
import { Walls } from './Walls'
import { Windows } from './Windows'

/** The empty architectural shell (Phase 1). Furniture is layered on separately. */
export function Apartment({ showCeiling, designed }: { showCeiling: boolean; designed: boolean }) {
  return (
    <group>
      <Floors />
      <Walls />
      <Windows />
      <Doors />
      <Fixtures designed={designed} />
      {showCeiling && <Ceiling />}
    </group>
  )
}
