import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { planCenter } from '../data/floorplan'
import { useLightMode } from '../state/lightMode'
import { useRenderMode } from '../state/renderMode'

const [cx, cz] = planCenter

/** Soft indoor reflections / fill from a procedural room environment (no downloads). */
function Environment({ intensity }: { intensity: number }) {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])
  useEffect(() => {
    scene.environmentIntensity = intensity
  }, [scene, intensity])
  return null
}

/**
 * Daylight. All windows face plan-top (living, master) or plan-right (bath, bedroom 2),
 * so the sun is placed above/beyond the top-right so light enters through them.
 * Real orientation is unknown (no north arrow on the plan).
 * Evening: low warm sun, dim sky; the interior lamps take over.
 */
export function Lighting() {
  const evening = useLightMode() === 'evening'
  return (
    <>
      {useRenderMode() === 'live' && <Environment intensity={evening ? 0.1 : 0.5} />}
      <hemisphereLight args={['#f7f9fc', '#e6dfd3', evening ? 0.12 : 1.15]} />
      <ambientLight intensity={evening ? 0.05 : 0.3} />
      <directionalLight
        position={evening ? [cx + 9, 4, cz - 6] : [cx + 5, 12, cz - 8]}
        intensity={evening ? 0.6 : 2.6}
        color={evening ? '#ffb070' : '#fff6e8'}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-radius={4}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-far={40}
      >
        <object3D attach="target" position={[cx, 0, cz]} />
      </directionalLight>
    </>
  )
}
