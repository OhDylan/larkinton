/**
 * Zen / Japanese accents: Poly Haven models (CC0) for the objects that need real detail
 * (tea set, stoneware vases, wooden bowl, money tree, dry branches), plus a few procedural
 * pieces: bonsai, hanging ink scroll (kakejiku), stacked stones, incense holder, ikebana.
 */
import { useGLTF } from '@react-three/drei'
import { Suspense, useMemo } from 'react'
import * as THREE from 'three'
import { designMaterials } from './designMaterials'
import { B, Cyl } from './primitives'

const modelUrl = (id: string) => `${import.meta.env.BASE_URL}assets/ph/models/${id}/${id}_1k.gltf`

export type PhModelId =
  | 'tea_set_01'
  | 'ceramic_vase_01'
  | 'ceramic_vase_02'
  | 'ceramic_vase_03'
  | 'ceramic_vase_04'
  | 'antique_ceramic_vase_01'
  | 'wooden_bowl_01'
  | 'pachira_aquatica_01'
  | 'potted_plant_02'
  | 'dry_branches_medium_01'

type ModelProps = {
  id: PhModelId
  /** keep only nodes whose name contains one of these strings (e.g. one variant, some pieces) */
  pick?: string[]
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  /** re-centre the picked pieces so their footprint centre / base sits at `position` */
  recenter?: boolean
  /** override the scanned glaze: matte black stoneware (keeps the surface relief) */
  finish?: 'black'
}

const blackGlaze = new Map<THREE.Material, THREE.Material>()
function toBlack(m: THREE.Material) {
  let b = blackGlaze.get(m)
  if (!b) {
    const s = m as THREE.MeshStandardMaterial
    b = new THREE.MeshStandardMaterial({ color: '#2c2926', roughness: 0.55, normalMap: s.normalMap, roughnessMap: s.roughnessMap })
    blackGlaze.set(m, b)
  }
  return b
}

function Model({ id, pick, position, rotation, scale = 1, recenter = true, finish }: ModelProps) {
  const { scene } = useGLTF(modelUrl(id))
  const obj = useMemo(() => {
    const root = new THREE.Group()
    scene.updateMatrixWorld(true)
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      if (pick && !pick.some((p) => mesh.name.includes(p))) return
      const c = mesh.clone()
      c.matrix.copy(mesh.matrixWorld)
      c.matrix.decompose(c.position, c.quaternion, c.scale)
      if (finish === 'black') c.material = Array.isArray(c.material) ? c.material.map(toBlack) : toBlack(c.material)
      c.castShadow = true
      c.receiveShadow = true
      root.add(c)
    })
    if (recenter) {
      const box = new THREE.Box3().setFromObject(root)
      const centre = box.getCenter(new THREE.Vector3())
      root.children.forEach((c) => c.position.sub(new THREE.Vector3(centre.x, box.min.y, centre.z)))
    }
    return root
  }, [scene, pick, recenter, finish])
  return <primitive object={obj} position={position} rotation={rotation} scale={scale} />
}

/** A Poly Haven model, loaded lazily (never blocks the rest of the room). */
export function PhModel(props: ModelProps) {
  return (
    <Suspense fallback={null}>
      <Model {...props} />
    </Suspense>
  )
}

/** Teapot and two cups from the Poly Haven tea set, on a dark wood tray. */
export function TeaSet({ x, z, y, rot = 0 }: { x: number; z: number; y: number; rot?: number }) {
  const d = designMaterials()
  return (
    <group position={[x, y, z]} rotation-y={rot}>
      <B x0={-0.2} x1={0.2} y0={0} y1={0.02} z0={-0.12} z1={0.12} m={d.woodDark} />
      <PhModel id="tea_set_01" pick={['teapot_01']} position={[-0.08, 0.02, 0]} />
      <PhModel id="tea_set_01" pick={['cup_small_01']} position={[0.08, 0.02, -0.04]} />
      <PhModel id="tea_set_01" pick={['cup_small_02']} position={[0.12, 0.02, 0.06]} />
    </group>
  )
}

