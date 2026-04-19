"use client"

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react"
import { Canvas } from "@react-three/fiber"
import { gsap } from "gsap"
import {
  ScrollRod,
  type RodProgressRef,
  ROD_PAPER_MIN_R,
  ROD_PAPER_MAX_R,
  ROD_CENTER_Y_OFFSET,
} from "./scroll-rod"

interface ScrollExperienceProps {
  children: ReactNode
}

/** Persists across in-app nav in the same tab, resets on reload / new tab. */
let hasPlayedInMemory = false

const CAMERA_ZOOM = 50
// Ornament dimensions — smaller than before so knobs stay inside the viewport.
const ORNAMENT_HEIGHT_PX = 78
const ORNAMENT_WIDTH_PX = 96

// Horizontal safe area — matches the inner edge of the ornament bulb.
// Content, header, footer, burnt edges, and background paper all span
// exactly this inset from the viewport edges.
const SAFE_X_DESKTOP = 58
const SAFE_X_MOBILE = 34

export function ScrollExperience({ children }: ScrollExperienceProps) {
  const [phase, setPhase] = useState<"loading" | "opening" | "open">("loading")
  const progressRef = useRef<RodProgressRef>({ opening: 0, scroll: 0, rotation: 0 })

  const applyCSSVars = (opening: number, scroll: number) => {
    const rodCenterOpen = CAMERA_ZOOM * ROD_CENTER_Y_OFFSET
    const viewportCenterY = window.innerHeight / 2
    const topRodCenterPxFromTop = (1 - opening) * viewportCenterY + opening * rodCenterOpen
    const bottomRodCenterPxFromBottom = topRodCenterPxFromTop

    const openTopR = ROD_PAPER_MIN_R + (ROD_PAPER_MAX_R - ROD_PAPER_MIN_R) * scroll
    const openBottomR = ROD_PAPER_MAX_R - (ROD_PAPER_MAX_R - ROD_PAPER_MIN_R) * scroll
    const topR = ROD_PAPER_MAX_R + (openTopR - ROD_PAPER_MAX_R) * opening
    const bottomR = ROD_PAPER_MAX_R + (openBottomR - ROD_PAPER_MAX_R) * opening

    const safeTopPx = Math.round(topRodCenterPxFromTop + topR * CAMERA_ZOOM)
    const safeBottomPx = Math.round(bottomRodCenterPxFromBottom + bottomR * CAMERA_ZOOM)
    const safeX = window.innerWidth < 640 ? SAFE_X_MOBILE : SAFE_X_DESKTOP

    const root = document.documentElement
    root.style.setProperty("--scroll-safe-top", `${safeTopPx}px`)
    root.style.setProperty("--scroll-safe-bottom", `${safeBottomPx}px`)
    root.style.setProperty("--scroll-safe-x", `${safeX}px`)
    root.style.setProperty("--scroll-opening", `${opening}`)
  }

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    if (hasPlayedInMemory || prefersReducedMotion) {
      progressRef.current.opening = 1
      applyCSSVars(1, 0)
      setPhase("open")
    } else {
      applyCSSVars(0, 0)
      setPhase("opening")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (phase === "loading") return
    const body = document.body
    const html = document.documentElement
    const prevBodyBg = body.style.backgroundColor
    const prevHtmlBg = html.style.backgroundColor
    body.style.backgroundColor = "transparent"
    html.style.backgroundColor = "#0a0604"
    return () => {
      body.style.backgroundColor = prevBodyBg
      html.style.backgroundColor = prevHtmlBg
    }
  }, [phase])

  useEffect(() => {
    if (phase !== "opening") return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [phase])

  useEffect(() => {
    if (phase !== "opening") return

    const obj = { v: 0 }
    const tween = gsap.to(obj, {
      v: 1,
      duration: 6.0,
      ease: "power2.inOut",
      onUpdate: () => {
        progressRef.current.opening = obj.v
        applyCSSVars(obj.v, 0)
      },
      onComplete: () => {
        hasPlayedInMemory = true
        progressRef.current.opening = 1
        applyCSSVars(1, 0)
        setPhase("open")
      },
    })

    return () => {
      tween.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  useEffect(() => {
    if (phase !== "open") return

    let raf = 0
    let lastY = window.scrollY
    let acc = 0

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const s = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      progressRef.current.scroll = s

      const dy = window.scrollY - lastY
      acc += dy * 0.014
      progressRef.current.rotation = acc
      lastY = window.scrollY

      applyCSSVars(1, s)
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", update)
      cancelAnimationFrame(raf)
      const root = document.documentElement
      root.style.removeProperty("--scroll-safe-top")
      root.style.removeProperty("--scroll-safe-bottom")
      root.style.removeProperty("--scroll-safe-x")
      root.style.removeProperty("--scroll-opening")
    }
  }, [phase])

  if (phase === "loading") {
    return (
      <div
        className="fixed inset-0 z-[9999]"
        style={{ background: "#0a0604" }}
        aria-hidden
      />
    )
  }

  return (
    <>
      {/* Dark outer frame covering entire viewport — shows outside the paper band */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -20,
          background: "radial-gradient(ellipse at center, #150b05 0%, #050200 85%)",
        }}
        aria-hidden
      />

      {/* Parchment — fills ONLY the band between the two ornamented knobs.
          Width = content width = header width = footer width = paper-on-rod width. */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: 0,
          bottom: 0,
          left: "var(--scroll-safe-x, 0)",
          right: "var(--scroll-safe-x, 0)",
          zIndex: -10,
          backgroundImage: "url(/textures/parchment-clean.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#b69272",
          backgroundBlendMode: "multiply",
        }}
        aria-hidden
      />

      {/* Content rendered at opacity 1 from mount */}
      {children}

      {/* Dark top mask — covers the portion above the top rod */}
      <div
        className="fixed top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "var(--scroll-safe-top)",
          background: "radial-gradient(ellipse at center bottom, #1a0d05 0%, #050200 75%)",
          zIndex: 35,
          boxShadow: "0 12px 24px -6px rgba(0,0,0,0.75), 0 4px 10px rgba(0,0,0,0.55)",
        }}
        aria-hidden
      />

      {/* Dark bottom mask */}
      <div
        className="fixed bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "var(--scroll-safe-bottom)",
          background: "radial-gradient(ellipse at center top, #1a0d05 0%, #050200 75%)",
          zIndex: 35,
          boxShadow: "0 -12px 24px -6px rgba(0,0,0,0.75), 0 -4px 10px rgba(0,0,0,0.55)",
        }}
        aria-hidden
      />

      {/* SVG ornaments — z:38 so they sit BELOW the canvas paper scroll (z:40).
          The inner edge of each ornament tucks under the rotating paper roll. */}
      <Ornament corner="top-left" />
      <Ornament corner="top-right" />
      <Ornament corner="bottom-left" />
      <Ornament corner="bottom-right" />

      {/* 3D canvas with both rods — rendered above ornaments so paper covers
          the ornament's inner edge visually */}
      <div
        className="fixed inset-0"
        style={{ zIndex: 40, pointerEvents: "none" }}
        aria-hidden
      >
        <Canvas
          orthographic
          camera={{ zoom: CAMERA_ZOOM, position: [0, 0, 100], near: 0.1, far: 1000 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 2]}
          style={{ background: "transparent", pointerEvents: "none" }}
        >
          <ambientLight intensity={0.75} />
          <directionalLight position={[4, 6, 8]} intensity={1.2} />
          <directionalLight position={[-5, -3, 6]} intensity={0.4} />
          <directionalLight position={[0, 0, 10]} intensity={0.55} />
          <Suspense fallback={null}>
            <ScrollRod position="top" progressRef={progressRef} />
            <ScrollRod position="bottom" progressRef={progressRef} />
          </Suspense>
        </Canvas>
      </div>
    </>
  )
}

