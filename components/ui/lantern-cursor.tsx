"use client"

import { useEffect, useRef, useState } from "react"

export function LanternCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)
  const [inLanding, setInLanding] = useState(true)
  const previousPosition = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const landing = document.querySelector(".thank-you-section")
    if (!landing) return

    const observer = new IntersectionObserver(([entry]) => {
      setInLanding(entry.isIntersecting)
      if (!entry.isIntersecting) setVisible(false)
    }, { threshold: 0.15 })

    observer.observe(landing)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (!inLanding) return
      const deltaX = event.clientX - previousPosition.current.x
      const deltaY = event.clientY - previousPosition.current.y
      const tilt = Math.max(-30, Math.min(30, deltaX * 1.15 - deltaY * 0.32))
      previousPosition.current = { x: event.clientX, y: event.clientY }
      setPosition({ x: event.clientX, y: event.clientY })
      document.documentElement.style.setProperty("--lantern-x", `${event.clientX}px`)
      document.documentElement.style.setProperty("--lantern-y", `${event.clientY}px`)
      document.documentElement.style.setProperty("--lantern-tilt", `${tilt}deg`)
      setVisible(true)
    }
    const leave = () => setVisible(false)
    window.addEventListener("pointermove", move)
    document.documentElement.addEventListener("pointerleave", leave)
    return () => {
      window.removeEventListener("pointermove", move)
      document.documentElement.removeEventListener("pointerleave", leave)
    }
  }, [inLanding])

  return (
    <>
      <div aria-hidden="true" className={`lantern-reveal ${visible ? "is-visible" : ""}`} />
      <div aria-hidden="true" className={`lantern-cursor ${visible ? "is-visible" : ""}`} style={{ left: position.x, top: position.y }}>
        <span className="lantern-cursor__glow" />
        <img className="lantern-cursor__image" src="/images/sky-lantern-cursor.png" alt="" />
      </div>
    </>
  )
}
