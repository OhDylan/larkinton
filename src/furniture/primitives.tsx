import { RoundedBox } from '@react-three/drei'
import { useEffect, useMemo, type ReactNode } from 'react'
import * as THREE from 'three'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'
import { dimensions as D } from '../data/dimensions'
import { metricBox } from '../scene/geometry'
import { useLightMode } from '../state/lightMode'
import { designMaterials } from './designMaterials'

type Ext = { x0: number; x1: number; y0: number; y1: number; z0: number; z1: number }

/** Axis-aligned box given by its extents, with metre-scaled UVs (wood grain runs vertically on fronts). */
export function B({ x0, x1, y0, y1, z0, z1, m, shadow = true }: Ext & { m: THREE.Material; shadow?: boolean }) {
  const g = useMemo(() => metricBox((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, x1 - x0, y1 - y0, z1 - z0), [x0, x1, y0, y1, z0, z1])
  return <mesh geometry={g} material={m} castShadow={shadow} receiveShadow />
}

/** Soft, rounded box for upholstery, mattresses, cushions. */
export function Soft({ x0, x1, y0, y1, z0, z1, m, r = 0.04, rot }: Ext & { m: THREE.Material; r?: number; rot?: [number, number, number] }) {
  const w = x1 - x0
  const h = y1 - y0
  const d = z1 - z0
  const radius = Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001)
  return (
    <RoundedBox args={[w, h, d]} radius={radius} smoothness={2} position={[(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]} rotation={rot} material={m} castShadow receiveShadow />
  )
}

export function Cyl({ x, z, y0, y1, r, rTop, m, seg = 32 }: { x: number; z: number; y0: number; y1: number; r: number; rTop?: number; m: THREE.Material; seg?: number }) {
  return (
    <mesh position={[x, (y0 + y1) / 2, z]} material={m} castShadow receiveShadow>
      <cylinderGeometry args={[rTop ?? r, r, y1 - y0, seg]} />
    </mesh>
  )
}

/** Warm point light whose strength follows the day/evening mode. */
export function Lamp({ x, y, z, evening = 1.6, distance = 4, shadow = false, minor = false }: { x: number; y: number; z: number; day?: number; evening?: number; distance?: number; shadow?: boolean; minor?: boolean }) {
  const mode = useLightMode()
  // Performance: every point light adds cost to every pixel. By day the lamps are off (they added
  // almost nothing), and small accent lamps (`minor`) are skipped; their glowing shades remain.
  if (mode !== 'evening' || minor) return null
  return (
    <pointLight
      position={[x, y, z]}
      color="#ffc98a"
      intensity={evening}
      distance={distance}
      decay={2}
      castShadow={shadow}
      shadow-mapSize={[512, 512]}
      shadow-bias={-0.002}
    />
  )
}

/** Mid-century tapered leg, splayed outwards: (x, z) is where it meets the underside at height `top`. */
export function TaperedLeg({ x, z, top, splay = [0, 0], r = 0.022, m }: { x: number; z: number; top: number; splay?: [number, number]; r?: number; m?: THREE.Material }) {
  const d = designMaterials()
  const [sx, sz] = splay // horizontal offset of the foot from the top of the leg
  const len = Math.hypot(top, sx, sz)
  const q = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-sx, top, -sz).normalize()), [sx, sz, top])
  return (
    <mesh position={[x + sx / 2, top / 2, z + sz / 2]} quaternion={q} material={m ?? d.wood} castShadow receiveShadow>
      <cylinderGeometry args={[r, r * 0.45, len, 12]} />
    </mesh>
  )
}

/** Four splayed tapered legs under a rectangle. */
export function Legs4({ x0, x1, z0, z1, top, inset = 0.06, splay = 0.04, r = 0.022, m }: { x0: number; x1: number; z0: number; z1: number; top: number; inset?: number; splay?: number; r?: number; m?: THREE.Material }) {
  return (
    <group>
      {[
        [x0 + inset, z0 + inset, -1, -1],
        [x1 - inset, z0 + inset, 1, -1],
        [x0 + inset, z1 - inset, -1, 1],
        [x1 - inset, z1 - inset, 1, 1],
      ].map(([x, z, dx, dz]) => (
        <TaperedLeg key={`${x}${z}`} x={x} z={z} top={top} splay={[dx * splay, dz * splay]} r={r} m={m} />
      ))}
    </group>
  )
}