/** Large ceramic planter with a Pachira (money tree), variant d ≈ 1.6 m. */
export function MoneyTree({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  const d = designMaterials()
  const potH = 0.42
  return (
    <group>
      <mesh position={[x, potH / 2, z]} scale={[1, 0.95, 1]} material={d.earth} castShadow receiveShadow>
        <sphereGeometry args={[0.24, 32, 20, 0, Math.PI * 2, 0.35, Math.PI - 0.35]} />
      </mesh>
      <Cyl x={x} z={z} y0={potH - 0.03} y1={potH - 0.02} r={0.21} m={d.basalt} />
      <PhModel id="pachira_aquatica_01" pick={['_d']} position={[x, potH - 0.05, z]} scale={scale} />
    </group>
  )
}

/** Ikebana: a single dry branch standing in a slim stoneware vase. */
export function Ikebana({ x, z, y, rot = 0 }: { x: number; z: number; y: number; rot?: number }) {
  return (
    <group position={[x, y, z]} rotation-y={rot}>
      <PhModel id="ceramic_vase_03" position={[0, 0, 0]} finish="black" />
      {/* branch "a" lies along +z on the ground: tip it upright into the vase */}
      <PhModel id="dry_branches_medium_01" pick={['_a']} position={[0, 0.25, 0]} rotation={[-Math.PI / 2 + 0.2, 0, 0.15]} scale={0.6} />
    </group>
  )
}

/** Procedural bonsai: shallow dark pot, twisting trunk, layered cloud-pad foliage. */
export function Bonsai({ x, z, y, s = 1 }: { x: number; z: number; y: number; s?: number }) {
  const d = designMaterials()
  const trunk = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.03, 0),
      new THREE.Vector3(0.03, 0.1, 0.01),
      new THREE.Vector3(-0.03, 0.18, -0.01),
      new THREE.Vector3(0.04, 0.26, 0.02),
      new THREE.Vector3(0.07, 0.31, 0),
    ])
    return new THREE.TubeGeometry(curve, 24, 0.018, 8, false)
  }, [])
  const pads: [number, number, number, number][] = [
    [0.09, 0.32, 0.0, 0.085],
    [-0.06, 0.24, 0.03, 0.07],
    [0.06, 0.2, -0.04, 0.06],
    [-0.01, 0.36, -0.02, 0.06],
  ]
  return (
    <group position={[x, y, z]} scale={s}>
      <B x0={-0.13} x1={0.13} y0={0} y1={0.045} z0={-0.08} z1={0.08} m={d.ceramicDark} />
      <B x0={-0.12} x1={0.12} y0={0.04} y1={0.046} z0={-0.07} z1={0.07} m={d.earth} shadow={false} />
      <mesh geometry={trunk} material={d.woodDark} castShadow />
      {pads.map(([px, py, pz, r], i) => (
        <mesh key={i} position={[px, py, pz]} scale={[1, 0.45, 0.8]} material={d.plant} castShadow>
          <icosahedronGeometry args={[r, 2]} />
        </mesh>
      ))}
    </group>
  )
}

/** Stacked river stones (as a sculpture / side table): alternating basalt and pale stone. */
export function StackedStones({ x, z, top = 0.55, withTop = true }: { x: number; z: number; top?: number; withTop?: boolean }) {
  const d = designMaterials()
  const stones: [number, number, number, THREE.Material][] = [
    [0.19, 0.6, 0, d.basalt],
    [0.15, 0.55, 0.01, d.stone],
    [0.12, 0.6, -0.01, d.basalt],
  ]
  let y = 0
  const k = top / 0.5
  return (
    <group>
      {stones.map(([r, sq, off, m], i) => {
        const h = r * sq * 2 * k * 0.95
        const cy = y + h / 2
        y += h * 0.92
        return (
          <mesh key={i} position={[x + off, cy, z]} scale={[1, sq * k * 0.95, 0.92]} material={m} castShadow receiveShadow>
            <sphereGeometry args={[r, 32, 20]} />
          </mesh>
        )
      })}
      {withTop && <Cyl x={x} z={z} y0={top - 0.03} y1={top} r={0.2} m={d.woodDark} seg={48} />}
    </group>
  )
}

/** Stone incense dish with a single stick. */
export function Incense({ x, z, y }: { x: number; z: number; y: number }) {
  const d = designMaterials()
  return (
    <group position={[x, y, z]}>
      <mesh position-y={0.012} scale={[1, 0.35, 0.7]} material={d.basalt} castShadow>
        <sphereGeometry args={[0.06, 24, 12]} />
      </mesh>
      <mesh position={[0.01, 0.1, 0]} rotation-z={-0.12} material={d.woodDark}>
        <cylinderGeometry args={[0.0015, 0.0015, 0.18, 4]} />
      </mesh>
    </group>
  )
}

