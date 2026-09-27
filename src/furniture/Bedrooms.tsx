/** Master bedroom, bathroom styling, and the Bedroom 2 studio / workshop. */
import { dimensions as D } from '../data/dimensions'
import { materials } from '../materials/materials'
import { designMaterials } from './designMaterials'
import { layout } from './layout'
import { B, Cyl, Plant, Vase } from './primitives'

// ------------------------------------------------------------------ master bedroom
export function Master() {
  const d = designMaterials()
  const { wardrobe: w, bed: b, mattress: mt, nightstand: n, rug: r } = layout.master
  const midX = (w.x0 + w.x1) / 2
  const bx = (b.x0 + b.x1) / 2
  const mz0 = b.z0 + 0.1
  const mz1 = mz0 + mt.l
  const my = 0.52 // mattress top
  return (
    <group>
      <B x0={r.x0} x1={r.x1} y0={0.001} y1={0.012} z0={r.z0} z1={r.z1} m={d.oatmeal} shadow={false} />

      {/* wardrobe: full-height oak, two doors, slim black pulls */}
      <B x0={w.x0} x1={w.x1} y0={0} y1={w.h} z0={w.z0} z1={w.z1} m={d.oak} />
      <B x0={midX - 0.002} x1={midX + 0.002} y0={0.02} y1={w.h - 0.02} z0={w.z1 - 0.001} z1={w.z1 + 0.002} m={d.charcoal} shadow={false} />
      <B x0={w.x0} x1={w.x1} y0={1.95} y1={1.954} z0={w.z1 - 0.001} z1={w.z1 + 0.002} m={d.charcoal} shadow={false} />
      {[midX - 0.05, midX + 0.04].map((x) => (
        <B key={x} x0={x} x1={x + 0.012} y0={0.85} y1={1.35} z0={w.z1} z1={w.z1 + 0.025} m={d.blackMetal} />
      ))}

      {/* platform bed with a low headboard that stays under the window sill */}
      <B x0={b.x0} x1={b.x1} y0={0} y1={b.h} z0={b.z0} z1={b.z0 + 0.06} m={d.oak} />
      <B x0={b.x0 + 0.08} x1={b.x1 - 0.08} y0={0} y1={0.1} z0={b.z0 + 0.1} z1={b.z1 - 0.1} m={d.charcoal} />
      <B x0={b.x0} x1={b.x1} y0={0.1} y1={0.3} z0={b.z0 + 0.06} z1={b.z1} m={d.oak} />
      <B x0={bx - mt.w / 2} x1={bx + mt.w / 2} y0={0.3} y1={my} z0={mz0} z1={mz1} m={d.warmWhite} />
      {/* linen duvet draping over the sides */}
      <B x0={bx - mt.w / 2 - 0.04} x1={bx + mt.w / 2 + 0.04} y0={0.34} y1={my + 0.06} z0={mz0 + 0.5} z1={mz1 + 0.04} m={d.linen} />
      {/* pillows */}
      {[bx - 0.36, bx + 0.36].map((x) => (
        <mesh key={x} position={[x, my + 0.08, mz0 + 0.25]} rotation-x={-0.35} material={d.warmWhite} castShadow>
          <boxGeometry args={[0.66, 0.14, 0.42]} />
        </mesh>
      ))}
      <mesh position={[bx + 0.15, my + 0.14, mz0 + 0.42]} rotation-x={-0.5} material={d.sage} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.1]} />
      </mesh>
      {/* clay throw across the foot */}
      <B x0={bx - mt.w / 2 - 0.05} x1={bx + mt.w / 2 + 0.05} y0={0.4} y1={my + 0.075} z0={mz1 - 0.55} z1={mz1 - 0.15} m={d.clay} />

      {/* nightstand + ceramic lamp */}
      <B x0={n.x0} x1={n.x1} y0={0.08} y1={n.h} z0={n.z0} z1={n.z1} m={d.oak} />
      <Cyl x={(n.x0 + n.x1) / 2} z={(n.z0 + n.z1) / 2} y0={0} y1={0.08} r={0.03} m={d.oak} seg={8} />
      <Vase x={(n.x0 + n.x1) / 2 + 0.05} z={(n.z0 + n.z1) / 2} y={n.h} h={0.2} r={0.07} />
      <Cyl x={(n.x0 + n.x1) / 2 + 0.05} z={(n.z0 + n.z1) / 2} y0={n.h + 0.2} y1={n.h + 0.38} r={0.13} rTop={0.1} m={d.paper} />
      <pointLight position={[(n.x0 + n.x1) / 2, n.h + 0.3, (n.z0 + n.z1) / 2 + 0.1]} color="#ffcf98" intensity={0.25} distance={2} decay={2} />
      <B x0={n.x0 + 0.04} x1={n.x0 + 0.2} y0={n.h} y1={n.h + 0.04} z0={n.z0 + 0.08} z1={n.z1 - 0.1} m={d.book[0]} />
    </group>
  )
}

