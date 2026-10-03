/** Master bedroom, bathroom, and the Bedroom 2 studio / workshop. */
import { dimensions as D } from '../data/dimensions'
import { materials } from '../materials/materials'
import { designMaterials } from './designMaterials'
import { layout } from './layout'
import { useMemo } from 'react'
import * as THREE from 'three'
import { AirCon, B, Cyl, Downlight, Lamp, Legs4, Mirror, PaperGlobe, RomanBlind, Soft, Vase } from './primitives'
import { PhModel } from './zen'

const { x: X, z: Z } = D

// ------------------------------------------------------------------ master bedroom
/**
 * Queen bed in its own frame: headboard at local z = 0, bed runs towards +z, centred on x = 0.
 * Placed with the headboard against the east wall.
 */
function QueenBed() {
  const d = designMaterials()
  const { bed: b, mattress: mt } = layout.master
  const L = b.x1 - b.x0 // 2.05
  const W = b.z1 - b.z0 // 1.62
  const hw = W / 2
  const my = 0.54 // mattress top
  const mz0 = 0.12
  const mz1 = mz0 + mt.l
  const cols = 6
  const cw = (W + 0.1) / cols
  return (
    <group>
      {/* walnut frame on splayed tapered legs */}
      <Legs4 x0={-hw} x1={hw} z0={0.08} z1={L} top={0.16} inset={0.08} splay={0.03} r={0.026} />
      <B x0={-hw} x1={hw} y0={0.16} y1={0.3} z0={0.08} z1={L} m={d.wood} />
      {/* channel-tufted forest green velvet headboard on a walnut base rail */}
      <B x0={-hw - 0.05} x1={hw + 0.05} y0={0.16} y1={0.3} z0={0} z1={0.1} m={d.wood} />
      {Array.from({ length: cols }, (_, i) => (
        <Soft key={i} x0={-hw - 0.05 + i * cw + 0.004} x1={-hw - 0.05 + (i + 1) * cw - 0.004} y0={0.3} y1={b.h} z0={0} z1={0.1} m={d.taupe} r={0.045} />
      ))}
      <Soft x0={-mt.w / 2} x1={mt.w / 2} y0={0.3} y1={my} z0={mz0} z1={mz1} m={d.linen} r={0.05} />
      {/* duvet with soft edges spilling over the sides and foot, folded band at the top */}
      <Soft x0={-mt.w / 2 - 0.05} x1={mt.w / 2 + 0.05} y0={0.36} y1={my + 0.06} z0={mz0 + 0.5} z1={mz1 + 0.05} m={d.linen} r={0.05} />
      <Soft x0={-mt.w / 2 - 0.05} x1={mt.w / 2 + 0.05} y0={my + 0.04} y1={my + 0.09} z0={mz0 + 0.5} z1={mz0 + 0.78} m={d.cream} r={0.025} />
      {[-0.37, 0.37].map((x) => (
        <Soft key={x} x0={x - 0.33} x1={x + 0.33} y0={my} y1={my + 0.15} z0={mz0 + 0.04} z1={mz0 + 0.42} m={d.linen} r={0.06} rot={[-0.3, 0, 0]} />
      ))}
      <Soft x0={-0.22} x1={0.22} y0={my + 0.06} y1={my + 0.37} z0={mz0 + 0.33} z1={mz0 + 0.45} m={d.sand} r={0.05} rot={[-0.35, 0, 0]} />
      {/* knit throw over one corner of the foot */}
      <Soft x0={0.05} x1={mt.w / 2 + 0.07} y0={my + 0.06} y1={my + 0.09} z0={mz1 - 0.55} z1={mz1 - 0.1} m={d.wool} r={0.012} />
      <Soft x0={mt.w / 2 + 0.05} x1={mt.w / 2 + 0.08} y0={0.33} y1={my + 0.09} z0={mz1 - 0.55} z1={mz1 - 0.1} m={d.wool} r={0.01} />
    </group>
  )
}

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

      <group position={[wallX, 0, bz]} rotation-y={-Math.PI / 2}>
        <QueenBed />
      </group>

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
      <PhModel id="potted_plant_04" position={[v.x1 - 0.08, top, v.z0 + 0.1]} scale={0.8} />

      {/* one long horizontal mirror, floating 3 cm off the wall with a warm back-glow */}
      <B x0={mr.x0 + 0.03} x1={mr.x1 - 0.03} y0={mr.y0 + 0.03} y1={mr.y1 - 0.03} z0={wallZ - 0.03} z1={wallZ - 0.001} m={d.charcoal} />
      <B x0={mr.x0 + 0.02} x1={mr.x1 - 0.02} y0={mr.y0 + 0.02} y1={mr.y1 - 0.02} z0={wallZ - 0.018} z1={wallZ - 0.012} m={d.lightStrip} shadow={false} />
      <Mirror geometry={mirrorGeo} position={[(mr.x0 + mr.x1) / 2, (mr.y0 + mr.y1) / 2, wallZ - 0.031]} rotationY={Math.PI} />
      <Lamp x={(mr.x0 + mr.x1) / 2} y={mr.y0 + 0.2} z={wallZ - 0.3} evening={0.5} distance={1.8} minor />

      {/* existing shower screen: hinged glass door → pull handle on both sides */}
      {[-1, 1].map((s) => (
        <B key={s} x0={glassX + s * 0.035 - 0.006} x1={glassX + s * 0.035 + 0.006} y0={0.85} y1={1.3} z0={Z.corridorNorth + 0.2} z1={Z.corridorNorth + 0.212} m={m.stainless} />
      ))}
      {/* towel on a brass hook rail beside the door */}
      <B x0={X.bathWestE} x1={X.bathWestE + 0.04} y0={1.36} y1={1.38} z0={4.02} z1={4.4} m={d.bronze} />
      <Soft x0={X.bathWestE + 0.005} x1={X.bathWestE + 0.04} y0={0.85} y1={1.37} z0={4.06} z1={4.34} m={d.cream} r={0.012} />
      <Downlight x={5.0} z={3.75} />
    </group>
  )
}

