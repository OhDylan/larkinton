/** Master bedroom, bathroom, and the Bedroom 2 studio / workshop. */
import { dimensions as D } from '../data/dimensions'
import { materials } from '../materials/materials'
import { designMaterials } from './designMaterials'
import { layout } from './layout'
import { useMemo } from 'react'
import * as THREE from 'three'
import { AirCon, B, Downlight, Lamp, Mirror, PaperGlobe, RomanBlind, Soft, Vase } from './primitives'
import { PhModel } from './zen'

const { x: X, z: Z } = D

// ------------------------------------------------------------------ master bedroom
export function Master() {
  const d = designMaterials()
  const { wardrobe: w, bed: b, nightstands, headboardWall: hw, rug: r, ac } = layout.master
  const doorZs = [w.z0 + (w.z1 - w.z0) / 3, w.z0 + ((w.z1 - w.z0) * 2) / 3]
  const win = D.windows.master
  const wallX = X.eastInner - hw.t // face of the wood panelling
  const bz = (b.z0 + b.z1) / 2
  return (
    <group>
      <Soft x0={r.x0} x1={r.x1} y0={0} y1={0.014} z0={r.z0} z1={r.z1} m={d.wool} r={0.006} />

      {/* wardrobe along the left wall, full height; its end panel faces the door */}
      <B x0={w.x0} x1={w.x1} y0={0} y1={0.08} z0={w.z0} z1={w.z1 - 0.04} m={d.charcoal} />
      <B x0={w.x0} x1={w.x1} y0={0.08} y1={w.h} z0={w.z0} z1={w.z1} m={d.wood} />
      {doorZs.map((z) => (
        <B key={z} x0={w.x1} x1={w.x1 + 0.002} y0={0.1} y1={w.h - 0.02} z0={z - 0.0015} z1={z + 0.0015} m={d.charcoal} shadow={false} />
      ))}
      <B x0={w.x1} x1={w.x1 + 0.002} y0={2.2} y1={2.203} z0={w.z0} z1={w.z1} m={d.charcoal} shadow={false} />
      {[w.z0 + 0.06, ...doorZs.map((z) => z + 0.06)].map((z) => (
        <B key={z} x0={w.x1} x1={w.x1 + 0.02} y0={0.8} y1={1.5} z0={z} z1={z + 0.012} m={d.bronze} />
      ))}

      {/* wood-panelled headboard wall with vertical reveals and a slim display ledge */}
      <B x0={wallX} x1={X.eastInner} y0={0} y1={hw.y1} z0={hw.z0} z1={hw.z1} m={d.wood} />
      {Array.from({ length: 8 }, (_, i) => hw.z0 + ((hw.z1 - hw.z0) * (i + 1)) / 9).map((z) => (
        <B key={z} x0={wallX - 0.001} x1={wallX + 0.004} y0={0.02} y1={hw.y1 - 0.02} z0={z - 0.002} z1={z + 0.002} m={d.woodDark} shadow={false} />
      ))}
      <B x0={X.eastInner - 0.13} x1={X.eastInner} y0={hw.y1} y1={hw.y1 + 0.03} z0={hw.z0} z1={hw.z1} m={d.wood} />
      {/* on the ledge: black and white stoneware */}
      <PhModel id="ceramic_vase_03" position={[X.eastInner - 0.07, hw.y1 + 0.03, bz + 0.45]} scale={0.7} finish="black" />
      <PhModel id="ceramic_vase_02" position={[X.eastInner - 0.07, hw.y1 + 0.03, bz + 0.65]} scale={0.45} />

      {/* low dark upholstered bed (Sketchfab "Dark Modern Bed", CC BY 4.0), headboard against the panelled wall.
          Model is ~2.14 m wide x 1.99 m long (mm units): fitted to a 1.75 m wide x 2.02 m long queen frame. */}
      <PhModel id="dark_bed" position={[wallX - 1.01, 0, bz]} rotation={[0, -Math.PI / 2, 0]} scale={[1.75 / 2136.6, 0.00093, 2.02 / 1993.1]} />

      {/* floating nightstands with a hanging paper lantern each side */}
      {nightstands.map((n, i) => {
        const nz = (n.z0 + n.z1) / 2
        const nx = (n.x0 + n.x1) / 2
        return (
          <group key={i}>
            <B x0={n.x0} x1={n.x1} y0={n.h - 0.2} y1={n.h} z0={n.z0} z1={n.z1} m={d.wood} />
            <B x0={n.x0 - 0.002} x1={n.x0} y0={n.h - 0.1} y1={n.h - 0.097} z0={n.z0 + 0.02} z1={n.z1 - 0.02} m={d.charcoal} shadow={false} />
            <B x0={n.x0 - 0.014} x1={n.x0} y0={n.h - 0.06} y1={n.h - 0.05} z0={nz - 0.04} z1={nz + 0.04} m={d.bronze} />
            <PhModel id="ceramic_vase_01" position={[nx, n.h, nz + (i ? 0.12 : -0.12)]} scale={0.4} />
            <PaperGlobe x={nx - 0.02} z={nz} bottom={0.95} r={0.13} light={0.7} minor={i === 1} />
          </group>
        )
      })}

      {/* linen roman blind, air-con at the existing point (near the east corner), downlights */}
      <RomanBlind a0={win.x0} a1={win.x1} at={Z.northInner + 0.03} top={win.head} drop={0.42} alongX />
      <AirCon x={ac.x} z={Z.bed1South} y={ac.y} face="z-" />
      <Downlight x={3.46} z={2.5} />
      <Downlight x={4.3} z={0.6} />
    </group>
  )
}