// ------------------------------------------------------------------ bathroom
export function Bath() {
  const d = designMaterials()
  const m = materials()
  const { vanity: v, mirror: mr } = layout.bath
  const wallZ = D.z.bathSouth
  const vx = (v.x0 + v.x1) / 2
  const vz = (v.z0 + v.z1) / 2
  const top = v.y0 + v.h
  const fr = 0.018
  const glassX = D.x.showerGlass
  return (
    <group>
      {/* floating oak vanity, stone top, ceramic vessel basin, wall spout */}
      <B x0={v.x0} x1={v.x1} y0={v.y0} y1={top - 0.02} z0={v.z0} z1={v.z1} m={d.oak} />
      <B x0={v.x0} x1={v.x1} y0={top - 0.02} y1={top} z0={v.z0 - 0.01} z1={v.z1} m={d.stone} />
      <Cyl x={vx} z={vz - 0.02} y0={top} y1={top + 0.13} r={0.14} rTop={0.19} m={d.ceramic} seg={32} />
      <mesh position={[vx, top + 0.25, wallZ - 0.07]} rotation-x={Math.PI / 2} material={m.stainless}>
        <cylinderGeometry args={[0.011, 0.011, 0.14, 10]} />
      </mesh>
      <Vase x={v.x1 - 0.06} z={v.z0 + 0.08} y={top} h={0.1} r={0.035} m={d.clay} />

      {/* one long horizontal mirror, thin oak frame */}
      <B x0={mr.x0} x1={mr.x1} y0={mr.y0} y1={mr.y1} z0={wallZ - 0.02} z1={wallZ - 0.001} m={d.oak} />
      <B x0={mr.x0 + fr} x1={mr.x1 - fr} y0={mr.y0 + fr} y1={mr.y1 - fr} z0={wallZ - 0.024} z1={wallZ - 0.02} m={d.mirror} shadow={false} />

      {/* existing shower screen: hinged glass door → pull handle on both sides */}
      {[-1, 1].map((s) => (
        <B key={s} x0={glassX + s * 0.035 - 0.006} x1={glassX + s * 0.035 + 0.006} y0={0.85} y1={1.3} z0={D.z.corridorNorth + 0.2} z1={D.z.corridorNorth + 0.212} m={m.stainless} />
      ))}
      {/* towel on a ring beside the door */}
      <B x0={D.x.bathWestE + 0.001} x1={D.x.bathWestE + 0.03} y0={0.9} y1={1.35} z0={4.05} z1={4.35} m={d.linen} />
    </group>
  )
}

// ------------------------------------------------------------------ studio / workshop
/** Small desktop 6-axis robot arm. Angles are the pose it's displayed in. */
function RobotArm({ x, z, y, yaw, a1, a2, a3, accent }: { x: number; z: number; y: number; yaw: number; a1: number; a2: number; a3: number; accent: boolean }) {
  const d = designMaterials()
  const body = accent ? d.robotAccent : d.robotWhite
  const joint = accent ? d.charcoal : d.robotAccent
  return (
    <group position={[x, y, z]} rotation-y={yaw}>
      <mesh position-y={0.02} material={d.charcoal} castShadow>
        <cylinderGeometry args={[0.075, 0.08, 0.04, 24]} />
      </mesh>
      <mesh position-y={0.075} material={body} castShadow>
        <cylinderGeometry args={[0.05, 0.055, 0.07, 20]} />
      </mesh>
      <group position-y={0.12} rotation-z={a1}>
        <mesh material={joint} castShadow>
          <sphereGeometry args={[0.042, 16, 12]} />
        </mesh>
        <mesh position-y={0.13} material={body} castShadow>
          <boxGeometry args={[0.05, 0.26, 0.05]} />
        </mesh>
        <group position-y={0.26} rotation-z={a2}>
          <mesh material={joint} castShadow>
            <sphereGeometry args={[0.035, 16, 12]} />
          </mesh>
          <mesh position-y={0.11} material={body} castShadow>
            <boxGeometry args={[0.04, 0.22, 0.04]} />
          </mesh>
          <group position-y={0.22} rotation-z={a3}>
            <mesh position-y={0.02} material={joint} castShadow>
              <cylinderGeometry args={[0.022, 0.022, 0.04, 12]} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.015, 0.065, 0]} material={d.charcoal} castShadow>
                <boxGeometry args={[0.008, 0.05, 0.02]} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </group>
  )
}

