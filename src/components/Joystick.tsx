import { useRef, useState } from 'react'
import { moveInput } from '../state/moveInput'

const R = 48 // max knob travel in px

/** On-screen joystick for walking on phones / tablets (walkthrough mode). */
export function Joystick() {
  const base = useRef<HTMLDivElement>(null!)
  const active = useRef<number | null>(null)
  const [knob, setKnob] = useState<[number, number]>([0, 0])

  const update = (e: React.PointerEvent) => {
    const r = base.current.getBoundingClientRect()
    let dx = e.clientX - (r.left + r.width / 2)
    let dy = e.clientY - (r.top + r.height / 2)
    const len = Math.hypot(dx, dy)
    if (len > R) {
      dx = (dx / len) * R
      dy = (dy / len) * R
    }
    setKnob([dx, dy])
    moveInput.x = dx / R
    moveInput.y = -dy / R
  }
  const end = (e: React.PointerEvent) => {
    if (active.current !== e.pointerId) return
    active.current = null
    setKnob([0, 0])
    moveInput.x = 0
    moveInput.y = 0
  }

  return (
    <div
      ref={base}
      className="joystick"
      onPointerDown={(e) => {
        active.current = e.pointerId
        e.currentTarget.setPointerCapture(e.pointerId)
        update(e)
      }}
      onPointerMove={(e) => active.current === e.pointerId && update(e)}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <div className="joystick-knob" style={{ transform: `translate(${knob[0]}px, ${knob[1]}px)` }} />
    </div>
  )
}
