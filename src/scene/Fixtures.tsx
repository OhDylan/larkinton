/**
 * Permanent fixtures that come with the unit (NOT furniture).
 * Kitchen: wall-hung sink slab + tiled backsplash (photo IMG_5218) — no cabinets exist.
 * Bath: shower glass screen, toilet (photo IMG_5223), basin (placeholder, not seen in photos).
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { dimensions as D } from '../data/dimensions'
import { materials, tileSizes } from '../materials/materials'
import { worldUV } from './geometry'

const { x: X, z: Z } = D

function KitchenSink() {
  const m = materials()
  const s = D.kitchen.sink
  const w = s.x1 - s.x0
  const cx = (s.x0 + s.x1) / 2
  const cz = Z.southInner - s.depth / 2
  const top = s.height
  return (
    <group>
      {/* solid-surface slab on brackets */}
      <mesh position={[cx, top - s.slab / 2, cz]} material={m.sanitary} castShadow receiveShadow>
        <boxGeometry args={[w, s.slab, s.depth]} />
      </mesh>
      {/* stainless bowl at the end nearest the yard window (photo) */}
      <mesh position={[s.x1 - 0.3, top + 0.002, cz]} material={m.stainless}>
        <boxGeometry args={[0.45, 0.004, 0.38]} />
      </mesh>
      {/* tap */}
      <mesh position={[s.x1 - 0.3, top + 0.15, Z.southInner - 0.06]} material={m.stainless}>
        <cylinderGeometry args={[0.012, 0.012, 0.3]} />
      </mesh>
      {/* brackets */}
      {[s.x0 + 0.1, s.x1 - 0.1].map((x) => (
        <mesh key={x} position={[x, top - 0.2, Z.southInner - 0.2]} material={m.stainless}>
          <boxGeometry args={[0.03, 0.35, 0.35]} />
        </mesh>
      ))}
    </group>
  )
}

function Backsplash() {
  const m = materials()
  const geoms = useMemo(() => {
    const h = D.kitchen.backsplashHeight
    const [tw, th] = tileSizes.wallTile
    // bottom wall of kitchen, facing the room (-z)
    const w1 = X.kitchenYardW - X.entryBlockE
    const g1 = new THREE.PlaneGeometry(w1, h)
    g1.rotateY(Math.PI)
    g1.translate(X.entryBlockE + w1 / 2, h / 2, Z.southInner - 0.003)
    worldUV(g1, (p) => [p.x / tw, p.y / th])
    // kitchen/yard wall, kitchen side (-x), below the window only
    const d2 = Z.southInner - D.doors.yard.z1
    const h2 = Math.min(h, D.windows.kitchen.sill)
    const g2 = new THREE.PlaneGeometry(d2, h2)
    g2.rotateY(-Math.PI / 2)
    g2.translate(X.kitchenYardW - 0.003, h2 / 2, D.doors.yard.z1 + d2 / 2)
    worldUV(g2, (p) => [p.z / tw, p.y / th])
    return [g1, g2]
  }, [])
  return (
    <group>
      {geoms.map((g, i) => (
        <mesh key={i} geometry={g} material={m.wallTile} receiveShadow />
      ))}
    </group>
  )
}

function Bathroom({ designed }: { designed: boolean }) {
  const m = materials()
  const b = D.bath
  const glassLen = Z.showerSouth - Z.corridorNorth
  const tz = Z.bathSouth // toilet backs onto bath|bedroom-2 wall, facing north
  return (
    <group>
      {/* shower screen along the thin plan line (photo shows glass with a door handle) */}
      <mesh position={[X.showerGlass, b.showerScreenHeight / 2 + 0.05, Z.corridorNorth + glassLen / 2]} material={m.glass}>
        <boxGeometry args={[0.01, b.showerScreenHeight, glassLen]} />
      </mesh>
      {/* toilet (replaced by a real model in design mode) */}
      {!designed && <group position={[b.toilet.x, 0, tz]}>
        <mesh position={[0, 0.2, -0.38]} material={m.sanitary} castShadow>
          <cylinderGeometry args={[0.19, 0.16, 0.4, 24]} />
        </mesh>
        <mesh position={[0, 0.6, -0.1]} material={m.sanitary} castShadow>
          <boxGeometry args={[0.38, 0.4, 0.17]} />
        </mesh>
      </group>}
      {/* basin — ASSUMED placeholder, not visible in any reference photo (replaced by the vanity in design mode) */}
      {!designed && <mesh position={[b.basin.x, 0.82, tz - 0.21]} material={m.sanitary} castShadow>
        <boxGeometry args={[0.5, 0.12, 0.4]} />
      </mesh>}
    </group>
  )
}

/** `designed`: the Phase 2 design replaces the sink slab and the basin placeholder. */
export function Fixtures({ designed }: { designed: boolean }) {
  return (
    <group>
      {!designed && <KitchenSink />}
      <Backsplash />
      <Bathroom designed={designed} />
    </group>
  )
}
