import { useMemo } from 'react'
import { materials } from '../materials/materials'
import { metricBox, rectCenter, rectSize } from './geometry'
import { wallBoxes } from './wallGeometry'

export function Walls() {
  const m = materials()
  // metre-scaled UVs so a wall finish texture (design mode) tiles evenly across all pieces
  const geoms = useMemo(
    () =>
      wallBoxes.map((b) => {
        const [cx, cz] = rectCenter(b.rect)
        const [w, d] = rectSize(b.rect)
        const h = b.y1 - b.y0
        return { b, g: metricBox(cx, b.y0 + h / 2, cz, w, h, d) }
      }),
    [],
  )
  return (
    <group>
      {geoms.map(({ b, g }) => (
        <mesh
          key={b.id}
          geometry={g}
          material={b.kind === 'screen' ? m.screen : m.wall}
          castShadow={b.kind !== 'screen'}
          receiveShadow
        />
      ))}
    </group>
  )
}
