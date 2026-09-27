/**
 * Phase 2: interior design / furniture, kept separate from the architectural
 * shell in /scene. Positions live in ./layout.ts.
 *
 * Style: cozy · warm wabi-sabi · deep peach-wood / walnut joinery · "designer studio".
 */
import { useEffect } from 'react'
import { materials, palette } from '../materials/materials'
import { useLightMode } from '../state/lightMode'
import { Bath, Master, Studio } from './Bedrooms'
import { designMaterials, designPalette } from './designMaterials'
import { Finishes } from './Finishes'
import { DiningWall, Entry, Island, Kitchen } from './Kitchen'
import { furnitureColliders } from './layout'
import { Living } from './Living'

/** Read by walkthrough collision: furniture only blocks the way while it's shown. */
export const designState = { enabled: true }
export const activeFurnitureColliders = () => (designState.enabled ? furnitureColliders : [])

export function Furniture({ show }: { show: boolean }) {
  const evening = useLightMode() === 'evening'

  useEffect(() => {
    designState.enabled = show
    const m = materials()
    const d = designMaterials()
    // greige limewash walls + warm ceiling with the design; builder white without it
    m.wall.color.set(show ? '#ffffff' : palette.wall)
    m.wall.map = show ? d.limewash : null
    m.wall.needsUpdate = true
    m.ceiling.color.set(show ? designPalette.ceilingWarm : palette.ceiling)
  }, [show])

  useEffect(() => {
    const d = designMaterials()
    d.paper.emissiveIntensity = evening ? 1.6 : 0.25
    d.lightStrip.emissiveIntensity = evening ? 2.2 : 0.3
    d.downlight.emissiveIntensity = evening ? 2.5 : 0.4
  }, [evening])

  if (!show) return null
  return (
    <group>
      <Finishes />
      <Entry />
      <Kitchen />
      <Island />
      <DiningWall />
      <Living />
      <Master />
      <Bath />
      <Studio />
    </group>
  )
}