function Chair({ x, z }: { x: number; z: number }) {
  const d = designMaterials()
  // faces +z (towards the workbench)
  return (
    <group>
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => <Cyl key={`${sx}${sz}`} x={x + sx * 0.19} z={z + sz * 0.19} y0={0} y1={0.45} r={0.016} m={d.oak} seg={8} />),
      )}
      <B x0={x - 0.22} x1={x + 0.22} y0={0.43} y1={0.47} z0={z - 0.22} z1={z + 0.22} m={d.oak} />
      <B x0={x - 0.2} x1={x + 0.2} y0={0.47} y1={0.5} z0={z - 0.2} z1={z + 0.2} m={d.linen} />
      {[-1, 1].map((sx) => (
        <Cyl key={sx} x={x + sx * 0.19} z={z - 0.2} y0={0.45} y1={0.85} r={0.014} m={d.oak} seg={8} />
      ))}
      <B x0={x - 0.22} x1={x + 0.22} y0={0.68} y1={0.84} z0={z - 0.23} z1={z - 0.2} m={d.oak} />
    </group>
  )
}

function Cart() {
  const d = designMaterials()
  const c = layout.studio.cart
  const trays = [0.12, 0.44, c.h - 0.02]
  const cx = (c.x0 + c.x1) / 2
  const cz = (c.z0 + c.z1) / 2
  return (
    <group>
      {[c.x0 + 0.02, c.x1 - 0.02].flatMap((x) =>
        [c.z0 + 0.02, c.z1 - 0.02].map((z) => (
          <group key={`${x}${z}`}>
            <Cyl x={x} z={z} y0={0.05} y1={c.h} r={0.008} m={d.sageMetal} seg={8} />
            <mesh position={[x, 0.025, z]} material={d.charcoal}>
              <sphereGeometry args={[0.025, 10, 8]} />
            </mesh>
          </group>
        )),
      )}
      {trays.map((y) => (
        <group key={y}>
          <B x0={c.x0} x1={c.x1} y0={y} y1={y + 0.01} z0={c.z0} z1={c.z1} m={d.sageMetal} />
          <B x0={c.x0} x1={c.x1} y0={y} y1={y + 0.06} z0={c.z0} z1={c.z0 + 0.006} m={d.sageMetal} />
          <B x0={c.x0} x1={c.x1} y0={y} y1={y + 0.06} z0={c.z1 - 0.006} z1={c.z1} m={d.sageMetal} />
        </group>
      ))}
      {/* parts bins, a spool, a roll of tape */}
      <B x0={c.x0 + 0.03} x1={cx - 0.01} y0={0.13} y1={0.25} z0={c.z0 + 0.03} z1={c.z1 - 0.03} m={d.warmWhite} />
      <B x0={cx + 0.01} x1={c.x1 - 0.03} y0={0.13} y1={0.22} z0={c.z0 + 0.03} z1={c.z1 - 0.03} m={d.clay} />
      <Cyl x={cx - 0.08} z={cz} y0={0.45} y1={0.53} r={0.06} m={d.robotAccent} />
      <Cyl x={cx + 0.1} z={cz} y0={0.45} y1={0.5} r={0.05} rTop={0.05} m={d.charcoal} />
      <B x0={c.x0 + 0.04} x1={c.x1 - 0.04} y0={c.h - 0.01} y1={c.h + 0.06} z0={c.z0 + 0.06} z1={c.z1 - 0.06} m={d.oakPale} />
    </group>
  )
}

function Pegboard() {
  const d = designMaterials()
  const k = layout.studio.desk
  const p = layout.studio.pegboard
  const z = D.z.bed2South - 0.022
  const shelves = [1.38, 1.74]
  return (
    <group>
      <B x0={k.x0} x1={k.x1} y0={p.y0} y1={p.y1} z0={z} z1={z + 0.018} m={d.pegboard} />
      {shelves.map((y, i) => (
        <group key={y}>
          <B x0={k.x0 + 0.15 + i * 0.5} x1={k.x0 + 0.95 + i * 0.5} y0={y} y1={y + 0.018} z0={z - 0.16} z1={z} m={d.oak} />
          {[0, 1, 2].map((j) => (
            <B key={j} x0={k.x0 + 0.2 + i * 0.5 + j * 0.25} x1={k.x0 + 0.4 + i * 0.5 + j * 0.25} y0={y + 0.018} y1={y + 0.12} z0={z - 0.14} z1={z - 0.02}
              m={[d.sage, d.warmWhite, d.clay][(i + j) % 3]} />
          ))}
        </group>
      ))}
      {/* hand tools hanging on pegs */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <B key={i} x0={k.x1 - 0.7 + i * 0.09} x1={k.x1 - 0.68 + i * 0.09} y0={1.05 + (i % 2) * 0.03} y1={1.28} z0={z - 0.02} z1={z} m={i % 3 === 0 ? d.robotAccent : d.charcoal} />
      ))}
      {/* coiled cable */}
      <mesh position={[k.x0 + 0.3, 1.15, z - 0.015]} material={d.charcoal}>
        <torusGeometry args={[0.08, 0.008, 6, 24]} />
      </mesh>
    </group>
  )
}

