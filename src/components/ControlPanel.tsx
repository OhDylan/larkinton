import type { CameraMode } from '../controls/CameraRig'
import { setAllDoors, useDoorState } from '../scene/doorState'
import { setLightMode, useLightMode } from '../state/lightMode'
import { setRenderMode, usePhotoStatus, useRenderMode } from '../state/renderMode'

type Props = {
  mode: CameraMode
  setMode: (m: CameraMode) => void
  onReset: () => void
  showCeiling: boolean
  setShowCeiling: (v: boolean) => void
  showLabels: boolean
  setShowLabels: (v: boolean) => void
  showDesign: boolean
  setShowDesign: (v: boolean) => void
}

const modes: { id: CameraMode; label: string }[] = [
  { id: 'dollhouse', label: 'Dollhouse' },
  { id: 'topdown', label: 'Top Down' },
  { id: 'walkthrough', label: 'Walkthrough' },
]

export function ControlPanel(p: Props) {
  const doors = useDoorState()
  const allOpen = Object.values(doors).every(Boolean)
  const light = useLightMode()
  const render = useRenderMode()
  const photo = usePhotoStatus()
  return (
    <div className="panel">
      <div className="row">
        {modes.map((m) => (
          <button key={m.id} className={p.mode === m.id ? 'active' : ''} onClick={() => p.setMode(m.id)}>
            {m.label}
          </button>
        ))}
      </div>
      <div className="row">
        <button onClick={p.onReset}>Reset Camera</button>
        <button className={p.showCeiling ? 'active' : ''} onClick={() => p.setShowCeiling(!p.showCeiling)}>
          Ceiling
        </button>
        <button className={p.showLabels ? 'active' : ''} onClick={() => p.setShowLabels(!p.showLabels)}>
          Labels
        </button>
        <button className={p.showDesign ? 'active' : ''} onClick={() => p.setShowDesign(!p.showDesign)}>
          Design
        </button>
        <button className={light === 'evening' ? 'active' : ''} onClick={() => setLightMode(light === 'evening' ? 'day' : 'evening')}>
          Evening
        </button>
        <button onClick={() => setAllDoors(!allOpen)}>{allOpen ? 'Close Doors' : 'Open Doors'}</button>
        <button className={render === 'photo' ? 'active photo' : 'photo'} onClick={() => setRenderMode(render === 'photo' ? 'live' : 'photo')}>
          Photo Render
        </button>
      </div>
      {render === 'photo' && (
        <div className="photo-status">
          {photo.phase === 'rendering'
            ? `Rendering · ${photo.samples} samples — hold still, it sharpens over time`
            : 'Preparing the photo render…'}
        </div>
      )}
      <div className="hint">
        {p.mode === 'walkthrough'
          ? 'WASD / arrows or joystick to move · drag to look · tap a door to open/close'
          : p.mode === 'topdown'
            ? 'Drag to pan · scroll to zoom'
            : 'Drag to orbit · right-drag to pan · scroll to zoom · click a door to open/close'}
      </div>
    </div>
  )
}