// ------------------------------------------------------------------ studio / workshop
/** Small desktop 6-axis robot arm, shown in a fixed pose. */
function RobotArm({ x, z, y, yaw, a1, a2, a3, accent }: { x: number; z: number; y: number; yaw: number; a1: number; a2: number; a3: number; accent: boolean }) {
  const d = designMaterials()
  const body = accent ? d.robotAccent : d.robotWhite
  const joint = accent ? d.charcoal : d.robotAccent
  return (
    <group position={[x, y, z]} rotation-y={yaw}>
      <mesh position-y={0.02} material={d.charcoal} castShadow>
        <cylinderGeometry args={[0.075, 0.08, 0.04, 32]} />
      </mesh>
      <mesh position-y={0.075} material={body} castShadow>
        <cylinderGeometry args={[0.05, 0.055, 0.07, 32]} />
      </mesh>
      <group position-y={0.12} rotation-z={a1}>
        <mesh material={joint} castShadow>
          <sphereGeometry args={[0.042, 24, 16]} />
        </mesh>
        <mesh position-y={0.13} material={body} castShadow>
          <capsuleGeometry args={[0.024, 0.22, 6, 16]} />
        </mesh>
        <group position-y={0.26} rotation-z={a2}>
          <mesh material={joint} castShadow>
            <sphereGeometry args={[0.035, 24, 16]} />
          </mesh>
          <mesh position-y={0.11} material={body} castShadow>
            <capsuleGeometry args={[0.019, 0.19, 6, 16]} />
          </mesh>
          <group position-y={0.22} rotation-z={a3}>
            <mesh position-y={0.02} material={joint} castShadow>
              <cylinderGeometry args={[0.022, 0.022, 0.04, 16]} />
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

const meshBack = new THREE.MeshStandardMaterial({ color: '#2b2d30', roughness: 0.8, transparent: true, opacity: 0.82, side: THREE.DoubleSide })

/** Ergonomic task chair: 5-star base on casters, gas lift, mesh back with lumbar + headrest, adjustable arms. Faces +z. */
function Chair({ x, z }: { x: number; z: number }) {
  const d = designMaterials()
  const seatY = 0.47
  return (
    <group position={[x, 0, z]} rotation-y={0.25}>
      {/* 5-star base with casters */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <group key={i} rotation-y={a}>
            <mesh position={[0.15, 0.085, 0]} rotation-z={0.12} material={d.blackMetal} castShadow>
              <boxGeometry args={[0.3, 0.03, 0.045]} />
            </mesh>
            <mesh position={[0.3, 0.03, 0]} material={d.charcoal} castShadow>
              <sphereGeometry args={[0.03, 16, 12]} />
            </mesh>
          </group>
        )
      })}
      <Cyl x={0} z={0} y0={0.08} y1={0.13} r={0.05} m={d.blackMetal} />
      <Cyl x={0} z={0} y0={0.13} y1={seatY - 0.05} r={0.022} m={d.bronze} seg={16} />
      <B x0={-0.12} x1={0.12} y0={seatY - 0.06} y1={seatY - 0.03} z0={-0.12} z1={0.12} m={d.blackMetal} />
      {/* contoured seat */}
      <Soft x0={-0.25} x1={0.25} y0={seatY - 0.03} y1={seatY + 0.05} z0={-0.22} z1={0.25} m={d.charcoal} r={0.035} />
      {/* back support spine + mesh back, slightly reclined */}
      <mesh position={[0, seatY + 0.12, -0.26]} rotation-x={-0.25} material={d.blackMetal} castShadow>
        <boxGeometry args={[0.06, 0.28, 0.025]} />
      </mesh>
      {/* curved mesh panel: an arc of a 0.42 m-radius cylinder whose axis sits in front of the back */}
      <group position={[0, seatY + 0.42, -0.3 + 0.42]} rotation-x={-0.12}>
        <mesh material={meshBack} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.55, 32, 1, true, Math.PI - 0.6, 1.2]} />
        </mesh>
      </group>
      {/* lumbar pad */}
      <Soft x0={-0.14} x1={0.14} y0={seatY + 0.2} y1={seatY + 0.3} z0={-0.29} z1={-0.24} m={d.charcoal} r={0.02} />
      {/* headrest */}
      <Soft x0={-0.14} x1={0.14} y0={seatY + 0.76} y1={seatY + 0.9} z0={-0.4} z1={-0.33} m={d.charcoal} r={0.025} rot={[-0.2, 0, 0]} />
      <mesh position={[0, seatY + 0.72, -0.36]} material={d.blackMetal}>
        <boxGeometry args={[0.03, 0.12, 0.02]} />
      </mesh>
      {/* adjustable arms */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.27, seatY + 0.1, -0.02]} material={d.blackMetal} castShadow>
            <boxGeometry args={[0.03, 0.22, 0.05]} />
          </mesh>
          <Soft x0={s * 0.27 - 0.04} x1={s * 0.27 + 0.04} y0={seatY + 0.2} y1={seatY + 0.235} z0={-0.14} z1={0.14} m={d.charcoal} r={0.012} />
        </group>
      ))}
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
            <Cyl x={x} z={z} y0={0.05} y1={c.h} r={0.008} m={d.blackMetal} seg={8} />
            <mesh position={[x, 0.025, z]} material={d.charcoal}>
              <sphereGeometry args={[0.025, 12, 8]} />
            </mesh>
          </group>
        )),
      )}
      {trays.map((y) => (
        <group key={y}>
          <B x0={c.x0} x1={c.x1} y0={y} y1={y + 0.01} z0={c.z0} z1={c.z1} m={d.blackMetal} />
          <B x0={c.x0} x1={c.x1} y0={y} y1={y + 0.06} z0={c.z0} z1={c.z0 + 0.006} m={d.blackMetal} />
          <B x0={c.x0} x1={c.x1} y0={y} y1={y + 0.06} z0={c.z1 - 0.006} z1={c.z1} m={d.blackMetal} />
        </group>
      ))}
      {/* parts bins, filament spool, tool roll, spare servo boxes */}
      <B x0={c.x0 + 0.03} x1={cx - 0.01} y0={0.13} y1={0.25} z0={c.z0 + 0.03} z1={c.z1 - 0.03} m={d.woodLight} />
      <B x0={cx + 0.01} x1={c.x1 - 0.03} y0={0.13} y1={0.22} z0={c.z0 + 0.03} z1={c.z1 - 0.03} m={d.earth} />
      <Cyl x={cx - 0.08} z={cz} y0={0.45} y1={0.53} r={0.07} m={d.robotAccent} />
      <Cyl x={cx + 0.1} z={cz} y0={0.45} y1={0.5} r={0.05} m={d.charcoal} />
      <Soft x0={c.x0 + 0.04} x1={c.x1 - 0.04} y0={c.h - 0.01} y1={c.h + 0.05} z0={c.z0 + 0.06} z1={c.z1 - 0.06} m={d.sand} r={0.02} />
    </group>
  )
}

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