// ------------------------------------------------------------------ bathroom
export function Bath() {
  const d = designMaterials()
  const m = materials()
  const { vanity: v, mirror: mr } = layout.bath
  const wallZ = Z.bathSouth
  const vx = (v.x0 + v.x1) / 2
  const vz = (v.z0 + v.z1) / 2
  const top = v.y0 + v.h
  const glassX = X.showerGlass
  const mirrorGeo = useMemo(() => new THREE.PlaneGeometry(mr.x1 - mr.x0, mr.y1 - mr.y0), [mr])
  return (
    <group>
      {/* floating wood vanity, terrazzo top, stoneware vessel basin, wall spout */}
      <B x0={v.x0} x1={v.x1} y0={v.y0} y1={top - 0.03} z0={v.z0} z1={v.z1} m={d.wood} />
      <B x0={v.x0 - 0.01} x1={v.x1 + 0.01} y0={top - 0.03} y1={top} z0={v.z0 - 0.015} z1={v.z1} m={d.stone} />
      <Vase x={vx} z={vz - 0.02} y={top} h={0.13} r={0.19} m={d.ceramic} neck={1} />
      <mesh position={[vx, top + 0.26, wallZ - 0.07]} rotation-x={Math.PI / 2} material={d.blackMetal}>
        <cylinderGeometry args={[0.01, 0.01, 0.14, 12]} />
      </mesh>
      {/* matt black pump bottle and a folded towel either side of the basin */}
      <PhModel id="soap_black" position={[v.x0 + 0.05, top, v.z1 - 0.08]} scale={0.011} />
      <PhModel id="towel_folded" position={[v.x1 - 0.1, top, vz]} rotation={[0, Math.PI / 2, 0]} scale={[0.0006, 0.0006, 0.0006]} />
      {/* toilet (Sketchfab, CC BY 4.0) backing onto the bedroom-2 wall, facing north; wooden brush holder beside it */}
      <PhModel id="toilet" position={[D.bath.toilet.x, 0, wallZ - 0.31]} rotation={[0, Math.PI, 0]} />
      <PhModel id="bath_accessories" pick={['Object_8', 'Object_10', 'Object_12']} position={[D.bath.toilet.x + 0.32, 0, wallZ - 0.1]} scale={0.032} />
      {/* hinoki bath stool and bucket in the shower */}
      <PhModel id="bath_stool" position={[6.25, 0, 3.55]} rotation={[0, 0.4, 0]} scale={1.7} />

      {/* one long horizontal mirror, floating 3 cm off the wall with a warm back-glow */}
      <B x0={mr.x0 + 0.03} x1={mr.x1 - 0.03} y0={mr.y0 + 0.03} y1={mr.y1 - 0.03} z0={wallZ - 0.03} z1={wallZ - 0.001} m={d.charcoal} />
      <B x0={mr.x0 + 0.02} x1={mr.x1 - 0.02} y0={mr.y0 + 0.02} y1={mr.y1 - 0.02} z0={wallZ - 0.018} z1={wallZ - 0.012} m={d.lightStrip} shadow={false} />
      <Mirror geometry={mirrorGeo} position={[(mr.x0 + mr.x1) / 2, (mr.y0 + mr.y1) / 2, wallZ - 0.031]} rotationY={Math.PI} />
      <Lamp x={(mr.x0 + mr.x1) / 2} y={mr.y0 + 0.2} z={wallZ - 0.3} evening={0.5} distance={1.8} minor />

      {/* existing shower screen: hinged glass door → pull handle on both sides */}
      {[-1, 1].map((s) => (
        <B key={s} x0={glassX + s * 0.035 - 0.006} x1={glassX + s * 0.035 + 0.006} y0={0.85} y1={1.3} z0={Z.corridorNorth + 0.2} z1={Z.corridorNorth + 0.212} m={m.stainless} />
      ))}
      {/* black towel rail with a linen towel on the wall beside the door */}
      <PhModel id="towel_rail" recenter={false} position={[X.bathWestE + 0.287 * 0.27, 1.4, 4.2]} scale={0.27} />
      <Downlight x={5.0} z={3.75} />
    </group>
  )
}

