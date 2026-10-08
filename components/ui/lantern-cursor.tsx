"use client"

import { useEffect, useState } from "react"

export function LanternCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const move = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY })
      setVisible(true)
    }
    const leave = () => setVisible(false)
    window.addEventListener("pointermove", move)
    document.documentElement.addEventListener("pointerleave", leave)
    return () => {
      window.removeEventListener("pointermove", move)
      document.documentElement.removeEventListener("pointerleave", leave)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className={`lantern-cursor ${visible ? "is-visible" : ""}`}
      style={{ left: position.x, top: position.y }}
    >
      <span className="lantern-cursor__glow" />
      <span className="lantern-cursor__body"><span className="lantern-cursor__mark">囍</span></span>
      <span className="lantern-cursor__tassel" />
    </div>
  )
}
