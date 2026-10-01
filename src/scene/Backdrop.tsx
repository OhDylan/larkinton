/**
 * What you see outside: in the overhead views a plain ground plane anchors the model;
 * at eye level (walkthrough) a gradient sky and a hazy ring of distant towers, as seen
 * from a mid-level condo floor. The skyline is illustrative, not the real view.
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import type { CameraMode } from '../controls/CameraRig'
import { planCenter } from '../data/floorplan'
import { materials } from '../materials/materials'
import { useLightMode } from '../state/lightMode'
import { useRenderMode } from '../state/renderMode'

const [cx, cz] = planCenter
const GROUND_BELOW = 35 // metres below the unit's floor (assumed mid-level floor)

function Sky({ evening }: { evening: boolean }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { top: { value: new THREE.Color() }, horizon: { value: new THREE.Color() } },
        vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader:
          'uniform vec3 top; uniform vec3 horizon; varying vec3 vP; void main(){ float t = pow(clamp(vP.y*1.6+0.05,0.0,1.0),0.6); gl_FragColor = vec4(mix(horizon, top, t),1.0); }',
      }),
    [],
  )
  mat.uniforms.top.value.set(evening ? '#2d3a55' : '#9fc0e0')
  mat.uniforms.horizon.value.set(evening ? '#d9a27a' : '#eef2f3')
  return (
    <mesh material={mat} position={[cx, 0, cz]} renderOrder={-1}>
      <sphereGeometry args={[480, 32, 16]} />
    </mesh>
  )
}

function Skyline({ evening }: { evening: boolean }) {
  const { geo, mat } = useMemo(() => {
    let seed = 11
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)
    const boxes: THREE.BufferGeometry[] = []
    for (let i = 0; i < 90; i++) {
      const a = rnd() * Math.PI * 2
      const r = 70 + rnd() * 260
      const w = 14 + rnd() * 22
      const d = 14 + rnd() * 22
      const h = 20 + rnd() * rnd() * 140
      const g = new THREE.BoxGeometry(w, h, d)
      g.rotateY(rnd() * Math.PI)
      g.translate(cx + Math.cos(a) * r, -GROUND_BELOW + h / 2, cz + Math.sin(a) * r)
      boxes.push(g)
    }
    const geo = mergeGeometries(boxes)
    const mat = new THREE.MeshStandardMaterial({ color: '#d7dbdf', roughness: 0.9 })
    return { geo, mat }
  }, [])
  mat.color.set(evening ? '#4a4f5c' : '#949da8')
  mat.emissive.set(evening ? '#3a3226' : '#000000')
  return <mesh geometry={geo} material={mat} />
}

/** Minimal merge (positions + normals) so the skyline is a single draw call. */
function mergeGeometries(list: THREE.BufferGeometry[]) {
  const parts = list.map((g) => g.toNonIndexed())
  const count = parts.reduce((n, g) => n + g.attributes.position.count, 0)
  const pos = new Float32Array(count * 3)
  const nrm = new Float32Array(count * 3)
  let o = 0
  for (const g of parts) {
    pos.set(g.attributes.position.array as Float32Array, o * 3)
    nrm.set(g.attributes.normal.array as Float32Array, o * 3)
    o += g.attributes.position.count
  }
  const out = new THREE.BufferGeometry()
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  out.setAttribute('normal', new THREE.BufferAttribute(nrm, 3))
  return out
}

export function Backdrop({ mode }: { mode: CameraMode }) {
  const evening = useLightMode() === 'evening'
  // photo mode: the path tracer can't run custom shaders or fog; it uses its own sky texture instead
  const live = useRenderMode() === 'live'
  if (mode !== 'walkthrough')
    return (
      <mesh rotation-x={-Math.PI / 2} position={[cx, -0.15, cz]} material={materials().ground} receiveShadow>
        <planeGeometry args={[60, 60]} />
      </mesh>
    )
  return (
    <group>
      {live && <Sky evening={evening} />}
      <Skyline evening={evening} />
      {live && <fog attach="fog" args={[evening ? '#5b5a63' : '#e3e9ee', 120, 600]} />}
      <mesh rotation-x={-Math.PI / 2} position={[cx, -GROUND_BELOW, cz]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color={evening ? '#3c3d40' : '#c2c6c0'} roughness={1} />
      </mesh>
    </group>
  )
}
