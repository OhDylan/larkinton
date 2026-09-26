import { dimensions } from '../data/dimensions'
import { walls, type Opening, type Wall } from '../data/floorplan'
import { materials } from '../materials/materials'

const { frameDepth: FD, frameWidth: FW } = dimensions.windows

/** Aluminium window: outer frame, column mullions, optional transom/bottom rows, single glass pane. */
function WindowUnit({ wall, o }: { wall: Wall; o: Opening }) {
  const m = materials()
  const style = o.window!
  const alongX = wall.x1 - wall.x0 >= wall.z1 - wall.z0
  const width = o.to - o.from
  const height = o.top - o.bottom
  const mid = (o.from + o.to) / 2
  const pos: [number, number, number] = alongX
    ? [mid, o.bottom + height / 2, (wall.z0 + wall.z1) / 2]
    : [(wall.x0 + wall.x1) / 2, o.bottom + height / 2, mid]

  // [PHOTO] transom ≈ 20% of height; living room bottom row ≈ 15%
  const bars: { x: number; y: number; w: number; h: number }[] = [
    { x: 0, y: height / 2 - FW / 2, w: width, h: FW },
    { x: 0, y: -height / 2 + FW / 2, w: width, h: FW },
    { x: -width / 2 + FW / 2, y: 0, w: FW, h: height },
    { x: width / 2 - FW / 2, y: 0, w: FW, h: height },
  ]
  for (let i = 1; i < style.cols; i++) bars.push({ x: -width / 2 + (width * i) / style.cols, y: 0, w: FW * 0.8, h: height })
  if (style.transom) bars.push({ x: 0, y: height / 2 - height * 0.2, w: width, h: FW * 0.8 })
  if (style.bottomRow) bars.push({ x: 0, y: -height / 2 + height * 0.15, w: width, h: FW * 0.8 })

  return (
    <group position={pos} rotation={[0, alongX ? 0 : Math.PI / 2, 0]}>
      {bars.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, 0]} material={m.frame} castShadow>
          <boxGeometry args={[b.w, b.h, FD]} />
        </mesh>
      ))}
      <mesh material={m.glass}>
        <planeGeometry args={[width - FW, height - FW]} />
      </mesh>
    </group>
  )
}

export function Windows() {
  return (
    <group>
      {walls.flatMap((w) =>
        (w.openings ?? []).filter((o) => o.kind === 'window').map((o) => <WindowUnit key={o.id} wall={w} o={o} />),
      )}
    </group>
  )
}