// ------------------------------------------------------------------ studio / workshop
function Pegboard() {
  const d = designMaterials()
  const k = layout.studio.desk
  const p = layout.studio.pegboard
  const z = Z.bed2South - 0.025
  const shelves = [1.38, 1.74]
  return (
    <group>
      {/* birch pegboard in a deep-wood frame */}
      <B x0={k.x0} x1={k.x1} y0={p.y0} y1={p.y1} z0={z - 0.005} z1={Z.bed2South} m={d.wood} />
      <B x0={k.x0 + 0.03} x1={k.x1 - 0.03} y0={p.y0 + 0.03} y1={p.y1 - 0.03} z0={z - 0.007} z1={z - 0.004} m={d.pegboard} shadow={false} />
      {shelves.map((y, i) => (
        <group key={y}>
          <B x0={k.x0 + 0.15 + i * 0.5} x1={k.x0 + 0.95 + i * 0.5} y0={y} y1={y + 0.02} z0={z - 0.17} z1={z - 0.007} m={d.wood} />
          {[0, 1, 2].map((j) => (
            <B key={j} x0={k.x0 + 0.2 + i * 0.5 + j * 0.25} x1={k.x0 + 0.4 + i * 0.5 + j * 0.25} y0={y + 0.02} y1={y + 0.12} z0={z - 0.15} z1={z - 0.03}
              m={[d.taupe, d.ceramic, d.earth][(i + j) % 3]} />
          ))}
        </group>
      ))}
      {/* hand tools on pegs, a coiled cable, a small clock-like gauge */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <B key={i} x0={k.x1 - 0.72 + i * 0.09} x1={k.x1 - 0.7 + i * 0.09} y0={1.04 + (i % 2) * 0.04} y1={1.28} z0={z - 0.025} z1={z - 0.007} m={i % 3 === 0 ? d.robotAccent : d.blackMetal} />
      ))}
      <mesh position={[k.x0 + 0.3, 1.16, z - 0.02]} material={d.charcoal}>
        <torusGeometry args={[0.08, 0.008, 8, 32]} />
      </mesh>
      <Lamp x={(k.x0 + k.x1) / 2} y={1.9} z={z - 0.3} evening={0.35} distance={1.8} minor />
    </group>
  )
}

