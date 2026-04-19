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

/**
 * Module-level flag: persists across in-app navigations within the same tab
 * (because the JS module stays resident), but is reset on full reload / new tab.
 * Matches the spec: "play on each reload, but not during client-side nav".
 */
let hasPlayedInMemory = false

const CAMERA_ZOOM = 50
// Vertical extent of an ornament image in screen pixels — the ornament
// always stays fully within the viewport and is centered on the rod.
const ORNAMENT_HEIGHT_PX = 110
const ORNAMENT_WIDTH_PX = 130

export function ScrollExperience({ children }: ScrollExperienceProps) {
  const [phase, setPhase] = useState<"loading" | "opening" | "open">("loading")
  // isOpen drives the CSS fade-in of children + shadows. It flips once at the
  // end of the opening animation — no per-frame state updates ⇒ no lag.
  const [isOpen, setIsOpen] = useState(false)

  // Shared animation state consumed directly by the 3D scene via useFrame
  const progressRef = useRef<RodProgressRef>({ opening: 0, scroll: 0, rotation: 0 })

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    if (hasPlayedInMemory || prefersReducedMotion) {
      progressRef.current.opening = 1
      setPhase("open")
      setIsOpen(true)
    } else {
      setPhase("opening")
    }
  }, [])

  // Lock page scroll during the opening animation
  useEffect(() => {
    if (phase === "opening") {
      const original = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [phase])

  // Keep html/body neutral while the scroll is active so our fixed parchment
  // and dark frame render correctly. Restore on unmount so other pages get
  // their normal background back.
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

  // Opening tween — writes directly to the ref on every frame (NO React renders)
  useEffect(() => {
    if (phase !== "opening") return

    const obj = { v: 0 }
    const tween = gsap.to(obj, {
      v: 1,
      duration: 6.0,
      ease: "power2.inOut",
      onUpdate: () => {
        progressRef.current.opening = obj.v
      },
      onComplete: () => {
        hasPlayedInMemory = true
        progressRef.current.opening = 1
        setPhase("open")
        setIsOpen(true)
      },
    })

    return () => {
      tween.kill()
    }
  }, [phase])

  // Scroll handler — updates ref + CSS custom properties (no React state churn).
  // Also computes live safe areas so Header / Footer margins track the rod size
  // exactly (zero gap between rod and content).
  useEffect(() => {
    if (phase !== "open") return

    let raf = 0
    let lastY = window.scrollY
    let acc = 0

    const applySafeAreas = (scroll: number) => {
      const topR = ROD_PAPER_MIN_R + (ROD_PAPER_MAX_R - ROD_PAPER_MIN_R) * scroll
      const bottomR = ROD_PAPER_MAX_R - (ROD_PAPER_MAX_R - ROD_PAPER_MIN_R) * scroll

      const centerPx = CAMERA_ZOOM * ROD_CENTER_Y_OFFSET // 42.5px
      // No buffer → content touches the rolls with the cast shadow overlapping it
      const safeTopPx = Math.round(centerPx + topR * CAMERA_ZOOM)
      const safeBottomPx = Math.round(centerPx + bottomR * CAMERA_ZOOM)

      const root = document.documentElement
      root.style.setProperty("--scroll-safe-top", `${safeTopPx}px`)
      root.style.setProperty("--scroll-safe-bottom", `${safeBottomPx}px`)
      // Horizontal inset equals the burnt-edge overlay width so content never
      // falls under the burnt edges.
      const safeX = window.innerWidth < 640 ? 36 : 52
      root.style.setProperty("--scroll-safe-x", `${safeX}px`)
    }

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const s = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      progressRef.current.scroll = s

      const dy = window.scrollY - lastY
      acc += dy * 0.014
      progressRef.current.rotation = acc
      lastY = window.scrollY

      applySafeAreas(s)
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
      // Restore default safe areas (0) so other routes are unaffected
      const root = document.documentElement
      root.style.removeProperty("--scroll-safe-top")
      root.style.removeProperty("--scroll-safe-bottom")
      root.style.removeProperty("--scroll-safe-x")
    }
  }, [phase])

  // Also apply safe areas during the OPENING animation so that Header / sections
  // lay out correctly even while content is faded out. Use the "closed" values
  // (max paper radius both rods) — matches the visual stacked-in-center state.
  useEffect(() => {
    if (phase !== "opening") return
    const centerPx = CAMERA_ZOOM * ROD_CENTER_Y_OFFSET
    const closedPx = Math.round(centerPx + ROD_PAPER_MAX_R * CAMERA_ZOOM)
    const root = document.documentElement
    root.style.setProperty("--scroll-safe-top", `${closedPx}px`)
    root.style.setProperty("--scroll-safe-bottom", `${closedPx}px`)
    const safeX = window.innerWidth < 640 ? 36 : 52
    root.style.setProperty("--scroll-safe-x", `${safeX}px`)
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
      {/* Dark outer frame — everything "outside" the scroll */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -30,
          background:
            "radial-gradient(ellipse at center, #150b05 0%, #080402 85%)",
        }}
        aria-hidden
      />

      {/* Page content (parchment + burnt edges wrap this in page.tsx).
          Fades in over ~1s once the opening animation completes. */}
      <div
        data-scroll-content
        style={{
          opacity: isOpen ? 1 : 0,
          transition: "opacity 1s ease-out",
        }}
      >
        {children}
      </div>

      {/* Cast shadow projected DOWN onto content, from under the top rod.
          Sits just below var(--scroll-safe-top) so it visibly darkens the top
          of the content instead of floating above it. */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "var(--scroll-safe-top)",
          left: 0,
          right: 0,
          height: "38px",
          zIndex: 20,
          background:
            "linear-gradient(to bottom, rgba(15,8,3,0.72) 0%, rgba(15,8,3,0.35) 50%, rgba(15,8,3,0) 100%)",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.8s ease-out",
        }}
        aria-hidden
      />

      {/* Cast shadow projected UP onto content, from above the bottom rod */}
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "var(--scroll-safe-bottom)",
          left: 0,
          right: 0,
          height: "38px",
          zIndex: 20,
          background:
            "linear-gradient(to top, rgba(15,8,3,0.72) 0%, rgba(15,8,3,0.35) 50%, rgba(15,8,3,0) 100%)",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.8s ease-out",
        }}
        aria-hidden
      />

      {/* 3D Canvas with both rods. pointerEvents:none so clicks pass through. */}
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

      {/* Static photorealistic ornaments — one per rod end (4 total). 
          Positioned precisely on the rod center (42.5px from viewport edge) and
          the outer screen edge. During the opening animation both rods are 
          stacked in the center of the viewport, so the ornaments fade in with 
          the content once the scroll has opened. */}
      <Ornament corner="top-left" visible={isOpen} />
      <Ornament corner="top-right" visible={isOpen} />
      <Ornament corner="bottom-left" visible={isOpen} />
      <Ornament corner="bottom-right" visible={isOpen} />
    </>
  )
}

