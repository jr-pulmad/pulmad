"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

interface PaperScrollFrameProps {
  children: ReactNode
}

// Safe space heights for scroll rods
const TOP_SAFE_SPACE = 60 // px
const BOTTOM_SAFE_SPACE = 60 // px

export function PaperScrollFrame({ children }: PaperScrollFrameProps) {
  const topRollRef = useRef<HTMLDivElement>(null)
  const bottomRollRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const lastScrollY = useRef(0)
  const scrollDirection = useRef(0)
  const bounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
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

      // Detect scroll direction change for bounce effect
      const newDirection = currentScrollY > lastScrollY.current ? 1 : currentScrollY < lastScrollY.current ? -1 : 0
      
      if (newDirection !== 0 && newDirection !== scrollDirection.current) {
        const target = newDirection > 0 ? topRollRef.current : bottomRollRef.current
        
        if (target && !bounceTimeoutRef.current) {
          target.style.transform = `translateY(${newDirection > 0 ? -3 : 3}px)`
          
          bounceTimeoutRef.current = setTimeout(() => {
            if (target) {
              target.style.transition = "transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)"
              target.style.transform = "translateY(0px)"
              
              setTimeout(() => {
                if (target) target.style.transition = ""
                bounceTimeoutRef.current = null
              }, 400)
            }
          }, 80)
        }
      }
      
      scrollDirection.current = newDirection
      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (bounceTimeoutRef.current) {
        clearTimeout(bounceTimeoutRef.current)
      }
    }
  }, [prefersReducedMotion])

  // Calculate dynamic scale based on scroll
  const topScale = 1 + scrollProgress * 0.3
  const bottomScale = 1.3 - scrollProgress * 0.3

  return (
    <div className="relative">
      {/* Paper texture background overlay */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url("/textures/old-paper.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.04,
        }}
        aria-hidden="true"
      />

      {/* Top scroll rod with ornaments */}
      <div
        ref={topRollRef}
        className="fixed top-0 left-0 right-0 z-[100] pointer-events-none"
        style={{ height: TOP_SAFE_SPACE }}
        aria-hidden="true"
      >
        {/* Wood rod background */}
        <div 
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: 48,
            backgroundImage: `url("/textures/dark-wood.jpg")`,
            backgroundSize: "200px 48px",
            backgroundRepeat: "repeat-x",
            borderRadius: "0 0 50% 50% / 0 0 12px 12px",
            boxShadow: `
              0 8px 32px rgba(0,0,0,0.5), 
              0 4px 12px rgba(0,0,0,0.3),
              inset 0 2px 4px rgba(255,255,255,0.1),
              inset 0 -4px 8px rgba(0,0,0,0.3)
            `,
            transform: `scaleY(${topScale})`,
            transformOrigin: "top center",
          }}
        >
          {/* Silver accent strip */}
          <div 
            className="absolute top-2 left-4 right-4 h-1 rounded-full"
            style={{
              background: "linear-gradient(90deg, #6b6b6b, #c0c0c0 20%, #a8a8a8 50%, #c0c0c0 80%, #6b6b6b)",
            }}
          />
          {/* Roll texture lines */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 4px,
                rgba(0,0,0,0.15) 4px,
                rgba(0,0,0,0.15) 5px
              )`
            }}
          />
        </div>

        {/* Left ornament */}
        <div 
          className="absolute bottom-1 left-2"
          style={{
            width: 36,
            height: 36,
            background: "radial-gradient(circle at 30% 30%, #5a4a3a, #2d2318)",
            borderRadius: "50%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)",
            border: "2px solid #a8a8a8",
          }}
        >
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{ background: "linear-gradient(135deg, #c0c0c0, #6b6b6b)" }}
          />
        </div>

        {/* Right ornament */}
        <div 
          className="absolute bottom-1 right-2"
          style={{
            width: 36,
            height: 36,
            background: "radial-gradient(circle at 30% 30%, #5a4a3a, #2d2318)",
            borderRadius: "50%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)",
            border: "2px solid #a8a8a8",
          }}
        >
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{ background: "linear-gradient(135deg, #c0c0c0, #6b6b6b)" }}
          />
        </div>
      </div>

      {/* Left burnt edge */}
      <div
        className="fixed left-0 z-[99] pointer-events-none"
        style={{
          top: TOP_SAFE_SPACE,
          bottom: BOTTOM_SAFE_SPACE,
          width: 20,
          background: `linear-gradient(90deg, 
            rgba(26, 16, 5, 0.7) 0%,
            rgba(45, 30, 15, 0.4) 30%,
            rgba(60, 40, 20, 0.2) 60%,
            transparent 100%
          )`,
        }}
        aria-hidden="true"
      >
        {/* Burnt edge texture */}
        <div 
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='200' viewBox='0 0 20 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 Q8 10 2 20 Q10 30 3 40 Q12 50 1 60 Q9 70 4 80 Q11 90 2 100 Q8 110 3 120 Q10 130 1 140 Q9 150 4 160 Q12 170 2 180 Q8 190 0 200 L0 0 Z' fill='%231a1005' fill-opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat-y",
            backgroundSize: "20px 200px",
          }}
        />
      </div>

      {/* Right burnt edge */}
      <div
        className="fixed right-0 z-[99] pointer-events-none"
        style={{
          top: TOP_SAFE_SPACE,
          bottom: BOTTOM_SAFE_SPACE,
          width: 20,
          background: `linear-gradient(-90deg, 
            rgba(26, 16, 5, 0.7) 0%,
            rgba(45, 30, 15, 0.4) 30%,
            rgba(60, 40, 20, 0.2) 60%,
            transparent 100%
          )`,
        }}
        aria-hidden="true"
      >
        {/* Burnt edge texture */}
        <div 
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='200' viewBox='0 0 20 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 Q12 10 18 20 Q10 30 17 40 Q8 50 19 60 Q11 70 16 80 Q9 90 18 100 Q12 110 17 120 Q10 130 19 140 Q11 150 16 160 Q8 170 18 180 Q12 190 20 200 L20 0 Z' fill='%231a1005' fill-opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat-y",
            backgroundSize: "20px 200px",
          }}
        />
      </div>

      {/* Bottom scroll rod with ornaments */}
      <div
        ref={bottomRollRef}
        className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none"
        style={{ height: BOTTOM_SAFE_SPACE }}
        aria-hidden="true"
      >
        {/* Wood rod background */}
        <div 
          className="absolute top-0 left-0 right-0"
          style={{
            height: 48,
            backgroundImage: `url("/textures/dark-wood.jpg")`,
            backgroundSize: "200px 48px",
            backgroundRepeat: "repeat-x",
            borderRadius: "50% 50% 0 0 / 12px 12px 0 0",
            boxShadow: `
              0 -8px 32px rgba(0,0,0,0.5), 
              0 -4px 12px rgba(0,0,0,0.3),
              inset 0 -2px 4px rgba(255,255,255,0.1),
              inset 0 4px 8px rgba(0,0,0,0.3)
            `,
            transform: `scaleY(${bottomScale})`,
            transformOrigin: "bottom center",
          }}
        >
          {/* Silver accent strip */}
          <div 
            className="absolute bottom-2 left-4 right-4 h-1 rounded-full"
            style={{
              background: "linear-gradient(90deg, #6b6b6b, #c0c0c0 20%, #a8a8a8 50%, #c0c0c0 80%, #6b6b6b)",
            }}
          />
          {/* Roll texture lines */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 4px,
                rgba(0,0,0,0.15) 4px,
                rgba(0,0,0,0.15) 5px
              )`
            }}
          />
        </div>

        {/* Left ornament */}
        <div 
          className="absolute top-1 left-2"
          style={{
            width: 36,
            height: 36,
            background: "radial-gradient(circle at 30% 30%, #5a4a3a, #2d2318)",
            borderRadius: "50%",
            boxShadow: "0 -4px 12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)",
            border: "2px solid #a8a8a8",
          }}
        >
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{ background: "linear-gradient(135deg, #c0c0c0, #6b6b6b)" }}
          />
        </div>

        {/* Right ornament */}
        <div 
          className="absolute top-1 right-2"
          style={{
            width: 36,
            height: 36,
            background: "radial-gradient(circle at 30% 30%, #5a4a3a, #2d2318)",
            borderRadius: "50%",
            boxShadow: "0 -4px 12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)",
            border: "2px solid #a8a8a8",
          }}
        >
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{ background: "linear-gradient(135deg, #c0c0c0, #6b6b6b)" }}
          />
        </div>
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
