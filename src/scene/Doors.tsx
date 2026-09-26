import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { dimensions } from '../data/dimensions'
import { doorLeaves, walls, type DoorLeaf, type Opening } from '../data/floorplan'
import { materials } from '../materials/materials'
import { rectCenter } from './geometry'
import { openness, toggleDoor, useDoorState } from './doorState'

const { height, leafThickness: t, frameWidth: fw, frameProud, handleHeight } = dimensions.doors
const leafH = height - 0.01

/** Wall opening for each leaf: `leaf-bed1` sits in opening `door-bed1`, etc. */
const doorOpenings: Record<string, Opening> = Object.fromEntries(
  walls.flatMap((w) => w.openings ?? []).filter((o) => o.kind === 'door').map((o) => [`leaf-${o.id.slice(5)}`, o]),
)

/** Rotation about +y that points the leaf's local +x along plan direction (dx, dz). */
const angleOf = ([dx, dz]: [number, number]) => Math.atan2(-dz, dx)

/** Door leaves (click to open / close) plus frames around every door opening. */
export function Doors() {
  const open = useDoorState()
  return (
    <group>
      {doorLeaves.map((d) => (
        <Leaf key={d.id} door={d} open={open[d.id]} />
      ))}
      <Frames />
    </group>
  )
}

function Leaf({ door, open }: { door: DoorLeaf; open: boolean }) {
  const m = materials()
  const pivot = useRef<THREE.Group>(null!)
  const closedA = angleOf(door.closedDir)
  // take the short (90°) way round between closed and open
  let openA = angleOf(door.openDir)
  while (openA - closedA > Math.PI) openA -= 2 * Math.PI
  while (openA - closedA < -Math.PI) openA += 2 * Math.PI

  useFrame((_, dt) => {
    const target = open ? 1 : 0
    const cur = openness[door.id]
    const next = cur + Math.sign(target - cur) * Math.min(Math.abs(target - cur), dt * 1.6)
    openness[door.id] = next
    const s = next * next * (3 - 2 * next) // ease in/out
    pivot.current.rotation.y = closedA + (openA - closedA) * s
  })

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    // ignore the click that ends a look/orbit drag
    if (e.delta > 4) return
    e.stopPropagation()
    toggleDoor(door.id)
  }

  // Leaf spans between the two jambs of its opening (closedDir is always +x or +z).
  const o = doorOpenings[door.id]
  const axis = door.closedDir[0] !== 0 ? 0 : 1
  const gap = 0.003
  const x0 = o ? o.from + fw + gap - door.hinge[axis] : 0
  const x1 = o ? o.to - fw - gap - door.hinge[axis] : door.width
  const w = x1 - x0
  const hx = x1 - 0.07 // handle position along the leaf
  return (
    <group position={[door.hinge[0], 0, door.hinge[1]]} ref={pivot}>
      <group
        onClick={onClick}
        onPointerOver={(e) => (e.stopPropagation(), (document.body.style.cursor = 'pointer'))}
        onPointerOut={() => (document.body.style.cursor = '')}
      >
        <mesh position={[x0 + w / 2, leafH / 2, 0]} material={door.color === 'main' ? m.doorMain : m.doorInterior} castShadow receiveShadow>
          <boxGeometry args={[w, leafH, t]} />
        </mesh>
        {[1, -1].map((side) => (
          <group key={side} position={[hx, handleHeight, side * (t / 2)]}>
            {/* rose */}
            <mesh rotation-x={Math.PI / 2} position={[0, 0, side * 0.005]} material={m.stainless}>
              <cylinderGeometry args={[0.026, 0.026, 0.01, 20]} />
            </mesh>
            {/* spindle */}
            <mesh rotation-x={Math.PI / 2} position={[0, 0, side * 0.03]} material={m.stainless}>
              <cylinderGeometry args={[0.009, 0.009, 0.05, 12]} />
            </mesh>
            {/* lever, pointing back toward the hinge */}
            <mesh position={[-0.06, 0, side * 0.055]} material={m.stainless} castShadow>
              <boxGeometry args={[0.13, 0.018, 0.018]} />
            </mesh>
          </group>
        ))}
        {door.color === 'main' && (
          // door viewer (peephole) on the main door
          <mesh rotation-x={Math.PI / 2} position={[x0 + w / 2, 1.55, 0]} material={m.stainless}>
            <cylinderGeometry args={[0.012, 0.012, t + 0.01, 16]} />
          </mesh>
        )}
      </group>
    </group>
  )
}

/** Jamb + head lining inside each door opening, slightly proud of both wall faces. */
function Frames() {
  const m = materials()
  const pieces: { key: string; pos: [number, number, number]; size: [number, number, number] }[] = []
  for (const wall of walls) {
    const alongX = wall.x1 - wall.x0 >= wall.z1 - wall.z0
    const [cx, cz] = rectCenter(wall)
    const depth = (alongX ? wall.z1 - wall.z0 : wall.x1 - wall.x0) + 2 * frameProud
    for (const o of wall.openings ?? []) {
      if (o.kind !== 'door') continue
      const at = (a: number, y: number): [number, number, number] => (alongX ? [a, y, cz] : [cx, y, a])
      const box = (len: number, h: number): [number, number, number] => (alongX ? [len, h, depth] : [depth, h, len])
      const top = o.top
      pieces.push({ key: `${o.id}-jamb-a`, pos: at(o.from + fw / 2, top / 2), size: box(fw, top) })
      pieces.push({ key: `${o.id}-jamb-b`, pos: at(o.to - fw / 2, top / 2), size: box(fw, top) })
      pieces.push({ key: `${o.id}-head`, pos: at((o.from + o.to) / 2, top - fw / 2), size: box(o.to - o.from, fw) })
    }
  }
  return (
    <group>
      {pieces.map((p) => (
        <mesh key={p.key} position={p.pos} material={m.doorFrame} castShadow receiveShadow>
          <boxGeometry args={p.size} />
        </mesh>
      ))}
    </group>
  )
}
