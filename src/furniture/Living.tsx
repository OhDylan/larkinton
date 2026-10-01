/** Living room (mid-century modern): window seat, 2-seater on the right-hand wall, left wall kept clear for projection / TV. */
import { dimensions as D } from '../data/dimensions'
import { designMaterials } from './designMaterials'
import { layout } from './layout'
import { AirCon, B, Books, CeilingFan, Curtain, Cyl, Downlight, Lamp, Legs4, Plant, Soft, Sputnik, TaperedLeg, Vase } from './primitives'

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
      <Soft x0={0.3} x1={0.85} y0={top + 0.07} y1={top + 0.5} z0={s.z0 + 0.04} z1={s.z0 + 0.2} m={d.green} r={0.06} rot={[-0.18, 0, 0]} />
      <Soft x0={0.9} x1={1.4} y0={top + 0.07} y1={top + 0.46} z0={s.z0 + 0.05} z1={s.z0 + 0.2} m={d.mustard} r={0.06} rot={[-0.2, 0, 0]} />
      <mesh position={[2.6, top + 0.17, s.z0 + 0.22]} rotation-z={Math.PI / 2} material={d.rust} castShadow>
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

/** Low-slung mid-century sofa: walnut frame on splayed tapered legs, slim arms, tufted cognac leather. */
function Sofa() {
  const d = designMaterials()
  const s = layout.living.sofa // back against the wall at x1, faces -x
  const arm = 0.09
  const back = 0.16
  const frameY = 0.2
  const seatTop = 0.43
  const zMid = (s.z0 + s.z1) / 2
  return (
    <group>
      <Legs4 x0={s.x0} x1={s.x1} z0={s.z0} z1={s.z1} top={frameY} inset={0.07} splay={0.035} r={0.022} />
      {/* exposed walnut rail under the cushions */}
      <B x0={s.x0} x1={s.x1} y0={frameY} y1={frameY + 0.05} z0={s.z0} z1={s.z1} m={d.wood} />
      {/* slim upholstered arms and back */}
      <Soft x0={s.x0 + 0.02} x1={s.x1} y0={frameY + 0.04} y1={0.6} z0={s.z0} z1={s.z0 + arm} m={d.leather} r={0.03} />
      <Soft x0={s.x0 + 0.02} x1={s.x1} y0={frameY + 0.04} y1={0.6} z0={s.z1 - arm} z1={s.z1} m={d.leather} r={0.03} />
      <Soft x0={s.x1 - back} x1={s.x1} y0={frameY + 0.04} y1={s.h} z0={s.z0 + arm} z1={s.z1 - arm} m={d.leather} r={0.035} />
      {/* button tufting on the back: two rows of small buttons */}
      {[0.55, 0.68].flatMap((y) =>
        Array.from({ length: 6 }, (_, k) => s.z0 + arm + ((s.z1 - s.z0 - 2 * arm) * (k + 0.5)) / 6).map((z) => (
          <mesh key={`${y}${z}`} position={[s.x1 - back - 0.002, y, z]} material={d.woodDark}>
            <sphereGeometry args={[0.009, 8, 6]} />
          </mesh>
        )),
      )}
      {/* two tight seat cushions */}
      {[
        [s.z0 + arm, zMid],
        [zMid, s.z1 - arm],
      ].map(([a, b]) => (
        <Soft key={a} x0={s.x0 + 0.03} x1={s.x1 - back} y0={frameY + 0.05} y1={seatTop} z0={a + 0.004} z1={b - 0.004} m={d.leather} r={0.03} />
      ))}
      {/* cushions: mustard velvet, forest green velvet, cream boucle; rust throw over the arm */}
      <Soft x0={s.x1 - back - 0.15} x1={s.x1 - back - 0.02} y0={seatTop - 0.02} y1={seatTop + 0.36} z0={s.z0 + arm + 0.04} z1={s.z0 + arm + 0.46} m={d.mustard} r={0.06} rot={[0, 0, 0.22]} />
      <Soft x0={s.x1 - back - 0.15} x1={s.x1 - back - 0.02} y0={seatTop - 0.02} y1={seatTop + 0.32} z0={s.z1 - arm - 0.44} z1={s.z1 - arm - 0.06} m={d.green} r={0.06} rot={[0, 0.15, 0.22]} />
      <Soft x0={s.x1 - back - 0.16} x1={s.x1 - back - 0.04} y0={seatTop - 0.02} y1={seatTop + 0.28} z0={zMid - 0.18} z1={zMid + 0.18} m={d.cream} r={0.06} rot={[0, 0, 0.25]} />
      <Soft x0={s.x0 + 0.1} x1={s.x1 - 0.1} y0={0.58} y1={0.62} z0={s.z1 - arm - 0.01} z1={s.z1 + 0.01} m={d.rust} r={0.012} />
      <Soft x0={s.x0 + 0.1} x1={s.x0 + 0.13} y0={0.35} y1={0.62} z0={s.z1 - arm - 0.01} z1={s.z1 + 0.01} m={d.rust} r={0.01} />
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
      <Cyl x={x - 0.05} z={z - 0.02} y0={top} y1={top + 0.015} r={0.06} m={d.brass} />
      <Cyl x={x - 0.05} z={z - 0.02} y0={top + 0.015} y1={top + 0.22} r={0.008} m={d.brass} seg={10} />
      <mesh position={[x - 0.05, top + 0.22, z - 0.02]} scale={[1, 0.6, 1]} material={d.opal}>
        <sphereGeometry args={[0.13, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <Lamp x={x - 0.05} y={top + 0.2} z={z - 0.02} evening={0.9} distance={3} />
      <Vase x={x + 0.11} z={z + 0.06} y={top} h={0.12} r={0.045} m={d.green} neck={0.4} />
    </group>
  )
}

/** Oval "surfboard" coffee table in walnut on splayed tapered legs, with a lower shelf. */
function CoffeeTable() {
  const d = designMaterials()
  const t = layout.living.coffeeTable
  const rx = t.r + 0.14
  const rz = t.r - 0.04
  return (
    <group>
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sz]) => (
        <TaperedLeg key={`${sx}${sz}`} x={t.cx + sx * rx * 0.62} z={t.cz + sz * rz * 0.55} top={t.h - 0.03} splay={[sx * 0.045, sz * 0.03]} r={0.02} />
      ))}
      <mesh position={[t.cx, t.h - 0.015, t.cz]} scale={[rx, 1, rz]} material={d.wood} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 0.03, 64]} />
      </mesh>
      <mesh position={[t.cx, 0.12, t.cz]} scale={[rx * 0.62, 1, rz * 0.55]} material={d.woodDark} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 0.018, 48]} />
      </mesh>
      <Books x={t.cx - 0.1} z={t.cz - 0.05} y={t.h} n={2} w={0.26} dpt={0.19} />
      <Cyl x={t.cx + 0.2} z={t.cz + 0.06} y0={t.h} y1={t.h + 0.06} r={0.05} rTop={0.11} m={d.brass} />
      <Vase x={t.cx - 0.24} z={t.cz + 0.1} y={t.h} h={0.18} r={0.05} m={d.rust} neck={0.35} />
      <Books x={t.cx} z={t.cz} y={0.13} n={3} w={0.28} dpt={0.2} />
    </group>
  )
}

export function Living() {
  const d = designMaterials()
  const r = layout.living.rug
  const [fx, fz] = layout.living.fan
  return (
    <group>
      {/* geometric mid-century rug */}
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
      {/* dining zone: brass Sputnik chandelier */}
      <Sputnik x={1.2} z={4.9} cy={2.05} light={1.1} />
    </group>
  )
}