/** Opal glass globe pendant with a brass canopy and stem. */
export function GlobePendant({ x, z, bottom, r = 0.15, light = 0.9, minor = false }: { x: number; z: number; bottom: number; r?: number; light?: number; minor?: boolean }) {
  const d = designMaterials()
  const cy = bottom + r
  const top = D.ceilingHeight
  return (
    <group>
      <mesh position={[x, cy, z]} material={d.opal}>
        <sphereGeometry args={[r, 40, 24]} />
      </mesh>
      <Cyl x={x} z={z} y0={cy + r * 0.92} y1={cy + r + 0.03} r={0.035} rTop={0.03} m={d.bronze} />
      <Cyl x={x} z={z} y0={cy + r + 0.03} y1={top - 0.01} r={0.004} m={d.bronze} seg={8} />
      <Cyl x={x} z={z} y0={top - 0.015} y1={top} r={0.05} m={d.bronze} />
      <Lamp x={x} y={cy} z={z} evening={light} distance={4} minor={minor} />
    </group>
  )
}

/** Spun-metal dome pendant (black outside, brass inside rim). */
export function DomePendant({ x, z, bottom, r = 0.18, light = 0.8, minor = false }: { x: number; z: number; bottom: number; r?: number; light?: number; minor?: boolean }) {
  const d = designMaterials()
  const h = r * 0.75
  const top = D.ceilingHeight
  return (
    <group>
      <mesh position={[x, bottom + h / 2, z]} material={d.glossBlack} castShadow>
        <cylinderGeometry args={[r * 0.18, r, h, 40, 1, true]} />
      </mesh>
      <mesh position={[x, bottom + 0.002, z]} rotation-x={Math.PI / 2} material={d.bronze}>
        <torusGeometry args={[r, 0.006, 8, 48]} />
      </mesh>
      <mesh position={[x, bottom + 0.04, z]} material={d.opal}>
        <sphereGeometry args={[r * 0.28, 24, 16]} />
      </mesh>
      <Cyl x={x} z={z} y0={bottom + h} y1={top} r={0.004} m={d.bronze} seg={8} />
      <Lamp x={x} y={bottom - 0.05} z={z} evening={light} distance={3.5} minor={minor} />
    </group>
  )
}

/** Round paper lantern (Akari-style globe) with fine horizontal ribs. */
export function PaperGlobe({ x, z, bottom, r = 0.28, light = 1.0, minor = false }: { x: number; z: number; bottom: number; r?: number; light?: number; minor?: boolean }) {
  const d = designMaterials()
  const cy = bottom + r
  const top = D.ceilingHeight
  const ribs = [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75]
  return (
    <group>
      <mesh position={[x, cy, z]} material={d.paper}>
        <sphereGeometry args={[r, 40, 24]} />
      </mesh>
      {ribs.map((t) => (
        <mesh key={t} position={[x, cy + t * r, z]} rotation-x={Math.PI / 2} material={d.ceramic}>
          <torusGeometry args={[r * Math.sqrt(1 - t * t) + 0.001, 0.0012, 4, 48]} />
        </mesh>
      ))}
      <Cyl x={x} z={z} y0={cy + r} y1={top} r={0.003} m={d.charcoal} seg={6} />
      <Lamp x={x} y={cy} z={z} evening={light} distance={4.5} minor={minor} />
    </group>
  )
}

/** Recessed ceiling downlight (visual only; light comes from the lamps). */
export function Downlight({ x, z, y = D.ceilingHeight }: { x: number; z: number; y?: number }) {
  const d = designMaterials()
  return (
    <group position={[x, y - 0.002, z]}>
      <mesh rotation-x={Math.PI / 2} material={d.charcoal}>
        <ringGeometry args={[0.035, 0.045, 24]} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} material={d.downlight}>
        <circleGeometry args={[0.035, 24]} />
      </mesh>
    </group>
  )
}

