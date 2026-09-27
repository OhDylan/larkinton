/** Small architectural finishes that make the rooms read as real: skirting, window sills, switches and sockets. */
import { useMemo } from 'react'
import * as THREE from 'three'
import { dimensions as D } from '../data/dimensions'
import { wallBoxes } from '../scene/wallGeometry'
import { designMaterials } from './designMaterials'
import { B } from './primitives'

const { x: X, z: Z } = D
const W = D.windows
const SKIRT_H = 0.07
const SKIRT_T = 0.008

const skirtMat = new THREE.MeshStandardMaterial({ color: '#cbc2b3', roughness: 0.7 })
const plateMat = new THREE.MeshStandardMaterial({ color: '#f1eee8', roughness: 0.4 })

/** Slim painted skirting around every floor-standing wall piece. */
function Skirting() {
  const geo = useMemo(() => {
    const parts: THREE.BufferGeometry[] = []
    for (const b of wallBoxes) {
      if (b.kind !== 'wall' || b.y0 > 0.01) continue
      const r = b.rect
      const g = new THREE.BoxGeometry(r.x1 - r.x0 + 2 * SKIRT_T, SKIRT_H, r.z1 - r.z0 + 2 * SKIRT_T)
      g.translate((r.x0 + r.x1) / 2, SKIRT_H / 2, (r.z0 + r.z1) / 2)
      parts.push(g.toNonIndexed())
    }
    const count = parts.reduce((n, g) => n + g.attributes.position.count, 0)
    const pos = new Float32Array(count * 3)
    const nrm = new Float32Array(count * 3)
    let o = 0
    for (const g of parts) {
      pos.set(g.attributes.position.array as Float32Array, o * 3)
      nrm.set(g.attributes.normal.array as Float32Array, o * 3)
      o += g.attributes.position.count
    }
    const out = new THREE.BufferGeometry()
    out.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    out.setAttribute('normal', new THREE.BufferAttribute(nrm, 3))
    return out
  }, [])
  return <mesh geometry={geo} material={skirtMat} receiveShadow />
}

/** Travertine sills under the bedroom, studio, bath and kitchen windows (living has the window seat). */
function Sills() {
  const d = designMaterials()
  const t = 0.02
  const p = 0.05 // projection into the room
  return (
    <group>
      <B x0={W.master.x0 - 0.03} x1={W.master.x1 + 0.03} y0={W.master.sill - t} y1={W.master.sill} z0={Z.northInner - 0.02} z1={Z.northInner + p} m={d.travertine} />
      <B x0={X.eastInner - p} x1={X.eastInner + 0.02} y0={W.bed2.sill - t} y1={W.bed2.sill} z0={W.bed2.z0 - 0.03} z1={W.bed2.z1 + 0.03} m={d.travertine} />
      <B x0={X.eastInner - p} x1={X.eastInner + 0.02} y0={W.bath.sill - t} y1={W.bath.sill} z0={W.bath.z0 - 0.03} z1={W.bath.z1 + 0.03} m={d.travertine} />
      <B x0={X.kitchenYardW - p} x1={X.kitchenYardW + 0.02} y0={W.kitchen.sill - t} y1={W.kitchen.sill} z0={W.kitchen.z0 - 0.02} z1={W.kitchen.z1 + 0.02} m={d.travertine} />
    </group>
  )
}

type Plate = { at: [number, number, number]; face: 'x+' | 'x-' | 'z+' | 'z-'; kind: 'switch' | 'socket' | 'double' }

// face = direction the plate faces (into the room)
const plates: Plate[] = [
  { at: [X.westInner, 1.2, 7.0], face: 'x+', kind: 'switch' }, // entrance
  { at: [X.westInner, 0.3, 2.1], face: 'x+', kind: 'double' }, // projector / TV wall
  { at: [X.westInner, 1.2, 2.1], face: 'x+', kind: 'socket' },
  { at: [X.partitionW, 0.3, 1.02], face: 'x-', kind: 'socket' }, // beside the sofa
  { at: [X.partitionW, 1.2, 4.35], face: 'x-', kind: 'switch' }, // hallway
  { at: [2.95, 1.1, Z.southInner], face: 'z-', kind: 'double' }, // kitchen backsplash
  { at: [3.85, 1.1, Z.southInner], face: 'z-', kind: 'double' },
  { at: [4.2, 1.2, Z.bed1South], face: 'z-', kind: 'switch' }, // master, beside the door
  { at: [X.eastInner - 0.03, 0.72, 0.36], face: 'x-', kind: 'double' }, // bedside
  { at: [X.eastInner - 0.03, 0.72, 2.74], face: 'x-', kind: 'double' },
  { at: [X.partitionE, 1.2, 5.2], face: 'x+', kind: 'switch' }, // studio, clear of the open door leaf
  { at: [X.partitionE, 0.95, 6.15], face: 'x+', kind: 'double' }, // workbench
  { at: [X.bathWestW, 1.2, 4.2], face: 'x-', kind: 'switch' }, // bath switch, hallway side
]

function Plates() {
  const d = designMaterials()
  return (
    <group>
      {plates.map((p, i) => {
        const rot = { 'z+': 0, 'x+': Math.PI / 2, 'z-': Math.PI, 'x-': -Math.PI / 2 }[p.face]
        const w = p.kind === 'double' ? 0.146 : 0.086
        return (
          <group key={i} position={p.at} rotation-y={rot}>
            <mesh position-z={0.005} material={plateMat} castShadow>
              <boxGeometry args={[w, 0.086, 0.01]} />
            </mesh>
            {p.kind === 'switch' ? (
              <mesh position-z={0.0105} material={d.charcoal}>
                <boxGeometry args={[0.012, 0.03, 0.002]} />
              </mesh>
            ) : (
              (p.kind === 'double' ? [-0.036, 0.036] : [0]).map((x) => (
                <mesh key={x} position={[x, 0, 0.0105]} material={d.charcoal}>
                  <boxGeometry args={[0.024, 0.026, 0.002]} />
                </mesh>
              ))
            )}
          </group>
        )
      })}
    </group>
  )
}

export function Finishes() {
  return (
    <group>
      <Skirting />
      <Sills />
      <Plates />
    </group>
  )
}
