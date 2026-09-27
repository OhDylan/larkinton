import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { dimensions as D } from '../data/dimensions'
import type { Rect } from '../data/floorplan'
import { activeFurnitureColliders } from '../furniture'
import { doorColliders } from '../scene/doorState'
import { colliders } from '../scene/wallGeometry'

const { eyeHeight, speed, radius } = D.walkthrough
// Start just inside the main door, looking up the plan towards the living room.
const START = { x: 0.75, z: 7.7, yaw: 0 }

function blocked(x: number, z: number, rects: Rect[]) {
  if (x < radius || z < radius || x > D.overall.width - radius || z > D.overall.depth + 1) return true
  return rects.some((r) => {
    const dx = x - Math.max(r.x0, Math.min(x, r.x1))
    const dz = z - Math.max(r.z0, Math.min(z, r.z1))
    return dx * dx + dz * dz < radius * radius
  })
}

/** Eye-level walk: WASD / arrows to move, drag to look. Simple circle-vs-wall collision (closed doors block too). */
export function WalkControls() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const dom = useThree((s) => s.gl.domElement)
  const keys = useRef(new Set<string>())
  const look = useRef({ yaw: START.yaw, pitch: 0 })

  useEffect(() => {
    camera.fov = 70
    camera.up.set(0, 1, 0)
    camera.position.set(START.x, eyeHeight, START.z)
    camera.updateProjectionMatrix()

    // dev helper for comparing against reference photos: __walkTo(x, z, yawRadians)
    if (import.meta.env.DEV)
      (window as unknown as Record<string, unknown>).__walkTo = (x: number, z: number, yaw: number) => {
        camera.position.set(x, eyeHeight, z)
        look.current = { yaw, pitch: 0 }
      }

    let dragging = false
    const down = (e: PointerEvent) => {
      dragging = true
      dom.setPointerCapture(e.pointerId)
    }
    const up = () => (dragging = false)
    const move = (e: PointerEvent) => {
      if (!dragging) return
      look.current.yaw += e.movementX * 0.004
      look.current.pitch = THREE.MathUtils.clamp(look.current.pitch + e.movementY * 0.004, -1.3, 1.3)
    }
    const kd = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('input,button')) return
      keys.current.add(e.code)
      if (e.code.startsWith('Arrow')) e.preventDefault()
    }
    const ku = (e: KeyboardEvent) => keys.current.delete(e.code)
    dom.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointermove', move)
    window.addEventListener('keydown', kd)
    window.addEventListener('keyup', ku)
    return () => {
      dom.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
    }
  }, [camera, dom])

  useFrame((_, dt) => {
    const k = keys.current
    const fwd = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0)
    const side = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0)
    const { yaw, pitch } = look.current
    if (fwd || side) {
      const step = speed * Math.min(dt, 0.05)
      // yaw 0 looks towards -z (plan top)
      const dx = (Math.sin(yaw) * fwd + Math.cos(yaw) * side) * step
      const dz = (-Math.cos(yaw) * fwd + Math.sin(yaw) * side) * step
      const p = camera.position
      const rects = [...colliders, ...doorColliders(), ...activeFurnitureColliders()]
      if (!blocked(p.x + dx, p.z, rects)) p.x += dx
      if (!blocked(p.x, p.z + dz, rects)) p.z += dz
    }
    camera.rotation.set(-pitch, -yaw, 0, 'YXZ')
  })

  return null
}
