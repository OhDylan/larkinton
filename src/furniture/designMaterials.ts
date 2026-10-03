/**
 * Phase 2 finishes (v5): warm minimal — between mid-century and wabi-sabi / zen.
 * A tight palette: warm walnut-teak wood, cream and sand textiles, soft stone, jute, and black
 * as the only accent (ceramics, a dome pendant). Paper lanterns and olive trees for softness.
 * All textures are procedural canvases (no downloads). Furniture boxes use
 * metre-scaled UVs, so `repeat` below = how many texture tiles per metre.
 */
import * as THREE from 'three'
import { phMap, phMaterial, tileSize } from './phTextures'

export const designPalette = {
  wallWarm: '#ddd5c8', // warm greige plaster
  ceilingWarm: '#e7e1d7',
  wood: '#5b3a26', // deep walnut / teak
  woodDark: '#3e281b',
  woodLight: '#86603f',
  stone: '#ddd3c3', // soft sand-coloured stone
  basalt: '#2b2926',
  leather: '#6a4a36',
  linen: '#ece5da',
  cream: '#e4dccd', // cream boucle
  sand: '#cdbda3', // sand linen
  taupe: '#a39380', // taupe linen
  earth: '#8a7058', // earthy stoneware
  charcoal: '#2a2826',
  ceramic: '#e6dfd2',
  wool: '#d6c9b3',
  paper: '#f5ecdb',
  plant: '#55684a',
  birch: '#d8c3a0',
  jute: '#b9a283',
}

type Draw = (g: CanvasRenderingContext2D, w: number, h: number) => void

function canvasTex(w: number, h: number, draw: Draw, perMetre: [number, number], srgb = true) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d')!, w, h)
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(perMetre[0], perMetre[1])
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

const rand = (a: number, b: number) => a + Math.random() * (b - a)

/** Soft mottling for limewash / stone / textiles; `pores` adds terrazzo-like voids. */
const mottleDraw = (base: string, amount: number, blob: [number, number], pores = 0, streaks = 0): Draw => (g, w, h) => {
  g.fillStyle = base
  g.fillRect(0, 0, w, h)
  for (let i = 0; i < 700; i++) {
    const l = Math.random() > 0.5 ? 255 : 0
    g.fillStyle = `rgba(${l},${l},${l},${Math.random() * amount})`
    g.beginPath()
    g.ellipse(rand(0, w), rand(0, h), rand(blob[0], blob[1]), rand(blob[0], blob[1]) * rand(0.4, 1), rand(0, 3), 0, Math.PI * 2)
    g.fill()
  }
  for (let i = 0; i < streaks; i++) {
    g.fillStyle = `rgba(120,95,70,${rand(0.03, 0.08)})`
    g.fillRect(0, rand(0, h), w, rand(1, 6))
  }
  for (let i = 0; i < pores; i++) {
    g.fillStyle = `rgba(90,70,50,${rand(0.25, 0.55)})`
    g.beginPath()
    g.ellipse(rand(0, w), rand(0, h), rand(1, 4), rand(0.5, 1.5), 0, 0, Math.PI * 2)
    g.fill()
  }
}

let concreteTex: THREE.Texture | null = null
export function microcementTexture() {
  // floor UVs: 1 unit = one 0.6 m porcelain tile
  return (concreteTex ??= phMap('microcement', 0.6 / tileSize.microcement))
}

/** Wood floor texture, scaled for the floor's UVs (1 UV unit = one 0.6 m porcelain tile). */
let floorTex: THREE.Texture | null = null
export function woodFloorTexture() {
  return (floorTex ??= phMap('wood_floor', 0.6 / tileSize.wood_floor))
}

/** Fine weave for linen / wool. */
const weaveDraw = (base: string, contrast: number): Draw => (g, w, h) => {
  g.fillStyle = base
  g.fillRect(0, 0, w, h)
  for (let y = 0; y < h; y += 2) {
    g.fillStyle = `rgba(0,0,0,${rand(0, contrast)})`
    g.fillRect(0, y, w, 1)
  }
  for (let x = 0; x < w; x += 2) {
    g.fillStyle = `rgba(255,255,255,${rand(0, contrast)})`
    g.fillRect(x, 0, 1, h)
  }
}

/** Pegboard: birch with a 50 mm hole grid. */
const pegDraw: Draw = (g) => {
  g.fillStyle = designPalette.birch
  g.fillRect(0, 0, 32, 32)
  g.fillStyle = '#4b3b2b'
  g.beginPath()
  g.arc(16, 16, 3.4, 0, Math.PI * 2)
  g.fill()
}

const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(p)


