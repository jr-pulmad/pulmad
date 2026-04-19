"use client"

import { useEffect, useRef, useState, type ReactNode, Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamically import the 3D canvas to avoid SSR issues
const ScrollRod3DCanvas = dynamic(
  () => import("./scroll-3d/scroll-rod-3d").then(mod => ({ default: mod.ScrollRod3DCanvas })),
  { ssr: false }
)

interface PaperScrollFrameProps {
  children: ReactNode
}

// Safe space heights for scroll rods
const TOP_SAFE_SPACE = 80 // px - increased for 3D rods
const BOTTOM_SAFE_SPACE = 80 // px

export function PaperScrollFrame({ children }: PaperScrollFrameProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentScrollY = window.scrollY
      const progress = scrollHeight > 0 ? Math.min(Math.max(currentScrollY / scrollHeight, 0), 1) : 0
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [prefersReducedMotion])

  // Calculate paper roll amounts - as you scroll down:
  // - Top roll gets bigger (more paper rolled up at top)
  // - Bottom roll gets smaller (less paper remaining)
  const topRollAmount = scrollProgress
  const bottomRollAmount = 1 - scrollProgress

  return (
    <div className="relative min-h-screen">
      {/* Paper texture background overlay on content area */}
      <div 
        className="fixed z-0 pointer-events-none"
        style={{
          top: TOP_SAFE_SPACE,
          bottom: BOTTOM_SAFE_SPACE,
          left: 0,
          right: 0,
          backgroundImage: `url("/textures/old-paper.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.08,
        }}
        aria-hidden="true"
      />

      {/* Top 3D scroll rod area */}
      <div
        className="fixed top-0 left-0 right-0 z-[100]"
        style={{ 
          height: TOP_SAFE_SPACE,
          background: "linear-gradient(to bottom, #1a1510 0%, #1a1510 60%, transparent 100%)"
        }}
        aria-hidden="true"
      >
        {mounted && (
          <Suspense fallback={<div className="w-full h-full bg-[#1a1510]" />}>
            <ScrollRod3DCanvas 
              topRollAmount={topRollAmount}
              bottomRollAmount={bottomRollAmount}
              className="absolute inset-0 pointer-events-none"
            />
          </Suspense>
        )}
      </div>

      {/* Left burnt edge */}
      <div
        className="fixed left-0 z-[99] pointer-events-none"
        style={{
          top: TOP_SAFE_SPACE,
          bottom: BOTTOM_SAFE_SPACE,
          width: 24,
          background: `linear-gradient(90deg, 
            rgba(26, 16, 5, 0.85) 0%,
            rgba(45, 30, 15, 0.5) 35%,
            rgba(60, 40, 20, 0.25) 65%,
            transparent 100%
          )`,
        }}
        aria-hidden="true"
      >
        {/* Burnt jagged edge SVG */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-70"
          preserveAspectRatio="none"
          viewBox="0 0 24 100"
        >
          <path 
            d="M0 0 Q10 2 4 5 Q14 8 2 12 Q12 15 5 18 Q15 22 3 25 Q13 28 4 32 Q14 35 2 38 Q12 42 5 45 Q15 48 3 52 Q13 55 4 58 Q14 62 2 65 Q12 68 5 72 Q15 75 3 78 Q13 82 4 85 Q14 88 2 92 Q12 95 5 98 Q8 100 0 100 Z"
            fill="rgba(15, 8, 2, 0.6)"
          />
        </svg>
      </div>

      {/* Right burnt edge */}
      <div
        className="fixed right-0 z-[99] pointer-events-none"
        style={{
          top: TOP_SAFE_SPACE,
          bottom: BOTTOM_SAFE_SPACE,
          width: 24,
          background: `linear-gradient(-90deg, 
            rgba(26, 16, 5, 0.85) 0%,
            rgba(45, 30, 15, 0.5) 35%,
            rgba(60, 40, 20, 0.25) 65%,
            transparent 100%
          )`,
        }}
        aria-hidden="true"
      >
        {/* Burnt jagged edge SVG */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-70"
          preserveAspectRatio="none"
          viewBox="0 0 24 100"
        >
          <path 
            d="M24 0 Q14 2 20 5 Q10 8 22 12 Q12 15 19 18 Q9 22 21 25 Q11 28 20 32 Q10 35 22 38 Q12 42 19 45 Q9 48 21 52 Q11 55 20 58 Q10 62 22 65 Q12 68 19 72 Q9 75 21 78 Q11 82 20 85 Q10 88 22 92 Q12 95 19 98 Q16 100 24 100 Z"
            fill="rgba(15, 8, 2, 0.6)"
          />
        </svg>
      </div>

      {/* Bottom 3D scroll rod area */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[100]"
        style={{ 
          height: BOTTOM_SAFE_SPACE,
          background: "linear-gradient(to top, #1a1510 0%, #1a1510 60%, transparent 100%)"
        }}
        aria-hidden="true"
      >
        {mounted && (
          <Suspense fallback={<div className="w-full h-full bg-[#1a1510]" />}>
            <ScrollRod3DCanvas 
              topRollAmount={topRollAmount}
              bottomRollAmount={bottomRollAmount}
              className="absolute inset-0 pointer-events-none"
            />
          </Suspense>
        )}
      </div>

      {/* Main content area with safe space padding */}
      <div 
        className="relative z-[1]"
        style={{
          paddingTop: TOP_SAFE_SPACE,
          paddingBottom: BOTTOM_SAFE_SPACE,
        }}
      >
        {children}
      </div>
    </div>
  )
}
