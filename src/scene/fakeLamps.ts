/**
 * "Fake" lamp light: instead of real point lights (each one adds a full lighting pass to every
 * pixel), every material gets a small injected loop that adds soft, warm, distance-faded light
 * from up to MAX lamps. Same idea as sael.net's interior configurator. No shadows, but cheap
 * enough to light every lamp in the evening.
 */
import * as THREE from 'three'

export const MAX_LAMPS = 16

type LampDef = { pos: THREE.Vector3; color: THREE.Color; radius: number }
const lamps = new Map<string, LampDef>()

export function setLamp(id: string, pos: [number, number, number], color: THREE.ColorRepresentation, intensity: number, radius: number) {
  lamps.set(id, { pos: new THREE.Vector3(...pos), color: new THREE.Color(color).multiplyScalar(intensity), radius })
}
export function removeLamp(id: string) {
  lamps.delete(id)
}

/** Shared uniforms: view-space position (w = 1/radius²) and colour per lamp. */
const uniforms = {
  uLampPos: { value: Array.from({ length: MAX_LAMPS }, () => new THREE.Vector4(0, -999, 0, 1)) },
  uLampCol: { value: Array.from({ length: MAX_LAMPS }, () => new THREE.Vector3()) },
}

const tmp = new THREE.Vector3()
/** Call once per frame before rendering: lamp positions are needed in view space. */
export function updateLampUniforms(world: THREE.Object3D, camera: THREE.Camera) {
  let i = 0
  for (const l of lamps.values()) {
    if (i >= MAX_LAMPS) break
    tmp.copy(l.pos).applyMatrix4(world.matrixWorld).applyMatrix4(camera.matrixWorldInverse)
    uniforms.uLampPos.value[i].set(tmp.x, tmp.y, tmp.z, 1 / (l.radius * l.radius))
    uniforms.uLampCol.value[i].set(l.color.r, l.color.g, l.color.b)
    i++
  }
  for (; i < MAX_LAMPS; i++) uniforms.uLampCol.value[i].set(0, 0, 0)
}

const decl = /* glsl */ `
uniform vec4 uLampPos[${MAX_LAMPS}];
uniform vec3 uLampCol[${MAX_LAMPS}];`

const loop = /* glsl */ `
#include <lights_fragment_end>
{
  vec3 fp = -vViewPosition;
  for (int i = 0; i < ${MAX_LAMPS}; i++) {
    vec3 d = uLampPos[i].xyz - fp;
    float dd = dot(d, d);
    float a = max(0.0, 1.0 - dd * uLampPos[i].w);
    a *= a;
    float n = dot(normal, d) * inversesqrt(dd + 1e-4);
    // mostly lambert, plus a little wrap so the far side of objects isn't pitch black
    reflectedLight.directDiffuse += uLampCol[i] * a * (max(n, 0.0) * 0.8 + 0.2) * material.diffuseContribution;
  }
}`

const patched = new WeakSet<THREE.Material>()
/** Inject the lamp loop into a standard/physical material (idempotent). */
export function patchMaterial(m: THREE.Material) {
  if (patched.has(m)) return
  const std = m as THREE.MeshStandardMaterial
  if (!std.isMeshStandardMaterial) return
  patched.add(m)
  const prev = m.onBeforeCompile
  m.onBeforeCompile = (shader, renderer) => {
    prev?.call(m, shader, renderer)
    Object.assign(shader.uniforms, uniforms)
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${decl}`)
      .replace('#include <lights_fragment_end>', loop)
  }
  const prevKey = m.customProgramCacheKey.bind(m)
  m.customProgramCacheKey = () => prevKey() + '|fakeLamps'
  m.needsUpdate = true
}