function make() {
  const P = designPalette
  // walls: scanned grey plaster (Poly Haven) recoloured to warm greige; walls have metre UVs
  const limewash = phMap('plaster', 1 / tileSize.plaster)
  const stoneMap = canvasTex(512, 512, mottleDraw(P.stone, 0.035, [6, 40], 120, 10), [1.2, 1.2])
  const woolMap = canvasTex(256, 256, weaveDraw(P.wool, 0.1), [6, 6])
  return {
    limewash,
    ceiling: P.ceilingWarm,
    // scanned veneers (Poly Haven): walnut joinery, smoked walnut accents, teak
    wood: phMaterial('walnut', { roughness: 0.75 }),
    woodDark: phMaterial('smoked_walnut', { roughness: 0.8 }),
    woodLight: phMaterial('teak', { roughness: 0.8 }),
    stone: std({ map: stoneMap, roughness: 0.5 }),
    basalt: std({ map: canvasTex(256, 256, mottleDraw(P.basalt, 0.08, [4, 20]), [2, 2]), roughness: 0.85 }),
    // scanned fabrics (Poly Haven); upholstery UVs run 0..1 per face, so repeats are per face
    leather: phMaterial('leather', { roughness: 0.9 }, 0.5),
    linen: phMaterial('linen', {}, 0.6),
    cream: phMaterial('cream', {}, 0.6, 1.3), // cream linen-weave upholstery
    sand: phMaterial('sand', {}, 0.6),
    taupe: phMaterial('taupe', {}, 0.6),
    rug: phMaterial('jute', {}, 1.8 / 4, 1.2), // rug plane UVs span the whole ~1.8 m rug
    opal: std({ color: '#fbf7ef', emissive: '#ffd9a6', emissiveIntensity: 0.25, roughness: 0.25 }),
    glossBlack: std({ color: '#151413', roughness: 0.15, metalness: 0.2 }),
    wool: std({ map: woolMap, bumpMap: woolMap, bumpScale: 0.8, roughness: 1 }),
    earth: std({ map: canvasTex(256, 256, mottleDraw(P.earth, 0.1, [3, 18], 60), [3, 3]), roughness: 0.8 }),
    ceramic: std({ map: canvasTex(256, 256, mottleDraw(P.ceramic, 0.07, [3, 18], 40), [4, 4]), roughness: 0.4 }),
    ceramicDark: std({ map: canvasTex(256, 256, mottleDraw('#3b3631', 0.1, [3, 18], 40), [4, 4]), roughness: 0.5 }),
    charcoal: std({ color: P.charcoal, roughness: 0.6 }),
    blackMetal: std({ color: '#1f1e1c', roughness: 0.4, metalness: 0.6 }),
    bronze: std({ color: '#3a3129', roughness: 0.45, metalness: 0.6 }), // dark aged bronze
    curtain: new THREE.MeshStandardMaterial({
      map: canvasTex(256, 256, weaveDraw('#f1ebe1', 0.05), [6, 6]),
      roughness: 1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
    }),
    plant: std({ color: P.plant, roughness: 0.8, side: THREE.DoubleSide }),
    paper: std({ color: P.paper, emissive: '#ffcf96', emissiveIntensity: 0.3, roughness: 1, side: THREE.DoubleSide }),
    lightStrip: std({ color: '#fff3e0', emissive: '#ffd49a', emissiveIntensity: 0.4 }),
    downlight: std({ color: '#fbf6ee', emissive: '#ffe2b8', emissiveIntensity: 0.6 }),
    mirror: std({ color: '#e6ebec', roughness: 0.04, metalness: 0.85, envMapIntensity: 2.2 }),
    hobGlass: std({ color: '#0e0e0e', roughness: 0.08, metalness: 0.4 }),
    whiteAppliance: std({ color: '#f3f2ee', roughness: 0.35 }),
    pegboard: std({ map: canvasTex(32, 32, pegDraw, [20, 20]), roughness: 0.8 }),
    robotWhite: std({ color: '#efeeea', roughness: 0.3 }),
    robotAccent: std({ color: '#d4833f', roughness: 0.45 }),
    screen: std({ color: '#15171a', roughness: 0.15, emissive: '#1b2330', emissiveIntensity: 0.4 }),
    book: ['#2a2826', '#e6dccb', '#b8a68c', '#6b4a36', '#d8cfbf', '#8a7a66', '#3e3a35'].map((c) => std({ color: c, roughness: 0.9 })),
  }
}

let cache: ReturnType<typeof make> | null = null
export function designMaterials() {
  return (cache ??= make())
}
export type DesignMaterials = ReturnType<typeof make>
