/** Entrance, kitchen upper/lower run, 2-seat island, and the dining joinery wall. */
import type { ReactNode } from 'react'
import { dimensions as D } from '../data/dimensions'
import { designMaterials } from './designMaterials'
import { layout } from './layout'
import { useMemo } from 'react'
import * as THREE from 'three'
import { B, Books, Cyl, DomePendant, Downlight, Lamp, Legs4, Mirror, Soft, Vase } from './primitives'

const GAP = 0.003 // shadow gap between joinery fronts

/** Dark hairlines that read as the gaps between doors on a front face (plane z = const). */
function SplitsX({ xs, y0, y1, z, dir = -1 }: { xs: number[]; y0: number; y1: number; z: number; dir?: 1 | -1 }) {
  const d = designMaterials()
  return (
    <>
      {xs.map((x) => (
        <B key={x} x0={x - GAP / 2} x1={x + GAP / 2} y0={y0} y1={y1} z0={Math.min(z, z + dir * 0.002)} z1={Math.max(z, z + dir * 0.002)} m={d.charcoal} shadow={false} />
      ))}
    </>
  )
}

const divide = (a: number, b: number, n: number) => Array.from({ length: n - 1 }, (_, i) => a + ((b - a) * (i + 1)) / n)

// ------------------------------------------------------------------ entrance
export function Entry() {
  const d = designMaterials()
  const s = layout.entry.shoeCabinet
  const top = s.y0 + s.h
  const mr = layout.entry.mirror
  const faceZ = D.z.entryDoorN
  const cx = (s.x0 + s.x1) / 2
  const mirrorGeo = useMemo(() => new THREE.CircleGeometry(mr.r, 64), [mr.r])
  return (
    <group>
      {/* mid-century credenza-style shoe cabinet on splayed tapered legs (shoes still fit underneath) */}
      <Legs4 x0={s.x0} x1={s.x1} z0={s.z0} z1={s.z1} top={s.y0} inset={0.05} splay={0.025} r={0.018} />
      <B x0={s.x0} x1={s.x1} y0={s.y0} y1={top - 0.03} z0={s.z0} z1={s.z1} m={d.wood} />
      {/* slim bar pulls */}
      {[cx - 0.09, cx + 0.04].map((x) => (
        <B key={x} x0={x} x1={x + 0.05} y0={top - 0.12} y1={top - 0.11} z0={s.z0 - 0.014} z1={s.z0} m={d.bronze} />
      ))}
      <B x0={s.x0 - 0.01} x1={s.x1 + 0.01} y0={top - 0.03} y1={top} z0={s.z0 - 0.015} z1={s.z1} m={d.stone} />
      <SplitsX xs={[cx]} y0={s.y0 + 0.01} y1={top - 0.04} z={s.z0} />
      {/* styling: ceramic key dish, bud vase with a stem, small book */}
      <Cyl x={s.x0 + 0.2} z={s.z0 + 0.17} y0={top} y1={top + 0.025} r={0.08} rTop={0.1} m={d.ceramicDark} />
      <Vase x={s.x1 - 0.16} z={s.z0 + 0.16} y={top} h={0.24} r={0.055} m={d.earth} neck={0.35} />
      <mesh position={[s.x1 - 0.17, top + 0.42, s.z0 + 0.16]} rotation-z={0.15} material={d.woodDark}>
        <cylinderGeometry args={[0.003, 0.004, 0.4, 5]} />
      </mesh>
      {/* round mirror in a thin walnut frame */}
      <Mirror geometry={mirrorGeo} position={[mr.cx, mr.y, faceZ - 0.012]} rotationY={Math.PI} />
      <mesh position={[mr.cx, mr.y, faceZ - 0.014]} material={d.wood}>
        <torusGeometry args={[mr.r, 0.016, 10, 64]} />
      </mesh>
      <Downlight x={cx} z={s.z0 - 0.25} />
      <Downlight x={0.7} z={7.75} />
    </group>
  )
}

