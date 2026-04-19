"use client"

import { Suspense, useEffect, useState, type ReactNode } from "react"
import { Canvas } from "@react-three/fiber"
import { gsap } from "gsap"
import { ScrollRod } from "./scroll-rod"
import { BurntEdge } from "./burnt-edge"

interface ScrollExperienceProps {
  children: ReactNode
}

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

  // Run opening animation
  useEffect(() => {
    if (phase !== "opening") return

    const obj = { progress: 0 }
    const tween = gsap.to(obj, {
      progress: 1,
      duration: 5.5,
      ease: "power3.inOut",
      onUpdate: () => {
        setOpeningProgress(obj.progress)
      },
      onComplete: () => {
        sessionStorage.setItem("scroll-animation-played", "true")
        setPhase("open")
        const fade = { o: 0 }
        gsap.to(fade, {
          o: 1,
          duration: 0.9,
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
        style={{ background: "#1a1108" }}
        aria-hidden
      />
    )
  }

  return (
    <>
      {/* Parchment background covering entire viewport - behind content */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -10,
          backgroundImage: "url(/textures/parchment-paper-v2.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />

      {/* Solid paper bands at top and bottom - behind rods, mask scrolling content */}
      <div
        className="fixed top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "var(--scroll-safe-top)",
          zIndex: 25,
          backgroundImage: "url(/textures/parchment-paper-v2.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          boxShadow: "inset 0 -10px 18px -10px rgba(0,0,0,0.45)",
        }}
        aria-hidden
      />
      <div
        className="fixed bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "var(--scroll-safe-bottom)",
          zIndex: 25,
          backgroundImage: "url(/textures/parchment-paper-v2.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          boxShadow: "inset 0 10px 18px -10px rgba(0,0,0,0.45)",
        }}
        aria-hidden
      />

      {/* HTML page content - fades in after opening */}
      <div style={{ opacity: contentOpacity, transition: "none" }}>
        {children}
      </div>

      {/* Burnt edges - SVG-based for reliability and dramatic irregular shapes */}
      <BurntEdge side="left" />
      <BurntEdge side="right" />

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
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 6, 8]} intensity={1.4} />
          <directionalLight position={[-4, -2, 6]} intensity={0.35} color="#b8a888" />
          <directionalLight position={[0, 0, 10]} intensity={0.4} />
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
