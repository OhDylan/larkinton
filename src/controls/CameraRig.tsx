import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import type { OrbitControls as OrbitImpl } from 'three-stdlib'
import { planCenter } from '../data/floorplan'
import { WalkControls } from './WalkControls'

export type CameraMode = 'dollhouse' | 'topdown' | 'walkthrough'

const [cx, cz] = planCenter

const presets = {
  dollhouse: { fov: 45, position: [cx - 3, 14, cz + 7.5], target: [cx, 0, cz] },
  // near-orthographic: narrow FOV from high up, plan-top at screen-top
  topdown: { fov: 18, position: [cx, 34, cz + 0.001], target: [cx, 0, cz] },
} as const

export function CameraRig({ mode, resetKey }: { mode: CameraMode; resetKey: number }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const controls = useRef<OrbitImpl>(null)

  useLayoutEffect(() => {
    if (mode === 'walkthrough') return
    const p = presets[mode]
    camera.fov = p.fov
    camera.up.set(0, 1, 0)
    camera.position.set(p.position[0], p.position[1], p.position[2])
    camera.updateProjectionMatrix()
    if (controls.current) {
      controls.current.target.set(p.target[0], p.target[1], p.target[2])
      controls.current.update()
    }
  }, [mode, resetKey, camera])

  if (mode === 'walkthrough') return <WalkControls key={resetKey} />

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      target={[cx, 0, cz]}
      enableDamping
      enableRotate={mode === 'dollhouse'}
      screenSpacePanning
      maxPolarAngle={mode === 'dollhouse' ? Math.PI / 2 - 0.05 : Math.PI}
      minDistance={2}
      maxDistance={60}
      mouseButtons={
        mode === 'topdown'
          ? { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }
          : { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }
      }
    />
  )
}
