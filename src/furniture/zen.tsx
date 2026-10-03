/**
 * Real models only (nothing hand-modelled): Poly Haven CC0 stoneware vases, wooden bowl,
 * money tree, plants and dry branch, plus Wayfair's GlamVelvetSofa from the Khronos glTF
 * sample assets, and furniture / bath accessories from Sketchfab (all CC BY 4.0, credited on
 * screen and in public/assets/ph/README.md).
 */
import { useGLTF } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import type { GLTFParser } from 'three-stdlib'

/**
 * Models are pre-optimised single-file GLBs (meshopt-compressed geometry, WebP textures,
 * unused variants pruned) — see public/assets/ph/README.md.
 */
const modelUrl = (id: string) => `${import.meta.env.BASE_URL}assets/ph/glb/${id}.glb`

export const MODEL_IDS = [
  'ceramic_vase_01',
  'ceramic_vase_02',
  'ceramic_vase_03',
  'ceramic_vase_04',
  'antique_ceramic_vase_01',
  'wooden_bowl_01',
  'pachira_aquatica_01',
  'potted_plant_02',
  'potted_plant_04',
  'dry_branches_medium_01',
  'planter_pot_clay',
  'GlamVelvetSofa',
  'stone_coffee_table',
  'japandi_stool',
  'dark_bed',
  'office_chair',
  'desk_lamp',
  'raskog_cart',
  'laptop',
  'robot_arm',
  'toilet',
  'bath_accessories',
  'bath_stool',
  'towel_folded',
  'towel_rail',
  'soap_black',
  'futon_sofa_bed',
] as const
export type PhModelId = (typeof MODEL_IDS)[number]

type ModelProps = {
  id: PhModelId
  /** keep only nodes whose name contains one of these strings (e.g. one variant, some pieces) */
  pick?: string[]
  position: [number, number, number]
  rotation?: [number, number, number]
  /** uniform, or per axis (model axes, before rotation) */
  scale?: number | [number, number, number]
  /** re-centre the picked pieces so their footprint centre / base sits at `position`; 'base' only drops them to y = 0 */
  recenter?: boolean | 'base'
  /**
   * 'black': override the scanned glaze with matte black stoneware (keeps the surface relief).
   * 'charcoal': stain the existing texture dark (keeps the wood grain).
   */
  finish?: 'black' | 'charcoal'
  /** KHR_materials_variants colourway (e.g. the sofa's "Black") */
  variant?: string
  /** re-dye materials by name: drops the colour texture, keeps normal / roughness detail */
  recolor?: Record<string, string>
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

const charcoalStain = new Map<THREE.Material, THREE.Material>()
function toCharcoal(m: THREE.Material) {
  let c = charcoalStain.get(m)
  if (!c) {
    c = (m as THREE.MeshStandardMaterial).clone()
    ;(c as THREE.MeshStandardMaterial).color.set('#4a4642')
    charcoalStain.set(m, c)
  }
  return c
}

const dyed = new Map<string, THREE.Material>()
function dye(m: THREE.Material, color: string) {
  const key = `${m.uuid}|${color}`
  let d = dyed.get(key)
  if (!d) {
    const c = (m as THREE.MeshStandardMaterial).clone()
    c.map = null
    c.color.set(color)
    dyed.set(key, (d = c))
  }
  return d
}

function Model({ id, pick, position, rotation, scale = 1, recenter = true, finish, variant, recolor }: ModelProps) {
  const { scene, parser } = useGLTF(modelUrl(id))
  const variantMats = useVariant(parser, scene, variant)
  const obj = useMemo(() => {
    const root = new THREE.Group()
    root.userData.noMerge = true // see StaticMerge
    scene.updateMatrixWorld(true)
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      if (pick && !pick.some((p) => mesh.name.includes(p))) return
      const c = mesh.clone()
      c.matrix.copy(mesh.matrixWorld)
      c.matrix.decompose(c.position, c.quaternion, c.scale)
      const vm = variantMats?.get(mesh)
      if (vm) c.material = vm
      const f = finish === 'black' ? toBlack : finish === 'charcoal' ? toCharcoal : null
      if (f) c.material = Array.isArray(c.material) ? c.material.map(f) : f(c.material)
      if (recolor && !Array.isArray(c.material) && recolor[c.material.name]) c.material = dye(c.material, recolor[c.material.name])
      c.castShadow = true
      c.receiveShadow = true
      root.add(c)
    })
    if (recenter) {
      const box = new THREE.Box3().setFromObject(root)
      const centre = box.getCenter(new THREE.Vector3())
      const shift = recenter === 'base' ? new THREE.Vector3(0, box.min.y, 0) : new THREE.Vector3(centre.x, box.min.y, centre.z)
      root.children.forEach((c) => c.position.sub(shift))
    }
    return root
  }, [scene, pick, recenter, finish, variantMats, recolor])
  return <primitive object={obj} position={position} rotation={rotation} scale={scale} />
}

