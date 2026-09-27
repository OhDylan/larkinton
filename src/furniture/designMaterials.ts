/**
 * Phase 2 finishes: natural oak, linen/boucle, warm stone, clay ceramics,
 * paper lanterns — Nordic + wabi-sabi. Procedural canvas textures, no downloads.
 */
import * as THREE from 'three'

export const designPalette = {
  wallWarm: '#efe9df', // warm limewash-like off-white (walls in design mode)
  oak: '#c9ae8b',
  oakPale: '#dfcfb4',
  warmWhite: '#ece6dc',
  stone: '#e6e0d5',
  linen: '#e4ddd0',
  oatmeal: '#d6cab6',
  sage: '#a5ad97',
  clay: '#b7795c',
  charcoal: '#3a3936',
  ceramic: '#ebe5d9',
  jute: '#cbbb9f',
  paper: '#f7f0e2',
  plant: '#5d7350',
  pot: '#c7b39c',
  birch: '#dcc9a8',
}

function canvas(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, repeat: [number, number] = [1, 1]) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d')!)
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(repeat[0], repeat[1])
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

/** Straight-grain oak: base colour with fine darker streaks. */
function woodTexture(base: string) {
  return canvas(512, 512, (g) => {
    g.fillStyle = base
    g.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 260; i++) {
      const x = Math.random() * 512
      g.strokeStyle = `rgba(80,60,40,${0.02 + Math.random() * 0.06})`
      g.lineWidth = 0.5 + Math.random() * 2
      g.beginPath()
      g.moveTo(x, 0)
      // gentle wander so the grain isn't ruler-straight
      for (let y = 0; y <= 512; y += 64) g.lineTo(x + Math.sin(y / 90 + i) * 3, y)
      g.stroke()
    }
  })
}

/** Soft mottling (limewash / stone / textiles). */
function mottled(base: string, amount: number, speck = 0) {
  return canvas(256, 256, (g) => {
    g.fillStyle = base
    g.fillRect(0, 0, 256, 256)
    for (let i = 0; i < 400; i++) {
      const l = Math.random() > 0.5 ? 255 : 0
      g.fillStyle = `rgba(${l},${l},${l},${Math.random() * amount * 0.3})`
      g.beginPath()
      g.arc(Math.random() * 256, Math.random() * 256, 3 + Math.random() * 12, 0, Math.PI * 2)
      g.fill()
    }
    for (let i = 0; i < speck; i++) {
      g.fillStyle = `rgba(80,70,60,${0.2 + Math.random() * 0.4})`
      g.fillRect(Math.random() * 256, Math.random() * 256, 1.5, 1.5)
    }
  })
}

/** Pegboard: birch with a 50 mm hole grid (one hole per texture tile). */
function pegTexture(repeat: [number, number]) {
  return canvas(
    32,
    32,
    (g) => {
      g.fillStyle = designPalette.birch
      g.fillRect(0, 0, 32, 32)
      g.fillStyle = '#6b5a45'
      g.beginPath()
      g.arc(16, 16, 3.2, 0, Math.PI * 2)
      g.fill()
    },
    repeat,
  )
}

const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(p)

function make() {
  const P = designPalette
  return {
    oak: std({ map: woodTexture(P.oak), roughness: 0.7 }),
    oakPale: std({ map: woodTexture(P.oakPale), roughness: 0.75 }),
    warmWhite: std({ color: P.warmWhite, roughness: 0.8 }),
    stone: std({ map: mottled(P.stone, 0.05, 350), roughness: 0.4 }),
    linen: std({ color: P.linen, roughness: 1 }),
    oatmeal: std({ color: P.oatmeal, roughness: 1 }),
    sage: std({ color: P.sage, roughness: 1 }),
    sageMetal: std({ color: P.sage, roughness: 0.5, metalness: 0.2 }),
    clay: std({ map: mottled(P.clay, 0.1), roughness: 0.9 }),
    charcoal: std({ color: P.charcoal, roughness: 0.6 }),
    blackMetal: std({ color: '#2a2927', roughness: 0.45, metalness: 0.5 }),
    ceramic: std({ map: mottled(P.ceramic, 0.08, 200), roughness: 0.45 }),
    jute: std({ map: mottled(P.jute, 0.1, 600), roughness: 1 }),
    plant: std({ color: P.plant, roughness: 0.85, side: THREE.DoubleSide }),
    pot: std({ map: mottled(P.pot, 0.1, 300), roughness: 0.9 }),
    paper: std({ color: P.paper, emissive: '#ffd9a6', emissiveIntensity: 0.35, roughness: 1 }),
    mirror: std({ color: '#dfe7ea', roughness: 0.04, metalness: 0.35 }),
    hobGlass: std({ color: '#141414', roughness: 0.15, metalness: 0.3 }),
    pegboard: std({ map: pegTexture([36, 22]), roughness: 0.8 }),
    robotWhite: std({ color: '#f2f1ee', roughness: 0.35 }),
    robotAccent: std({ color: '#d98c4a', roughness: 0.5 }),
    screen: std({ color: '#1d1f22', roughness: 0.2, emissive: '#223', emissiveIntensity: 0.3 }),
    artA: std({ color: '#c9a78b', roughness: 1 }),
    artB: std({ color: '#7d6a58', roughness: 1 }),
    book: [P.clay, P.sage, '#d8cdb6', '#8a7a66', '#efe8dc', '#5e5a52'].map((c) => std({ color: c, roughness: 0.9 })),
  }
}

let cache: ReturnType<typeof make> | null = null
export function designMaterials() {
  return (cache ??= make())
}
export type DesignMaterials = ReturnType<typeof make>
