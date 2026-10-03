/**
 * Zen / Japanese accents: Poly Haven models (CC0) for the objects that need real detail
 * (tea set, stoneware vases, wooden bowl, money tree, dry branches, furniture), arranged as zen
 * accents. Nothing here is hand-modelled.
 */
import { useGLTF } from '@react-three/drei'
import { Suspense, useMemo } from 'react'
import * as THREE from 'three'

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
  | 'modern_arm_chair_01'
  | 'chinese_tea_table'
  | 'chinese_stool'
  | 'WoodenTable_02'
  | 'hanging_picture_frame_03'
  | 'planter_pot_clay'
  | 'potted_plant_04'

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

/** Teapot and two cups from the Poly Haven tea set. */
export function TeaSet({ x, z, y, rot = 0 }: { x: number; z: number; y: number; rot?: number }) {
  return (
    <group position={[x, y, z]} rotation-y={rot}>
      <PhModel id="tea_set_01" pick={['teapot_01']} position={[-0.08, 0, 0]} />
      <PhModel id="tea_set_01" pick={['cup_small_01']} position={[0.08, 0, -0.04]} />
      <PhModel id="tea_set_01" pick={['cup_small_02']} position={[0.12, 0, 0.06]} />
    </group>
  )
}

/** Pachira (money tree, Poly Haven variant d ≈ 1.6 m) in Poly Haven's terracotta pot, scaled up. */
export function MoneyTree({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  const potScale = 1.7 // 0.27 m pot → ~0.46 m
  const potH = 0.22 * potScale
  return (
    <group>
      <PhModel id="planter_pot_clay" position={[x, 0, z]} scale={potScale} />
      <PhModel id="pachira_aquatica_01" pick={['_d']} position={[x, potH - 0.06, z]} scale={scale} />
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

;(['tea_set_01', 'ceramic_vase_01', 'ceramic_vase_03', 'wooden_bowl_01', 'pachira_aquatica_01'] as PhModelId[]).forEach((id) => useGLTF.preload(modelUrl(id)))