/** Inline SVG ornament — pure wood carving, no silver, clean shapes. */
function Ornament({
  corner,
}: {
  corner: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}) {
  const isTop = corner.startsWith("top")
  const isLeft = corner.endsWith("left")
  const rodCenterOpenPx = CAMERA_ZOOM * ROD_CENTER_Y_OFFSET

  const verticalExpr = `calc((1 - var(--scroll-opening, 1)) * 50vh + var(--scroll-opening, 1) * ${rodCenterOpenPx}px - ${ORNAMENT_HEIGHT_PX / 2}px)`

  const vertical = isTop ? { top: verticalExpr } : { bottom: verticalExpr }
  const horizontal = isLeft ? { left: 0 } : { right: 0 }
  const mirror = isLeft ? "scaleX(1)" : "scaleX(-1)"

  const gradId = `ornWood-${corner}`
  const bulbGradId = `ornBulb-${corner}`
  const shadowId = `ornShadow-${corner}`

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        ...vertical,
        ...horizontal,
        width: `${ORNAMENT_WIDTH_PX}px`,
        height: `${ORNAMENT_HEIGHT_PX}px`,
        zIndex: 38,
        transform: mirror,
      }}
      aria-hidden
    >
      <svg
        viewBox="0 0 96 78"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Wood grain — subtle gradient from top to bottom */}
          <linearGradient id={gradId} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#4a2a14" />
            <stop offset="50%" stopColor="#5c3620" />
            <stop offset="100%" stopColor="#2a1608" />
          </linearGradient>
          {/* Bulb — 3D lit radial gradient */}
          <radialGradient id={bulbGradId} cx="30%" cy="28%" r="78%">
            <stop offset="0%" stopColor="#7d4a2a" />
            <stop offset="38%" stopColor="#5a3018" />
            <stop offset="78%" stopColor="#2e160a" />
            <stop offset="100%" stopColor="#1a0a04" />
          </radialGradient>
          <filter id={shadowId} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="2" dy="3" stdDeviation="2.5" floodOpacity="0.7" />
          </filter>
        </defs>

        <g filter={`url(#${shadowId})`}>
          {/* Inner shaft attaching to rod (at right edge, will be covered by paper) */}
          <rect x="86" y="35" width="10" height="8" fill={`url(#${gradId})`} />

          {/* Narrow inner neck */}
          <rect x="78" y="33" width="10" height="12" fill={`url(#${gradId})`} rx="1" />

          {/* Carved ring detail — very thin darker band (not silver) */}
          <ellipse cx="76" cy="39" rx="1.5" ry="7" fill="#1a0a04" opacity="0.7" />

          {/* Tier 1 - widening wood */}
          <ellipse cx="68" cy="39" rx="8" ry="14" fill={`url(#${gradId})`} />

          {/* Carved detail ring */}
          <ellipse cx="60" cy="39" rx="1.5" ry="17" fill="#1a0a04" opacity="0.6" />

          {/* Tier 2 - approach to bulb */}
          <ellipse cx="52" cy="39" rx="7" ry="22" fill={`url(#${gradId})`} />

          {/* Carved neck detail */}
          <ellipse cx="44" cy="39" rx="2" ry="24" fill="#1a0a04" opacity="0.55" />

          {/* Main bulb — large rounded end */}
          <ellipse cx="22" cy="39" rx="24" ry="30" fill={`url(#${bulbGradId})`} />

          {/* Carved gothic line on bulb — horizontal */}
          <path
            d="M 4 39 L 46 39"
            stroke="#1a0a04"
            strokeWidth="0.5"
            opacity="0.4"
            fill="none"
          />

          {/* Carved gothic line on bulb — vertical */}
          <path
            d="M 22 11 L 22 67"
            stroke="#1a0a04"
            strokeWidth="0.5"
            opacity="0.35"
            fill="none"
          />

          {/* Small decorative carved circle center */}
          <circle
            cx="22"
            cy="39"
            r="3.5"
            fill="none"
            stroke="#1a0a04"
            strokeWidth="0.5"
            opacity="0.5"
          />

          {/* Specular highlight — wood sheen */}
          <ellipse
            cx="14"
            cy="26"
            rx="8"
            ry="11"
            fill="white"
            opacity="0.07"
          />

          {/* Outer tip — small rounded wood cap */}
          <circle cx="2" cy="39" r="4" fill={`url(#${gradId})`} />
        </g>
      </svg>
    </div>
  )
}
