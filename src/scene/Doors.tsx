import { dimensions } from '../data/dimensions'
import { doorLeaves } from '../data/floorplan'
import { materials } from '../materials/materials'

/** Door leaves, shown in the open position drawn on the plan. */
export function Doors() {
  const m = materials()
  const h = dimensions.doors.height - 0.01
  const t = dimensions.doors.leafThickness
  return (
    <group>
      {doorLeaves.map((d) => {
        const [dx, dz] = d.openDir
        const cx = d.hinge[0] + (dx * d.width) / 2
        const cz = d.hinge[1] + (dz * d.width) / 2
        const size: [number, number, number] = dx !== 0 ? [d.width, h, t] : [t, h, d.width]
        return (
          <mesh
            key={d.id}
            position={[cx, h / 2, cz]}
            material={d.color === 'main' ? m.doorMain : m.doorInterior}
            castShadow
            receiveShadow
          >
            <boxGeometry args={size} />
          </mesh>
        )
      })}
    </group>
  )
}
