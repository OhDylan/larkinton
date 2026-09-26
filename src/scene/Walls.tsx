import { materials } from '../materials/materials'
import { rectCenter, rectSize } from './geometry'
import { wallBoxes } from './wallGeometry'

export function Walls() {
  const m = materials()
  return (
    <group>
      {wallBoxes.map((b) => {
        const [cx, cz] = rectCenter(b.rect)
        const [w, d] = rectSize(b.rect)
        const h = b.y1 - b.y0
        return (
          <mesh
            key={b.id}
            position={[cx, b.y0 + h / 2, cz]}
            material={b.kind === 'screen' ? m.screen : m.wall}
            castShadow={b.kind !== 'screen'}
            receiveShadow
          >
            <boxGeometry args={[w, h, d]} />
          </mesh>
        )
      })}
    </group>
  )
}
