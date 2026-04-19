"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { gsap } from "gsap"

interface ScrollRevealOverlayProps {
  children: ReactNode
  onAnimationComplete?: () => void
}

export function ScrollRevealOverlay({ children, onAnimationComplete }: ScrollRevealOverlayProps) {
  // State: null = checking, true = should animate, false = skip animation
  const [shouldAnimate, setShouldAnimate] = useState<boolean | null>(null)
  const [animationComplete, setAnimationComplete] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const topRollRef = useRef<HTMLDivElement>(null)
  const bottomRollRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // First effect: Check if we should animate (runs once on mount)
  useEffect(() => {
    const hasPlayed = sessionStorage.getItem("scroll-animation-played")
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    
    console.log("[v0] ScrollRevealOverlay mount - hasPlayed:", hasPlayed, "prefersReducedMotion:", prefersReducedMotion)
    
    if (hasPlayed || prefersReducedMotion) {
      console.log("[v0] Skipping animation, showing content directly")
      setShouldAnimate(false)
      setAnimationComplete(true)
    } else {
      console.log("[v0] Will play animation")
      setShouldAnimate(true)
    }
  }, [])

  // Second effect: Run animation if needed
  useEffect(() => {
    console.log("[v0] Animation effect - shouldAnimate:", shouldAnimate)
    if (shouldAnimate !== true) return
    
    console.log("[v0] Refs check - overlay:", !!overlayRef.current, "topRoll:", !!topRollRef.current, "bottomRoll:", !!bottomRollRef.current, "paper:", !!paperRef.current, "content:", !!contentRef.current)
    if (!overlayRef.current || !topRollRef.current || !bottomRollRef.current || !paperRef.current || !contentRef.current) return
    
    console.log("[v0] Starting GSAP animation")

    // Lock body scroll during animation
    document.body.style.overflow = "hidden"

    // Initial state - scroll rolls meet in the center
    gsap.set([topRollRef.current, bottomRollRef.current], { scaleY: 1, opacity: 1 })
    gsap.set(topRollRef.current, { y: "calc(50vh - 40px)" })
    gsap.set(bottomRollRef.current, { y: "calc(-50vh + 40px)" })
    gsap.set(paperRef.current, { clipPath: "inset(50% 0 50% 0)", opacity: 1 })
    gsap.set(contentRef.current, { opacity: 0 })

    const tl = gsap.timeline({
      onComplete: () => {
        setAnimationComplete(true)
        sessionStorage.setItem("scroll-animation-played", "true")
        document.body.style.overflow = ""
        onAnimationComplete?.()
      }
    })

    // Phase 1: Fade in from dark (0-0.5s)
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.inOut" })

    // Phase 2: Scroll unrolls (0.5-4.5s)
    .to(topRollRef.current, { y: 0, duration: 4, ease: "power1.inOut" }, "unroll")
    .to(bottomRollRef.current, { y: 0, duration: 4, ease: "power1.inOut" }, "unroll")
    .to(paperRef.current, { clipPath: "inset(0% 0 0% 0)", duration: 4, ease: "power1.inOut" }, "unroll")

    // Phase 3: Subtle settle bounce
    .to(topRollRef.current, { y: -3, duration: 0.15, ease: "power2.out" })
    .to(topRollRef.current, { y: 0, duration: 0.25, ease: "elastic.out(1.2, 0.5)" })
    .to(bottomRollRef.current, { y: 3, duration: 0.15, ease: "power2.out" }, "-=0.4")
    .to(bottomRollRef.current, { y: 0, duration: 0.25, ease: "elastic.out(1.2, 0.5)" })

    // Phase 4: Content fades in
    .to(contentRef.current, { opacity: 1, duration: 0.5, ease: "power2.inOut" })

    // Phase 5: Overlay fades out
    .to(overlayRef.current, { opacity: 0, duration: 0.5, ease: "power2.inOut" })

    return () => {
      tl.kill()
      document.body.style.overflow = ""
    }
  }, [shouldAnimate, onAnimationComplete])

  // While checking session, show a loading state (dark background to prevent flash)
  if (shouldAnimate === null) {
    return (
      <div className="fixed inset-0 z-[9999]" style={{ backgroundColor: "#2a2520" }} />
    )
  }

  // If animation is skipped or complete, just render children
  if (shouldAnimate === false || animationComplete) {
    return <>{children}</>
  }

  // Show animation overlay
  return (
    <>
      {/* Overlay for animation */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] pointer-events-auto"
        style={{ backgroundColor: "#2a2520", opacity: 0 }}
        aria-hidden="true"
      >
        {/* Top scroll roll */}
        <div
          ref={topRollRef}
          className="absolute top-0 left-0 right-0 h-20 z-20"
          style={{
            background: `linear-gradient(180deg, 
              #3d3629 0%, #5a5045 15%, #a8a8a8 20%, #6b6b6b 25%, 
              #4a4035 35%, #5a5045 50%, #3d3629 100%)`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)",
            borderRadius: "0 0 100% 100% / 0 0 30px 30px",
          }}
        >
          <div 
            className="absolute top-2 left-4 right-4 h-3 rounded-full opacity-30"
            style={{ background: "linear-gradient(180deg, rgba(168,168,168,0.6) 0%, transparent 100%)" }}
          />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 5px)`
          }} />
        </div>

        {/* Paper/parchment background */}
        <div
          ref={paperRef}
          className="absolute inset-0 z-10"
          style={{
            background: `linear-gradient(135deg, 
              #f5f0e6 0%, #e8e0d0 25%, #f0e8da 50%, #e5ddd0 75%, #f2ebe0 100%)`,
          }}
        >
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              background: `radial-gradient(ellipse at 20% 30%, #8b7355 0%, transparent 50%),
                radial-gradient(ellipse at 80% 70%, #8b7355 0%, transparent 40%),
                radial-gradient(ellipse at 60% 20%, #6b5344 0%, transparent 30%)`,
            }}
          />
        </div>

        {/* Bottom scroll roll */}
        <div
          ref={bottomRollRef}
          className="absolute bottom-0 left-0 right-0 h-20 z-20"
          style={{
            background: `linear-gradient(0deg, 
              #3d3629 0%, #5a5045 15%, #a8a8a8 20%, #6b6b6b 25%, 
              #4a4035 35%, #5a5045 50%, #3d3629 100%)`,
            boxShadow: "0 -8px 32px rgba(0,0,0,0.5), 0 -2px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(0,0,0,0.2)",
            borderRadius: "100% 100% 0 0 / 30px 30px 0 0",
          }}
        >
          <div 
            className="absolute bottom-2 left-4 right-4 h-3 rounded-full opacity-30"
            style={{ background: "linear-gradient(0deg, rgba(168,168,168,0.6) 0%, transparent 100%)" }}
          />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 5px)`
          }} />
        </div>
      </div>

      {/* Content (starts hidden, fades in during animation) */}
      <div ref={contentRef} style={{ opacity: 0 }}>
        {children}
      </div>
    </>
  )
}
