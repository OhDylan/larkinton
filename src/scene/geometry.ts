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

/**
 * Box whose UVs are in metres (per face, from world position), so textures keep a
 * constant scale on boxes of any size and line up across neighbouring pieces.
 * The geometry is baked at its world position (render the mesh at the origin).
 */
export function metricBox(cx: number, cy: number, cz: number, w: number, h: number, d: number): THREE.BufferGeometry {
  const g = new THREE.BoxGeometry(w, h, d)
  g.translate(cx, cy, cz)
  const pos = g.attributes.position
  const nrm = g.attributes.normal
  const uv = g.attributes.uv
  for (let i = 0; i < pos.count; i++) {
    const [x, y, z] = [pos.getX(i), pos.getY(i), pos.getZ(i)]
    const [nx, ny] = [Math.abs(nrm.getX(i)), Math.abs(nrm.getY(i))]
    if (nx > 0.5) uv.setXY(i, z, y)
    else if (ny > 0.5) uv.setXY(i, x, z)
    else uv.setXY(i, x, y)
  }
  uv.needsUpdate = true
  return g
}