/** Sofa bed (daybed style): single mattress on a wood frame, back cushions, bolsters, pull-out trundle. */
function SofaBed() {
  const d = designMaterials()
  const s = layout.studio.sofaBed // back against the wall at z0, faces +z
  const baseTop = 0.32
  const matTop = 0.5
  const cx = (s.x0 + s.x1) / 2
  const third = (s.x1 - s.x0 - 0.36) / 3
  return (
    <group>
      <B x0={s.x0 + 0.05} x1={s.x1 - 0.05} y0={0} y1={0.06} z0={s.z0 + 0.05} z1={s.z1 - 0.05} m={d.charcoal} />
      <B x0={s.x0} x1={s.x1} y0={0.06} y1={baseTop} z0={s.z0} z1={s.z1} m={d.wood} />
      {/* trundle front (pulls out into a second mattress) with two brass pulls */}
      <B x0={s.x0 + 0.04} x1={s.x1 - 0.04} y0={0.09} y1={baseTop - 0.03} z0={s.z1} z1={s.z1 + 0.003} m={d.woodDark} />
      {[cx - 0.4, cx + 0.4].map((x) => (
        <B key={x} x0={x - 0.08} x1={x + 0.08} y0={0.2} y1={0.212} z0={s.z1 + 0.003} z1={s.z1 + 0.02} m={d.bronze} />
      ))}
      {/* mattress + fitted cover */}
      <Soft x0={s.x0 + 0.02} x1={s.x1 - 0.02} y0={baseTop} y1={matTop} z0={s.z0 + 0.02} z1={s.z1 - 0.01} m={d.cream} r={0.05} />
      {/* three back cushions against the wall */}
      {[0, 1, 2].map((i) => (
        <Soft key={i} x0={s.x0 + 0.18 + i * third + 0.01} x1={s.x0 + 0.18 + (i + 1) * third - 0.01} y0={matTop - 0.02} y1={s.h} z0={s.z0 + 0.03} z1={s.z0 + 0.22} m={d.linen} r={0.07} rot={[-0.12, 0, 0]} />
      ))}
      {/* bolsters at each end */}
      {[s.x0 + 0.1, s.x1 - 0.1].map((x) => (
        <mesh key={x} position={[x, matTop + 0.09, (s.z0 + s.z1) / 2]} rotation-x={Math.PI / 2} material={d.sand} castShadow>
          <capsuleGeometry args={[0.09, 0.5, 8, 24]} />
        </mesh>
      ))}
      <Soft x0={cx + 0.1} x1={cx + 0.5} y0={matTop} y1={matTop + 0.32} z0={s.z0 + 0.22} z1={s.z0 + 0.34} m={d.taupe} r={0.05} rot={[-0.3, 0, 0]} />
      {/* folded guest blanket + pillow */}
      <Soft x0={s.x0 + 0.3} x1={s.x0 + 0.78} y0={matTop} y1={matTop + 0.08} z0={s.z1 - 0.42} z1={s.z1 - 0.08} m={d.wool} r={0.02} />
      <Soft x0={s.x0 + 0.32} x1={s.x0 + 0.76} y0={matTop + 0.08} y1={matTop + 0.16} z0={s.z1 - 0.4} z1={s.z1 - 0.12} m={d.linen} r={0.035} />
    </group>
  )
}

