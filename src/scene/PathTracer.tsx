/**
 * Photo mode: progressive path tracing (three-gpu-pathtracer) of the current view.
 * Same light transport as offline renderers: real bounce light, soft shadows, glowing lamps.
 * The image sharpens while the camera is still; any camera move restarts it.
 */
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js'
import { DenoiseMaterial, GradientEquirectTexture, WebGLPathTracer } from 'three-gpu-pathtracer'
import { designMaterials } from '../furniture/designMaterials'
import { materials } from '../materials/materials'
import { setPhotoStatus, setRenderMode } from '../state/renderMode'
import { useLightMode } from '../state/lightMode'
import { dimensions as D } from '../data/dimensions'
import { MIRRORED, toWorldX } from '../data/mirror'
import { useDoorState } from './doorState'

const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
const MAX_SAMPLES = isMobile ? 192 : 768

/** Sky dome used both as light source and as what you see through the windows. */
function makeSky(evening: boolean) {
  const sky = new GradientEquirectTexture(256)
  sky.topColor.set(evening ? '#1c2440' : '#8fb6e8')
  sky.bottomColor.set(evening ? '#c98a5e' : '#f4efe6')
  sky.exponent = 1.6
  sky.update()
  return sky
}

/**
 * Camera exposure for photo mode. Indoors only the windows (and lamps) light the room, so,
 * like a real camera, the eye-level view needs a much longer exposure than the open dollhouse.
 */
const EXPOSURE = {
  day: { inside: 2.2, overview: 1.1 },
  evening: { inside: 2.4, overview: 1.6 },
}

/**
 * "Sky portals": a soft area light just inside each exterior window, the standard trick in
 * offline renderers. The path tracer samples them directly, so daylight coming through the
 * windows converges in far fewer samples (much less grain) than light found by chance.
 */
const W = D.windows
/** In plan coordinates; mirrored to world coordinates when placed. */
const portals: { w: number; h: number; pos: [number, number, number]; look: [number, number, number] }[] = [
  { w: W.living.x1 - W.living.x0, h: W.living.head - W.living.sill, pos: [(W.living.x0 + W.living.x1) / 2, (W.living.sill + W.living.head) / 2, D.z.northInner + 0.03], look: [0, 0, 1] },
  { w: W.master.x1 - W.master.x0, h: W.master.head - W.master.sill, pos: [(W.master.x0 + W.master.x1) / 2, (W.master.sill + W.master.head) / 2, D.z.northInner + 0.03], look: [0, 0, 1] },
  { w: W.bed2.z1 - W.bed2.z0, h: W.bed2.head - W.bed2.sill, pos: [D.x.eastInner - 0.03, (W.bed2.sill + W.bed2.head) / 2, (W.bed2.z0 + W.bed2.z1) / 2], look: [-1, 0, 0] },
  { w: W.bath.z1 - W.bath.z0, h: W.bath.head - W.bath.sill, pos: [D.x.eastInner - 0.03, (W.bath.sill + W.bath.head) / 2, (W.bath.z0 + W.bath.z1) / 2], look: [-1, 0, 0] },
]

function SkyPortals({ evening }: { evening: boolean }) {
  return (
    <group>
      {portals.map((p, i) => (
        <rectAreaLight
          key={i}
          args={[evening ? '#5a6a90' : '#e4ecf6', evening ? 0.25 : 2.5, p.w, p.h]}
          position={[toWorldX(p.pos[0]), p.pos[1], p.pos[2]]}
          onUpdate={(l) => l.lookAt(toWorldX(p.pos[0]) + (MIRRORED ? -p.look[0] : p.look[0]), p.pos[1] + p.look[1], p.pos[2] + p.look[2])}
        />
      ))}
    </group>
  )
}