// ------------------------------------------------------------------ kitchen
export function Kitchen() {
  const d = designMaterials()
  const k = layout.kitchen
  const b = k.base
  const u = k.upper
  const counterY = b.h
  const bodyTop = counterY - 0.04
  const sinkZ = (b.z0 + b.z1) / 2 + 0.03
  const uTop = u.y0 + u.h
  return (
    <group>
      {/* ---- lower run: shadow-gap plinth, deep wood fronts, terrazzo top with a thick edge */}
      <B x0={b.x0} x1={b.x1} y0={0} y1={0.1} z0={b.z0 + 0.06} z1={b.z1} m={d.charcoal} />
      <B x0={b.x0} x1={b.x1} y0={0.1} y1={bodyTop} z0={b.z0} z1={b.z1} m={d.wood} />
      <SplitsX xs={divide(b.x0, b.x1, 4)} y0={0.1} y1={bodyTop} z={b.z0} />
      {/* top-edge finger-pull groove */}
      <B x0={b.x0} x1={b.x1} y0={bodyTop - 0.035} y1={bodyTop - 0.02} z0={b.z0 - 0.001} z1={b.z0 + 0.012} m={d.woodDark} shadow={false} />
      <B x0={b.x0} x1={b.x1} y0={bodyTop} y1={counterY} z0={b.z0 - 0.02} z1={b.z1} m={d.stone} />
      {/* undermount sink (existing plumbing position) + tall matt-black spout */}
      <B x0={k.sinkX - 0.23} x1={k.sinkX + 0.23} y0={counterY - 0.001} y1={counterY + 0.001} z0={sinkZ - 0.2} z1={sinkZ + 0.2} m={d.blackMetal} shadow={false} />
      <Cyl x={k.sinkX} z={b.z1 - 0.07} y0={counterY} y1={counterY + 0.34} r={0.012} m={d.blackMetal} seg={12} />
      <B x0={k.sinkX - 0.01} x1={k.sinkX + 0.01} y0={counterY + 0.32} y1={counterY + 0.34} z0={b.z1 - 0.28} z1={b.z1 - 0.07} m={d.blackMetal} />
      {/* single-zone domino induction hob with a thin ring marking the zone */}
      <B x0={k.hobX - 0.145} x1={k.hobX + 0.145} y0={counterY} y1={counterY + 0.006} z0={sinkZ - 0.26} z1={sinkZ + 0.26} m={d.hobGlass} shadow={false} />
      <mesh position={[k.hobX, counterY + 0.0065, sinkZ + 0.03]} rotation-x={-Math.PI / 2} material={d.bronze}>
        <ringGeometry args={[0.095, 0.1, 48]} />
      </mesh>
      {/* styling: board, crock of utensils, stoneware bowls */}
      <B x0={3.58} x1={3.95} y0={counterY} y1={counterY + 0.025} z0={b.z1 - 0.32} z1={b.z1 - 0.04} m={d.woodLight} />
      <Vase x={b.x0 + 0.12} z={b.z1 - 0.13} y={counterY} h={0.17} r={0.065} m={d.ceramicDark} neck={0.9} />
      <Fridge />
      {[0, 0.06].map((dy, i) => (
        <Cyl key={i} x={3.95} z={b.z0 + 0.25} y0={counterY + dy} y1={counterY + dy + 0.05} r={0.07 - i * 0.012} rTop={0.1 - i * 0.012} m={d.ceramic} />
      ))}

      {/* ---- upper run: deep wood, full height to the beam line, integrated hood, lit underside */}
      <B x0={u.x0} x1={u.x1} y0={u.y0} y1={uTop} z0={u.z0} z1={u.z1} m={d.wood} />
      <SplitsX xs={divide(u.x0, u.x1, 3)} y0={u.y0} y1={uTop} z={u.z0} />
      <B x0={u.x0} x1={u.x1} y0={uTop} y1={D.ceilingHeight} z0={u.z0 + 0.02} z1={u.z1} m={d.woodDark} />
      <B x0={k.hobX - 0.2} x1={k.hobX + 0.2} y0={u.y0 - 0.035} y1={u.y0} z0={u.z0 - 0.04} z1={u.z1} m={d.charcoal} />
      <B x0={u.x0 + 0.04} x1={u.x1 - 0.04} y0={u.y0 - 0.005} y1={u.y0} z0={u.z0 + 0.03} z1={u.z0 + 0.05} m={d.lightStrip} shadow={false} />
      <Lamp x={(u.x0 + u.x1) / 2 - 0.5} y={u.y0 - 0.1} z={u.z0 - 0.05} evening={0.5} distance={1.6} />
      <Lamp x={(u.x0 + u.x1) / 2 + 0.5} y={u.y0 - 0.1} z={u.z0 - 0.05} evening={0.5} distance={1.6} minor />
      <Downlight x={2.7} z={7.7} />
      <Downlight x={3.7} z={7.7} />
    </group>
  )
}

