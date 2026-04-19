"use client"

import { Suspense, useEffect, useState, type ReactNode } from "react"
import { Canvas } from "@react-three/fiber"
import { gsap } from "gsap"
import { ScrollRod } from "./scroll-rod"
import { BurntEdge } from "./burnt-edge"

interface ScrollExperienceProps {
  children: ReactNode
}

// Must match the paper-on-rod horizontal span in 3D.
// rodLength = viewport.width - 2.6 world units, paper = 96% of that,
// at zoom 50 → ~70px inset from each edge.
const EDGE_INSET_PX = 70

export function ScrollExperience({ children }: ScrollExperienceProps) {
  const [phase, setPhase] = useState<"loading" | "opening" | "open">("loading")
  const [openingProgress, setOpeningProgress] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [contentOpacity, setContentOpacity] = useState(0)

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

  useEffect(() => {
    if (phase === "opening") {
      const original = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [phase])

  // Make body transparent so our fixed parchment sheet is visible behind content.
  useEffect(() => {
    if (phase === "loading") return
    const body = document.body
    const html = document.documentElement
    const prevBodyBg = body.style.backgroundColor
    const prevHtmlBg = html.style.backgroundColor
    body.style.backgroundColor = "transparent"
    html.style.backgroundColor = "#080402"
    return () => {
      body.style.backgroundColor = prevBodyBg
      html.style.backgroundColor = prevHtmlBg
    }
  }, [phase])

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

  if (phase === "loading") {
    return (
      <div
        className="fixed inset-0 z-[9999]"
        style={{ background: "#0f0a04" }}
        aria-hidden
      />
    )
  }

  // Parchment sheet grows from the center stripe outward as the scroll opens.
  const sheetInsetY = `calc((100vh / 2 - var(--scroll-safe-top)) * ${1 - openingProgress})`

  return (
    <>
      {/* Dark frame - the world "outside" the scroll */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -30,
          background:
            "radial-gradient(ellipse at center, #150b05 0%, #080402 85%)",
        }}
        aria-hidden
      />

      {/* Central parchment sheet — darker, textured, with burnt edges on its sides.
          Burnt edges live INSIDE this sheet, not globally across the viewport. */}
      <div
        className="fixed pointer-events-none overflow-hidden"
        style={{
          top: `calc(var(--scroll-safe-top) + ${sheetInsetY})`,
          bottom: `calc(var(--scroll-safe-bottom) + ${sheetInsetY})`,
          left: `${EDGE_INSET_PX}px`,
          right: `${EDGE_INSET_PX}px`,
          zIndex: -20,
          backgroundImage: "url(/textures/parchment-detailed.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#b89870",
          backgroundBlendMode: "multiply",
          boxShadow: `
            inset 0 22px 28px -8px rgba(15, 8, 3, 0.55),
            inset 0 -22px 28px -8px rgba(15, 8, 3, 0.55),
            inset 0 60px 90px -60px rgba(0, 0, 0, 0.45),
            inset 0 -60px 90px -60px rgba(0, 0, 0, 0.45)
          `,
          transition: "none",
        }}
        aria-hidden
      >
        {/* Burnt edges scoped to this sheet only */}
        <BurntEdge side="left" width={56} />
        <BurntEdge side="right" width={56} />
      </div>

      {/* Cast shadow directly under the top rod - across the paper only */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: `calc(var(--scroll-safe-top) + ${sheetInsetY})`,
          left: `${EDGE_INSET_PX}px`,
          right: `${EDGE_INSET_PX}px`,
          height: "36px",
          zIndex: 20,
          background:
            "linear-gradient(to bottom, rgba(15,8,3,0.65) 0%, rgba(15,8,3,0.3) 50%, rgba(15,8,3,0) 100%)",
          opacity: openingProgress,
        }}
        aria-hidden
      />

      {/* Cast shadow directly above the bottom rod */}
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: `calc(var(--scroll-safe-bottom) + ${sheetInsetY})`,
          left: `${EDGE_INSET_PX}px`,
          right: `${EDGE_INSET_PX}px`,
          height: "36px",
          zIndex: 20,
          background:
            "linear-gradient(to top, rgba(15,8,3,0.65) 0%, rgba(15,8,3,0.3) 50%, rgba(15,8,3,0) 100%)",
          opacity: openingProgress,
        }}
        aria-hidden
      />

      {/* Page content - transparent so the parchment sheet shows through */}
      <div
        data-scroll-content
        style={{ opacity: contentOpacity, transition: "none", position: "relative", zIndex: 1 }}
      >
        {children}
      </div>

      {/* 3D Canvas with both rods - above sheet, above content bg */}
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
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 8]} intensity={1.2} />
          <directionalLight position={[-5, -3, 6]} intensity={0.45} color="#ffffff" />
          <directionalLight position={[0, 0, 10]} intensity={0.6} color="#ffffff" />
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
