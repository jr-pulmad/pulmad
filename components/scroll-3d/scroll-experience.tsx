"use client"

import { Suspense, useEffect, useState, type ReactNode } from "react"
import { Canvas } from "@react-three/fiber"
import { gsap } from "gsap"
import { ScrollRod } from "./scroll-rod"
import { BurntEdge } from "./burnt-edge"

interface ScrollExperienceProps {
  children: ReactNode
}

// Horizontal inset for burnt edges + paper sheet - must match
// the paper-on-rod span in 3D (rodLength = viewport.width - 2.6 world units,
// paperSection = rodLength * 0.96 ≈ viewport.width - 3.4 units).
// At zoom 50 that's ~85px from each edge to the paper start. We use 70px here
// and let the burnt edge mask the transition softly.
const EDGE_INSET_PX = 70

export function ScrollExperience({ children }: ScrollExperienceProps) {
  const [phase, setPhase] = useState<"loading" | "opening" | "open">("loading")
  const [openingProgress, setOpeningProgress] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [contentOpacity, setContentOpacity] = useState(0)

  // Determine initial phase
  useEffect(() => {
    const hasPlayed = sessionStorage.getItem("scroll-animation-played")
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (hasPlayed || prefersReducedMotion) {
      setPhase("open")
      setOpeningProgress(1)
      setContentOpacity(1)
    } else {
      setPhase("opening")
    }
  }, [])

  // Lock body scroll during opening animation
  useEffect(() => {
    if (phase === "opening") {
      const original = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [phase])

  // Run opening animation - slow and dramatic
  useEffect(() => {
    if (phase !== "opening") return

    const obj = { progress: 0 }
    const tween = gsap.to(obj, {
      progress: 1,
      duration: 7.2,
      ease: "power2.inOut",
      onUpdate: () => {
        setOpeningProgress(obj.progress)
      },
      onComplete: () => {
        sessionStorage.setItem("scroll-animation-played", "true")
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

  // Track page scroll for scroll-reactive rolling
  useEffect(() => {
    if (phase !== "open") return

    let raf = 0
    let lastY = window.scrollY
    let accRotation = 0

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      setScrollProgress(progress)

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
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [phase])

  // Loading state - show dark background to avoid flash
  if (phase === "loading") {
    return (
      <div
        className="fixed inset-0 z-[9999]"
        style={{ background: "#100a04" }}
        aria-hidden
      />
    )
  }

  // Sheet is visually "behind" rods during opening, but expands vertically
  // along with them. At opening=0 sheet collapses to the center strip; at
  // opening=1 it spans between the two rods.
  const sheetInsetY = `calc((100vh / 2 - var(--scroll-safe-top)) * ${1 - openingProgress})`

  return (
    <>
      {/* Dark frame background - the world "outside" the scroll */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -20,
          background:
            "radial-gradient(ellipse at center, #1c1108 0%, #0a0603 85%)",
        }}
        aria-hidden
      />

      {/* Central parchment sheet - same width as paper-on-rod section.
          Hangs between the two rods, with visible cast shadows from rods above/below. */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: `calc(var(--scroll-safe-top) + ${sheetInsetY})`,
          bottom: `calc(var(--scroll-safe-bottom) + ${sheetInsetY})`,
          left: `${EDGE_INSET_PX}px`,
          right: `${EDGE_INSET_PX}px`,
          zIndex: -10,
          backgroundImage: "url(/textures/parchment-paper-v2.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          // Strong inner shadows from top and bottom rods give the 3D effect
          // of paper hanging in space behind cylindrical rolls.
          boxShadow: `
            inset 0 22px 28px -8px rgba(20, 10, 4, 0.55),
            inset 0 -22px 28px -8px rgba(20, 10, 4, 0.55),
            inset 0 60px 80px -60px rgba(0, 0, 0, 0.35),
            inset 0 -60px 80px -60px rgba(0, 0, 0, 0.35)
          `,
          transition: "none",
        }}
        aria-hidden
      />

      {/* Hard cast shadow strip directly under the top rod */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: `calc(var(--scroll-safe-top) + ${sheetInsetY})`,
          left: `${EDGE_INSET_PX}px`,
          right: `${EDGE_INSET_PX}px`,
          height: "32px",
          zIndex: 20,
          background:
            "linear-gradient(to bottom, rgba(20,10,4,0.55) 0%, rgba(20,10,4,0.25) 50%, rgba(20,10,4,0) 100%)",
          opacity: openingProgress,
        }}
        aria-hidden
      />

      {/* Hard cast shadow strip directly above the bottom rod */}
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: `calc(var(--scroll-safe-bottom) + ${sheetInsetY})`,
          left: `${EDGE_INSET_PX}px`,
          right: `${EDGE_INSET_PX}px`,
          height: "32px",
          zIndex: 20,
          background:
            "linear-gradient(to top, rgba(20,10,4,0.55) 0%, rgba(20,10,4,0.25) 50%, rgba(20,10,4,0) 100%)",
          opacity: openingProgress,
        }}
        aria-hidden
      />

      {/* HTML page content - fades in after opening */}
      <div style={{ opacity: contentOpacity, transition: "none" }}>
        {children}
      </div>

      {/* Burnt edges - narrow, realistic, with ember sparks */}
      <BurntEdge side="left" width={EDGE_INSET_PX} />
      <BurntEdge side="right" width={EDGE_INSET_PX} />

      {/* 3D Canvas with both rods */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 40 }}
        aria-hidden
      >
        <Canvas
          orthographic
          camera={{ zoom: 50, position: [0, 0, 100], near: 0.1, far: 1000 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 2]}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.55} />
          <directionalLight position={[4, 6, 8]} intensity={1.3} />
          <directionalLight position={[-5, -3, 6]} intensity={0.35} color="#ffffff" />
          <directionalLight position={[0, 0, 10]} intensity={0.5} color="#ffffff" />
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
