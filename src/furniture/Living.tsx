/** Living room (window seat, 2-seater, no TV wall) + dining-side shelving. */
import type { ReactNode } from 'react'
import { designMaterials } from './designMaterials'
import { layout } from './layout'
import { B, Cyl, Lantern, Plant, Vase } from './primitives'

function WindowSeat() {
  const d = designMaterials()
  const s = layout.living.windowSeat
  const drawers = [1, 2].map((i) => s.x0 + ((s.x1 - s.x0) * i) / 3)
  const pillows: [number, (typeof d)['oatmeal']][] = [
    [0.55, d.oatmeal],
    [1.05, d.sage],
    [2.4, d.clay],
  ]
  return (
    <group>
      <B x0={s.x0} x1={s.x1} y0={0.06} y1={s.h} z0={s.z0} z1={s.z1} m={d.oak} />
      <B x0={s.x0} x1={s.x1} y0={0} y1={0.06} z0={s.z0} z1={s.z1 - 0.05} m={d.charcoal} />
      {drawers.map((x) => (
        <B key={x} x0={x - 0.002} x1={x + 0.002} y0={0.06} y1={s.h} z0={s.z1 - 0.001} z1={s.z1 + 0.002} m={d.charcoal} shadow={false} />
      ))}
      {/* linen seat cushion */}
      <B x0={s.x0 + 0.02} x1={s.x1 - 0.02} y0={s.h} y1={s.h + 0.08} z0={s.z0 + 0.03} z1={s.z1 - 0.01} m={d.linen} />
      {/* scatter cushions leaning on the glass */}
      {pillows.map(([x, m]) => (
        <mesh key={x} position={[x, s.h + 0.26, s.z0 + 0.12]} rotation-x={-0.25} material={m} castShadow>
          <boxGeometry args={[0.45, 0.4, 0.12]} />
        </mesh>
      ))}
      {/* a book and a cup on the seat */}
      <B x0={1.7} x1={1.92} y0={s.h + 0.08} y1={s.h + 0.11} z0={s.z1 - 0.3} z1={s.z1 - 0.1} m={d.book[1]} />
      <Cyl x={2.05} z={s.z1 - 0.15} y0={s.h + 0.08} y1={s.h + 0.17} r={0.04} m={d.ceramic} />
    </group>
  )
}

function Loveseat() {
  const d = designMaterials()
  const s = layout.living.loveseat // faces -z (the window)
  const arm = 0.14
  const mid = (s.x0 + s.x1) / 2
  const legs = [s.x0 + 0.06, s.x1 - 0.06].flatMap((x) => [s.z0 + 0.06, s.z1 - 0.06].map((z) => [x, z]))
  return (
    <group>
      {legs.map(([x, z]) => (
        <Cyl key={`${x}${z}`} x={x} z={z} y0={0} y1={0.12} r={0.02} m={d.oak} seg={8} />
      ))}
      <B x0={s.x0} x1={s.x1} y0={0.12} y1={0.36} z0={s.z0} z1={s.z1} m={d.oatmeal} />
      <B x0={s.x0} x1={s.x0 + arm} y0={0.36} y1={0.6} z0={s.z0} z1={s.z1} m={d.oatmeal} />
      <B x0={s.x1 - arm} x1={s.x1} y0={0.36} y1={0.6} z0={s.z0} z1={s.z1} m={d.oatmeal} />
      <B x0={s.x0 + arm} x1={s.x1 - arm} y0={0.36} y1={s.h} z0={s.z1 - 0.2} z1={s.z1} m={d.oatmeal} />
      {/* two seat cushions */}
      {[
        [s.x0 + arm, mid],
        [mid, s.x1 - arm],
      ].map(([a, b]) => (
        <B key={a} x0={a + 0.005} x1={b - 0.005} y0={0.36} y1={0.46} z0={s.z0 + 0.02} z1={s.z1 - 0.2} m={d.oatmeal} />
      ))}
      <mesh position={[s.x0 + 0.35, 0.62, s.z1 - 0.26]} rotation={[0.2, 0.3, 0]} material={d.sage} castShadow>
        <boxGeometry args={[0.4, 0.38, 0.12]} />
      </mesh>
      {/* folded clay throw over one arm */}
      <B x0={s.x1 - arm - 0.02} x1={s.x1 + 0.01} y0={0.35} y1={0.62} z0={s.z0 + 0.25} z1={s.z0 + 0.6} m={d.clay} />
    </group>
  )
}

function CoffeeTable() {
  const d = designMaterials()
  const t = layout.living.coffeeTable
  return (
    <group>
      <Cyl x={t.cx} z={t.cz} y0={t.h - 0.05} y1={t.h} r={t.r} m={d.oak} seg={40} />
      {[0, 1, 2].map((i) => {
        const a = (i * Math.PI * 2) / 3
        return <Cyl key={i} x={t.cx + Math.cos(a) * t.r * 0.6} z={t.cz + Math.sin(a) * t.r * 0.6} y0={0} y1={t.h - 0.05} r={0.035} m={d.oak} seg={10} />
      })}
      <B x0={t.cx - 0.15} x1={t.cx + 0.1} y0={t.h} y1={t.h + 0.03} z0={t.cz - 0.1} z1={t.cz + 0.08} m={d.book[2]} />
      <B x0={t.cx - 0.13} x1={t.cx + 0.08} y0={t.h + 0.03} y1={t.h + 0.055} z0={t.cz - 0.08} z1={t.cz + 0.06} m={d.book[3]} />
      <Vase x={t.cx + 0.14} z={t.cz + 0.1} y={t.h} h={0.12} r={0.06} m={d.clay} />
    </group>
  )
}

