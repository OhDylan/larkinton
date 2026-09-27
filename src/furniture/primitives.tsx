import type { ReactNode } from 'react'
import type * as THREE from 'three'
import { dimensions as D } from '../data/dimensions'
import { designMaterials } from './designMaterials'

/** Axis-aligned box given by its extents (plan x/z + height y). */
export function B({
  x0, x1, y0, y1, z0, z1, m, shadow = true,
}: { x0: number; x1: number; y0: number; y1: number; z0: number; z1: number; m: THREE.Material; shadow?: boolean }) {
  return (
    <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]} material={m} castShadow={shadow} receiveShadow>
      <boxGeometry args={[x1 - x0, y1 - y0, z1 - z0]} />
    </mesh>
  )
}

export function Cyl({
  x, z, y0, y1, r, rTop, m, seg = 24,
}: { x: number; z: number; y0: number; y1: number; r: number; rTop?: number; m: THREE.Material; seg?: number }) {
  return (
    <mesh position={[x, (y0 + y1) / 2, z]} material={m} castShadow receiveShadow>
      <cylinderGeometry args={[rTop ?? r, r, y1 - y0, seg]} />
    </mesh>
  )
}

/** Paper lantern pendant (Akari-style) with a warm light inside. */
export function Lantern({ x, z, bottom, r = 0.2, light = 0.4 }: { x: number; z: number; bottom: number; r?: number; light?: number }) {
  const d = designMaterials()
  const cy = bottom + r * 1.15
  const top = D.ceilingHeight
  return (
    <group>
      <mesh position={[x, cy, z]} scale={[1, 1.15, 1]} material={d.paper}>
        <sphereGeometry args={[r, 24, 16]} />
      </mesh>
      <mesh position={[x, (cy + top) / 2, z]} material={d.charcoal}>
        <cylinderGeometry args={[0.004, 0.004, top - cy, 6]} />
      </mesh>
      <pointLight position={[x, cy, z]} color="#ffcf98" intensity={light} distance={2.8} decay={2} />
    </group>
  )
}

/** Potted plant: ceramic pot + a loose cluster of leaves. */
export function Plant({ x, z, h = 1.4, r = 0.18 }: { x: number; z: number; h?: number; r?: number }) {
  const d = designMaterials()
  const leaves: ReactNode[] = []
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2
    const y = 0.45 + (h - 0.45) * (0.35 + 0.65 * ((i * 7) % 9) / 9)
    leaves.push(
      <mesh key={i} position={[x + Math.cos(a) * r * 0.9, y, z + Math.sin(a) * r * 0.9]} rotation={[0.5, -a, 0.3]} material={d.plant} castShadow>
        <sphereGeometry args={[0.13, 10, 8]} />
      </mesh>,
    )
  }
  return (
    <group>
      <Cyl x={x} z={z} y0={0} y1={0.4} r={r * 0.85} rTop={r} m={d.pot} />
      <Cyl x={x} z={z} y0={0.4} y1={h * 0.8} r={0.012} m={d.oak} seg={6} />
      {leaves}
    </group>
  )
}

/** Oak counter stool with a round seat and footrest ring. */
export function Stool({ x, z, h }: { x: number; z: number; h: number }) {
  const d = designMaterials()
  const legs = [0, 1, 2, 3].map((i) => {
    const a = Math.PI / 4 + (i * Math.PI) / 2
    return (
      <mesh key={i} position={[x + Math.cos(a) * 0.12, h / 2, z + Math.sin(a) * 0.12]} rotation={[Math.sin(a) * 0.08, 0, -Math.cos(a) * 0.08]} material={d.oak} castShadow>
        <cylinderGeometry args={[0.014, 0.018, h, 8]} />
      </mesh>
    )
  })
  return (
    <group>
      <Cyl x={x} z={z} y0={h - 0.035} y1={h} r={0.17} m={d.oak} />
      {legs}
      <mesh position={[x, 0.25, z]} rotation-x={Math.PI / 2} material={d.blackMetal}>
        <torusGeometry args={[0.13, 0.007, 6, 24]} />
      </mesh>
    </group>
  )
}

/** Simple ceramic vase / pot for styling surfaces. */
export function Vase({ x, z, y, h = 0.22, r = 0.07, m }: { x: number; z: number; y: number; h?: number; r?: number; m?: THREE.Material }) {
  const d = designMaterials()
  return (
    <mesh position={[x, y + h / 2, z]} material={m ?? d.ceramic} castShadow>
      <cylinderGeometry args={[r * 0.6, r, h, 20]} />
    </mesh>
  )
}
