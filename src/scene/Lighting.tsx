import { planCenter } from '../data/floorplan'
import { materials } from '../materials/materials'

const [cx, cz] = planCenter

/**
 * Daylight. All windows face plan-top (living, master) or plan-right (bath, bedroom 2),
 * so the sun is placed above/beyond the top-right so light enters through them.
 * Real orientation is unknown (no north arrow on the plan).
 */
export function Lighting() {
  return (
    <>
      <hemisphereLight args={['#f7f9fc', '#e6dfd3', 1.6]} />
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[cx + 5, 12, cz - 8]}
        intensity={2.4}
        color="#fff6e8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-far={40}
      >
        <object3D attach="target" position={[cx, 0, cz]} />
      </directionalLight>
      {/* ground far below-ish, just to anchor the model visually */}
      <mesh rotation-x={-Math.PI / 2} position={[cx, -0.15, cz]} material={materials().ground}>
        <planeGeometry args={[60, 60]} />
      </mesh>
    </>
  )
}
