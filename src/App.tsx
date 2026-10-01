import { Canvas } from '@react-three/fiber'
import { lazy, Suspense, useRef, useState } from 'react'
import * as THREE from 'three'
import { ControlPanel } from './components/ControlPanel'
import { Joystick } from './components/Joystick'
import { RoomLabels } from './components/RoomLabels'
import { CameraRig, type CameraMode } from './controls/CameraRig'
import { Furniture } from './furniture'
import { Apartment } from './scene/Apartment'
import { Effects } from './scene/Effects'
import { useRenderMode } from './state/renderMode'
import { Backdrop } from './scene/Backdrop'
import { Lighting } from './scene/Lighting'
import { useLightMode } from './state/lightMode'

// photo (path-traced) mode is loaded on demand so the first page load stays light
const PathTracer = lazy(() => import('./scene/PathTracer').then((m) => ({ default: m.PathTracer })))

// Ceiling is hidden by default in the overhead views, shown at eye level.
const ceilingDefault: Record<CameraMode, boolean> = { dollhouse: false, topdown: false, walkthrough: true }

export default function App() {
  const [mode, setModeState] = useState<CameraMode>('dollhouse')
  const [resetKey, setResetKey] = useState(0)
  const [showCeiling, setShowCeiling] = useState(false)
  const [showLabels, setShowLabels] = useState(true)
  const [showDesign, setShowDesign] = useState(true)
  const renderMode = useRenderMode()
  const labelLayer = useRef<HTMLDivElement>(null!)

  const setMode = (m: CameraMode) => {
    setModeState(m)
    setShowCeiling(ceilingDefault[m])
    setResetKey((k) => k + 1)
  }

  return (
    <>
      <Canvas shadows="percentage" camera={{ fov: 45, near: 0.05, far: 200 }} dpr={[1, 2]}
        gl={{ toneMapping: THREE.NeutralToneMapping, toneMappingExposure: 1.5 }}
      >
        <Background />
        <Lighting />
        <Backdrop mode={mode} />
        <Apartment showCeiling={showCeiling} designed={showDesign} />
        <Furniture show={showDesign} />
        {showLabels && <RoomLabels layer={labelLayer} height={mode === 'walkthrough' ? 2.0 : 0.05} />}
        <CameraRig mode={mode} resetKey={resetKey} />
        {renderMode === 'live' ? (
          <Effects />
        ) : (
          <Suspense fallback={null}>
            <PathTracer designed={showDesign} inside={mode === 'walkthrough'} />
          </Suspense>
        )}
      </Canvas>
      <div ref={labelLayer} className="label-layer" />
      {mode === 'walkthrough' && <Joystick />}
      <ControlPanel
        mode={mode}
        setMode={setMode}
        onReset={() => setResetKey((k) => k + 1)}
        showCeiling={showCeiling}
        setShowCeiling={setShowCeiling}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
        showDesign={showDesign}
        setShowDesign={setShowDesign}
      />
    </>
  )
}

/** Sky seen through the windows: pale by day, dusk blue-grey in the evening. */
function Background() {
  const evening = useLightMode() === 'evening'
  // in photo mode the path tracer supplies the sky as the background
  if (useRenderMode() === 'photo') return null
  return <color attach="background" args={[evening ? '#3a4150' : '#e4e8ec']} />
}
