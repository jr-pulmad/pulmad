"use client"

import { Suspense, useEffect, useState, type ReactNode } from "react"
import { Canvas } from "@react-three/fiber"
import { gsap } from "gsap"
import { ScrollRod } from "./scroll-rod"

interface ScrollExperienceProps {
  children: ReactNode
}

/**
 * Module-level flag: persists across in-app navigations within the same tab
 * (because the JS module stays resident), but is reset on reload / new tab /
 * when the module is fresh-evaluated. Exactly matches: "play on each reload,
 * but not during client-side navigations".
 */
let hasPlayedInMemory = false

// Camera constants — kept in sync with the Canvas below.
const CAMERA_ZOOM = 50
const ROD_CENTER_OFFSET_WORLD = 0.85 // rod center world-units from viewport edge
const MIN_PAPER_R = 0.42
const MAX_PAPER_R = 1.0

export function ScrollExperience({ children }: ScrollExperienceProps) {
  const [phase, setPhase] = useState<"loading" | "opening" | "open">("loading")
  const [openingProgress, setOpeningProgress] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [contentOpacity, setContentOpacity] = useState(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    if (hasPlayedInMemory || prefersReducedMotion) {
      setPhase("open")
      setOpeningProgress(1)
      setContentOpacity(1)
    } else {
      setPhase("opening")
    }
  }, [])

  // Lock body scroll during the opening animation
  useEffect(() => {
    if (phase === "opening") {
      const original = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [phase])

  // Keep html/body neutral while the scroll is active so fixed & layered
  // elements render correctly (no light #fafafa showing through).
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

  // Drive the opening animation
  useEffect(() => {
    if (phase !== "opening") return

    const obj = { progress: 0 }
    const tween = gsap.to(obj, {
      progress: 1,
      duration: 7.2,
      ease: "power2.inOut",
      onUpdate: () => setOpeningProgress(obj.progress),
      onComplete: () => {
        hasPlayedInMemory = true
        setPhase("open")
        const fade = { o: 0 }
        gsap.to(fade, {
          o: 1,
          duration: 1.1,
          ease: "power2.out",
          onUpdate: () => setContentOpacity(fade.o),
        })
      },
    })

    return () => {
      tween.kill()
    }
  }, [phase])

  // Scroll handler — drives rod spin + the dynamic safe area (so there's no
  // dead gap between the rods and the page header/footer as rolls shrink).
  useEffect(() => {
    if (phase !== "open") return

    let raf = 0
    let lastY = window.scrollY
    let accRotation = 0

    const applySafeAreas = (progress: number) => {
      // Top rod radius grows as user scrolls down; bottom rod shrinks.
      const topR = MIN_PAPER_R + (MAX_PAPER_R - MIN_PAPER_R) * progress
      const bottomR = MAX_PAPER_R - (MAX_PAPER_R - MIN_PAPER_R) * progress

      // Convert to screen px. Orthographic: 1 world unit = CAMERA_ZOOM px.
      // Rod center sits ROD_CENTER_OFFSET_WORLD from viewport edge
      // → in screen px that's CAMERA_ZOOM * ROD_CENTER_OFFSET_WORLD from edge.
      const centerPx = CAMERA_ZOOM * ROD_CENTER_OFFSET_WORLD // 42.5
      const buffer = 10 // small gap so content doesn't touch the rod shadow

      const safeTopPx = Math.round(centerPx + topR * CAMERA_ZOOM + buffer)
      const safeBottomPx = Math.round(centerPx + bottomR * CAMERA_ZOOM + buffer)

      document.documentElement.style.setProperty(
        "--scroll-safe-top",
        `${safeTopPx}px`,
      )
      document.documentElement.style.setProperty(
        "--scroll-safe-bottom",
        `${safeBottomPx}px`,
      )
    }

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      setScrollProgress(progress)
      applySafeAreas(progress)

      const dy = window.scrollY - lastY
      accRotation += dy * 0.014
      setRotationAngle(accRotation)
      lastY = window.scrollY
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
      // Restore defaults on unmount (so other pages don't inherit our values)
      document.documentElement.style.removeProperty("--scroll-safe-top")
      document.documentElement.style.removeProperty("--scroll-safe-bottom")
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
      {/* Dark frame — the world "outside" the scroll.
          The parchment background itself lives on the content wrapper (see page.tsx),
          so it scrolls continuously with the page. */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -30,
          background:
            "radial-gradient(ellipse at center, #150b05 0%, #080402 85%)",
        }}
        aria-hidden
      />

      {/* Page content — the parchment + burnt edges live inside it (see page.tsx) */}
      <div
        data-scroll-content
        style={{ opacity: contentOpacity, transition: "none" }}
      >
        {children}
      </div>

      {/* Cast shadow under the top rod */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "var(--scroll-safe-top)",
          left: "var(--scroll-safe-x)",
          right: "var(--scroll-safe-x)",
          height: "36px",
          zIndex: 20,
          background:
            "linear-gradient(to bottom, rgba(15,8,3,0.6) 0%, rgba(15,8,3,0.28) 55%, rgba(15,8,3,0) 100%)",
          opacity: openingProgress,
          transform: "translateY(-6px)",
        }}
        aria-hidden
      />

      {/* Cast shadow above the bottom rod */}
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "var(--scroll-safe-bottom)",
          left: "var(--scroll-safe-x)",
          right: "var(--scroll-safe-x)",
          height: "36px",
          zIndex: 20,
          background:
            "linear-gradient(to top, rgba(15,8,3,0.6) 0%, rgba(15,8,3,0.28) 55%, rgba(15,8,3,0) 100%)",
          opacity: openingProgress,
          transform: "translateY(6px)",
        }}
        aria-hidden
      />

      {/* 3D Canvas with both rods.
          pointerEvents:none on the Canvas element itself so clicks pass through
          to the underlying page controls (header links, buttons, etc.). */}
      <div className="fixed inset-0" style={{ zIndex: 40, pointerEvents: "none" }} aria-hidden>
        <Canvas
          orthographic
          camera={{ zoom: CAMERA_ZOOM, position: [0, 0, 100], near: 0.1, far: 1000 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 2]}
          style={{ background: "transparent", pointerEvents: "none" }}
        >
          <ambientLight intensity={0.75} />
          <directionalLight position={[4, 6, 8]} intensity={1.2} />
          <directionalLight position={[-5, -3, 6]} intensity={0.4} color="#ffffff" />
          <directionalLight position={[0, 0, 10]} intensity={0.55} color="#ffffff" />
          <Suspense fallback={null}>
            <ScrollRod
              position="top"
              openingProgress={openingProgress}
              scrollProgress={scrollProgress}
              rotationAngle={rotationAngle}
            />
            <ScrollRod
              position="bottom"
              openingProgress={openingProgress}
              scrollProgress={scrollProgress}
              rotationAngle={rotationAngle}
            />
          </Suspense>
        </Canvas>
      </div>
    </>
  )
}
