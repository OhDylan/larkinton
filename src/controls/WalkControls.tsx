import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { dimensions as D } from '../data/dimensions'
import { MIRRORED, toPlanX, toWorldX } from '../data/mirror'
import type { Rect } from '../data/floorplan'
import { activeFurnitureColliders } from '../furniture'
import { doorColliders } from '../scene/doorState'
import { moveInput } from '../state/moveInput'
import { colliders } from '../scene/wallGeometry'

const { eyeHeight, speed, radius } = D.walkthrough
// Start just inside the main door, looking up the plan towards the living room.
const START = { x: 0.75, z: 7.7, yaw: 0 }

/** `x` is a world x; colliders are in plan coordinates (the model is mirrored, see data/mirror.ts). */
function blocked(worldX: number, z: number, rects: Rect[]) {
  const x = toPlanX(worldX)
  if (x < radius || z < radius || x > D.overall.width - radius || z > D.overall.depth + 1) return true
  return rects.some((r) => {
    const dx = x - Math.max(r.x0, Math.min(x, r.x1))
    const dz = z - Math.max(r.z0, Math.min(z, r.z1))
    return dx * dx + dz * dz < radius * radius
  })
}

/** Eye-level walk: WASD / arrows or the on-screen joystick to move, drag to look. Simple circle-vs-wall collision (closed doors block too). */
export function WalkControls() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const dom = useThree((s) => s.gl.domElement)
  const renderer = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const keys = useRef(new Set<string>())
  const look = useRef({ yaw: START.yaw, pitch: 0 })

  useEffect(() => {
    camera.fov = 55 // closer to a real camera lens than a wide game FOV
    camera.up.set(0, 1, 0)
    camera.position.set(toWorldX(START.x), eyeHeight, START.z)
    camera.updateProjectionMatrix()

    // dev helper for comparing against reference photos: __walkTo(x, z, yawRadians, pitchRadians?)
    if (import.meta.env.DEV)
      (window as unknown as Record<string, unknown>).__walkTo = (x: number, z: number, yaw: number, pitch = 0) => {
        // plan coordinates and plan heading, like the rest of the data
        camera.position.set(toWorldX(x), eyeHeight, z)
        look.current = { yaw: MIRRORED ? -yaw : yaw, pitch }
      }
    // dev helper for performance checks: __stats() → draw calls / triangles / lights of the last frame
    if (import.meta.env.DEV)
      (window as unknown as Record<string, unknown>).__stats = () => {
        let lights = 0
        let meshes = 0
        scene.traverse((o: THREE.Object3D) => {
          if ((o as THREE.Light).isLight && o.visible) lights++
          if ((o as THREE.Mesh).isMesh && o.visible) meshes++
        })
        const i = renderer.info
        // count every pass of one whole frame (shadow map, AO, effects), not just the last one
        i.autoReset = false
        i.reset()
        return new Promise((resolve) =>
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              const r = { calls: i.render.calls, triangles: i.render.triangles, lights, visibleMeshes: meshes }
              i.autoReset = true
              resolve(r)
            }),
          ),
        )
      }

    // Look = one pointer dragging on the canvas (mouse or finger). Deltas come from clientX/Y because
    // mobile browsers don't report movementX/Y for touch; tracking the pointer id lets a second
    // finger use the joystick at the same time.
    let lookId: number | null = null
    let last = [0, 0]
    const down = (e: PointerEvent) => {
      if (lookId !== null) return
      lookId = e.pointerId
      last = [e.clientX, e.clientY]
      dom.setPointerCapture(e.pointerId)
    }
    const up = (e: PointerEvent) => {
      if (e.pointerId === lookId) lookId = null
    }
    const move = (e: PointerEvent) => {
      if (e.pointerId !== lookId) return
      const dx = e.clientX - last[0]
      const dy = e.clientY - last[1]
      last = [e.clientX, e.clientY]
      const sens = e.pointerType === 'touch' ? 0.006 : 0.004
      // "grab the view": drag left → turn right, drag up → look down (like Street View / 360° tours)
      look.current.yaw -= dx * sens
      look.current.pitch = THREE.MathUtils.clamp(look.current.pitch - dy * sens, -1.3, 1.3)
    }
    const kd = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('input,button')) return
      keys.current.add(e.code)
      if (e.code.startsWith('Arrow')) e.preventDefault()
    }
    const ku = (e: KeyboardEvent) => keys.current.delete(e.code)
    dom.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    window.addEventListener('pointermove', move)
    window.addEventListener('keydown', kd)
    window.addEventListener('keyup', ku)
    return () => {
      dom.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
    }
  }, [camera, dom])

  useFrame((_, dt) => {
    const k = keys.current
    const clamp1 = (v: number) => Math.max(-1, Math.min(1, v))
    const fwd = clamp1((k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0) + moveInput.y)
    const side = clamp1((k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0) + moveInput.x)
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
