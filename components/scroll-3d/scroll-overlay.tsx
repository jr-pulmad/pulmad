"use client"

import { useEffect, useState, useRef, type ReactNode } from "react"
import { gsap } from "gsap"

interface Scroll3DOverlayProps {
  children: ReactNode
}

export function Scroll3DOverlay({ children }: Scroll3DOverlayProps) {
  const [shouldAnimate, setShouldAnimate] = useState<boolean | null>(null)
  const [animationComplete, setAnimationComplete] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const topRodRef = useRef<HTMLDivElement>(null)
  const bottomRodRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)
  const leftBurnRef = useRef<HTMLDivElement>(null)
  const rightBurnRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Check if we should animate on mount
  useEffect(() => {
    const hasPlayed = sessionStorage.getItem("scroll-animation-played-v3")
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    
    if (hasPlayed || prefersReducedMotion) {
      setShouldAnimate(false)
      setAnimationComplete(true)
    } else {
      setShouldAnimate(true)
      document.body.style.overflow = "hidden"
    }
  }, [])

  // Run animation
  useEffect(() => {
    if (shouldAnimate !== true) return
    if (!overlayRef.current || !topRodRef.current || !bottomRodRef.current || !paperRef.current) return

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("scroll-animation-played-v3", "true")
        
        // Fade out overlay
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => {
            setAnimationComplete(true)
            document.body.style.overflow = ""
          }
        })
        
        // Fade in content
        if (contentRef.current) {
          gsap.to(contentRef.current, {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
          })
        }
      }
    })

    // Initial state - both rods in center, paper minimal
    gsap.set(topRodRef.current, { y: "50vh", transformOrigin: "center" })
    gsap.set(bottomRodRef.current, { y: "-50vh", transformOrigin: "center" })
    gsap.set(paperRef.current, { scaleY: 0, transformOrigin: "center" })
    if (leftBurnRef.current) gsap.set(leftBurnRef.current, { scaleY: 0, transformOrigin: "center" })
    if (rightBurnRef.current) gsap.set(rightBurnRef.current, { scaleY: 0, transformOrigin: "center" })

    // Dramatic pause at start
    tl.to({}, { duration: 0.8 })

    // Main unrolling animation - 5 seconds, realistic easing
    // Rods move apart while paper expands between them
    tl.to(topRodRef.current, {
      y: "calc(-50vh + var(--scroll-safe-top, 90px))",
      duration: 5,
      ease: "power2.inOut",
    }, "unroll")
    
    tl.to(bottomRodRef.current, {
      y: "calc(50vh - var(--scroll-safe-bottom, 90px))",
      duration: 5,
      ease: "power2.inOut",
    }, "unroll")

    tl.to(paperRef.current, {
      scaleY: 1,
      duration: 5,
      ease: "power2.inOut",
    }, "unroll")

    if (leftBurnRef.current) {
      tl.to(leftBurnRef.current, {
        scaleY: 1,
        duration: 5,
        ease: "power2.inOut",
      }, "unroll")
    }

    if (rightBurnRef.current) {
      tl.to(rightBurnRef.current, {
        scaleY: 1,
        duration: 5,
        ease: "power2.inOut",
      }, "unroll")
    }

    // Subtle settle bounce at end
    tl.to([topRodRef.current, bottomRodRef.current], {
      scale: 1.01,
      duration: 0.15,
      ease: "power1.out",
    })
    tl.to([topRodRef.current, bottomRodRef.current], {
      scale: 1,
      duration: 0.35,
      ease: "elastic.out(1, 0.5)",
    })

    // Hold at end briefly
    tl.to({}, { duration: 0.4 })

    return () => {
      tl.kill()
    }
  }, [shouldAnimate])

  // Loading state - dark background while checking
  if (shouldAnimate === null) {
    return (
      <div className="fixed inset-0 z-[9999]" style={{ backgroundColor: "#0a0604" }} />
    )
  }

  // Animation complete or skipped - show content directly
  if (animationComplete) {
    return <>{children}</>
  }

  // Opening animation with photorealistic image-based scroll
  return (
    <>
      {/* Animation overlay - full screen */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 z-[9999] overflow-hidden"
        style={{ backgroundColor: "#0a0604" }}
        aria-hidden="true"
      >
        {/* Paper sheet in the middle - expands as rods separate */}
        <div 
          ref={paperRef}
          className="absolute left-0 right-0"
          style={{
            top: "var(--scroll-safe-top, 90px)",
            bottom: "var(--scroll-safe-bottom, 90px)",
            backgroundImage: `url("/textures/parchment-paper-v2.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            boxShadow: "inset 0 0 100px rgba(60,30,10,0.35)",
          }}
        />

        {/* Left burnt edge - revealed as paper expands */}
        <div
          ref={leftBurnRef}
          className="absolute left-0"
          style={{
            top: "var(--scroll-safe-top, 90px)",
            bottom: "var(--scroll-safe-bottom, 90px)",
            width: 40,
          }}
        >
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, 
                rgba(0,0,0,0.98) 0%,
                rgba(8,4,0,0.85) 30%,
                rgba(25,12,3,0.45) 65%,
                transparent 100%
              )`,
            }}
          />
          <svg 
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 40 200"
          >
            <path 
              d="M0 0 Q14 3 6 7 Q22 11 4 15 Q18 19 8 23 Q25 27 5 31 Q16 36 9 40 Q22 44 6 48 Q18 52 10 57 Q26 61 4 65 Q16 70 7 74 Q22 78 8 82 Q14 87 10 91 Q24 95 5 100 Q18 104 7 109 Q20 113 8 117 Q15 122 10 126 Q26 130 5 135 Q17 139 7 143 Q21 147 9 152 Q16 156 10 160 Q24 164 6 169 Q18 173 8 177 Q14 182 10 186 Q22 190 5 195 Q17 200 3 200 L0 200 Z"
              fill="#000000"
              opacity="0.9"
            />
          </svg>
        </div>

        {/* Right burnt edge - revealed as paper expands */}
        <div
          ref={rightBurnRef}
          className="absolute right-0"
          style={{
            top: "var(--scroll-safe-top, 90px)",
            bottom: "var(--scroll-safe-bottom, 90px)",
            width: 40,
          }}
        >
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(-90deg, 
                rgba(0,0,0,0.98) 0%,
                rgba(8,4,0,0.85) 30%,
                rgba(25,12,3,0.45) 65%,
                transparent 100%
              )`,
            }}
          />
          <svg 
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 40 200"
          >
            <path 
              d="M40 0 Q26 3 34 7 Q18 11 36 15 Q22 19 32 23 Q15 27 35 31 Q24 36 31 40 Q18 44 34 48 Q22 52 30 57 Q14 61 36 65 Q24 70 33 74 Q18 78 32 82 Q26 87 30 91 Q16 95 35 100 Q22 104 33 109 Q20 113 32 117 Q25 122 30 126 Q14 130 35 135 Q23 139 33 143 Q19 147 31 152 Q24 156 30 160 Q16 164 34 169 Q22 173 32 177 Q26 182 30 186 Q18 190 35 195 Q23 200 37 200 L40 200 Z"
              fill="#000000"
              opacity="0.9"
            />
          </svg>
        </div>

        {/* Top scroll rod - moves up */}
        <div
          ref={topRodRef}
          className="absolute top-1/2 left-0 right-0"
          style={{ 
            height: "var(--scroll-safe-top, 90px)",
            marginTop: "calc(-1 * var(--scroll-safe-top, 90px) / 2)",
          }}
        >
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, #000 0%, #0a0604 40%, rgba(15,8,2,0.5) 80%, transparent 100%)"
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("/textures/scroll-rod-top.jpg")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.8))",
            }}
          />
        </div>

        {/* Bottom scroll rod - moves down */}
        <div
          ref={bottomRodRef}
          className="absolute top-1/2 left-0 right-0"
          style={{ 
            height: "var(--scroll-safe-bottom, 90px)",
            marginTop: "calc(-1 * var(--scroll-safe-bottom, 90px) / 2)",
          }}
        >
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, #000 0%, #0a0604 40%, rgba(15,8,2,0.5) 80%, transparent 100%)"
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("/textures/scroll-rod-bottom.jpg")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "drop-shadow(0 -10px 20px rgba(0,0,0,0.8))",
            }}
          />
        </div>
      </div>

      {/* Hidden content during animation */}
      <div ref={contentRef} style={{ opacity: 0 }}>
        {children}
      </div>
    </>
  )
}
