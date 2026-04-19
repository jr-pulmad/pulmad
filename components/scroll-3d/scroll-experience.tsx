"use client"

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react"
import { Canvas } from "@react-three/fiber"
import { gsap } from "gsap"
import { ScrollRod } from "./scroll-rod"

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
        // Smoothly fade in HTML content
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
      // Rotation amount tied to scroll delta - feels like the paper is rolling
      accRotation += dy * 0.012
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

  // Loading state - show solid dark color to avoid flash
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
      {/* Paper background covering entire viewport - sits behind content */}
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

      {/* Solid paper bands at top and bottom (behind rods) - mask scrolling content */}
      <div
        className="fixed top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "var(--scroll-safe-top)",
          zIndex: 25,
          backgroundImage: "url(/textures/parchment-paper-v2.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          boxShadow: "inset 0 -8px 16px -8px rgba(0,0,0,0.4)",
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
          boxShadow: "inset 0 8px 16px -8px rgba(0,0,0,0.4)",
        }}
        aria-hidden
      />

      {/* HTML content - fades in after opening */}
      <div style={{ opacity: contentOpacity, transition: "none" }}>
        {children}
      </div>

      {/* Burnt left edge */}
      <div
        className="fixed top-0 bottom-0 left-0 pointer-events-none"
        style={{
          width: "70px",
          zIndex: 30,
          backgroundImage: "url(/textures/burnt-edge-left.jpg)",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          mixBlendMode: "multiply",
        }}
        aria-hidden
      />
      {/* Burnt left edge - solid overlay for the very black charred bit */}
      <div
        className="fixed top-0 bottom-0 left-0 pointer-events-none"
        style={{
          width: "30px",
          zIndex: 31,
          backgroundImage: "url(/textures/burnt-edge-left.jpg)",
          backgroundSize: "233% 100%",
          backgroundPosition: "left center",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden
      />

      {/* Burnt right edge */}
      <div
        className="fixed top-0 bottom-0 right-0 pointer-events-none"
        style={{
          width: "70px",
          zIndex: 30,
          backgroundImage: "url(/textures/burnt-edge-right.jpg)",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          mixBlendMode: "multiply",
        }}
        aria-hidden
      />
      <div
        className="fixed top-0 bottom-0 right-0 pointer-events-none"
        style={{
          width: "30px",
          zIndex: 31,
          backgroundImage: "url(/textures/burnt-edge-right.jpg)",
          backgroundSize: "233% 100%",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden
      />

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
          <ambientLight intensity={0.65} />
          <directionalLight position={[4, 6, 8]} intensity={1.4} />
          <directionalLight position={[-4, -2, 6]} intensity={0.35} color="#b8a888" />
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
