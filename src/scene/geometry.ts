import * as THREE from 'three'
import type { Rect } from '../data/floorplan'

/** Horizontal plane over a plan rect at height y, with world-aligned UVs (1 UV unit = 1 tile). */
export function planeXZ(r: Rect, y: number, tileW = 1, tileD = 1, faceDown = false): THREE.BufferGeometry {
  const w = r.x1 - r.x0
  const d = r.z1 - r.z0
  const g = new THREE.PlaneGeometry(w, d)
  g.rotateX(faceDown ? Math.PI / 2 : -Math.PI / 2)
  g.translate(r.x0 + w / 2, y, r.z0 + d / 2)
  worldUV(g, (p) => [p.x / tileW, p.z / tileD])
  return g
}

/** Replace a geometry's UVs using a function of world position. */
export function worldUV(g: THREE.BufferGeometry, f: (p: THREE.Vector3) => [number, number]) {
  const pos = g.attributes.position
  const uv = g.attributes.uv
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const [u, w] = f(v)
    uv.setXY(i, u, w)
  }
  uv.needsUpdate = true
}

export const rectCenter = (r: Rect): [number, number] => [(r.x0 + r.x1) / 2, (r.z0 + r.z1) / 2]
export const rectSize = (r: Rect): [number, number] => [r.x1 - r.x0, r.z1 - r.z0]