/** Fridge in a full-height wood housing; the cabinet above conceals the DB box. */
function Fridge() {
  const d = designMaterials()
  const f = layout.kitchen.fridge
  const side = 0.025
  const fx0 = f.x0 + side + 0.01
  const fx1 = f.x1 - side - 0.01
  const front = f.z0 + 0.03
  const split = 1.2 // bottom freezer drawer / fridge door line
  const fx = (fx0 + fx1) / 2
  return (
    <group>
      {/* housing: side panels, over-fridge cabinet to the ceiling */}
      <B x0={f.x0} x1={f.x0 + side} y0={0} y1={D.ceilingHeight} z0={f.z0} z1={f.z1} m={d.wood} />
      <B x0={f.x1 - side} x1={f.x1} y0={0} y1={D.ceilingHeight} z0={f.z0} z1={f.z1} m={d.wood} />
      <B x0={f.x0 + side} x1={f.x1 - side} y0={f.h + 0.05} y1={D.ceilingHeight} z0={f.z0} z1={f.z1} m={d.wood} />
      <SplitsX xs={[fx]} y0={f.h + 0.07} y1={D.ceilingHeight - 0.02} z={f.z0} />
      <B x0={f.x0 + side} x1={f.x1 - side} y0={f.h + 0.3} y1={f.h + 0.303} z0={f.z0 - 0.002} z1={f.z0} m={d.charcoal} shadow={false} />
      {/* fridge: matt charcoal, bottom freezer, slim vertical brass handles */}
      <Soft x0={fx0} x1={fx1} y0={0.02} y1={f.h} z0={front} z1={f.z1 - 0.03} m={d.charcoal} r={0.015} />
      <B x0={fx0 + 0.01} x1={fx1 - 0.01} y0={split - 0.003} y1={split + 0.003} z0={front - 0.002} z1={front + 0.01} m={d.blackMetal} shadow={false} />
      <B x0={fx1 - 0.06} x1={fx1 - 0.045} y0={split + 0.15} y1={split + 0.55} z0={front - 0.035} z1={front} m={d.bronze} />
      <B x0={fx0 + 0.15} x1={fx1 - 0.15} y0={split - 0.1} y1={split - 0.085} z0={front - 0.035} z1={front} m={d.bronze} />
    </group>
  )
}

// ------------------------------------------------------------------ yard laundry
/** One front-loading machine (faces -z): body, control strip, round glass door. */
function Machine({ x0, x1, y0, z0, z1, h, dryer }: { x0: number; x1: number; y0: number; z0: number; z1: number; h: number; dryer: boolean }) {
  const d = designMaterials()
  const cx = (x0 + x1) / 2
  const doorY = y0 + h * 0.45
  return (
    <group>
      <Soft x0={x0} x1={x1} y0={y0} y1={y0 + h} z0={z0} z1={z1} m={d.whiteAppliance} r={0.02} />
      {/* control strip: dial + display */}
      <B x0={x0 + 0.03} x1={x1 - 0.03} y0={y0 + h - 0.12} y1={y0 + h - 0.03} z0={z0 - 0.003} z1={z0} m={d.ceramic} shadow={false} />
      <mesh position={[x1 - 0.12, y0 + h - 0.075, z0 - 0.012]} rotation-x={Math.PI / 2} material={d.bronze}>
        <cylinderGeometry args={[0.028, 0.028, 0.02, 24]} />
      </mesh>
      <B x0={cx - 0.1} x1={cx + 0.04} y0={y0 + h - 0.095} y1={y0 + h - 0.055} z0={z0 - 0.004} z1={z0} m={d.screen} shadow={false} />
      {/* door: chrome-ish ring + dark glass */}
      <mesh position={[cx, doorY, z0 - 0.02]} material={d.blackMetal}>
        <torusGeometry args={[dryer ? 0.19 : 0.2, 0.025, 12, 48]} />
      </mesh>
      <mesh position={[cx, doorY, z0 - 0.015]} rotation-y={Math.PI} material={d.hobGlass}>
        <circleGeometry args={[dryer ? 0.17 : 0.18, 48]} />
      </mesh>
    </group>
  )
}

