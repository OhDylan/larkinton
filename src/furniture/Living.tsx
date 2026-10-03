/** Living room (warm minimal): window seat, 2-seater on the right-hand wall, left wall kept clear for projection / TV. */
import { dimensions as D } from '../data/dimensions'
import { designMaterials } from './designMaterials'
import { layout } from './layout'
import { AirCon, B, Books, CeilingFan, Curtain, Cyl, Downlight, Lamp, PaperGlobe, Plant, Soft, TaperedLeg, Vase } from './primitives'

function WindowSeat() {
  const d = designMaterials()
  const s = layout.living.windowSeat
  const drawers = [1, 2].map((i) => s.x0 + ((s.x1 - s.x0) * i) / 3)
  const top = s.h
  return (
    <group>
      <B x0={s.x0} x1={s.x1} y0={0} y1={0.07} z0={s.z0} z1={s.z1 - 0.05} m={d.charcoal} />
      <B x0={s.x0} x1={s.x1} y0={0.07} y1={top} z0={s.z0} z1={s.z1} m={d.wood} />
      {drawers.map((x) => (
        <B key={x} x0={x - 0.0015} x1={x + 0.0015} y0={0.07} y1={top} z0={s.z1} z1={s.z1 + 0.002} m={d.charcoal} shadow={false} />
      ))}
      <B x0={s.x0} x1={s.x1} y0={top - 0.045} y1={top - 0.03} z0={s.z1} z1={s.z1 + 0.002} m={d.woodDark} shadow={false} />
      {/* thick linen seat pad */}
      <Soft x0={s.x0 + 0.02} x1={s.x1 - 0.02} y0={top} y1={top + 0.09} z0={s.z0 + 0.03} z1={s.z1 + 0.01} m={d.cream} r={0.035} />
      {/* back cushions leaning on the glass + a bolster */}
      <Soft x0={0.3} x1={0.85} y0={top + 0.07} y1={top + 0.5} z0={s.z0 + 0.04} z1={s.z0 + 0.2} m={d.taupe} r={0.06} rot={[-0.18, 0, 0]} />
      <Soft x0={0.9} x1={1.4} y0={top + 0.07} y1={top + 0.46} z0={s.z0 + 0.05} z1={s.z0 + 0.2} m={d.sand} r={0.06} rot={[-0.2, 0, 0]} />
      <mesh position={[2.6, top + 0.17, s.z0 + 0.22]} rotation-z={Math.PI / 2} material={d.earth} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.55, 24]} />
      </mesh>
      {/* tea tray, cup, books */}
      <B x0={1.75} x1={2.15} y0={top + 0.09} y1={top + 0.11} z0={s.z1 - 0.34} z1={s.z1 - 0.08} m={d.woodDark} />
      <Cyl x={1.88} z={s.z1 - 0.2} y0={top + 0.11} y1={top + 0.17} r={0.035} rTop={0.04} m={d.ceramic} />
      <Vase x={2.04} z={s.z1 - 0.22} y={top + 0.11} h={0.12} r={0.05} m={d.ceramicDark} neck={0.5} />
      <Books x={1.55} z={s.z1 - 0.22} y={top + 0.09} n={2} w={0.24} dpt={0.17} />
      {/* sheer linen curtains stacked at both ends, on a slim ceiling track */}
      <B x0={s.x0 + 0.02} x1={s.x1 - 0.02} y0={D.ceilingHeight - 0.03} y1={D.ceilingHeight} z0={s.z0 + 0.06} z1={s.z0 + 0.1} m={d.charcoal} />
      <Curtain a0={s.x0 + 0.04} a1={0.55} at={s.z0 + 0.09} y0={top + 0.1} y1={D.ceilingHeight - 0.03} alongX folds={5} />
      <Curtain a0={2.62} a1={s.x1 - 0.04} at={s.z0 + 0.09} y0={top + 0.1} y1={D.ceilingHeight - 0.03} alongX folds={5} />
    </group>
  )
}

/** Low cream boucle sofa on a recessed walnut plinth: soft, deep, rounded (Japandi). */
function Sofa() {
  const d = designMaterials()
  const s = layout.living.sofa // back against the wall at x1, faces -x
  const arm = 0.14
  const back = 0.2
  const plinth = 0.14
  const seatTop = 0.42
  const zMid = (s.z0 + s.z1) / 2
  return (
    <group>
      {/* walnut plinth, set back so the sofa seems to float */}
      <B x0={s.x0 + 0.05} x1={s.x1 - 0.02} y0={0} y1={plinth} z0={s.z0 + 0.04} z1={s.z1 - 0.04} m={d.wood} />
      <Soft x0={s.x0} x1={s.x1} y0={plinth} y1={0.3} z0={s.z0} z1={s.z1} m={d.cream} r={0.05} />
      <Soft x0={s.x0} x1={s.x1} y0={plinth} y1={0.56} z0={s.z0} z1={s.z0 + arm} m={d.cream} r={0.07} />
      <Soft x0={s.x0} x1={s.x1} y0={plinth} y1={0.56} z0={s.z1 - arm} z1={s.z1} m={d.cream} r={0.07} />
      <Soft x0={s.x1 - back} x1={s.x1} y0={0.26} y1={s.h} z0={s.z0 + arm - 0.01} z1={s.z1 - arm + 0.01} m={d.cream} r={0.08} />
      {[
        [s.z0 + arm, zMid],
        [zMid, s.z1 - arm],
      ].map(([a, b]) => (
        <Soft key={a} x0={s.x0 + 0.02} x1={s.x1 - back} y0={0.28} y1={seatTop} z0={a + 0.005} z1={b - 0.005} m={d.cream} r={0.06} />
      ))}
      {/* cushions in sand and taupe linen, a linen bolster */}
      <Soft x0={s.x1 - back - 0.16} x1={s.x1 - back - 0.03} y0={seatTop - 0.02} y1={seatTop + 0.36} z0={s.z0 + arm + 0.04} z1={s.z0 + arm + 0.46} m={d.sand} r={0.06} rot={[0, 0, 0.22]} />
      <Soft x0={s.x1 - back - 0.16} x1={s.x1 - back - 0.03} y0={seatTop - 0.02} y1={seatTop + 0.32} z0={s.z1 - arm - 0.44} z1={s.z1 - arm - 0.06} m={d.taupe} r={0.06} rot={[0, 0.15, 0.22]} />
      <mesh position={[s.x1 - back - 0.1, seatTop + 0.08, zMid + 0.05]} rotation-x={Math.PI / 2} material={d.linen} castShadow>
        <capsuleGeometry args={[0.08, 0.32, 8, 20]} />
      </mesh>
    </group>
  )
}

