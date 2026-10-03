/**
 * Phase 2 finishes (v5): warm minimal — between mid-century and wabi-sabi / zen.
 * A tight palette: warm walnut-teak wood, cream and sand textiles, soft stone, jute, and black
 * as the only accent (ceramics, a dome pendant). Paper lanterns and olive trees for softness.
 * All textures are procedural canvases (no downloads). Furniture boxes use
 * metre-scaled UVs, so `repeat` below = how many texture tiles per metre.
 */
import * as THREE from 'three'

export const designPalette = {
  wallWarm: '#e9e2d6', // warm off-white plaster
  ceilingWarm: '#efe9df',
  wood: '#6e4a32', // warm walnut / teak, medium-dark
  woodDark: '#4b3223',
  woodLight: '#9a7352',
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

/** Wood: straight grain with slow colour drift, fine pores and a few darker figure lines. */
const woodDraw = (base: string, dark: string): Draw => (g, w, h) => {
  const k = w / 512 // detail scale relative to the 512-px design size
  g.fillStyle = base
  g.fillRect(0, 0, w, h)
  // broad colour bands (boards / flitch variation)
  for (let i = 0; i < 14; i++) {
    const x = rand(0, w)
    const bw = rand(20, 120) * k
    const grd = g.createLinearGradient(x - bw, 0, x + bw, 0)
    const a = rand(0.04, 0.14)
    const tone = Math.random() > 0.5 ? `rgba(255,220,190,${a})` : `rgba(20,8,0,${a})`
    grd.addColorStop(0, 'rgba(0,0,0,0)')
    grd.addColorStop(0.5, tone)
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grd
    g.fillRect(x - bw, 0, bw * 2, h)
  }
  // grain lines
  for (let i = 0; i < 220 * k; i++) {
    const x = rand(0, w)
    g.strokeStyle = Math.random() > 0.3 ? `rgba(30,14,4,${rand(0.03, 0.12)})` : `rgba(255,230,200,${rand(0.02, 0.06)})`
    g.lineWidth = rand(1, 4) * k
    g.beginPath()
    const phase = rand(0, 10)
    const amp = rand(0.3, 1.6) * k
    const period = rand(90, 220) * k
    g.moveTo(x, 0)
    for (let y = 0; y <= h; y += 16) g.lineTo(x + Math.sin(y / period + phase) * amp, y)
    g.stroke()
  }
  // a few long cathedral-ish figure strokes
  g.strokeStyle = dark
  for (let i = 0; i < 6; i++) {
    const x = rand(0, w)
    g.globalAlpha = rand(0.12, 0.25)
    g.lineWidth = rand(1, 3) * k
    g.beginPath()
    g.moveTo(x, 0)
    for (let y = 0; y <= h; y += 16) g.lineTo(x + Math.sin(y / (180 * k) + i) * 14 * k, y)
    g.stroke()
  }
  g.globalAlpha = 1
}

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

/** Medium oak floorboards, 180 mm wide, staggered lengths (one texture tile = 1.2 x 1.2 m). */
const floorDraw: Draw = (g, w, h) => {
  const boards = 1.2 / 0.18
  const bw = w / boards
  const tones = ['#a5805d', '#9e7956', '#aa8662', '#9a7552', '#a37e5b']
  for (let c = 0; c < Math.ceil(boards); c++) {
    // stagger each column, and wrap so the texture tiles seamlessly
    let y = -rand(0, h * 0.6)
    let k = c
    while (y < h) {
      const len = rand(h * 0.45, h * 0.9)
      g.fillStyle = tones[k++ % tones.length]
      g.fillRect(c * bw, y, bw, len)
      for (let i = 0; i < 26; i++) {
        g.strokeStyle = `rgba(60,35,15,${rand(0.04, 0.12)})`
        g.lineWidth = rand(0.5, 1.6)
        const x = c * bw + rand(2, bw - 2)
        g.beginPath()
        g.moveTo(x, y)
        g.bezierCurveTo(x + rand(-3, 3), y + len * 0.3, x + rand(-3, 3), y + len * 0.7, x + rand(-2, 2), y + len)
        g.stroke()
      }
      g.fillStyle = 'rgba(40,24,10,0.55)'
      g.fillRect(c * bw, y, bw, 1.5)
      y += len
    }
    g.fillStyle = 'rgba(40,24,10,0.5)'
    g.fillRect(c * bw, 0, 1.5, h)
  }
}

/** Wood floor texture, scaled for the floor's UVs (1 UV unit = one 0.6 m porcelain tile). */
let floorTex: THREE.CanvasTexture | null = null
export function woodFloorTexture() {
  return (floorTex ??= canvasTex(1024, 1024, floorDraw, [0.5, 0.5]))
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

function wood(base: string, dark: string, roughness = 0.42) {
  const map = canvasTex(1024, 2048, woodDraw(base, dark), [0.9, 0.45])
  return std({ map, bumpMap: map, bumpScale: 0.25, roughness })
}

function make() {
  const P = designPalette
  // smooth painted wall: only a whisper of texture
  const limewash = canvasTex(512, 512, mottleDraw(P.wallWarm, 0.006, [4, 30]), [0.6, 0.6])
  const stoneMap = canvasTex(512, 512, mottleDraw(P.stone, 0.035, [6, 40], 120, 10), [1.2, 1.2])
  const linenMap = canvasTex(256, 256, weaveDraw(P.linen, 0.06), [8, 8])
  const woolMap = canvasTex(256, 256, weaveDraw(P.wool, 0.1), [6, 6])
  const leatherMap = canvasTex(256, 256, mottleDraw(P.leather, 0.025, [2, 8]), [4, 4])
  return {
    limewash,
    ceiling: P.ceilingWarm,
    wood: wood(P.wood, P.woodDark),
    woodDark: wood(P.woodDark, '#1e120b', 0.6),
    woodLight: wood(P.woodLight, P.wood, 0.6),
    stone: std({ map: stoneMap, roughness: 0.5 }),
    basalt: std({ map: canvasTex(256, 256, mottleDraw(P.basalt, 0.08, [4, 20]), [2, 2]), roughness: 0.85 }),
    leather: std({ map: leatherMap, bumpMap: leatherMap, bumpScale: 0.15, roughness: 0.42 }),
    linen: std({ map: linenMap, bumpMap: linenMap, bumpScale: 0.3, roughness: 1 }),
    // boucle: chunky loops → strong bump
    cream: (() => {
      const t = canvasTex(256, 256, mottleDraw(P.cream, 0.12, [1.5, 3.5]), [10, 10])
      return std({ map: t, bumpMap: t, bumpScale: 1.2, roughness: 1 })
    })(),
    sand: std({ map: canvasTex(256, 256, weaveDraw(P.sand, 0.07), [8, 8]), roughness: 1 }),
    taupe: std({ map: canvasTex(256, 256, weaveDraw(P.taupe, 0.07), [8, 8]), roughness: 1 }),
    // jute rug: coarse woven fibre
    rug: (() => {
      const t = canvasTex(256, 256, weaveDraw(P.jute, 0.22), [3, 3])
      return std({ map: t, bumpMap: t, bumpScale: 1.5, roughness: 1 })
    })(),
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
