/** Living room: window seat, 2-seater on the right-hand wall, left wall kept clear for projection / TV. */
import { dimensions as D } from '../data/dimensions'
import { designMaterials } from './designMaterials'
import { layout } from './layout'
import { AirCon, Akari, B, Books, CeilingFan, Curtain, Cyl, Downlight, Lamp, Plant, Soft, Vase } from './primitives'

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
      <Soft x0={s.x0 + 0.02} x1={s.x1 - 0.02} y0={top} y1={top + 0.09} z0={s.z0 + 0.03} z1={s.z1 + 0.01} m={d.linen} r={0.035} />
      {/* back cushions leaning on the glass + a bolster */}
      <Soft x0={0.3} x1={0.85} y0={top + 0.07} y1={top + 0.5} z0={s.z0 + 0.04} z1={s.z0 + 0.2} m={d.oatmeal} r={0.06} rot={[-0.18, 0, 0]} />
      <Soft x0={0.9} x1={1.4} y0={top + 0.07} y1={top + 0.46} z0={s.z0 + 0.05} z1={s.z0 + 0.2} m={d.mocha} r={0.06} rot={[-0.2, 0, 0]} />
      <mesh position={[2.6, top + 0.17, s.z0 + 0.22]} rotation-z={Math.PI / 2} material={d.sage} castShadow>
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

function Sofa() {
  const d = designMaterials()
  const s = layout.living.sofa // back against the wall at x1, faces -x
  const arm = 0.16
  const back = 0.22
  const seatTop = 0.44
  const zMid = (s.z0 + s.z1) / 2
  return (
    <group>
      {[s.x0 + 0.07, s.x1 - 0.07].flatMap((x) =>
        [s.z0 + 0.07, s.z1 - 0.07].map((z) => <Cyl key={`${x}${z}`} x={x} z={z} y0={0} y1={0.1} r={0.02} rTop={0.025} m={d.woodDark} seg={10} />),
      )}
      {/* base + arms + back, soft-edged leather */}
      <Soft x0={s.x0} x1={s.x1} y0={0.1} y1={0.34} z0={s.z0} z1={s.z1} m={d.leather} r={0.05} />
      <Soft x0={s.x0} x1={s.x1} y0={0.1} y1={0.62} z0={s.z0} z1={s.z0 + arm} m={d.leather} r={0.07} />
      <Soft x0={s.x0} x1={s.x1} y0={0.1} y1={0.62} z0={s.z1 - arm} z1={s.z1} m={d.leather} r={0.07} />
      <Soft x0={s.x1 - back} x1={s.x1} y0={0.3} y1={s.h} z0={s.z0 + arm - 0.01} z1={s.z1 - arm + 0.01} m={d.leather} r={0.07} />
      {/* two seat + two back cushions */}
      {[
        [s.z0 + arm, zMid],
        [zMid, s.z1 - arm],
      ].map(([a, b]) => (
        <group key={a}>
          <Soft x0={s.x0 + 0.02} x1={s.x1 - back} y0={0.32} y1={seatTop} z0={a + 0.005} z1={b - 0.005} m={d.leather} r={0.05} />
          <Soft x0={s.x1 - back - 0.14} x1={s.x1 - back + 0.02} y0={seatTop - 0.02} y1={s.h + 0.02} z0={a + 0.01} z1={b - 0.01} m={d.leather} r={0.06} rot={[0, 0, 0.12]} />
        </group>
      ))}
      {/* scatter cushions + a wool throw over the arm */}
      <Soft x0={s.x1 - back - 0.26} x1={s.x1 - back - 0.1} y0={seatTop - 0.02} y1={seatTop + 0.36} z0={s.z0 + arm + 0.05} z1={s.z0 + arm + 0.5} m={d.linen} r={0.06} rot={[0, 0, 0.3]} />
      <Soft x0={s.x1 - back - 0.24} x1={s.x1 - back - 0.1} y0={seatTop - 0.02} y1={seatTop + 0.3} z0={s.z1 - arm - 0.45} z1={s.z1 - arm - 0.05} m={d.sage} r={0.06} rot={[0, 0.2, 0.28]} />
      <Soft x0={s.x0 + 0.1} x1={s.x1 - 0.12} y0={0.45} y1={0.64} z0={s.z1 - arm - 0.01} z1={s.z1 + 0.01} m={d.wool} r={0.02} />
      <Soft x0={s.x0 + 0.1} x1={s.x0 + 0.13} y0={0.3} y1={0.64} z0={s.z1 - arm - 0.01} z1={s.z1 + 0.01} m={d.wool} r={0.012} />
    </group>
  )
}