/** Gathered linen curtain panel hanging in a plane of constant z (`alongX`) or constant x. */
export function Curtain({ a0, a1, at, y0, y1, alongX, folds = 7, depth = 0.035 }: { a0: number; a1: number; at: number; y0: number; y1: number; alongX: boolean; folds?: number; depth?: number }) {
  const d = designMaterials()
  const g = useMemo(() => {
    const w = a1 - a0
    const h = y1 - y0
    const geo = new THREE.PlaneGeometry(w, h, folds * 8, 4)
    const p = geo.attributes.position
    for (let i = 0; i < p.count; i++) {
      const u = (p.getX(i) + w / 2) / w
      p.setZ(i, Math.sin(u * folds * Math.PI * 2) * depth)
    }
    geo.computeVertexNormals()
    if (alongX) geo.translate(a0 + w / 2, y0 + h / 2, at)
    else {
      geo.rotateY(Math.PI / 2)
      geo.translate(at, y0 + h / 2, a0 + w / 2)
    }
    return geo
  }, [a0, a1, at, y0, y1, alongX, folds, depth])
  return <mesh geometry={g} material={d.curtain} castShadow receiveShadow />
}

/** Linen roman blind, partly lowered, inside a window reveal. */
export function RomanBlind({ a0, a1, at, top, drop, alongX }: { a0: number; a1: number; at: number; top: number; drop: number; alongX: boolean }) {
  const d = designMaterials()
  const folds = 3
  const fh = drop / folds
  const items: ReactNode[] = []
  for (let i = 0; i < folds; i++) {
    const y1 = top - i * fh
    const y0 = y1 - fh
    items.push(
      alongX ? (
        <Soft key={i} x0={a0} x1={a1} y0={y0} y1={y1} z0={at - 0.015 - i * 0.004} z1={at + 0.015} m={d.linen} r={0.012} />
      ) : (
        <Soft key={i} x0={at - 0.015} x1={at + 0.015 + i * 0.004} y0={y0} y1={y1} z0={a0} z1={a1} m={d.linen} r={0.012} />
      ),
    )
  }
  return <group>{items}</group>
}

/** Wall-mounted split air-conditioner. `face` = direction it blows (+/-x or +/-z). */
export function AirCon({ x, z, y, face }: { x: number; z: number; y: number; face: 'x+' | 'x-' | 'z+' | 'z-' }) {
  const d = designMaterials()
  const rot = { 'z+': 0, 'x+': Math.PI / 2, 'z-': Math.PI, 'x-': -Math.PI / 2 }[face]
  return (
    <group position={[x, y, z]} rotation-y={rot}>
      <RoundedBox args={[0.82, 0.28, 0.22]} radius={0.03} smoothness={3} position={[0, 0, 0.11]} material={d.whiteAppliance} castShadow />
      <mesh position={[0, -0.09, 0.222]} material={d.charcoal}>
        <boxGeometry args={[0.7, 0.025, 0.004]} />
      </mesh>
    </group>
  )
}