export function Yard() {
  const d = designMaterials()
  const l = layout.yard.laundry
  const washerH = 0.85
  return (
    <group>
      <Machine x0={l.x0} x1={l.x1} y0={0.01} z0={l.z0} z1={l.z1} h={washerH} dryer={false} />
      {/* stacking kit between the two machines */}
      <B x0={l.x0 - 0.005} x1={l.x1 + 0.005} y0={washerH + 0.01} y1={washerH + 0.03} z0={l.z0} z1={l.z1} m={d.blackMetal} />
      <Machine x0={l.x0} x1={l.x1} y0={washerH + 0.03} z0={l.z0} z1={l.z1} h={l.h - washerH - 0.03} dryer />
      {/* laundry basket beside the stack */}
      <Cyl x={l.x0 - 0.26} z={l.z1 - 0.25} y0={0} y1={0.42} r={0.18} rTop={0.21} m={d.wool} />
      <Downlight x={(l.x0 + l.x1) / 2 - 0.3} z={7.9} />
    </group>
  )
}

// ------------------------------------------------------------------ island
export function Island() {
  const d = designMaterials()
  const i = layout.island
  const t = i.top
  const bodyTop = t.h - 0.05
  const flutes: ReactNode[] = []
  for (let x = t.x0 + 0.025; x < t.x1 - 0.015; x += 0.04)
    flutes.push(
      <mesh key={`n${x}`} position={[x, (0.1 + bodyTop) / 2, i.bodyZ0]} material={d.wood} castShadow receiveShadow>
        <cylinderGeometry args={[0.018, 0.018, bodyTop - 0.1, 10, 1, false, Math.PI / 2, Math.PI]} />
      </mesh>,
    )
  for (let z = i.bodyZ0 + 0.025; z < t.z1 - 0.015; z += 0.04)
    flutes.push(
      <mesh key={`w${z}`} position={[t.x0, (0.1 + bodyTop) / 2, z]} material={d.wood} castShadow receiveShadow>
        <cylinderGeometry args={[0.018, 0.018, bodyTop - 0.1, 10, 1, false, Math.PI, Math.PI]} />
      </mesh>,
    )
  const cz = (t.z0 + t.z1) / 2
  const cx = (t.x0 + t.x1) / 2
  return (
    <group>
      <B x0={t.x0 + 0.03} x1={t.x1} y0={0} y1={0.1} z0={i.bodyZ0 + 0.03} z1={t.z1 - 0.03} m={d.charcoal} />
      <B x0={t.x0} x1={t.x1} y0={0.1} y1={bodyTop} z0={i.bodyZ0} z1={t.z1} m={d.woodDark} />
      {flutes}
      {/* thick stone slab */}
      <B x0={t.x0 - 0.02} x1={t.x1} y0={bodyTop} y1={t.h} z0={t.z0} z1={t.z1 + 0.02} m={d.stone} />
      {/* chopping board, stoneware fruit bowl, teapot-ish vessel */}
      <B x0={t.x1 - 0.52} x1={t.x1 - 0.12} y0={t.h} y1={t.h + 0.03} z0={t.z1 - 0.34} z1={t.z1 - 0.06} m={d.woodLight} />
      <Cyl x={t.x0 + 0.3} z={cz + 0.05} y0={t.h} y1={t.h + 0.09} r={0.09} rTop={0.15} m={d.earth} />
      <Vase x={cx - 0.05} z={cz - 0.18} y={t.h} h={0.13} r={0.07} m={d.ceramicDark} neck={0.5} />
      {i.stools.map(([x, z]) => (
        <Stool key={x} x={x} z={z} h={i.seatH} />
      ))}
      {/* pair of black dome pendants over the island */}
      <DomePendant x={t.x0 + 0.35} z={cz} bottom={1.6} light={0.9} />
      <DomePendant x={t.x1 - 0.35} z={cz} bottom={1.6} light={0.9} minor />
    </group>
  )
}