function StackedSideTable() {
  const d = designMaterials()
  const [x, z] = layout.living.sideTable
  return (
    <group>
      <mesh position={[x, 0.11, z]} scale={[1, 0.62, 0.92]} material={d.basalt} castShadow receiveShadow>
        <sphereGeometry args={[0.17, 32, 20]} />
      </mesh>
      <mesh position={[x + 0.01, 0.3, z]} scale={[1, 0.55, 0.95]} material={d.travertine} castShadow receiveShadow>
        <sphereGeometry args={[0.14, 32, 20]} />
      </mesh>
      <mesh position={[x, 0.44, z]} scale={[1, 0.5, 1]} material={d.basalt} castShadow receiveShadow>
        <sphereGeometry args={[0.11, 32, 20]} />
      </mesh>
      <Cyl x={x} z={z} y0={0.48} y1={0.52} r={0.19} m={d.basalt} />
      {/* small paper table lamp */}
      <Cyl x={x - 0.05} z={z} y0={0.52} y1={0.54} r={0.05} m={d.blackMetal} />
      <mesh position={[x - 0.05, 0.68, z]} scale={[1, 1.1, 1]} material={d.paper}>
        <sphereGeometry args={[0.11, 32, 20]} />
      </mesh>
      <Lamp x={x - 0.05} y={0.68} z={z} evening={0.9} distance={3} />
      <Vase x={x + 0.1} z={z + 0.04} y={0.52} h={0.1} r={0.04} m={d.clay} />
    </group>
  )
}

function CoffeeTable() {
  const d = designMaterials()
  const t = layout.living.coffeeTable
  return (
    <group>
      {/* travertine drum with a slightly recessed base */}
      <Cyl x={t.cx} z={t.cz} y0={0} y1={0.04} r={t.r - 0.06} m={d.travertine} seg={48} />
      <Cyl x={t.cx} z={t.cz} y0={0.04} y1={t.h} r={t.r} rTop={t.r - 0.01} m={d.travertine} seg={48} />
      <Books x={t.cx - 0.06} z={t.cz - 0.08} y={t.h} n={3} w={0.26} dpt={0.19} />
      <Cyl x={t.cx + 0.14} z={t.cz + 0.13} y0={t.h} y1={t.h + 0.07} r={0.06} rTop={0.11} m={d.ceramicDark} />
      <Vase x={t.cx - 0.15} z={t.cz + 0.16} y={t.h} h={0.2} r={0.05} m={d.ceramic} neck={0.35} />
    </group>
  )
}

export function Living() {
  const d = designMaterials()
  const r = layout.living.rug
  const [fx, fz] = layout.living.fan
  return (
    <group>
      <Soft x0={r.x0} x1={r.x1} y0={0.0} y1={0.014} z0={r.z0} z1={r.z1} m={d.wool} r={0.006} />
      <WindowSeat />
      <Sofa />
      <CoffeeTable />
      <StackedSideTable />
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
      {/* dining-zone lantern (between shelving wall and island) */}
      <Akari x={1.2} z={4.9} bottom={1.9} r={0.26} squash={0.5} light={0.9} />
    </group>
  )
}
