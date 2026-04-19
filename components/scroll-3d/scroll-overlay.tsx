"use client"

import { useEffect, useState, type ReactNode } from "react"
import dynamic from "next/dynamic"
import { gsap } from "gsap"

// Dynamically import 3D scene to avoid SSR issues
const Scroll3DScene = dynamic(
  () => import("./scroll-scene").then(mod => ({ default: mod.Scroll3DScene })),
  { ssr: false }
)

interface Scroll3DOverlayProps {
  children: ReactNode
}

export function Scroll3DOverlay({ children }: Scroll3DOverlayProps) {
  // State: null = checking, true = should animate, false = skip animation
  const [shouldAnimate, setShouldAnimate] = useState<boolean | null>(null)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [fadeOutOverlay, setFadeOutOverlay] = useState(false)

  // Check if we should animate on mount
  useEffect(() => {
    const hasPlayed = sessionStorage.getItem("scroll-animation-played-3d")
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    
    if (hasPlayed || prefersReducedMotion) {
      setShouldAnimate(false)
      setAnimationComplete(true)
    } else {
      setShouldAnimate(true)
      // Lock body scroll during animation
      document.body.style.overflow = "hidden"
    }
  }, [])

  const handleAnimationComplete = () => {
    // Mark as played in session
    sessionStorage.setItem("scroll-animation-played-3d", "true")
    
    // Start fade out
    setFadeOutOverlay(true)
    
    // After fade, show content
    setTimeout(() => {
      setAnimationComplete(true)
      document.body.style.overflow = ""
    }, 800)
  }

  // While checking session, show dark loading state
  if (shouldAnimate === null) {
    return (
      <div className="fixed inset-0 z-[9999]" style={{ backgroundColor: "#2a2520" }} />
    )
  }

  // If animation is skipped or complete, just render children with paper frame
  if (shouldAnimate === false || animationComplete) {
    return <>{children}</>
  }

  // Show 3D animation overlay
  return (
    <>
      {/* 3D Scroll Animation Overlay */}
      <div
        className={`fixed inset-0 z-[9999] transition-opacity duration-700 ${
          fadeOutOverlay ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <Scroll3DScene 
          onAnimationComplete={handleAnimationComplete}
          shouldAnimate={true}
        />
      </div>

      {/* Content (hidden during animation) */}
      <div className={fadeOutOverlay ? "opacity-100" : "opacity-0"}>
        {children}
      </div>
    </>
  )
}
