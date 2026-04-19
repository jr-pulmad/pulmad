"use client"

import { useEffect, useState, useRef, type ReactNode, Suspense } from "react"
import dynamic from "next/dynamic"
import { gsap } from "gsap"

// Dynamically import the 3D canvas to avoid SSR issues
const OpeningAnimation3D = dynamic(
  () => import("./opening-animation-3d").then(mod => ({ default: mod.OpeningAnimation3D })),
  { ssr: false }
)

interface Scroll3DOverlayProps {
  children: ReactNode
}

export function Scroll3DOverlay({ children }: Scroll3DOverlayProps) {
  const [shouldAnimate, setShouldAnimate] = useState<boolean | null>(null)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [openProgress, setOpenProgress] = useState(0)
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Check if we should animate on mount
  useEffect(() => {
    const hasPlayed = sessionStorage.getItem("scroll-animation-played-3d-v2")
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

    // Animate open progress from 0 to 1
    const progressObj = { value: 0 }
    
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("scroll-animation-played-3d-v2", "true")
        
        // Fade out overlay
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.6,
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
            duration: 0.6,
            ease: "power2.out"
          })
        }
      }
    })

    // Initial pause
    tl.to({}, { duration: 0.8 })

    // Scroll unrolling animation - 5 seconds, dramatic easing
    tl.to(progressObj, {
      value: 1,
      duration: 5,
      ease: "power2.inOut",
      onUpdate: () => {
        setOpenProgress(progressObj.value)
      }
    })

    // Hold at end briefly
    tl.to({}, { duration: 0.3 })

  }, [shouldAnimate])

  // Loading state - dark background
  if (shouldAnimate === null) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#1a1510]" />
    )
  }

  // Animation complete - show content
  if (animationComplete) {
    return <>{children}</>
  }

  // Show 3D animation
  return (
    <>
      {/* Animation overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 z-[9999] overflow-hidden bg-[#1a1510]"
      >
        <Suspense fallback={<div className="w-full h-full bg-[#1a1510]" />}>
          <OpeningAnimation3D openProgress={openProgress} />
        </Suspense>
      </div>

      {/* Hidden content during animation */}
      <div ref={contentRef} style={{ opacity: 0 }}>
        {children}
      </div>
    </>
  )
}
