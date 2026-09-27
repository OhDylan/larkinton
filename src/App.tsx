import { Canvas } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import { ControlPanel } from './components/ControlPanel'
import { RoomLabels } from './components/RoomLabels'
import { CameraRig, type CameraMode } from './controls/CameraRig'
import { Furniture } from './furniture'
import { Apartment } from './scene/Apartment'
import { Lighting } from './scene/Lighting'

// Ceiling is hidden by default in the overhead views, shown at eye level.
const ceilingDefault: Record<CameraMode, boolean> = { dollhouse: false, topdown: false, walkthrough: true }

export default function App() {
  const [mode, setModeState] = useState<CameraMode>('dollhouse')
  const [resetKey, setResetKey] = useState(0)
  const [showCeiling, setShowCeiling] = useState(false)
  const [showLabels, setShowLabels] = useState(true)
  const [showDesign, setShowDesign] = useState(true)
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
        <color attach="background" args={['#e4e8ec']} />
        <Lighting />
        <Apartment showCeiling={showCeiling} designed={showDesign} />
        <Furniture show={showDesign} />
        {showLabels && <RoomLabels layer={labelLayer} height={mode === 'walkthrough' ? 2.0 : 0.05} />}
        <CameraRig mode={mode} resetKey={resetKey} />
      </Canvas>
      <div ref={labelLayer} className="label-layer" />
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
