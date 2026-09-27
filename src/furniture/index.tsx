/**
 * Phase 2: interior design / furniture, kept separate from the architectural
 * shell in /scene. Positions live in ./layout.ts.
 *
 * Style: cozy · Nordic · natural oak · a touch of wabi-sabi · "designer studio".
 */
import { useEffect } from 'react'
import { materials, palette } from '../materials/materials'
import { Bath, Master, Studio } from './Bedrooms'
import { designPalette } from './designMaterials'
import { Entry, Island, Kitchen } from './Kitchen'
import { furnitureColliders } from './layout'
import { Living } from './Living'

/** Read by walkthrough collision: furniture only blocks the way while it's shown. */
export const designState = { enabled: true }
export const activeFurnitureColliders = () => (designState.enabled ? furnitureColliders : [])

export function Furniture({ show }: { show: boolean }) {
  useEffect(() => {
    designState.enabled = show
    // warm limewash-toned walls with the design; builder white without it
    materials().wall.color.set(show ? designPalette.wallWarm : palette.wall)
  }, [show])

  if (!show) return null
  return (
    <group>
      <Entry />
      <Kitchen />
      <Island />
      <Living />
      <Master />
      <Bath />
      <Studio />
    </group>
  )
}
