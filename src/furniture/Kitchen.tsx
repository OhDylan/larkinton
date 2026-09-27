/** Entrance shoe cabinet, kitchen upper/lower run, and the 2-seat island. */
import { dimensions as D } from '../data/dimensions'
import { materials } from '../materials/materials'
import { designMaterials } from './designMaterials'
import { layout } from './layout'
import { B, Cyl, Lantern, Stool, Vase } from './primitives'

const gap = 0.004 // shadow gap between cabinet fronts

/** Thin dark lines on a front face that read as the gaps between doors. */
function Splits({ xs, y0, y1, z }: { xs: number[]; y0: number; y1: number; z: number }) {
  const d = designMaterials()
  return (
    <>
      {xs.map((x) => (
        <B key={x} x0={x - gap / 2} x1={x + gap / 2} y0={y0} y1={y1} z0={z - 0.002} z1={z + 0.002} m={d.charcoal} shadow={false} />
      ))}
    </>
  )
}

const divide = (a: number, b: number, n: number) => Array.from({ length: n - 1 }, (_, i) => a + ((b - a) * (i + 1)) / n)

export function Entry() {
  const d = designMaterials()
  const s = layout.entry.shoeCabinet
  const top = s.y0 + s.h
  const mr = layout.entry.mirror
  const faceZ = D.z.entryDoorN
  const cx = (s.x0 + s.x1) / 2
  return (
    <group>
      {/* floating cabinet: gap underneath for everyday shoes */}
      <B x0={s.x0} x1={s.x1} y0={s.y0} y1={top} z0={s.z0} z1={s.z1} m={d.oak} />
      <Splits xs={[cx]} y0={s.y0 + 0.02} y1={top - 0.02} z={s.z0} />
      {/* recessed finger-pull line along the top */}
      <B x0={s.x0 + 0.01} x1={s.x1 - 0.01} y0={top - 0.05} y1={top - 0.035} z0={s.z0 - 0.002} z1={s.z0 + 0.01} m={d.charcoal} shadow={false} />
      {/* styling: key tray + small vase */}
      <B x0={s.x0 + 0.1} x1={s.x0 + 0.32} y0={top} y1={top + 0.02} z0={s.z0 + 0.1} z1={s.z0 + 0.25} m={d.clay} />
      <Vase x={s.x1 - 0.15} z={(s.z0 + s.z1) / 2} y={top} h={0.26} r={0.06} />
      {/* round mirror with a thin oak rim */}
      <mesh position={[mr.cx, mr.y, faceZ - 0.012]} rotation-y={Math.PI} material={d.mirror}>
        <circleGeometry args={[mr.r, 48]} />
      </mesh>
      <mesh position={[mr.cx, mr.y, faceZ - 0.01]} material={d.oak}>
        <torusGeometry args={[mr.r, 0.012, 8, 48]} />
      </mesh>
    </group>
  )
}

