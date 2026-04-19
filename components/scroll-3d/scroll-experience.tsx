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
const ORNAMENT_HEIGHT_PX = 110
const ORNAMENT_WIDTH_PX = 140

// Horizontal content padding: paper extends edge-to-edge; ornaments sit on top.
// Content starts just after where the ornament bulb ends visually.
const SAFE_X_DESKTOP = 72
const SAFE_X_MOBILE = 42

export function ScrollExperience({ children }: ScrollExperienceProps) {
  const [phase, setPhase] = useState<"loading" | "opening" | "open">("loading")
  const progressRef = useRef<RodProgressRef>({ opening: 0, scroll: 0, rotation: 0 })

  // Compute safe-area pixels from the current opening progress + scroll position.
  // Also writes --scroll-opening so ornaments can interpolate their positions in CSS.
  const applyCSSVars = (opening: number, scroll: number) => {
    // Rod center Y (in pixels from top/bottom edge)
    const rodCenterOpen = CAMERA_ZOOM * ROD_CENTER_Y_OFFSET // e.g. 42.5
    const viewportCenterY = window.innerHeight / 2
    // During opening: rods move from viewport center (closed) to rodCenterOpen from edge
    const topRodCenterPxFromTop = (1 - opening) * viewportCenterY + opening * rodCenterOpen
    const bottomRodCenterPxFromBottom = topRodCenterPxFromTop

    // Paper radius for top rod: MAX when closed (opening=0), interpolates to
    // (MIN + (MAX - MIN) * scroll) when fully open.
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

  // Phase transitions: decide on mount whether to play
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    if (hasPlayedInMemory || prefersReducedMotion) {
      progressRef.current.opening = 1
      applyCSSVars(1, 0)
      setPhase("open")
    } else {
      // Start at closed so the very first frame shows the stacked-scroll
      applyCSSVars(0, 0)
      setPhase("opening")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep html/body neutral while scroll experience is active
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

  // Lock page scroll during opening
  useEffect(() => {
    if (phase !== "opening") return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [phase])

  // Opening tween — writes to ref + CSS vars every frame. Zero React renders.
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

  // Scroll + resize handler in "open" phase. Updates CSS vars and ref values.
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
      // Clean up so other routes have a normal layout
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
      {/* Viewport-level parchment — NOT inside any stacking context, so it's
          actually fixed to the viewport and never splits. The parchment is
          visible as ONE continuous sheet across the entire page regardless
          of how tall content becomes. */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -10,
          backgroundImage: "url(/textures/parchment-detailed.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#9d7b55",
          backgroundBlendMode: "multiply",
        }}
        aria-hidden
      />

      {/* Dark outer frame — fallback for anywhere that might slip through */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -20,
          background: "radial-gradient(ellipse at center, #150b05 0%, #050200 85%)",
        }}
        aria-hidden
      />

      {/* Content — rendered at opacity 1 from the start. The dark mask strips
          below hide the "outside the scroll" portions; content is revealed
          naturally as the mask strips shrink. */}
      {children}

      {/* Dark top mask — covers everything above var(--scroll-safe-top).
          When rods are stacked in the center (opening=0), the mask is HUGE
          and covers the entire top half of viewport. As rods separate, the
          mask shrinks, exposing content underneath. */}
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

      {/* 3D canvas with both rods */}
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

      {/* SVG ornaments at each rod end — positions track the opening progress
          via CSS calc, so they're visually attached to the rods throughout
          the animation. */}
      <Ornament corner="top-left" />
      <Ornament corner="top-right" />
      <Ornament corner="bottom-left" />
      <Ornament corner="bottom-right" />
    </>
  )
}