/** Sumi-ink landscape on washi paper (procedural), used for the hanging scroll. */
function inkPainting(w: number, h: number, kind: 'mountains' | 'enso') {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')!
  g.fillStyle = '#efe8da'
  g.fillRect(0, 0, w, h)
  for (let i = 0; i < 3000; i++) {
    g.fillStyle = `rgba(120,100,70,${Math.random() * 0.05})`
    g.fillRect(Math.random() * w, Math.random() * h, 2, 2)
  }
  if (kind === 'enso') {
    g.strokeStyle = 'rgba(25,22,20,0.9)'
    g.lineCap = 'round'
    const cx = w / 2
    const cy = h * 0.42
    const r = w * 0.3
    for (let a = 0.4; a < Math.PI * 2 - 0.15; a += 0.02) {
      g.lineWidth = w * 0.05 * (0.55 + 0.45 * Math.sin(a * 0.5))
      g.globalAlpha = 0.85 - 0.4 * (a / (Math.PI * 2))
      g.beginPath()
      g.arc(cx, cy, r, a, a + 0.03)
      g.stroke()
    }
    g.globalAlpha = 1
  } else {
    // three layers of misty mountains, darker in front
    const layers = [
      { base: 0.55, amp: 0.18, a: 0.22 },
      { base: 0.68, amp: 0.14, a: 0.42 },
      { base: 0.82, amp: 0.1, a: 0.75 },
    ]
    layers.forEach((L, li) => {
      const grd = g.createLinearGradient(0, h * (L.base - L.amp), 0, h)
      grd.addColorStop(0, `rgba(30,28,26,${L.a})`)
      grd.addColorStop(1, 'rgba(30,28,26,0)')
      g.fillStyle = grd
      g.beginPath()
      g.moveTo(0, h)
      for (let x = 0; x <= w; x += 4) {
        const t = x / w
        const y = h * (L.base - L.amp * Math.abs(Math.sin(t * 3.1 + li * 1.7)) * (0.6 + 0.4 * Math.sin(t * 11 + li)))
        g.lineTo(x, y)
      }
      g.lineTo(w, h)
      g.closePath()
      g.fill()
    })
    // a lone pine and a red seal stamp
    g.strokeStyle = 'rgba(20,18,16,0.85)'
    g.lineWidth = w * 0.012
    g.beginPath()
    g.moveTo(w * 0.72, h * 0.8)
    g.quadraticCurveTo(w * 0.69, h * 0.66, w * 0.74, h * 0.56)
    g.stroke()
    g.fillStyle = 'rgba(20,18,16,0.8)'
    for (const [px, py, pr] of [[0.7, 0.57, 0.06], [0.78, 0.6, 0.05], [0.73, 0.64, 0.045]])
      g.fillRect(w * (px - pr), h * py, w * pr * 2, h * 0.012)
  }
  g.fillStyle = 'rgba(170,45,35,0.85)'
  g.fillRect(w * 0.12, h * 0.86, w * 0.06, w * 0.06)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

/**
 * Kakejiku (hanging scroll) on a wall. `face` is the direction it faces into the room.
 * Coordinates: centre of the painting (cx along the wall, top/bottom heights).
 */
export function HangingScroll({ at, along, y0, y1, w = 0.42, face, kind = 'mountains' }: { at: number; along: number; y0: number; y1: number; w?: number; face: 'x+' | 'x-' | 'z+' | 'z-'; kind?: 'mountains' | 'enso' }) {
  const d = designMaterials()
  const h = y1 - y0
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ map: inkPainting(256, Math.round((256 * h) / w), kind), roughness: 0.95 }), [h, w, kind])
  const mount = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8b8173', roughness: 1 }), [])
  const rot = { 'z+': 0, 'x+': Math.PI / 2, 'z-': Math.PI, 'x-': -Math.PI / 2 }[face]
  const pos: [number, number, number] = face[0] === 'x' ? [at, 0, along] : [along, 0, at]
  return (
    <group position={pos} rotation-y={rot}>
      {/* silk mount, painting, wooden rods, hanging cord */}
      <mesh position={[0, (y0 + y1) / 2, 0.004]} material={mount}>
        <planeGeometry args={[w + 0.08, h + 0.3]} />
      </mesh>
      <mesh position={[0, (y0 + y1) / 2 + 0.03, 0.006]} material={mat}>
        <planeGeometry args={[w, h - 0.12]} />
      </mesh>
      <mesh position={[0, (y0 + y1) / 2 - h / 2 - 0.16, 0.012]} rotation-z={Math.PI / 2} material={d.woodDark} castShadow>
        <cylinderGeometry args={[0.012, 0.012, w + 0.14, 12]} />
      </mesh>
      <mesh position={[0, (y0 + y1) / 2 + h / 2 + 0.15, 0.01]} rotation-z={Math.PI / 2} material={d.woodDark}>
        <cylinderGeometry args={[0.008, 0.008, w + 0.1, 10]} />
      </mesh>
    </group>
  )
}

;(['tea_set_01', 'ceramic_vase_01', 'ceramic_vase_03', 'wooden_bowl_01', 'pachira_aquatica_01'] as PhModelId[]).forEach((id) => useGLTF.preload(modelUrl(id)))