export function Kitchen() {
  const d = designMaterials()
  const m = materials()
  const k = layout.kitchen
  const b = k.base
  const u = k.upper
  const counterY = b.h
  const bodyTop = counterY - 0.04
  const sinkZ = (b.z0 + b.z1) / 2 + 0.03
  const baseSplits = divide(b.x0, b.x1, 4)
  const upperSplits = divide(u.x0, u.x1, 3)
  return (
    <group>
      {/* ---- lower run: recessed plinth, oak fronts, warm stone top */}
      <B x0={b.x0} x1={b.x1} y0={0} y1={0.1} z0={b.z0 + 0.06} z1={b.z1} m={d.charcoal} />
      <B x0={b.x0} x1={b.x1} y0={0.1} y1={bodyTop} z0={b.z0} z1={b.z1} m={d.oak} />
      <Splits xs={baseSplits} y0={0.1} y1={bodyTop} z={b.z0} />
      <B x0={b.x0} x1={b.x1} y0={bodyTop} y1={counterY} z0={b.z0 - 0.02} z1={b.z1} m={d.stone} />
      {/* undermount sink (existing plumbing position) + tall spout */}
      <B x0={k.sinkX - 0.23} x1={k.sinkX + 0.23} y0={counterY - 0.001} y1={counterY + 0.002} z0={sinkZ - 0.2} z1={sinkZ + 0.2} m={m.stainless} shadow={false} />
      <Cyl x={k.sinkX} z={b.z1 - 0.07} y0={counterY} y1={counterY + 0.32} r={0.013} m={d.charcoal} seg={10} />
      <B x0={k.sinkX - 0.012} x1={k.sinkX + 0.012} y0={counterY + 0.3} y1={counterY + 0.325} z0={b.z1 - 0.26} z1={b.z1 - 0.07} m={d.charcoal} />
      {/* induction hob */}
      <B x0={k.hobX - 0.29} x1={k.hobX + 0.29} y0={counterY} y1={counterY + 0.006} z0={sinkZ - 0.25} z1={sinkZ + 0.25} m={d.hobGlass} shadow={false} />
      {/* styling: oak board, ceramic crock with utensils */}
      <B x0={3.35} x1={3.7} y0={counterY} y1={counterY + 0.02} z0={b.z1 - 0.3} z1={b.z1 - 0.05} m={d.oakPale} />
      <Vase x={2.35} z={b.z1 - 0.12} y={counterY} h={0.16} r={0.065} m={d.clay} />

      {/* ---- upper run: warm-white flat fronts, slim integrated hood, under-cabinet light strip */}
      <B x0={u.x0} x1={u.x1} y0={u.y0} y1={u.y0 + u.h} z0={u.z0} z1={u.z1} m={d.warmWhite} />
      <Splits xs={upperSplits} y0={u.y0} y1={u.y0 + u.h} z={u.z0} />
      <B x0={k.hobX - 0.3} x1={k.hobX + 0.3} y0={u.y0 - 0.04} y1={u.y0} z0={u.z0 - 0.05} z1={u.z1} m={d.charcoal} />
      <B x0={u.x0 + 0.05} x1={u.x1 - 0.05} y0={u.y0 - 0.006} y1={u.y0} z0={u.z0 + 0.03} z1={u.z0 + 0.05} m={d.paper} shadow={false} />
    </group>
  )
}

export function Island() {
  const d = designMaterials()
  const i = layout.island
  const t = i.top
  const bodyTop = t.h - 0.04
  // vertical oak flutes on the seating face and the open end
  const flutes = []
  for (let x = t.x0 + 0.03; x < t.x1 - 0.02; x += 0.05)
    flutes.push(<B key={`n${x}`} x0={x - 0.015} x1={x + 0.015} y0={0.08} y1={bodyTop} z0={i.bodyZ0 - 0.015} z1={i.bodyZ0} m={d.oak} />)
  for (let z = i.bodyZ0 + 0.03; z < t.z1 - 0.02; z += 0.05)
    flutes.push(<B key={`w${z}`} x0={t.x0 - 0.015} x1={t.x0} y0={0.08} y1={bodyTop} z0={z - 0.015} z1={z + 0.015} m={d.oak} />)
  const cz = (t.z0 + t.z1) / 2
  return (
    <group>
      <B x0={t.x0 + 0.02} x1={t.x1} y0={0} y1={0.08} z0={i.bodyZ0 + 0.02} z1={t.z1 - 0.02} m={d.charcoal} />
      <B x0={t.x0} x1={t.x1} y0={0.08} y1={bodyTop} z0={i.bodyZ0} z1={t.z1} m={d.oakPale} />
      {flutes}
      <B x0={t.x0 - 0.02} x1={t.x1} y0={bodyTop} y1={t.h} z0={t.z0} z1={t.z1 + 0.02} m={d.stone} />
      {/* chopping board + clay fruit bowl */}
      <B x0={t.x1 - 0.5} x1={t.x1 - 0.12} y0={t.h} y1={t.h + 0.025} z0={t.z1 - 0.32} z1={t.z1 - 0.06} m={d.oak} />
      <Cyl x={t.x0 + 0.3} z={cz + 0.05} y0={t.h} y1={t.h + 0.08} r={0.08} rTop={0.13} m={d.clay} />
      {i.stools.map(([x, z]) => (
        <Stool key={x} x={x} z={z} h={i.seatH} />
      ))}
      {i.stools.map(([x]) => (
        <Lantern key={x} x={x} z={cz} bottom={1.62} r={0.16} light={0.25} />
      ))}
    </group>
  )
}
