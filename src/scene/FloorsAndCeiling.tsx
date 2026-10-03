import { useEffect, useMemo } from 'react'
import type * as THREE from 'three'
import { microcementTexture, woodFloorTexture } from '../furniture/designMaterials'
import { useFloorFinish as useFloorFinishState } from '../state/floorMode'
import { bulkheads, ceilingHeight, ceilings, floors } from '../data/floorplan'
import { materials, tileSizes } from '../materials/materials'
import { planeXZ, rectCenter, rectSize } from './geometry'

/**
 * The porcelain material is swapped in place (map + finish) rather than replaced, because the
 * floor meshes are merged for speed and share this material object.
 * Bath and yard keep their wet-area tiles either way.
 */
function useFloorFinish() {
  const finish = useFloorFinishState()
  useEffect(() => {
    const m = materials()
    const p = m.porcelain
    if (!porcelainMap) porcelainMap = p.map
    if (!porcelainColor) porcelainColor = p.color.clone()
    p.color.copy(porcelainColor)
    if (finish === 'wood') {
      p.map = woodFloorTexture()
      p.color.set('#b8a898') // a shade deeper and less orange than the raw oak scan
      p.roughness = 0.42 // satin-lacquered oak
    } else if (finish === 'concrete') {
      p.map = microcementTexture()
      p.roughness = 0.6 // sealed microcement, soft sheen
    } else {
      p.map = porcelainMap
      p.roughness = 0.22
    }
    p.needsUpdate = true
  }, [finish])
}
let porcelainMap: THREE.Texture | null = null
let porcelainColor: THREE.Color | null = null

export function Floors() {
  useFloorFinish()
  const m = materials()
  const meshes = useMemo(
    () =>
      floors.map((f) => {
        const [tw, td] = f.kind === 'porcelain' ? tileSizes.porcelain : f.kind === 'wetTile' ? tileSizes.wetTile : [1, 1]
        return { id: f.id, geom: planeXZ(f, f.y ?? 0, tw, td), mat: m[f.kind] }
      }),
    [m],
  )
  return (
    <group>
      {meshes.map((f) => (
        <mesh key={f.id} geometry={f.geom} material={f.mat} receiveShadow />
      ))}
    </group>
  )
}

const SLAB = 0.12

export function Ceiling() {
  const m = materials()
  return (
    <group>
      {ceilings.map((c, i) => {
        const [cx, cz] = rectCenter(c)
        const [w, d] = rectSize(c)
        return (
          <mesh key={i} position={[cx, ceilingHeight + SLAB / 2, cz]} material={m.ceiling} castShadow receiveShadow>
            <boxGeometry args={[w, SLAB, d]} />
          </mesh>
        )
      })}
      {bulkheads.map((b, i) => {
        const [cx, cz] = rectCenter(b)
        const [w, d] = rectSize(b)
        const h = ceilingHeight - b.bottom
        return (
          <mesh key={`bh${i}`} position={[cx, b.bottom + h / 2, cz]} material={m.ceiling} castShadow receiveShadow>
            <boxGeometry args={[w, h, d]} />
          </mesh>
        )
      })}
    </group>
  )
}