export function PathTracer({ designed, inside }: { designed: boolean; inside: boolean }) {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const evening = useLightMode() === 'evening'
  const doors = useDoorState()
  const pt = useRef<WebGLPathTracer | null>(null)
  const ready = useRef(false)
  const lastCam = useRef(new THREE.Matrix4())
  const lastProj = useRef(new THREE.Matrix4())

  // one path tracer for the lifetime of photo mode
  useEffect(() => {
    const tracer = new WebGLPathTracer(gl)
    // Keep each frame's GPU work small so the browser stays responsive (a single long GPU job is
    // what makes a tab freeze or the driver reset): a pixel budget instead of full resolution,
    // the sample split into tiles over several frames, modest bounce depth and texture size.
    const size = gl.getDrawingBufferSize(new THREE.Vector2())
    const budget = isMobile ? 0.18e6 : 0.45e6 // path-traced pixels per sample
    tracer.renderScale = Math.min(1, Math.sqrt(budget / (size.x * size.y)))
    tracer.tiles.set(isMobile ? 4 : 3, isMobile ? 4 : 3)
    tracer.dynamicLowRes = true
    tracer.lowResScale = 0.15
    tracer.minSamples = 2
    tracer.fadeDuration = 300
    tracer.bounces = 4
    tracer.transmissiveBounces = 2
    tracer.filterGlossyFactor = 0.5
    tracer.textureSize.set(512, 512)
    // light denoise on top of the accumulated image, strongest while samples are few
    const denoise = new FullScreenQuad(new DenoiseMaterial({ sigma: 2.5, threshold: 0.12, kSigma: 1.0 }))
    tracer.renderToCanvasCallback = (target, renderer, quad) => {
      const m = denoise.material as DenoiseMaterial & { uniforms: Record<string, { value: unknown }> }
      const s = tracer.samples
      m.uniforms.map.value = target.texture
      m.uniforms.sigma.value = s < 32 ? 3.5 : s < 128 ? 2.2 : s < 512 ? 1.2 : 0.6
      m.uniforms.threshold.value = s < 32 ? 0.2 : 0.12
      m.uniforms.opacity.value = (quad.material as unknown as { opacity: number }).opacity
      m.transparent = true
      m.blending = (quad.material as THREE.Material).blending
      const auto = renderer.autoClear
      renderer.autoClear = false
      denoise.render(renderer)
      renderer.autoClear = auto
    }
    pt.current = tracer
    // if the GPU gives up (context lost), fall back to the live view instead of a dead canvas
    const lost = (e: Event) => {
      e.preventDefault()
      setPhotoStatus({ phase: 'failed', samples: 0 })
      setRenderMode('live')
    }
    gl.domElement.addEventListener('webglcontextlost', lost)
    return () => {
      gl.domElement.removeEventListener('webglcontextlost', lost)
      tracer.dispose()
      denoise.dispose()
      pt.current = null
      setPhotoStatus({ phase: 'idle', samples: 0 }, true)
    }
  }, [gl])

  useEffect(() => {
    const prev = gl.toneMappingExposure
    gl.toneMappingExposure = EXPOSURE[evening ? 'evening' : 'day'][inside ? 'inside' : 'overview']
    pt.current?.reset()
    return () => {
      gl.toneMappingExposure = prev
    }
  }, [gl, evening, inside])

  // (re)build the path-traced scene whenever what's in it changes
  useEffect(() => {
    const tracer = pt.current
    if (!tracer) return
    const d = designMaterials()
    const m = materials()
    // lamp shades, glass and light strips shouldn't block light in the path tracer
    for (const mat of [d.paper, d.lightStrip, d.downlight, m.glass] as (THREE.Material & { castShadow?: boolean })[]) mat.castShadow = false

    const prevEnv = scene.environment
    const prevBg = scene.background
    const prevEnvI = scene.environmentIntensity
    const sky = makeSky(evening)
    scene.environment = sky
    scene.background = sky
    scene.environmentIntensity = evening ? 0.15 : 1.0
    scene.backgroundIntensity = evening ? 0.4 : 1.0

    ready.current = false
    setPhotoStatus({ phase: 'preparing', samples: 0 })
    let cancelled = false
    // let door animations / light changes settle before baking the scene
    const t = window.setTimeout(() => {
      if (cancelled) return
      try {
        // synchronous BVH build: a brief pause (~1 s) when photo mode starts or the scene changes
        tracer.setScene(scene, camera)
        ready.current = true
        lastCam.current.copy(camera.matrixWorld)
        lastProj.current.copy(camera.projectionMatrix)
      } catch (e) {
        console.error('path tracer setup failed', e)
      }
    }, 700)
    return () => {
      cancelled = true
      window.clearTimeout(t)
      // only undo what we set; the live view may already have attached its own background/env
      if (scene.environment === sky) scene.environment = prevEnv
      if (scene.background === sky) scene.background = prevBg
      scene.environmentIntensity = prevEnvI
      sky.dispose()
    }
  }, [scene, camera, evening, doors, designed])

  // take over rendering (priority 1 disables R3F's own render)
  useFrame(() => {
    const tracer = pt.current
    if (!tracer || !ready.current) {
      gl.render(scene, camera)
      return
    }
    camera.updateMatrixWorld()
    if (!lastCam.current.equals(camera.matrixWorld) || !lastProj.current.equals(camera.projectionMatrix)) {
      lastCam.current.copy(camera.matrixWorld)
      lastProj.current.copy(camera.projectionMatrix)
      tracer.updateCamera()
    }
    // stop once the image is clean enough: no point heating the device further
    const done = tracer.samples >= MAX_SAMPLES
    tracer.pausePathTracing = done
    tracer.renderSample()
    setPhotoStatus({ phase: done ? 'done' : 'rendering', samples: Math.floor(tracer.samples) })
  }, 1)

  return <SkyPortals evening={evening} />
}
