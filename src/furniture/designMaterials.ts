/**
 * Phase 2 finishes (v3): mid-century modern — dark walnut joinery, warm white walls, terrazzo,
 * cognac leather, brass, opal glass, and MCM accent colours (mustard, forest green, rust).
 * All textures are procedural canvases (no downloads). Furniture boxes use
 * metre-scaled UVs, so `repeat` below = how many texture tiles per metre.
 */
import * as THREE from 'three'

export const designPalette = {
  wallWarm: '#ece5d8', // warm white paint
  ceilingWarm: '#f1ece3',
  wood: '#4f3020', // dark walnut
  woodDark: '#33201a',
  woodLight: '#8a5a3a', // lighter walnut accent
  terrazzo: '#ebe5da', // warm white terrazzo base
  basalt: '#2b2926',
  leather: '#7a3f22', // cognac
  linen: '#efe9df',
  cream: '#e3d9c6', // cream boucle
  mustard: '#c4922c',
  green: '#2f4a3c', // forest green velvet
  rust: '#a5482a',
  charcoal: '#2a2826',
  ceramic: '#ece6da',
  wool: '#d9cdb8',
  paper: '#f5ecdb',
  plant: '#4f6645',
  birch: '#d8c3a0',
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

/** Terrazzo: warm white base with scattered stone chips in the room's accent colours. */
const terrazzoDraw: Draw = (g, w, h) => {
  g.fillStyle = designPalette.terrazzo
  g.fillRect(0, 0, w, h)
  const chips = ['#c4922c', '#a5482a', '#2f4a3c', '#7d6b57', '#d8cdb9', '#4f3020', '#b9b2a6']
  for (let i = 0; i < 1400; i++) {
    g.fillStyle = chips[i % chips.length]
    g.globalAlpha = rand(0.55, 0.95)
    g.beginPath()
    const x = rand(0, w)
    const y = rand(0, h)
    const r = rand(1, i % 9 === 0 ? 7 : 3.5)
    g.moveTo(x + r, y)
    for (let a = 1; a < 6; a++) g.lineTo(x + Math.cos(a * 1.2 + i) * r * rand(0.6, 1.2), y + Math.sin(a * 1.2 + i) * r * rand(0.6, 1.2))
    g.closePath()
    g.fill()
  }
  g.globalAlpha = 1
}

/** Mid-century geometric rug: rust field, cream diamonds, mustard border. */
const rugDraw: Draw = (g, w, h) => {
  const P = designPalette
  g.fillStyle = P.mustard
  g.fillRect(0, 0, w, h)
  const m = w * 0.06
  g.fillStyle = P.rust
  g.fillRect(m, m, w - 2 * m, h - 2 * m)
  g.strokeStyle = P.cream
  g.lineWidth = w * 0.012
  const n = 6
  const cw = (w - 2 * m) / n
  const ch = (h - 2 * m) / n
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      const cx = m + cw * (i + 0.5)
      const cy = m + ch * (j + 0.5)
      g.beginPath()
      g.moveTo(cx, cy - ch * 0.38)
      g.lineTo(cx + cw * 0.38, cy)
      g.lineTo(cx, cy + ch * 0.38)
      g.lineTo(cx - cw * 0.38, cy)
      g.closePath()
      g.stroke()
    }
  // wool fibre noise
  for (let i = 0; i < 20000; i++) {
    g.fillStyle = `rgba(${Math.random() > 0.5 ? '255,255,255' : '0,0,0'},${rand(0.02, 0.08)})`
    g.fillRect(rand(0, w), rand(0, h), 1.5, 1.5)
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
  const terrazzoMap = canvasTex(1024, 1024, terrazzoDraw, [1.4, 1.4])
  const linenMap = canvasTex(256, 256, weaveDraw(P.linen, 0.06), [8, 8])
  const woolMap = canvasTex(256, 256, weaveDraw(P.wool, 0.1), [6, 6])
  const leatherMap = canvasTex(256, 256, mottleDraw(P.leather, 0.025, [2, 8]), [4, 4])
  return {
    limewash,
    ceiling: P.ceilingWarm,
    wood: wood(P.wood, P.woodDark),
    woodDark: wood(P.woodDark, '#1e120b', 0.6),
    woodLight: wood(P.woodLight, P.wood, 0.6),
    terrazzo: std({ map: terrazzoMap, roughness: 0.3 }),
    basalt: std({ map: canvasTex(256, 256, mottleDraw(P.basalt, 0.08, [4, 20]), [2, 2]), roughness: 0.85 }),
    leather: std({ map: leatherMap, bumpMap: leatherMap, bumpScale: 0.15, roughness: 0.42 }),
    linen: std({ map: linenMap, bumpMap: linenMap, bumpScale: 0.3, roughness: 1 }),
    // boucle: chunky loops → strong bump
    cream: (() => {
      const t = canvasTex(256, 256, mottleDraw(P.cream, 0.12, [1.5, 3.5]), [10, 10])
      return std({ map: t, bumpMap: t, bumpScale: 1.2, roughness: 1 })
    })(),
    // velvets: soft sheen
    mustard: new THREE.MeshPhysicalMaterial({ map: canvasTex(256, 256, weaveDraw(P.mustard, 0.05), [8, 8]), roughness: 0.75, sheen: 1, sheenColor: new THREE.Color('#f2cf7a'), sheenRoughness: 0.4 }),
    green: new THREE.MeshPhysicalMaterial({ map: canvasTex(256, 256, weaveDraw(P.green, 0.05), [8, 8]), roughness: 0.75, sheen: 1, sheenColor: new THREE.Color('#6f9a82'), sheenRoughness: 0.4 }),
    rug: std({ map: canvasTex(1024, 1024, rugDraw, [1, 1]), roughness: 1 }),
    opal: std({ color: '#fbf7ef', emissive: '#ffd9a6', emissiveIntensity: 0.25, roughness: 0.25 }),
    glossBlack: std({ color: '#151413', roughness: 0.15, metalness: 0.2 }),
    wool: std({ map: woolMap, bumpMap: woolMap, bumpScale: 0.8, roughness: 1 }),
    rust: std({ map: canvasTex(256, 256, mottleDraw(P.rust, 0.06, [3, 18], 20), [3, 3]), roughness: 0.55 }),
    ceramic: std({ map: canvasTex(256, 256, mottleDraw(P.ceramic, 0.07, [3, 18], 40), [4, 4]), roughness: 0.4 }),
    ceramicDark: std({ map: canvasTex(256, 256, mottleDraw('#3b3631', 0.1, [3, 18], 40), [4, 4]), roughness: 0.5 }),
    charcoal: std({ color: P.charcoal, roughness: 0.6 }),
    blackMetal: std({ color: '#1f1e1c', roughness: 0.4, metalness: 0.6 }),
    brass: std({ color: '#c39a52', roughness: 0.28, metalness: 1 }),
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
    book: ['#a5482a', '#2f4a3c', '#c4922c', '#2a2826', '#e6dccb', '#6b4a36', '#3d5a6b'].map((c) => std({ color: c, roughness: 0.9 })),
  }
}

let cache: ReturnType<typeof make> | null = null
export function designMaterials() {
  return (cache ??= make())
}
export type DesignMaterials = ReturnType<typeof make>
