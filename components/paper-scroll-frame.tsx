"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface PaperScrollFrameProps {
  children: ReactNode
}

export function PaperScrollFrame({ children }: PaperScrollFrameProps) {
  const topRollRef = useRef<HTMLDivElement>(null)
  const bottomRollRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
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
    if (!topRollRef.current || !bottomRollRef.current) return

    // Create scroll-linked animations
    const ctx = gsap.context(() => {
      // Top roll - gets fuller (expands) as you scroll down (paper rolled back up)
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress
          
          // Top roll: smaller at top, fuller at bottom
          const topScale = 1 + progress * 0.4
          const topShadowIntensity = 0.3 + progress * 0.2
          
          gsap.to(topRollRef.current, {
            scaleY: topScale,
            boxShadow: `0 ${6 + progress * 4}px ${24 + progress * 16}px rgba(0,0,0,${topShadowIntensity}), 0 2px 8px rgba(0,0,0,0.2)`,
            duration: 0.1,
            ease: "none",
          })
          
          // Bottom roll: fuller at top, smaller at bottom
          const bottomScale = 1.4 - progress * 0.4
          const bottomShadowIntensity = 0.5 - progress * 0.2
          
          gsap.to(bottomRollRef.current, {
            scaleY: bottomScale,
            boxShadow: `0 -${10 - progress * 4}px ${32 - progress * 16}px rgba(0,0,0,${bottomShadowIntensity}), 0 -2px 8px rgba(0,0,0,0.2)`,
            duration: 0.1,
            ease: "none",
          })
        }
      })

      // Subtle bounce on scroll direction change
      let lastScrollY = window.scrollY
      let scrollDirection = 0
      let bounceTimeout: ReturnType<typeof setTimeout>

      const handleScroll = () => {
        const currentScrollY = window.scrollY
        const newDirection = currentScrollY > lastScrollY ? 1 : currentScrollY < lastScrollY ? -1 : 0
        
        // If direction changed, add a subtle bounce
        if (newDirection !== 0 && newDirection !== scrollDirection) {
          clearTimeout(bounceTimeout)
          
          const target = newDirection > 0 ? topRollRef.current : bottomRollRef.current
          
          gsap.to(target, {
            y: newDirection > 0 ? -2 : 2,
            duration: 0.1,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(target, {
                y: 0,
                duration: 0.3,
                ease: "elastic.out(1.2, 0.6)",
              })
            }
          })
        }
        
        scrollDirection = newDirection
        lastScrollY = currentScrollY
      }

      window.addEventListener("scroll", handleScroll, { passive: true })
      
      return () => {
        window.removeEventListener("scroll", handleScroll)
      }
    })

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [prefersReducedMotion])

  return (
    <div ref={frameRef} className="relative min-h-screen">
      {/* Top scroll roll - fixed at top */}
      <div
        ref={topRollRef}
        className="fixed top-0 left-0 right-0 h-10 z-[100] pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg, 
              #3d3629 0%, 
              #5a5045 15%,
              #a8a8a8 20%,
              #6b6b6b 25%,
              #4a4035 35%,
              #5a5045 50%,
              #3d3629 100%
            )
          `,
          boxShadow: "0 6px 24px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)",
          borderRadius: "0 0 100% 100% / 0 0 20px 20px",
          transformOrigin: "top center",
        }}
        aria-hidden="true"
      >
        {/* Roll highlight */}
        <div 
          className="absolute top-1 left-4 right-4 h-2 rounded-full opacity-25"
          style={{
            background: "linear-gradient(180deg, rgba(168,168,168,0.6) 0%, transparent 100%)",
          }}
        />
        {/* Roll texture lines */}
        <div className="absolute inset-0 opacity-10 rounded-b-[20px]" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.1) 3px,
            rgba(0,0,0,0.1) 4px
          )`
        }} />
      </div>

      {/* Left paper edge - subtle deckled effect */}
      <div
        className="fixed top-10 bottom-10 left-0 w-3 z-[99] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, 
            rgba(74, 64, 53, 0.15) 0%,
            rgba(74, 64, 53, 0.08) 30%,
            transparent 100%
          )`,
        }}
        aria-hidden="true"
      >
        {/* Deckled edge effect */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='100' viewBox='0 0 12 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 Q3 5 0 10 Q4 15 0 20 Q3 25 0 30 Q5 35 0 40 Q3 45 0 50 Q4 55 0 60 Q3 65 0 70 Q5 75 0 80 Q3 85 0 90 Q4 95 0 100 L12 100 L12 0 Z' fill='%234a4035'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat-y",
            backgroundSize: "12px 100px",
          }}
        />
      </div>

      {/* Right paper edge - subtle deckled effect */}
      <div
        className="fixed top-10 bottom-10 right-0 w-3 z-[99] pointer-events-none"
        style={{
          background: `linear-gradient(-90deg, 
            rgba(74, 64, 53, 0.15) 0%,
            rgba(74, 64, 53, 0.08) 30%,
            transparent 100%
          )`,
        }}
        aria-hidden="true"
      >
        {/* Deckled edge effect (mirrored) */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='100' viewBox='0 0 12 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 0 Q9 5 12 10 Q8 15 12 20 Q9 25 12 30 Q7 35 12 40 Q9 45 12 50 Q8 55 12 60 Q9 65 12 70 Q7 75 12 80 Q9 85 12 90 Q8 95 12 100 L0 100 L0 0 Z' fill='%234a4035'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat-y",
            backgroundSize: "12px 100px",
            backgroundPosition: "right",
          }}
        />
      </div>

      {/* Bottom scroll roll - fixed at bottom */}
      <div
        ref={bottomRollRef}
        className="fixed bottom-0 left-0 right-0 h-10 z-[100] pointer-events-none"
        style={{
          background: `
            linear-gradient(0deg, 
              #3d3629 0%, 
              #5a5045 15%,
              #a8a8a8 20%,
              #6b6b6b 25%,
              #4a4035 35%,
              #5a5045 50%,
              #3d3629 100%
            )
          `,
          boxShadow: "0 -10px 32px rgba(0,0,0,0.5), 0 -2px 8px rgba(0,0,0,0.2)",
          borderRadius: "100% 100% 0 0 / 20px 20px 0 0",
          transformOrigin: "bottom center",
          transform: "scaleY(1.4)", // Start fuller (more paper remaining at bottom)
        }}
        aria-hidden="true"
      >
        {/* Roll highlight */}
        <div 
          className="absolute bottom-1 left-4 right-4 h-2 rounded-full opacity-25"
          style={{
            background: "linear-gradient(0deg, rgba(168,168,168,0.6) 0%, transparent 100%)",
          }}
        />
        {/* Roll texture lines */}
        <div className="absolute inset-0 opacity-10 rounded-t-[20px]" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.1) 3px,
            rgba(0,0,0,0.1) 4px
          )`
        }} />
      </div>

      {/* Main content area - passes children through unchanged */}
      <div className="relative z-[1]">
        {children}
      </div>
    </div>
  )
}