function Credenza() {
  const d = designMaterials()
  const c = layout.living.credenza
  const x = c.x0 - 0.001
  return (
    <group>
      {[c.z0 + 0.05, c.z1 - 0.05].map((z) => (
        <B key={z} x0={c.x0 + 0.05} x1={c.x1 - 0.05} y0={0} y1={0.1} z0={z - 0.02} z1={z + 0.02} m={d.oak} />
      ))}
      <B x0={c.x0} x1={c.x1} y0={0.1} y1={c.h} z0={c.z0} z1={c.z1} m={d.oak} />
      <B x0={x - 0.002} x1={x + 0.002} y0={0.12} y1={c.h - 0.02} z0={(c.z0 + c.z1) / 2 - 0.002} z1={(c.z0 + c.z1) / 2 + 0.002} m={d.charcoal} shadow={false} />
      {/* ceramics + a branch in a tall vase */}
      <Vase x={c.x1 - 0.2} z={c.z0 + 0.25} y={c.h} h={0.4} r={0.09} m={d.ceramic} />
      <mesh position={[c.x1 - 0.2, c.h + 0.62, c.z0 + 0.28]} rotation-z={0.2} material={d.oak}>
        <cylinderGeometry args={[0.004, 0.006, 0.55, 5]} />
      </mesh>
      <Vase x={c.x1 - 0.2} z={c.z0 + 0.5} y={c.h} h={0.18} r={0.08} m={d.clay} />
      <B x0={c.x0 + 0.08} x1={c.x1 - 0.06} y0={c.h} y1={c.h + 0.05} z0={c.z1 - 0.45} z1={c.z1 - 0.15} m={d.book[4]} />
    </group>
  )
}

function WallArt() {
  const d = designMaterials()
  const a = layout.living.art
  const x = layout.living.credenza.x1 - 0.015 // on the partition wall above the sideboard
  return (
    <group>
      <B x0={x - 0.02} x1={x} y0={a.y0} y1={a.y1} z0={a.z0} z1={a.z1} m={d.oakPale} />
      {/* abstract earth-tone composition */}
      <B x0={x - 0.022} x1={x - 0.02} y0={a.y0 + 0.08} y1={a.y1 - 0.25} z0={a.z0 + 0.1} z1={a.z0 + 0.55} m={d.artA} shadow={false} />
      <mesh position={[x - 0.022, a.y0 + 0.42, a.z1 - 0.3]} rotation-y={-Math.PI / 2} material={d.artB}>
        <circleGeometry args={[0.16, 32]} />
      </mesh>
    </group>
  )
}

function FloorLamp() {
  const d = designMaterials()
  const [x, z] = layout.living.floorLamp
  return (
    <group>
      <Cyl x={x} z={z} y0={0} y1={0.02} r={0.14} m={d.charcoal} />
      <Cyl x={x} z={z} y0={0.02} y1={1.2} r={0.008} m={d.charcoal} seg={6} />
      <Cyl x={x} z={z} y0={1.2} y1={1.62} r={0.17} rTop={0.15} m={d.paper} />
      <pointLight position={[x, 1.4, z]} color="#ffcf98" intensity={0.3} distance={2.5} decay={2} />
    </group>
  )
}

function Shelving() {
  const d = designMaterials()
  const s = layout.living.shelf
  const levels = [0.05, 0.45, 0.85, 1.25, 1.65]
  const books: ReactNode[] = []
  levels.slice(0, 4).forEach((y, li) => {
    let z = s.z0 + 0.06 + li * 0.07
    for (let i = 0; i < 8 && z < s.z1 - 0.5; i++) {
      const w = 0.025 + ((i * 13 + li * 7) % 4) * 0.008
      const h = 0.22 + ((i * 5 + li) % 3) * 0.04
      books.push(<B key={`${li}-${i}`} x0={s.x0 + 0.04} x1={s.x1 - 0.06} y0={y + 0.02} y1={y + 0.02 + h} z0={z} z1={z + w} m={d.book[(i + li) % d.book.length]} />)
      z += w + 0.004
    }
  })
  return (
    <group>
      {[s.z0, s.z1 - 0.025].map((z) => (
        <B key={z} x0={s.x0} x1={s.x1} y0={0} y1={s.h} z0={z} z1={z + 0.025} m={d.oak} />
      ))}
      {levels.map((y) => (
        <B key={y} x0={s.x0} x1={s.x1} y0={y} y1={y + 0.02} z0={s.z0} z1={s.z1} m={d.oak} />
      ))}
      {books}
      <Vase x={(s.x0 + s.x1) / 2} z={s.z1 - 0.25} y={0.87} h={0.2} r={0.07} m={d.clay} />
      <Vase x={(s.x0 + s.x1) / 2} z={s.z1 - 0.25} y={1.27} h={0.14} r={0.08} />
      <Vase x={(s.x0 + s.x1) / 2} z={s.z0 + 0.4} y={1.67} h={0.12} r={0.06} m={d.pot} />
    </group>
  )
}

export function Living() {
  const d = designMaterials()
  const r = layout.living.rug
  const t = layout.living.coffeeTable
  return (
    <group>
      <B x0={r.x0} x1={r.x1} y0={0.001} y1={0.012} z0={r.z0} z1={r.z1} m={d.jute} shadow={false} />
      <WindowSeat />
      <Loveseat />
      <CoffeeTable />
      <Credenza />
      <WallArt />
      <FloorLamp />
      <Plant x={layout.living.plant[0]} z={layout.living.plant[1]} h={1.5} />
      <Lantern x={t.cx} z={t.cz} bottom={1.9} r={0.28} light={0.5} />
      <Shelving />
    </group>
  )
}
