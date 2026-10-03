/**
 * Photo-scanned PBR textures from Poly Haven (CC0, polyhaven.com), downsized to 512 px and
 * recoloured to the design palette (see public/assets/ph/tex). Each set has a colour map,
 * an OpenGL normal map and a roughness map.
 *
 * Furniture boxes have metre-scaled UVs, so `perMetre` = 1 / the texture's real-world size.
 */
import * as THREE from 'three'

const base = `${import.meta.env.BASE_URL}assets/ph/tex/`
const loader = new THREE.TextureLoader()

function tex(name: string, file: string, perMetre: number, srgb: boolean) {
  const t = loader.load(`${base}${name}/${file}.webp`)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(perMetre, perMetre)
  t.anisotropy = 8
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** Real-world size of one texture tile, metres (from Poly Haven's asset info). */
export const tileSize = {
  walnut: 1.8,
  smoked_walnut: 1.0,
  teak: 1.0,
  plaster: 1.5,
  cream: 0.27,
  linen: 0.27,
  sand: 0.27,
  taupe: 0.27,
  leather: 0.4,
  oak_floor: 2.08, // laminate_floor_03 (renamed from wood_floor so cached copies of the old scan are not reused)
  microcement: 2.0,
  jute: 0.27,
} as const
export type PhTex = keyof typeof tileSize

/** `scale` multiplies the repeat (e.g. for geometry whose UVs aren't in metres). */
export function phMaterial(name: PhTex, params: THREE.MeshStandardMaterialParameters = {}, scale = 1, normal = 1) {
  const r = scale / tileSize[name]
  return new THREE.MeshStandardMaterial({
    map: tex(name, 'diff', r, true),
    normalMap: tex(name, 'nor', r, false),
    normalScale: new THREE.Vector2(normal, normal),
    roughnessMap: tex(name, 'rough', r, false),
    roughness: 1,
    ...params,
  })
}

/** Bare colour map, e.g. for swapping onto an existing material (walls, floor). */
export function phMap(name: PhTex, perMetre: number) {
  return tex(name, 'diff', perMetre, true)
}
export function phNormal(name: PhTex, perMetre: number) {
  return tex(name, 'nor', perMetre, false)
}
