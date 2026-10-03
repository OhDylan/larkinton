import { useFrame, useThree } from '@react-three/fiber'
import { useRef, type RefObject } from 'react'
import type * as THREE from 'three'
import { patchMaterial, updateLampUniforms } from './fakeLamps'

/**
 * Keeps the fake lamps working: patches every standard material in the scene with the lamp
 * loop (re-checked every ~30 frames for newly mounted meshes), and updates the lamps' view-space
 * positions each frame. `space` = the (mirrored) group the lamp coordinates are given in.
 */
export function FakeLampDriver({ space }: { space: RefObject<THREE.Object3D | null> }) {
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const frame = useRef(0)
  useFrame(() => {
    if (frame.current++ % 30 === 0)
      scene.traverse((o) => {
        const m = (o as THREE.Mesh).material
        if (!m) return
        if (Array.isArray(m)) m.forEach(patchMaterial)
        else patchMaterial(m)
      })
    if (space.current) {
      space.current.updateWorldMatrix(true, false)
      camera.updateMatrixWorld()
      updateLampUniforms(space.current, camera)
    }
  })
  return null
}