const FUTON_FABRIC = { TELA: '#4a4846' }

export function Studio() {
  const d = designMaterials()
  const sb = layout.studio.sofaBed
  const k = layout.studio.desk
  const top = k.h
  const [chx, chz] = layout.studio.chair
  const win = D.windows.bed2
  return (
    <group>
      {/* workbench: thick wood top on a black steel frame */}
      <B x0={k.x0} x1={k.x1} y0={top - 0.045} y1={top} z0={k.z0} z1={k.z1} m={d.wood} />
      {[k.x0 + 0.04, k.x1 - 0.08].flatMap((x) =>
        [k.z0 + 0.04, k.z1 - 0.08].map((z) => <B key={`${x}${z}`} x0={x} x1={x + 0.04} y0={0} y1={top - 0.045} z0={z} z1={z + 0.04} m={d.blackMetal} />),
      )}
      <B x0={k.x0 + 0.04} x1={k.x1 - 0.04} y0={0.12} y1={0.15} z0={k.z1 - 0.08} z1={k.z1 - 0.04} m={d.blackMetal} />
      <Pegboard />
      {/* two desktop 6-axis arms (Sketchfab, CC BY 4.0; 1.29 m industrial model scaled to ~0.45 m), reaching over the bench */}
      <PhModel id="robot_arm" recenter="base" position={[k.x1 - 0.35, top, k.z1 - 0.2]} rotation={[0, Math.PI - 0.5, 0]} scale={0.35} />
      <PhModel id="robot_arm" recenter="base" position={[k.x0 + 0.3, top, k.z1 - 0.18]} rotation={[0, Math.PI + 0.4, 0]} scale={0.35} />
      {/* laptop, keyboard towards the chair */}
      <PhModel id="laptop" position={[chx, top, k.z0 + 0.2]} rotation={[0, Math.PI, 0]} scale={0.0102} />
      {/* black architect lamp, head reaching towards the front of the bench */}
      <PhModel id="desk_lamp" recenter="base" position={[chx + 0.55, top, k.z1 - 0.15]} rotation={[0, Math.PI / 2, 0]} scale={0.193} />
      <Lamp x={chx + 0.55} y={top + 0.4} z={k.z1 - 0.35} evening={0.6} distance={2} />
      {/* black mesh ergonomic chair with headrest (~1.2 m), facing the bench */}
      <PhModel id="office_chair" position={[chx, 0, chz]} rotation={[0, -Math.PI / 2 + 0.25, 0]} scale={1.2 / 8.52} />
      {/* black 3-tier utility trolley */}
      <PhModel id="raskog_cart" position={[(layout.studio.cart.x0 + layout.studio.cart.x1) / 2, 0, (layout.studio.cart.z0 + layout.studio.cart.z1) / 2]} />
      {/* click-clack futon sofa bed on oak legs (Sketchfab "FUTON LONDON", CC BY 4.0), blue fabric re-dyed charcoal;
          2.22 m model scaled to the 1.9 m slot, back against the bath wall, facing the bench */}
      <PhModel id="futon_sofa_bed" position={[(sb.x0 + sb.x1) / 2, 0, sb.z0 + 0.47]} rotation={[0, -Math.PI / 2, 0]} scale={(sb.x1 - sb.x0) / 2.22}
        recolor={FUTON_FABRIC} />
      <PhModel id="potted_plant_02" position={[layout.studio.plant[0] - 0.05, 0, layout.studio.plant[1] - 0.05]} scale={1.1} />
      <RomanBlind a0={win.z0} a1={win.z1} at={X.eastInner - 0.03} top={win.head} drop={0.38} alongX={false} />
      <AirCon x={X.eastInner} z={(win.z0 + win.z1) / 2} y={2.4} face="x-" />
      <Downlight x={4.2} z={5.85} />
      <Downlight x={5.6} z={5.85} />
    </group>
  )
}
