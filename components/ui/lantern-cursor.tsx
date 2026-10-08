"use client"

import { useEffect, useState } from "react"

export function LanternCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)
  const [inLanding, setInLanding] = useState(true)

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
      setPosition({ x: event.clientX, y: event.clientY })
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