function Ornament({
  corner,
  visible,
}: {
  corner: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  visible: boolean
}) {
  const isTop = corner.startsWith("top")
  const isLeft = corner.endsWith("left")

  // Rod center is CAMERA_ZOOM * ROD_CENTER_Y_OFFSET = 42.5px from the edge.
  const rodCenterOffsetPx = CAMERA_ZOOM * ROD_CENTER_Y_OFFSET

  const vertical = isTop
    ? { top: `${rodCenterOffsetPx - ORNAMENT_HEIGHT_PX / 2}px` }
    : { bottom: `${rodCenterOffsetPx - ORNAMENT_HEIGHT_PX / 2}px` }

  const horizontal = isLeft ? { left: 0 } : { right: 0 }

  // Our ornament image is authored with the narrow shaft on the RIGHT and
  // the big bulb on the LEFT. For a left-rod-end this is correct (bulb at
  // outer screen edge). For a right-rod-end we mirror horizontally so the
  // bulb still sits at the outer screen edge.
  const mirror = isLeft ? "scaleX(1)" : "scaleX(-1)"

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        ...vertical,
        ...horizontal,
        width: `${ORNAMENT_WIDTH_PX}px`,
        height: `${ORNAMENT_HEIGHT_PX}px`,
        zIndex: 50,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease-out",
        transform: mirror,
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.6))",
      }}
      aria-hidden
    >
      <img
        src="/textures/scroll-ornament.jpg"
        alt=""
        className="w-full h-full object-contain"
        style={{
          // The JPG has a pure black background; `screen`/`multiply` would not help.
          // Instead we use `mix-blend-mode: lighten` so anything at or below the
          // dark outer-frame color vanishes, keeping only the ornament itself.
          mixBlendMode: "lighten",
        }}
        draggable={false}
      />
    </div>
  )
}