function SofaBed() {
  const d = designMaterials()
  const s = layout.studio.sofaBed // faces +z (the workbench)
  return (
    <group>
      {[s.x0 + 0.06, s.x1 - 0.06].flatMap((x) =>
        [s.z0 + 0.06, s.z1 - 0.06].map((z) => <Cyl key={`${x}${z}`} x={x} z={z} y0={0} y1={0.14} r={0.02} m={d.oak} seg={8} />),
      )}
      <B x0={s.x0} x1={s.x1} y0={0.14} y1={0.42} z0={s.z0} z1={s.z1} m={d.sage} />
      <B x0={s.x0} x1={s.x1} y0={0.42} y1={s.h} z0={s.z0} z1={s.z0 + 0.2} m={d.sage} />
      {/* bolsters at each end */}
      {[s.x0 + 0.1, s.x1 - 0.1].map((x) => (
        <mesh key={x} position={[x, 0.5, (s.z0 + s.z1) / 2 + 0.1]} rotation-x={Math.PI / 2} material={d.oatmeal} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.55, 20]} />
        </mesh>
      ))}
      <mesh position={[(s.x0 + s.x1) / 2 + 0.2, 0.58, s.z0 + 0.28]} rotation-x={-0.3} material={d.linen} castShadow>
        <boxGeometry args={[0.42, 0.36, 0.12]} />
      </mesh>
      {/* folded blanket for guests */}
      <B x0={s.x0 + 0.25} x1={s.x0 + 0.7} y0={0.42} y1={0.5} z0={s.z1 - 0.4} z1={s.z1 - 0.08} m={d.clay} />
    </group>
  )
}

export function Studio() {
  const d = designMaterials()
  const k = layout.studio.desk
  const top = k.h
  const [chx, chz] = layout.studio.chair
  return (
    <group>
      {/* workbench: thick oak top on a black steel frame */}
      <B x0={k.x0} x1={k.x1} y0={top - 0.04} y1={top} z0={k.z0} z1={k.z1} m={d.oak} />
      {[k.x0 + 0.04, k.x1 - 0.08].flatMap((x) =>
        [k.z0 + 0.04, k.z1 - 0.08].map((z) => <B key={`${x}${z}`} x0={x} x1={x + 0.04} y0={0} y1={top - 0.04} z0={z} z1={z + 0.04} m={d.blackMetal} />),
      )}
      <B x0={k.x0 + 0.04} x1={k.x1 - 0.04} y0={0.12} y1={0.15} z0={k.z1 - 0.08} z1={k.z1 - 0.04} m={d.blackMetal} />
      <Pegboard />
      <RobotArm x={k.x1 - 0.35} z={k.z1 - 0.2} y={top} yaw={-0.6} a1={0.5} a2={1.3} a3={0.6} accent={false} />
      <RobotArm x={k.x0 + 0.3} z={k.z1 - 0.18} y={top} yaw={0.4} a1={0.25} a2={-0.9} a3={-0.7} accent />
      {/* laptop */}
      <B x0={chx - 0.16} x1={chx + 0.16} y0={top} y1={top + 0.015} z0={k.z0 + 0.12} z1={k.z0 + 0.34} m={d.charcoal} />
      <mesh position={[chx, top + 0.11, k.z0 + 0.35]} rotation-x={-0.25} material={d.screen}>
        <boxGeometry args={[0.32, 0.21, 0.008]} />
      </mesh>
      {/* architect task lamp */}
      <Cyl x={chx + 0.45} z={k.z1 - 0.12} y0={top} y1={top + 0.02} r={0.07} m={d.blackMetal} />
      <mesh position={[chx + 0.45, top + 0.22, k.z1 - 0.2]} rotation-x={-0.35} material={d.blackMetal}>
        <cylinderGeometry args={[0.006, 0.006, 0.42, 6]} />
      </mesh>
      <mesh position={[chx + 0.45, top + 0.4, k.z1 - 0.36]} rotation-x={0.9} material={d.blackMetal}>
        <coneGeometry args={[0.07, 0.12, 20, 1, true]} />
      </mesh>
      <pointLight position={[chx + 0.45, top + 0.3, k.z1 - 0.4]} color="#ffd6a8" intensity={0.2} distance={1.5} decay={2} />
      <Chair x={chx} z={chz} />
      <Cart />
      <SofaBed />
      <Plant x={layout.studio.plant[0]} z={layout.studio.plant[1]} h={1.3} />
    </group>
  )
}
