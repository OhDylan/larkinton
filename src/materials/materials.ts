/**
 * Shared materials. Phase 1 = neutral finishes matched to the photos
 * (white walls, light grey-white polished porcelain, darker grey wet-area tiles,
 * dark bronze window frames, grey doors).
 * Phase 2 can swap/extend these without touching geometry.
 */
import * as THREE from 'three'

export const palette = {
  wall: '#f3f1ec',
  ceiling: '#fbfbf9',
  porcelain: '#e8e6e1',
  porcelainGrout: '#cbc7bf',
  wetTile: '#a9a8a4',
  wetTileGrout: '#8d8c88',
  wallTile: '#f1efea',
  wallTileGrout: '#d4d0c8',
  common: '#bdbab3',
  concrete: '#a8a59f',
  frame: '#3a3935',
  doorMain: '#8e8f8c',
  doorInterior: '#c9c9c5',
  stainless: '#c3c6c8',
  sanitary: '#fafafa',
}

/** Draws one tile (with grout on two edges) into a canvas texture; UVs are in tile units. */
function tileTexture(color: string, grout: string, aspect = 1, noise = 6): THREE.CanvasTexture {
  const w = 256
  const h = Math.round(256 / aspect)
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')!
  g.fillStyle = color
  g.fillRect(0, 0, w, h)
  // subtle variation so large surfaces don't look flat
  const img = g.getImageData(0, 0, w, h)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * noise
    img.data[i] += n
    img.data[i + 1] += n
    img.data[i + 2] += n
  }
  g.putImageData(img, 0, 0)
  g.fillStyle = grout
  g.fillRect(0, 0, w, 2)
  g.fillRect(0, 0, 2, h)
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

/** Tile module sizes in metres (width, height) used for UV scaling. */
export const tileSizes = {
  porcelain: [0.6, 0.6], // [PHOTO] large square floor tiles
  wetTile: [0.3, 0.3], // [PHOTO] smaller darker tiles in bath (assumed same in yard)
  wallTile: [0.6, 0.3], // [PHOTO] kitchen backsplash, landscape rectangles
} as const

function make() {
  return {
    wall: new THREE.MeshStandardMaterial({ color: palette.wall, roughness: 0.92 }),
    ceiling: new THREE.MeshStandardMaterial({ color: palette.ceiling, roughness: 0.95 }),
    porcelain: new THREE.MeshStandardMaterial({
      map: tileTexture(palette.porcelain, palette.porcelainGrout),
      roughness: 0.22,
      metalness: 0.02,
    }),
    wetTile: new THREE.MeshStandardMaterial({ map: tileTexture(palette.wetTile, palette.wetTileGrout, 1, 10), roughness: 0.5 }),
    wallTile: new THREE.MeshStandardMaterial({ map: tileTexture(palette.wallTile, palette.wallTileGrout, 2, 4), roughness: 0.3 }),
    common: new THREE.MeshStandardMaterial({ color: palette.common, roughness: 0.8 }),
    concrete: new THREE.MeshStandardMaterial({ color: palette.concrete, roughness: 0.95 }),
    screen: new THREE.MeshStandardMaterial({ color: palette.frame, roughness: 0.6, transparent: true, opacity: 0.55 }),
    frame: new THREE.MeshStandardMaterial({ color: palette.frame, roughness: 0.5, metalness: 0.3 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: '#dfeef2',
      roughness: 0.05,
      transmission: 0,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    }),
    doorMain: new THREE.MeshStandardMaterial({ color: palette.doorMain, roughness: 0.6 }),
    doorInterior: new THREE.MeshStandardMaterial({ color: palette.doorInterior, roughness: 0.6 }),
    stainless: new THREE.MeshStandardMaterial({ color: palette.stainless, roughness: 0.35, metalness: 0.25 }),
    sanitary: new THREE.MeshStandardMaterial({ color: palette.sanitary, roughness: 0.15 }),
    ground: new THREE.MeshStandardMaterial({ color: '#b9bec2', roughness: 1 }),
  }
}

let cache: ReturnType<typeof make> | null = null
/** Lazily created singleton (needs `document` for canvas textures). */
export function materials() {
  return (cache ??= make())
}
export type Materials = ReturnType<typeof make>
