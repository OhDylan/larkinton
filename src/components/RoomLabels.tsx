import { Html } from '@react-three/drei'
import type { RefObject } from 'react'
import { rooms } from '../data/floorplan'

/** `layer` = a stable DOM container outside the canvas (avoids drei Html re-mounting its roots). */
export function RoomLabels({ height, layer }: { height: number; layer: RefObject<HTMLDivElement> }) {
  return (
    <group>
      {rooms.map((r) => (
        <Html key={r.id} position={[r.at[0], height, r.at[1]]} portal={layer} center zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
          <div className={r.secondary ? 'room-label secondary' : 'room-label'}>{r.label}</div>
        </Html>
      ))}
    </group>
  )
}
