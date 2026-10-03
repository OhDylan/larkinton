import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { planCenter } from '../data/floorplan'
import { useLightMode } from '../state/lightMode'
import { MIRRORED } from '../data/mirror'
import { openness } from './doorState'

const [cx, cz] = planCenter
// the side windows face plan-right; in the mirrored unit (Type Ba) they face world-left
const side = MIRRORED ? -1 : 1

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
      {/* moody daylight: soft cool sky fill, low warm late-afternoon sun raking through the windows */}
      <Environment intensity={evening ? 0.05 : 0.42} />
      <hemisphereLight args={['#e9eef5', '#d8cbb8', evening ? 0.08 : 0.75]} />
      <ambientLight intensity={evening ? 0.04 : 0.15} />
      <directionalLight
        position={evening ? [cx + side * 9, 4, cz - 6] : [cx + side * 4, 6.5, cz - 13]}
        intensity={evening ? 0.5 : 4}
        color={evening ? '#ffb070' : '#ffd6a0'}
        castShadow
        shadow-mapSize={[2048, 2048]}
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

/**
 * The sun doesn't move, so its shadow map only needs re-rendering when something in the scene
 * changes (a door swinging, design/ceiling/light toggles) — not every frame. Saves a full
 * scene pass per frame.
 */
export function ShadowUpdates({ version }: { version: string }) {
  const gl = useThree((s) => s.gl)
  const frames = useRef(10)
  const lastDoors = useRef('')
  useEffect(() => {
    gl.shadowMap.autoUpdate = false
    gl.shadowMap.needsUpdate = true
    return () => {
      gl.shadowMap.autoUpdate = true
    }
  }, [gl])
  useEffect(() => {
    frames.current = 10 // a few frames: merged meshes / new lights settle after the toggle
  }, [version])
  useFrame(() => {
    const doors = Object.values(openness).map((v) => v.toFixed(3)).join()
    if (doors !== lastDoors.current) {
      lastDoors.current = doors
      frames.current = Math.max(frames.current, 2)
    }
    if (frames.current > 0) {
      gl.shadowMap.needsUpdate = true
      frames.current--
    }
  })
  return null
}