/** Counter stool: wood frame, leather seat, footrest. */
function Stool({ x, z, h }: { x: number; z: number; h: number }) {
  const d = designMaterials()
  return (
    <group>
      {[0, 1, 2, 3].map((k) => {
        const a = Math.PI / 4 + (k * Math.PI) / 2
        return (
          <mesh key={k} position={[x + Math.cos(a) * 0.13, h / 2 - 0.02, z + Math.sin(a) * 0.13]} rotation={[Math.sin(a) * 0.07, 0, -Math.cos(a) * 0.07]} material={d.wood} castShadow>
            <cylinderGeometry args={[0.018, 0.011, h - 0.04, 10]} />
          </mesh>
        )
      })}
      <Cyl x={x} z={z} y0={h - 0.05} y1={h - 0.03} r={0.17} m={d.woodDark} />
      <Cyl x={x} z={z} y0={h - 0.035} y1={h + 0.02} r={0.165} rTop={0.17} m={d.leather} seg={40} />
      <mesh position={[x, 0.24, z]} rotation-x={Math.PI / 2} material={d.bronze}>
        <torusGeometry args={[0.135, 0.007, 8, 32]} />
      </mesh>
    </group>
  )
}

// ------------------------------------------------------------------ dining joinery wall
export function DiningWall() {
  const d = designMaterials()
  const w = layout.diningWall
  const face = w.x1 // front face (plane x = const), facing +x
  const T = 0.025 // panel thickness
  const baseH = 0.45
  const nicheBottom = 0.9
  const nicheTop = 1.55
  const pieces: ReactNode[] = []
  const key = (() => {
    let n = 0
    return () => n++
  })()
  const vDivider = (z: number, y0: number, y1: number) =>
    pieces.push(<B key={key()} x0={w.x0} x1={face} y0={y0} y1={y1} z0={z - T / 2} z1={z + T / 2} m={d.wood} />)
  const shelf = (z0: number, z1: number, y: number) =>
    pieces.push(<B key={key()} x0={w.x0} x1={face} y0={y - T / 2} y1={y + T / 2} z0={z0} z1={z1} m={d.wood} />)

  // --- A: open asymmetric shelving over a closed base (like the reference)
  const A0 = w.z0
  const A1 = w.shelvesZ1
  pieces.push(<B key={key()} x0={w.x0} x1={face} y0={0} y1={baseH} z0={A0} z1={A1} m={d.wood} />)
  shelf(A0, A1, baseH)
  const levels = [0.9, 1.35, 1.8]
  levels.forEach((y) => shelf(A0, A1, y))
  // warm LED strip tucked under the front of each open shelf
  ;[...levels, 2.2].forEach((y) =>
    pieces.push(<B key={key()} x0={face - 0.04} x1={face - 0.025} y0={y - T / 2 - 0.004} y1={y - T / 2} z0={A0 + T} z1={A1 - T / 2} m={d.lightStrip} shadow={false} />),
  )
  shelf(A0, A1, 2.2)
  vDivider(A0 + T / 2, 0, w.h)
  // staggered vertical dividers per row
  const rows: [number, number, number[]][] = [
    [baseH, 0.9, [A0 + 0.55]],
    [0.9, 1.35, [A0 + 0.95]],
    [1.35, 1.8, [A0 + 0.4, A0 + 1.0]],
    [1.8, 2.2, [A0 + 0.7]],
  ]
  rows.forEach(([y0, y1, zs]) => zs.forEach((z) => vDivider(z, y0, y1)))
  // closed top cabinets to the ceiling
  pieces.push(<B key={key()} x0={w.x0} x1={face} y0={2.2} y1={w.h} z0={A0} z1={A1} m={d.wood} />)
  // --- B: tea / coffee niche: base cabinet with stone top, lit open niche, uppers to ceiling
  const B0 = A1
  const B1 = w.nicheZ1
  vDivider(B0, 0, w.h)
  pieces.push(<B key={key()} x0={w.x0} x1={face} y0={0.08} y1={nicheBottom - 0.03} z0={B0 + T / 2} z1={B1 - T / 2} m={d.wood} />)
  pieces.push(<B key={key()} x0={w.x0} x1={face + 0.015} y0={nicheBottom - 0.03} y1={nicheBottom} z0={B0 + T / 2} z1={B1 - T / 2} m={d.stone} />)
  pieces.push(<B key={key()} x0={w.x0} x1={face} y0={nicheTop} y1={w.h} z0={B0 + T / 2} z1={B1 - T / 2} m={d.wood} />)
  pieces.push(<B key={key()} x0={face - 0.05} x1={face - 0.03} y0={nicheTop - 0.005} y1={nicheTop} z0={B0 + 0.03} z1={B1 - 0.03} m={d.lightStrip} shadow={false} />)
  // --- C: tall pantry
  const C0 = B1
  vDivider(C0, 0, w.h)
  pieces.push(<B key={key()} x0={w.x0} x1={face} y0={0} y1={w.h} z0={C0 + T / 2} z1={w.z1} m={d.wood} />)
  vDivider(w.z1 - T / 2, 0, w.h)
  // door gaps on closed parts (fronts face +x)
  const gaps: [number, number, number, number][] = [
    [A0 + 0.7, 0.02, baseH - 0.02, 0],
    [(A0 + A1) / 2, 2.22, w.h - 0.02, 0],
    [(B0 + B1) / 2, 0.1, nicheBottom - 0.05, 0],
    [(B0 + B1) / 2, nicheTop + 0.02, w.h - 0.02, 0],
    [(C0 + w.z1) / 2, 0.02, w.h - 0.02, 0],
  ]
  gaps.forEach(([z, y0, y1]) => pieces.push(<B key={key()} x0={face} x1={face + 0.002} y0={y0} y1={y1} z0={z - GAP / 2} z1={z + GAP / 2} m={d.charcoal} shadow={false} />))
  // styling on the shelves
  const sx = (w.x0 + face) / 2
  const styling: ReactNode[] = [
    <Books key="b1" x={sx} z={A0 + 0.25} y={baseH + T / 2} n={4} w={0.26} dpt={0.18} alongX={false} />,
    <Vase key="v1" x={sx} z={A0 + 0.75} y={baseH + T / 2} h={0.3} r={0.1} m={d.ceramicDark} neck={0.4} />,
    <Vase key="v2" x={sx} z={A0 + 1.2} y={0.9 + T / 2} h={0.18} r={0.08} m={d.earth} />,
    <Books key="b2" x={sx} z={A0 + 0.35} y={0.9 + T / 2} n={2} w={0.24} dpt={0.18} alongX={false} />,
    <Vase key="v3" x={sx} z={A0 + 0.2} y={1.35 + T / 2} h={0.14} r={0.07} m={d.ceramic} />,
    <Vase key="v4" x={sx} z={A0 + 1.2} y={1.35 + T / 2} h={0.34} r={0.09} m={d.ceramic} neck={0.35} />,
    <Books key="b3" x={sx} z={A0 + 1.1} y={1.8 + T / 2} n={3} w={0.22} dpt={0.17} alongX={false} />,
    <Vase key="v5" x={sx} z={A0 + 0.35} y={1.8 + T / 2} h={0.2} r={0.075} m={d.ceramicDark} />,
    // niche: tea tray with cups + kettle
    <B key="tray" x0={w.x0 + 0.08} x1={face - 0.05} y0={nicheBottom} y1={nicheBottom + 0.02} z0={B0 + 0.2} z1={B0 + 0.62} m={d.woodDark} />,
    ...[0.28, 0.4, 0.52].map((z) => <Cyl key={`c${z}`} x={sx} z={B0 + z} y0={nicheBottom + 0.02} y1={nicheBottom + 0.07} r={0.03} rTop={0.035} m={d.ceramic} />),
    <Vase key="kettle" x={sx} z={B0 + 0.85} y={nicheBottom} h={0.2} r={0.085} m={d.ceramicDark} neck={0.5} />,
  ]
  return (
    <group>
      {pieces}
      {styling}
      <Lamp x={face + 0.15} y={nicheTop - 0.08} z={(B0 + B1) / 2} evening={0.45} distance={1.5} minor />
      <Downlight x={1.0} z={4.2} />
      <Downlight x={1.0} z={5.4} />
    </group>
  )
}