/** Walnut tripod side table with a mushroom table lamp (opal shade, brass stem). */
function SideTable() {
  const d = designMaterials()
  const [x, z] = layout.living.sideTable
  const top = 0.5
  return (
    <group>
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + 0.3
        return <TaperedLeg key={i} x={x + Math.cos(a) * 0.1} z={z + Math.sin(a) * 0.1} top={top - 0.02} splay={[Math.cos(a) * 0.06, Math.sin(a) * 0.06]} r={0.018} />
      })}
      <Cyl x={x} z={z} y0={top - 0.025} y1={top} r={0.2} m={d.wood} seg={48} />
      {/* mushroom lamp */}
      <Cyl x={x - 0.05} z={z - 0.02} y0={top} y1={top + 0.015} r={0.06} m={d.bronze} />
      <Cyl x={x - 0.05} z={z - 0.02} y0={top + 0.015} y1={top + 0.22} r={0.008} m={d.bronze} seg={10} />
      <mesh position={[x - 0.05, top + 0.22, z - 0.02]} scale={[1, 0.6, 1]} material={d.opal}>
        <sphereGeometry args={[0.13, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <Lamp x={x - 0.05} y={top + 0.2} z={z - 0.02} evening={0.9} distance={3} />
      <Vase x={x + 0.11} z={z + 0.06} y={top} h={0.12} r={0.045} m={d.taupe} neck={0.4} />
    </group>
  )
}

/** Chunky solid-wood coffee table: thick slab on a recessed block base (as in the references). */
function CoffeeTable() {
  const d = designMaterials()
  const t = layout.living.coffeeTable
  const hx = 0.4
  const hz = 0.36
  const top = 0.07
  return (
    <group>
      <B x0={t.cx - hx + 0.12} x1={t.cx + hx - 0.12} y0={0} y1={t.h - top} z0={t.cz - hz + 0.12} z1={t.cz + hz - 0.12} m={d.woodDark} />
      <B x0={t.cx - hx} x1={t.cx + hx} y0={t.h - top} y1={t.h} z0={t.cz - hz} z1={t.cz + hz} m={d.wood} />
      <Books x={t.cx - 0.15} z={t.cz - 0.1} y={t.h} n={2} w={0.26} dpt={0.19} />
      <Cyl x={t.cx + 0.18} z={t.cz + 0.08} y0={t.h} y1={t.h + 0.05} r={0.06} rTop={0.12} m={d.earth} />
      <Vase x={t.cx - 0.2} z={t.cz + 0.17} y={t.h} h={0.2} r={0.07} m={d.ceramicDark} neck={0.4} />
    </group>
  )
}

export function Living() {
  const d = designMaterials()
  const r = layout.living.rug
  const [fx, fz] = layout.living.fan
  return (
    <group>
      {/* jute rug */}
      <mesh position={[(r.x0 + r.x1) / 2, 0.008, (r.z0 + r.z1) / 2]} rotation-x={-Math.PI / 2} material={d.rug} receiveShadow>
        <planeGeometry args={[r.x1 - r.x0, r.z1 - r.z0]} />
      </mesh>
      <WindowSeat />
      <Sofa />
      <CoffeeTable />
      <SideTable />
      <Plant x={layout.living.plant[0]} z={layout.living.plant[1]} h={1.7} />
      <CeilingFan x={fx} z={fz} />
      {/* split air-con at the existing point: on the header above the hallway opening (IMG_5220) */}
      <AirCon x={D.x.partitionW} z={layout.living.acZ} y={2.6} face="x-" />
      {[
        [0.55, 1.35],
        [0.55, 2.75],
        [2.55, 1.35],
        [2.55, 2.75],
      ].map(([x, z]) => (
        <Downlight key={`${x}${z}`} x={x} z={z} />
      ))}
      <Lamp x={1.55} y={2.3} z={1.95} evening={0.5} distance={4} minor />
      {/* dining zone: paper globe lantern (the living room keeps its ceiling fan) */}
      <PaperGlobe x={1.2} z={4.9} bottom={1.8} r={0.28} light={1.0} />
    </group>
  )
}