/** Resolve a KHR_materials_variants colourway to a material per original mesh (async, then re-render). */
function useVariant(parser: GLTFParser, scene: THREE.Object3D, variant?: string) {
  const [mats, setMats] = useState<Map<THREE.Object3D, THREE.Material> | null>(null)
  useEffect(() => {
    if (!variant) return
    const ext = parser.json.extensions?.KHR_materials_variants as { variants: { name: string }[] } | undefined
    const vi = ext?.variants.findIndex((v) => v.name === variant) ?? -1
    if (vi < 0) return
    const meshes: THREE.Mesh[] = []
    scene.traverse((o) => (o as THREE.Mesh).isMesh && meshes.push(o as THREE.Mesh))
    let alive = true
    Promise.all(
      meshes.map(async (m) => {
        const a = parser.associations.get(m) as { meshes?: number; primitives?: number } | undefined
        if (a?.meshes === undefined) return null
        const prim = parser.json.meshes[a.meshes].primitives[a.primitives ?? 0]
        const map = prim.extensions?.KHR_materials_variants?.mappings?.find((mp: { variants: number[] }) => mp.variants.includes(vi))
        return map ? ([m, (await parser.getDependency('material', map.material)) as THREE.Material] as const) : null
      }),
    ).then((pairs) => alive && setMats(new Map(pairs.filter((p) => p !== null))))
    return () => {
      alive = false
    }
  }, [parser, scene, variant])
  return variant ? mats : null
}

/** A model, loaded lazily (never blocks the rest of the room). */
export function PhModel(props: ModelProps) {
  return (
    <Suspense fallback={null}>
      <Model {...props} />
    </Suspense>
  )
}

/** Pachira (money tree, Poly Haven variant d ≈ 1.6 m) in Poly Haven's terracotta pot, scaled up. */
export function MoneyTree({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  const potScale = 1.7 // 0.27 m pot → ~0.46 m
  const potH = 0.22 * potScale
  return (
    <group>
      <PhModel id="planter_pot_clay" position={[x, 0, z]} scale={potScale} />
      <PhModel id="pachira_aquatica_01" position={[x, potH - 0.06, z]} scale={scale} />
    </group>
  )
}

/** Ikebana: a single dry branch standing in a slim stoneware vase. */
export function Ikebana({ x, z, y, rot = 0 }: { x: number; z: number; y: number; rot?: number }) {
  return (
    <group position={[x, y, z]} rotation-y={rot}>
      <PhModel id="ceramic_vase_03" position={[0, 0, 0]} finish="black" />
      {/* branch "a" lies along +z on the ground: tip it upright into the vase */}
      <PhModel id="dry_branches_medium_01" position={[0, 0.25, 0]} rotation={[-Math.PI / 2 + 0.2, 0, 0.15]} scale={0.6} />
    </group>
  )
}

// start every download immediately, in parallel, instead of when each item mounts
MODEL_IDS.forEach((id) => useGLTF.preload(modelUrl(id)))