/** Inline SVG ornament — no external assets, true transparency, detailed wood + silver. */
function Ornament({
  corner,
}: {
  corner: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}) {
  const isTop = corner.startsWith("top")
  const isLeft = corner.endsWith("left")
  const rodCenterOpenPx = CAMERA_ZOOM * ROD_CENTER_Y_OFFSET // 42.5

  // Position: at opening=0 both rods are at viewport center, at opening=1
  // they're at rodCenterOpenPx from the edge. Subtract half ornament height
  // so it's centered on the rod.
  // Using calc lets the browser interpolate smoothly via --scroll-opening.
  const verticalExpr = isTop
    ? `calc((1 - var(--scroll-opening, 1)) * 50vh + var(--scroll-opening, 1) * ${rodCenterOpenPx}px - ${ORNAMENT_HEIGHT_PX / 2}px)`
    : `calc((1 - var(--scroll-opening, 1)) * 50vh + var(--scroll-opening, 1) * ${rodCenterOpenPx}px - ${ORNAMENT_HEIGHT_PX / 2}px)`

  const vertical = isTop ? { top: verticalExpr } : { bottom: verticalExpr }
  const horizontal = isLeft ? { left: 0 } : { right: 0 }
  const mirror = isLeft ? "scaleX(1)" : "scaleX(-1)"

  const gradId = `ornWood-${corner}`
  const bulbGradId = `ornBulb-${corner}`
  const silverGradId = `ornSilver-${corner}`
  const shadowId = `ornShadow-${corner}`

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        ...vertical,
        ...horizontal,
        width: `${ORNAMENT_WIDTH_PX}px`,
        height: `${ORNAMENT_HEIGHT_PX}px`,
        zIndex: 50,
        transform: mirror,
      }}
      aria-hidden
    >
      <svg
        viewBox="0 0 140 110"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3d1f0a" />
            <stop offset="30%" stopColor="#5a2e14" />
            <stop offset="60%" stopColor="#4a2410" />
            <stop offset="100%" stopColor="#1a0a04" />
          </linearGradient>
          <radialGradient id={bulbGradId} cx="32%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#7a4424" />
            <stop offset="45%" stopColor="#4d2410" />
            <stop offset="85%" stopColor="#22100a" />
            <stop offset="100%" stopColor="#0a0402" />
          </radialGradient>
          <linearGradient id={silverGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#eee6d4" />
            <stop offset="45%" stopColor="#9c968a" />
            <stop offset="85%" stopColor="#4a4540" />
            <stop offset="100%" stopColor="#1f1c18" />
          </linearGradient>
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.65" />
          </filter>
        </defs>

        <g filter={`url(#${shadowId})`}>
          {/* Shaft attaching to rod (rightmost) */}
          <rect x="120" y="48" width="20" height="14" fill={`url(#${gradId})`} />
          {/* Inner silver collar */}
          <ellipse cx="120" cy="55" rx="3" ry="11" fill={`url(#${silverGradId})`} />
          {/* First wood bead */}
          <ellipse cx="114" cy="55" rx="4" ry="14" fill={`url(#${gradId})`} />
          {/* Silver ring */}
          <ellipse cx="108" cy="55" rx="2.5" ry="17" fill={`url(#${silverGradId})`} />
          {/* Tier 1 - wider wood */}
          <ellipse cx="100" cy="55" rx="6" ry="22" fill={`url(#${gradId})`} />
          {/* Silver engraved band */}
          <ellipse cx="92" cy="55" rx="2.5" ry="25" fill={`url(#${silverGradId})`} />
          {/* Tier 2 - wood approaching bulb */}
          <ellipse cx="82" cy="55" rx="7" ry="30" fill={`url(#${gradId})`} />
          {/* Silver collar */}
          <ellipse cx="72" cy="55" rx="2.5" ry="34" fill={`url(#${silverGradId})`} />
          {/* Main bulb — rounded, large */}
          <ellipse cx="38" cy="55" rx="34" ry="44" fill={`url(#${bulbGradId})`} />
          {/* Gothic cross carving */}
          <path
            d="M 38 24 L 38 86"
            stroke="#a89d8a"
            strokeWidth="0.8"
            opacity="0.35"
            fill="none"
          />
          <path
            d="M 14 55 L 58 55"
            stroke="#a89d8a"
            strokeWidth="0.8"
            opacity="0.35"
            fill="none"
          />
          <circle
            cx="38"
            cy="55"
            r="5"
            fill="none"
            stroke="#b8b0a0"
            strokeWidth="0.7"
            opacity="0.4"
          />
          {/* Decorative silver ring on bulb */}
          <ellipse
            cx="54"
            cy="55"
            rx="2"
            ry="42"
            fill={`url(#${silverGradId})`}
            opacity="0.9"
          />
          {/* Bulb specular highlight */}
          <ellipse
            cx="26"
            cy="38"
            rx="11"
            ry="15"
            fill="white"
            opacity="0.08"
          />
          {/* Outer silver cap (tiny bead at very end) */}
          <circle cx="6" cy="55" r="5" fill={`url(#${silverGradId})`} />
        </g>
      </svg>
    </div>
  )
}
