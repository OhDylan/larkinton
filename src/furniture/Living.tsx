/** Living room (warm minimal): window seat, 2-seater on the right-hand wall, left wall kept clear for projection / TV. */
import { dimensions as D } from '../data/dimensions'
import { designMaterials } from './designMaterials'
import { MoneyTree, PhModel, TeaSet } from './zen'
import { layout } from './layout'
import { AirCon, B, CeilingFan, Curtain, Downlight, Lamp, PaperGlobe, Soft } from './primitives'

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
      {/* Poly Haven: tea set and a small aloe on the seat */}
      <TeaSet x={1.85} z={s.z1 - 0.2} y={top + 0.09} rot={0.1} />
      <PhModel id="potted_plant_04" position={[2.5, top + 0.09, s.z1 - 0.2]} />
      {/* sheer linen curtains stacked at both ends, on a slim ceiling track */}
      <B x0={s.x0 + 0.02} x1={s.x1 - 0.02} y0={D.ceilingHeight - 0.03} y1={D.ceilingHeight} z0={s.z0 + 0.06} z1={s.z0 + 0.1} m={d.charcoal} />
      <Curtain a0={s.x0 + 0.04} a1={0.55} at={s.z0 + 0.09} y0={top + 0.1} y1={D.ceilingHeight - 0.03} alongX folds={5} />
      <Curtain a0={2.62} a1={s.x1 - 0.04} at={s.z0 + 0.09} y0={top + 0.1} y1={D.ceilingHeight - 0.03} alongX folds={5} />
    </group>
  )
}

/** Low cream boucle sofa on a recessed walnut plinth: soft, deep, rounded (Japandi). */
/**
 * Seating: two Poly Haven mid-century armchairs (walnut frame, black leather) side by side
 * against the right-hand wall, facing the projection wall; a small dark-wood stand by the window.
 */
function Seating() {
  const s = layout.living.sofa
  const x = s.x1 - 0.52
  return (
    <group>
      {[s.z0 + 0.43, s.z1 - 0.43].map((z) => (
        <PhModel key={z} id="modern_arm_chair_01" position={[x, 0, z]} rotation={[0, -Math.PI / 2, 0]} />
      ))}
      <PhModel id="WoodenTable_02" position={[layout.living.sideTable[0], 0, layout.living.sideTable[1]]} />
      <PhModel id="ceramic_vase_04" position={[layout.living.sideTable[0], 0.42, layout.living.sideTable[1]]} scale={0.45} finish="black" />
    </group>
  )
}

/** Low Chinese tea table (Poly Haven) as the coffee table, with a wooden bowl and black stoneware. */
function CoffeeTable() {
  const t = layout.living.coffeeTable
  const top = 0.5
  return (
    <group>
      <PhModel id="chinese_tea_table" position={[t.cx - 0.1, 0, t.cz]} />
      <PhModel id="wooden_bowl_01" position={[t.cx - 0.05, top, t.cz + 0.12]} scale={0.8} />
      <PhModel id="ceramic_vase_02" position={[t.cx - 0.3, top, t.cz - 0.2]} scale={0.55} finish="black" />
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
      <Seating />
      <CoffeeTable />
      <MoneyTree x={layout.living.plant[0]} z={layout.living.plant[1]} />
      {/* round East Asian landscape painting above the chairs */}
      <PhModel id="hanging_picture_frame_03" position={[D.x.partitionW - 0.02, 1.25, (layout.living.sofa.z0 + layout.living.sofa.z1) / 2]} rotation={[0, -Math.PI / 2, 0]} scale={1.3} />
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
      <PaperGlobe x={1.2} z={4.9} bottom={1.85} r={0.32} squash={0.55} light={1.0} />
    </group>
  )
}