/** Ceiling fan with dark wood blades. */
export function CeilingFan({ x, z, drop = 0.3 }: { x: number; z: number; drop?: number }) {
  const d = designMaterials()
  const y = D.ceilingHeight - drop
  return (
    <group position={[x, y, z]}>
      <mesh position-y={drop / 2} material={d.blackMetal}>
        <cylinderGeometry args={[0.012, 0.012, drop, 8]} />
      </mesh>
      <mesh material={d.blackMetal} castShadow>
        <cylinderGeometry args={[0.09, 0.07, 0.1, 24]} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <group key={i} rotation-y={(i * Math.PI * 2) / 3 + 0.4}>
          <mesh position={[0.42, -0.02, 0]} rotation-x={0.12} material={d.woodDark} castShadow>
            <boxGeometry args={[0.66, 0.012, 0.13]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** Potted olive-like tree: ceramic pot, slim trunk, clusters of small leaves. */
export function Plant({ x, z, h = 1.6, r = 0.2, pot }: { x: number; z: number; h?: number; r?: number; pot?: THREE.Material }) {
  const d = designMaterials()
  const leaves = useMemo(() => {
    const out: { p: [number, number, number]; rot: [number, number, number]; s: number }[] = []
    let seed = 7
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)
    for (let i = 0; i < 140; i++) {
      const a = rnd() * Math.PI * 2
      const rr = 0.1 + rnd() * 0.32
      const y = h * 0.55 + rnd() * h * 0.45
      out.push({ p: [x + Math.cos(a) * rr, y, z + Math.sin(a) * rr], rot: [rnd() * 3, rnd() * 3, rnd() * 3], s: 0.6 + rnd() * 0.6 })
    }
    return out
  }, [x, z, h])
  return (
    <group>
      <Cyl x={x} z={z} y0={0} y1={0.42} r={r * 0.8} rTop={r} m={pot ?? d.ceramicDark} />
      <Cyl x={x} z={z} y0={0.4} y1={0.42} r={r * 0.95} m={d.basalt} />
      <mesh position={[x, 0.42 + (h * 0.7) / 2, z]} rotation-z={0.06} material={d.woodDark}>
        <cylinderGeometry args={[0.012, 0.02, h * 0.7, 6]} />
      </mesh>
      {leaves.map((l, i) => (
        <mesh key={i} position={l.p} rotation={l.rot} scale={[l.s, l.s * 0.25, l.s * 2.4]} material={d.plant} castShadow>
          <sphereGeometry args={[0.022, 6, 4]} />
        </mesh>
      ))}
    </group>
  )
}

/** Simple ceramic vessel for styling surfaces. */
export function Vase({ x, z, y, h = 0.22, r = 0.07, m, neck = 0.6 }: { x: number; z: number; y: number; h?: number; r?: number; m?: THREE.Material; neck?: number }) {
  const d = designMaterials()
  const g = useMemo(() => {
    const pts: THREE.Vector2[] = []
    for (let i = 0; i <= 12; i++) {
      const t = i / 12
      const rr = r * (0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, t * 1.15))) * (t > 0.85 ? neck + (1 - neck) * 0.4 : 1)
      pts.push(new THREE.Vector2(Math.max(0.005, rr), t * h))
    }
    return new THREE.LatheGeometry(pts, 32)
  }, [h, r, neck])
  return <mesh geometry={g} position={[x, y, z]} material={m ?? d.ceramic} castShadow receiveShadow />
}

/** Stack of books (for shelves / tables). */
export function Books({ x, z, y, n = 3, w = 0.22, dpt = 0.16, alongX = true }: { x: number; z: number; y: number; n?: number; w?: number; dpt?: number; alongX?: boolean }) {
  const d = designMaterials()
  let yy = y
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const t = 0.025 + (i % 2) * 0.012
        const y0 = yy
        yy += t
        const ww = w * (1 - i * 0.06)
        const hw = (alongX ? ww : dpt) / 2
        const hd = (alongX ? dpt : ww) / 2
        return <B key={i} x0={x - hw} x1={x + hw} y0={y0} y1={y0 + t} z0={z - hd} z1={z + hd} m={d.book[(i * 3 + 1) % d.book.length]} />
      })}
    </group>
  )
}

/**
 * Real planar mirror (renders the scene from the mirrored camera).
 * `geometry` is built in the XY plane facing +z; position/rotation place it.
 */
export function Mirror({ geometry, position, rotationY = 0 }: { geometry: THREE.BufferGeometry; position: [number, number, number]; rotationY?: number }) {
  const mirror = useMemo(
    () => new Reflector(geometry, { textureWidth: 512, textureHeight: 512, color: new THREE.Color('#c9cdcc'), clipBias: 0.003 }),
    [geometry],
  )
  useEffect(() => () => mirror.dispose(), [mirror])
  return <primitive object={mirror} position={position} rotation-y={rotationY} />
}

