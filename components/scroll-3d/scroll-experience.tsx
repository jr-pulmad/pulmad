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
const ORNAMENT_HEIGHT_PX = 70
const ORNAMENT_WIDTH_PX = 48
const SAFE_X_DESKTOP = ORNAMENT_WIDTH_PX        // 48px — paper overlaps ornament slightly
const SAFE_X_MOBILE = Math.round(ORNAMENT_WIDTH_PX * 0.65) // ~31px on mobile

const EXTRA_EDGE_MARGIN = 0

// Very small gap between the bottom of the top roll and the header top.
const HEADER_GAP = 4

export function ScrollExperience({ children }: ScrollExperienceProps) {
  const [phase, setPhase] = useState<"loading" | "opening" | "open">("loading")
  const progressRef = useRef<RodProgressRef>({ opening: 0, scroll: 0, rotation: 0 })

  const applyCSSVars = (opening: number, scroll: number) => {
    const rodCenterOpen = CAMERA_ZOOM * ROD_CENTER_Y_OFFSET + EXTRA_EDGE_MARGIN
    const viewportCenterY = window.innerHeight / 2
    const topRodCenterPxFromTop = (1 - opening) * viewportCenterY + opening * rodCenterOpen
    const bottomRodCenterPxFromBottom = topRodCenterPxFromTop

    // FIXED paper height when open: always 50% of the previous max radius.
    // No more growing/shrinking on scroll.
    const FIXED_OPEN_R = (ROD_PAPER_MIN_R + ROD_PAPER_MAX_R) / 2
    const topR = ROD_PAPER_MAX_R + (FIXED_OPEN_R - ROD_PAPER_MAX_R) * opening
    const bottomR = ROD_PAPER_MAX_R + (FIXED_OPEN_R - ROD_PAPER_MAX_R) * opening

    const safeTopPx = Math.round(topRodCenterPxFromTop + topR * CAMERA_ZOOM)
    const safeBottomPx = Math.round(bottomRodCenterPxFromBottom + bottomR * CAMERA_ZOOM)
    const safeX = window.innerWidth < 640 ? SAFE_X_MOBILE : SAFE_X_DESKTOP

    // STATIC header top — based on the OPEN-state safe area only, so the
    // header doesn't move during the opening animation or scroll.
    const openTopR = FIXED_OPEN_R
    const openSafeTopPx = Math.round(rodCenterOpen + openTopR * CAMERA_ZOOM)
    const headerTopPx = openSafeTopPx + HEADER_GAP

    const root = document.documentElement
    root.style.setProperty("--scroll-safe-top", `${safeTopPx}px`)
    root.style.setProperty("--scroll-safe-bottom", `${safeBottomPx}px`)
    root.style.setProperty("--scroll-safe-x", `${safeX}px`)
    root.style.setProperty("--scroll-opening", `${opening}`)
    root.style.setProperty("--header-top", `${headerTopPx}px`)
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
    // Activate parchment colour palette for the home page only
    html.setAttribute("data-page", "home")
    return () => {
      body.style.backgroundColor = prevBodyBg
      html.style.backgroundColor = prevHtmlBg
      html.removeAttribute("data-page")
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
          backgroundImage: "url(/textures/old-paper.jpg)",
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
          the ornament's inner edge visually. overflow:hidden is critical to
          prevent the canvas/WebGL from contributing to scrollWidth. */}
      <div
        className="fixed inset-0"
        style={{ zIndex: 40, pointerEvents: "none", overflow: "hidden" }}
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
  const rodCenterOpenPx = CAMERA_ZOOM * ROD_CENTER_Y_OFFSET + EXTRA_EDGE_MARGIN

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
      {/* viewBox width 64 to match narrower 60px rendered width, height 78 unchanged */}
      <svg
        viewBox="0 0 64 78"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", display: "block", overflow: "hidden" }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradId} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#4a2a14" />
            <stop offset="50%" stopColor="#5c3620" />
            <stop offset="100%" stopColor="#2a1608" />
          </linearGradient>
          <radialGradient id={bulbGradId} cx="30%" cy="28%" r="78%">
            <stop offset="0%" stopColor="#7d4a2a" />
            <stop offset="38%" stopColor="#5a3018" />
            <stop offset="78%" stopColor="#2e160a" />
            <stop offset="100%" stopColor="#1a0a04" />
          </radialGradient>
          <filter id={shadowId} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.65" />
          </filter>
        </defs>

        <g filter={`url(#${shadowId})`}>
          {/* Inner shaft — right edge, hidden under rolling paper */}
          <rect x="56" y="35" width="8" height="8" fill={`url(#${gradId})`} />
          {/* Narrow neck */}
          <rect x="48" y="33" width="10" height="12" fill={`url(#${gradId})`} rx="1" />
          {/* Carved ring */}
          <ellipse cx="46" cy="39" rx="1.5" ry="7" fill="#1a0a04" opacity="0.7" />
          {/* Widening tier */}
          <ellipse cx="39" cy="39" rx="7" ry="14" fill={`url(#${gradId})`} />
          {/* Ring detail */}
          <ellipse cx="33" cy="39" rx="1.5" ry="17" fill="#1a0a04" opacity="0.6" />
          {/* Approach to bulb */}
          <ellipse cx="27" cy="39" rx="6" ry="21" fill={`url(#${gradId})`} />
          {/* Neck before bulb */}
          <ellipse cx="21" cy="39" rx="1.8" ry="23" fill="#1a0a04" opacity="0.5" />
          {/* Main bulb — same 24×30 size as before, just shifted left */}
          <ellipse cx="14" cy="39" rx="16" ry="30" fill={`url(#${bulbGradId})`} />

          {/* Gothic cross on bulb — horizontal */}
          <path d="M 0 39 L 30 39" stroke="#1a0a04" strokeWidth="0.5" opacity="0.4" fill="none" />
          {/* Gothic cross on bulb — vertical */}
          <path d="M 14 11 L 14 67" stroke="#1a0a04" strokeWidth="0.5" opacity="0.35" fill="none" />
          {/* Carved circle at center */}
          <circle cx="14" cy="39" r="3.5" fill="none" stroke="#1a0a04" strokeWidth="0.5" opacity="0.5" />
          {/* Specular highlight */}
          <ellipse cx="8" cy="26" rx="6" ry="9" fill="white" opacity="0.07" />
          {/* Outer tip cap */}
          <circle cx="2" cy="39" r="3" fill={`url(#${gradId})`} />
        </g>
      </svg>
    </div>
  )
}
