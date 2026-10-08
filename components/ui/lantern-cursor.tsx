"use client"

import { useEffect, useState } from "react"

export function LanternCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const move = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY })
      document.documentElement.style.setProperty("--lantern-x", `${event.clientX}px`)
      document.documentElement.style.setProperty("--lantern-y", `${event.clientY}px`)
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
    <>
      <div aria-hidden="true" className={`lantern-reveal ${visible ? "is-visible" : ""}`} />
      <div aria-hidden="true" className={`lantern-cursor ${visible ? "is-visible" : ""}`} style={{ left: position.x, top: position.y }}>
        <span className="lantern-cursor__glow" />
        <span className="lantern-cursor__body">
          <span className="lantern-cursor__top" />
          <span className="lantern-cursor__flame" />
          <span className="lantern-cursor__basket" />
        </span>
        <span className="lantern-cursor__tassel" />
      </div>
    </>
  )
}
