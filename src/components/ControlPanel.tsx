import type { CameraMode } from '../controls/CameraRig'

type Props = {
  mode: CameraMode
  setMode: (m: CameraMode) => void
  onReset: () => void
  showCeiling: boolean
  setShowCeiling: (v: boolean) => void
  showLabels: boolean
  setShowLabels: (v: boolean) => void
}

const modes: { id: CameraMode; label: string }[] = [
  { id: 'dollhouse', label: 'Dollhouse' },
  { id: 'topdown', label: 'Top Down' },
  { id: 'walkthrough', label: 'Walkthrough' },
]

export function ControlPanel(p: Props) {
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
      </div>
      <div className="hint">
        {p.mode === 'walkthrough'
          ? 'WASD / arrows to move · drag to look'
          : p.mode === 'topdown'
            ? 'Drag to pan · scroll to zoom'
            : 'Drag to orbit · right-drag to pan · scroll to zoom'}
      </div>
    </div>
  )
}
