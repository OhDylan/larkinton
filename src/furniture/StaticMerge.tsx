/**
 * Performance: the furniture is ~900 small meshes, i.e. ~900 draw calls per frame (more with
 * shadows). Everything inside <StaticMerge> is static, so after it mounts we bake it into one
 * mesh per material (+ shadow flag) and hide the originals. Same look, a few dozen draw calls.
 * Materials are shared, not copied, so day/evening changes to them still apply.
 */
import { useLayoutEffect, useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const KEEP = ['position', 'normal', 'uv']

function prepare(src: THREE.BufferGeometry, matrix: THREE.Matrix4) {
  const g = src.index ? src.toNonIndexed() : src.clone()
  for (const name of Object.keys(g.attributes)) if (!KEEP.includes(name)) g.deleteAttribute(name)
  g.morphAttributes = {}
  if (!g.attributes.normal) g.computeVertexNormals()
  if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2))
  g.clearGroups()
  g.applyMatrix4(matrix)
  return g
}

export function StaticMerge({ children }: { children: ReactNode }) {
  const root = useRef<THREE.Group>(null!)

  useLayoutEffect(() => {
    const group = root.current
    group.updateWorldMatrix(true, true)
    const toLocal = new THREE.Matrix4().copy(group.matrixWorld).invert()
    const buckets = new Map<string, { material: THREE.Material; cast: boolean; geos: THREE.BufferGeometry[] }>()
    const hidden: THREE.Object3D[] = []

    group.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh || !mesh.visible || Array.isArray(mesh.material)) return
      // live planar mirrors and custom shaders keep their own draw
      if ((mesh as unknown as { isReflector?: boolean }).isReflector || (mesh.material as THREE.ShaderMaterial).isShaderMaterial) return
      if (mesh.children.length) return
      const material = mesh.material as THREE.Material
      const key = `${material.uuid}|${mesh.castShadow ? 1 : 0}`
      let b = buckets.get(key)
      if (!b) buckets.set(key, (b = { material, cast: mesh.castShadow, geos: [] }))
      b.geos.push(prepare(mesh.geometry, new THREE.Matrix4().multiplyMatrices(toLocal, mesh.matrixWorld)))
      hidden.push(mesh)
    })

    const merged: THREE.Mesh[] = []
    for (const b of buckets.values()) {
      const geo = mergeGeometries(b.geos, false)
      b.geos.forEach((g) => g.dispose())
      if (!geo) continue
      const m = new THREE.Mesh(geo, b.material)
      m.castShadow = b.cast
      m.receiveShadow = true
      m.name = 'merged'
      merged.push(m)
    }
    // only hide originals once their merged copies exist
    if (merged.length) {
      hidden.forEach((h) => (h.visible = false))
      merged.forEach((m) => group.add(m))
    }
    return () => {
      merged.forEach((m) => {
        group.remove(m)
        m.geometry.dispose()
      })
      hidden.forEach((h) => (h.visible = true))
    }
  }, [])

  return <group ref={root}>{children}</group>
}
