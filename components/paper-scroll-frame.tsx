"use client"

import { useEffect, useState, type ReactNode, Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamically import 3D components to avoid SSR issues
const TopScrollRodCanvas = dynamic(
  () => import("./scroll-3d/scroll-rod-3d").then(mod => ({ default: mod.TopScrollRodCanvas })),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
)

const BottomScrollRodCanvas = dynamic(
  () => import("./scroll-3d/scroll-rod-3d").then(mod => ({ default: mod.BottomScrollRodCanvas })),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
)

interface PaperScrollFrameProps {
  children: ReactNode
}

// Safe space for 3D scroll rods - content stays within these bounds
const TOP_SAFE_SPACE = 70
const BOTTOM_SAFE_SPACE = 70

export function PaperScrollFrame({ children }: PaperScrollFrameProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentScrollY = window.scrollY
      const progress = scrollHeight > 0 ? Math.min(Math.max(currentScrollY / scrollHeight, 0), 1) : 0
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // As you scroll down: top roll gets thicker, bottom roll gets thinner
  const topRollAmount = scrollProgress
  const bottomRollAmount = 1 - scrollProgress

  return (
    <div className="relative min-h-screen">
      {/* Top 3D scroll rod - fixed at top of viewport */}
      <div
        className="fixed top-0 left-0 right-0 z-[100] pointer-events-none"
        style={{ 
          height: TOP_SAFE_SPACE,
          background: "linear-gradient(to bottom, #0f0a06 0%, #1a1208 70%, transparent 100%)"
        }}
        aria-hidden="true"
      >
        {mounted && (
          <div className="absolute inset-0" style={{ top: -10, bottom: -10 }}>
            <TopScrollRodCanvas 
              paperRollAmount={topRollAmount}
              className="w-full h-full"
            />
          </div>
        )}
        {/* Shadow below top rod */}
        <div 
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            bottom: -20,
            height: 20,
            background: "linear-gradient(to bottom, rgba(10,5,0,0.5) 0%, transparent 100%)"
          }}
        />
      </div>

      {/* Left burnt/charred edge - irregular black burns */}
      <div
        className="fixed left-0 z-[99] pointer-events-none"
        style={{
          top: TOP_SAFE_SPACE,
          bottom: BOTTOM_SAFE_SPACE,
          width: 35,
        }}
        aria-hidden="true"
      >
        {/* Base dark gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, 
              rgba(8, 4, 0, 0.95) 0%,
              rgba(15, 8, 2, 0.8) 30%,
              rgba(25, 15, 5, 0.5) 55%,
              rgba(40, 25, 10, 0.25) 75%,
              transparent 100%
            )`,
          }}
        />
        {/* Irregular burnt edge overlay */}
        <svg 
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 35 100"
        >
          <defs>
            <linearGradient id="burnGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#050200" stopOpacity="1" />
              <stop offset="40%" stopColor="#0a0502" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#1a0f05" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1a0f05" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path 
            d="M0 0 Q12 1 6 3 Q18 5 4 8 Q16 10 8 13 Q20 15 5 18 Q15 20 9 23 Q22 25 6 28 Q14 30 10 33 Q24 36 4 39 Q16 41 7 44 Q19 47 5 50 Q17 52 8 55 Q21 58 6 61 Q15 63 9 66 Q23 69 5 72 Q18 74 7 77 Q14 80 10 83 Q22 86 4 89 Q16 91 8 94 Q19 97 6 100 L0 100 Z"
            fill="url(#burnGradLeft)"
          />
        </svg>
        {/* Charred bits */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-60"
          preserveAspectRatio="none"
          viewBox="0 0 35 100"
        >
          <path 
            d="M0 5 Q8 6 3 8 Q10 10 2 12 Q7 14 4 16 Q12 18 1 20 Q9 22 3 25 Q8 27 5 30 Q14 33 2 35 Q10 38 4 40 Q7 43 6 45 Q15 48 3 50 Q11 53 2 55 Q8 58 5 60 Q13 63 1 65 Q9 68 4 70 Q6 73 7 75 Q14 78 2 80 Q10 83 3 85 Q8 88 5 90 Q12 93 1 95 Q7 98 4 100 L0 100 Z"
            fill="#020100"
          />
        </svg>
      </div>

      {/* Right burnt/charred edge - irregular black burns */}
      <div
        className="fixed right-0 z-[99] pointer-events-none"
        style={{
          top: TOP_SAFE_SPACE,
          bottom: BOTTOM_SAFE_SPACE,
          width: 35,
        }}
        aria-hidden="true"
      >
        {/* Base dark gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(-90deg, 
              rgba(8, 4, 0, 0.95) 0%,
              rgba(15, 8, 2, 0.8) 30%,
              rgba(25, 15, 5, 0.5) 55%,
              rgba(40, 25, 10, 0.25) 75%,
              transparent 100%
            )`,
          }}
        />
        {/* Irregular burnt edge overlay */}
        <svg 
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 35 100"
        >
          <defs>
            <linearGradient id="burnGradRight" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#050200" stopOpacity="1" />
              <stop offset="40%" stopColor="#0a0502" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#1a0f05" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1a0f05" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path 
            d="M35 0 Q23 2 29 4 Q17 6 31 9 Q22 11 28 14 Q15 17 30 19 Q20 22 26 24 Q13 27 29 30 Q21 32 25 35 Q11 38 31 40 Q19 43 28 45 Q16 48 30 51 Q22 53 27 56 Q12 59 29 61 Q20 64 26 66 Q14 69 30 72 Q18 74 27 77 Q21 80 25 82 Q13 85 31 88 Q19 90 28 93 Q16 96 29 100 L35 100 Z"
            fill="url(#burnGradRight)"
          />
        </svg>
        {/* Charred bits */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-60"
          preserveAspectRatio="none"
          viewBox="0 0 35 100"
        >
          <path 
            d="M35 5 Q27 6 32 8 Q25 10 33 12 Q28 14 31 16 Q23 18 34 20 Q26 22 32 25 Q27 27 30 30 Q21 33 33 35 Q25 38 31 40 Q28 43 29 45 Q20 48 32 50 Q24 53 33 55 Q27 58 30 60 Q22 63 34 65 Q26 68 31 70 Q29 73 28 75 Q21 78 33 80 Q25 83 32 85 Q27 88 30 90 Q23 93 34 95 Q28 98 31 100 L35 100 Z"
            fill="#020100"
          />
        </svg>
      </div>

      {/* Bottom 3D scroll rod - fixed at bottom of viewport */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none"
        style={{ 
          height: BOTTOM_SAFE_SPACE,
          background: "linear-gradient(to top, #0f0a06 0%, #1a1208 70%, transparent 100%)"
        }}
        aria-hidden="true"
      >
        {mounted && (
          <div className="absolute inset-0" style={{ top: -10, bottom: -10 }}>
            <BottomScrollRodCanvas 
              paperRollAmount={bottomRollAmount}
              className="w-full h-full"
            />
          </div>
        )}
        {/* Shadow above bottom rod */}
        <div 
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: -20,
            height: 20,
            background: "linear-gradient(to top, rgba(10,5,0,0.5) 0%, transparent 100%)"
          }}
        />
      </div>

      {/* Paper texture overlay on visible content area */}
      <div 
        className="fixed z-[1] pointer-events-none"
        style={{
          top: TOP_SAFE_SPACE,
          bottom: BOTTOM_SAFE_SPACE,
          left: 35,
          right: 35,
          backgroundImage: `url("/textures/parchment-paper.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.06,
          mixBlendMode: "multiply",
        }}
        aria-hidden="true"
      />

      {/* Main content - padded to stay within safe area */}
      <div 
        className="relative z-[2]"
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
