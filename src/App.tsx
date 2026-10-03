import { Canvas } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import { ControlPanel } from './components/ControlPanel'
import { Joystick } from './components/Joystick'
import { RoomLabels } from './components/RoomLabels'
import { dimensions } from './data/dimensions'
import { MIRRORED } from './data/mirror'
import { CameraRig, type CameraMode } from './controls/CameraRig'
import { Furniture } from './furniture'
import { Apartment } from './scene/Apartment'
import { Effects } from './scene/Effects'
import { Backdrop } from './scene/Backdrop'
import { Lighting, ShadowUpdates } from './scene/Lighting'
import { useLightMode } from './state/lightMode'

// Ceiling is hidden by default in the overhead views, shown at eye level.
const ceilingDefault: Record<CameraMode, boolean> = { dollhouse: false, topdown: false, walkthrough: true }

export default function App() {
  const [mode, setModeState] = useState<CameraMode>('dollhouse')
  const [resetKey, setResetKey] = useState(0)
  const [showCeiling, setShowCeiling] = useState(false)
  const [showLabels, setShowLabels] = useState(true)
  const [showDesign, setShowDesign] = useState(true)
  const lightModeKey = useLightMode()
  const labelLayer = useRef<HTMLDivElement>(null!)

  const setMode = (m: CameraMode) => {
    setModeState(m)
    setShowCeiling(ceilingDefault[m])
    setResetKey((k) => k + 1)
  }

  return (
    <>
      <Canvas shadows="percentage" camera={{ fov: 45, near: 0.05, far: 200 }} dpr={[1, 1.5]}
        gl={{ toneMapping: THREE.NeutralToneMapping, toneMappingExposure: 1.5 }}
      >
        <Background />
        <Lighting />
        <ShadowUpdates version={`${showCeiling}|${showDesign}|${lightModeKey}`} />
        <Backdrop mode={mode} />
        {/* Type Ba = mirror image of the plan; data stays in plan coordinates (see data/mirror.ts) */}
        <group scale-x={MIRRORED ? -1 : 1} position-x={MIRRORED ? dimensions.overall.width : 0}>
          <Apartment showCeiling={showCeiling} designed={showDesign} />
          <Furniture show={showDesign} />
          {showLabels && <RoomLabels layer={labelLayer} height={mode === 'walkthrough' ? 2.0 : 0.05} />}
        </group>
        <CameraRig mode={mode} resetKey={resetKey} />
        <Effects />
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
  return <color attach="background" args={[evening ? '#3a4150' : '#e4e8ec']} />
}