export function Studio() {
  const d = designMaterials()
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
      <RobotArm x={k.x1 - 0.35} z={k.z1 - 0.2} y={top} yaw={-0.6} a1={0.5} a2={1.3} a3={0.6} accent={false} />
      <RobotArm x={k.x0 + 0.3} z={k.z1 - 0.18} y={top} yaw={0.4} a1={0.25} a2={-0.9} a3={-0.7} accent />
      {/* laptop */}
      <B x0={chx - 0.16} x1={chx + 0.16} y0={top} y1={top + 0.015} z0={k.z0 + 0.12} z1={k.z0 + 0.34} m={d.charcoal} />
      <mesh position={[chx, top + 0.11, k.z0 + 0.35]} rotation-x={-0.25} material={d.screen}>
        <boxGeometry args={[0.32, 0.21, 0.008]} />
      </mesh>
      {/* architect task lamp */}
      <Cyl x={chx + 0.55} z={k.z1 - 0.12} y0={top} y1={top + 0.02} r={0.07} m={d.blackMetal} />
      <mesh position={[chx + 0.55, top + 0.22, k.z1 - 0.2]} rotation-x={-0.35} material={d.blackMetal}>
        <cylinderGeometry args={[0.006, 0.006, 0.42, 8]} />
      </mesh>
      <mesh position={[chx + 0.55, top + 0.4, k.z1 - 0.36]} rotation-x={0.9} material={d.blackMetal}>
        <coneGeometry args={[0.07, 0.12, 24, 1, true]} />
      </mesh>
      <Lamp x={chx + 0.55} y={top + 0.3} z={k.z1 - 0.42} evening={0.6} distance={2} />
      <Chair x={chx} z={chz} />
      <Cart />
      <SofaBed />
      <PhModel id="potted_plant_02" position={[layout.studio.plant[0] - 0.05, 0, layout.studio.plant[1] - 0.05]} scale={1.1} />
      <RomanBlind a0={win.z0} a1={win.z1} at={X.eastInner - 0.03} top={win.head} drop={0.38} alongX={false} />
      <AirCon x={X.eastInner} z={(win.z0 + win.z1) / 2} y={2.4} face="x-" />
      <Downlight x={4.2} z={5.85} />
      <Downlight x={5.6} z={5.85} />
    </group>
  )
}
