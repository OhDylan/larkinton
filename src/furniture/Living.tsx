/** Living room (warm minimal): window seat, 2-seater on the right-hand wall, left wall kept clear for projection / TV. */
import { dimensions as D } from '../data/dimensions'
import { designMaterials } from './designMaterials'
import { MoneyTree, PhModel } from './zen'
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
      {/* a small aloe and a black stoneware vase on the seat */}
      <PhModel id="potted_plant_04" position={[2.5, top + 0.09, s.z1 - 0.2]} />
      <PhModel id="ceramic_vase_03" position={[1.9, top + 0.09, s.z1 - 0.22]} scale={0.55} finish="black" />
      {/* sheer linen curtains stacked at both ends, on a slim ceiling track */}
      <B x0={s.x0 + 0.02} x1={s.x1 - 0.02} y0={D.ceilingHeight - 0.03} y1={D.ceilingHeight} z0={s.z0 + 0.06} z1={s.z0 + 0.1} m={d.charcoal} />
      <Curtain a0={s.x0 + 0.04} a1={0.55} at={s.z0 + 0.09} y0={top + 0.1} y1={D.ceilingHeight - 0.03} alongX folds={5} />
      <Curtain a0={2.62} a1={s.x1 - 0.04} at={s.z0 + 0.09} y0={top + 0.1} y1={D.ceilingHeight - 0.03} alongX folds={5} />
    </group>
  )
}

/** Low cream boucle sofa on a recessed walnut plinth: soft, deep, rounded (Japandi). */
/**
 * Sofa: Wayfair's curved velvet sofa (Khronos glTF sample assets, CC BY 4.0) in its black
 * colourway, against the right-hand wall facing the projection wall. No coffee table on purpose:
 * Poly Haven only has antique / Chinese / industrial ones, and the empty floor suits the zen brief.
 */
function Sofa() {
  const s = layout.living.sofa
  return <PhModel id="GlamVelvetSofa" variant="Black" position={[s.x1 - 0.53, 0, (s.z0 + s.z1) / 2]} rotation={[0, -Math.PI / 2, 0]} />
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
      <MoneyTree x={layout.living.plant[0]} z={layout.living.plant[1]} />
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
