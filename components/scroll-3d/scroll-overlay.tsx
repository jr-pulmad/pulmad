"use client"

import { useEffect, useState, useRef, type ReactNode } from "react"
import Image from "next/image"
import { gsap } from "gsap"

interface Scroll3DOverlayProps {
  children: ReactNode
}

export function Scroll3DOverlay({ children }: Scroll3DOverlayProps) {
  const [shouldAnimate, setShouldAnimate] = useState<boolean | null>(null)
  const [animationComplete, setAnimationComplete] = useState(false)
  
  const overlayRef = useRef<HTMLDivElement>(null)
  const topRollRef = useRef<HTMLDivElement>(null)
  const bottomRollRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Check if we should animate on mount
  useEffect(() => {
    const hasPlayed = sessionStorage.getItem("scroll-animation-played-3d")
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    
    console.log("[v0] Scroll animation check - hasPlayed:", hasPlayed, "reducedMotion:", prefersReducedMotion)
    
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
    if (!overlayRef.current || !topRollRef.current || !bottomRollRef.current || !paperRef.current) return

    console.log("[v0] Starting scroll animation")

    const tl = gsap.timeline({
      onComplete: () => {
        console.log("[v0] Animation complete")
        sessionStorage.setItem("scroll-animation-played-3d", "true")
        
        // Fade out overlay and show content
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.8,
          onComplete: () => {
            setAnimationComplete(true)
            document.body.style.overflow = ""
          }
        })
      }
    })

    // Set initial state
    gsap.set(topRollRef.current, { y: "0%" })
    gsap.set(bottomRollRef.current, { y: "0%" })
    gsap.set(paperRef.current, { scaleY: 0, transformOrigin: "center center" })

    // Initial pause
    tl.to({}, { duration: 0.5 })

    // Unroll the paper (5 seconds)
    tl.to(paperRef.current, {
      scaleY: 1,
      duration: 5,
      ease: "power2.inOut"
    }, 0.5)

    // Move top roll up
    tl.to(topRollRef.current, {
      y: "-100%",
      duration: 5,
      ease: "power2.inOut"
    }, 0.5)

    // Move bottom roll down
    tl.to(bottomRollRef.current, {
      y: "100%",
      duration: 5,
      ease: "power2.inOut"
    }, 0.5)

  }, [shouldAnimate])

  // Loading state
  if (shouldAnimate === null) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#2a2520]" />
    )
  }

  // Animation complete - show content with paper frame
  if (animationComplete) {
    return <>{children}</>
  }

  // Show animation
  return (
    <>
      {/* Animation overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 z-[9999] overflow-hidden"
        style={{ backgroundColor: "#1a1510" }}
      >
        {/* Paper background that unrolls */}
        <div
          ref={paperRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backgroundImage: "url(/textures/old-paper.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Burnt left edge */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none"
            style={{
              background: "linear-gradient(to right, rgba(20,10,5,0.9) 0%, rgba(40,25,15,0.6) 40%, rgba(60,40,20,0.3) 70%, transparent 100%)"
            }}
          />
          
          {/* Burnt right edge */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none"
            style={{
              background: "linear-gradient(to left, rgba(20,10,5,0.9) 0%, rgba(40,25,15,0.6) 40%, rgba(60,40,20,0.3) 70%, transparent 100%)"
            }}
          />
        </div>

        {/* Top scroll roll */}
        <div
          ref={topRollRef}
          className="absolute top-0 left-0 right-0 h-[50vh] flex flex-col justify-end z-10"
        >
          {/* Roll shadow */}
          <div 
            className="h-8 w-full"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)"
            }}
          />
          
          {/* Rolled paper cylinder */}
          <div 
            className="h-16 w-full relative"
            style={{
              background: "linear-gradient(to bottom, #d4c4a8 0%, #c9b896 20%, #bfa97c 50%, #c9b896 80%, #d4c4a8 100%)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
            }}
          >
            {/* Paper texture lines */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)"
              }}
            />
          </div>
          
          {/* Wooden rod */}
          <div className="h-6 w-full relative flex items-center justify-between px-4"
            style={{
              backgroundImage: "url(/textures/dark-wood.jpg)",
              backgroundSize: "cover",
              boxShadow: "0 6px 24px rgba(0,0,0,0.6)"
            }}
          >
            {/* Left ornament */}
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-[#6b6b6b] shadow-lg" 
                style={{ boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.4), 0 2px 4px rgba(255,255,255,0.2)" }}
              />
              <div className="w-6 h-6 rounded-full bg-[#3d2d1f] shadow-lg border border-[#a8a8a8]" />
              <div className="w-3 h-5 bg-[#3d2d1f] rounded-sm" 
                style={{ clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)" }}
              />
            </div>
            
            {/* Right ornament */}
            <div className="flex items-center gap-1">
              <div className="w-3 h-5 bg-[#3d2d1f] rounded-sm" 
                style={{ clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)" }}
              />
              <div className="w-6 h-6 rounded-full bg-[#3d2d1f] shadow-lg border border-[#a8a8a8]" />
              <div className="w-4 h-4 rounded-full bg-[#6b6b6b] shadow-lg"
                style={{ boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.4), 0 2px 4px rgba(255,255,255,0.2)" }}
              />
            </div>
          </div>
        </div>

        {/* Bottom scroll roll */}
        <div
          ref={bottomRollRef}
          className="absolute bottom-0 left-0 right-0 h-[50vh] flex flex-col justify-start z-10"
        >
          {/* Wooden rod */}
          <div className="h-6 w-full relative flex items-center justify-between px-4"
            style={{
              backgroundImage: "url(/textures/dark-wood.jpg)",
              backgroundSize: "cover",
              boxShadow: "0 -6px 24px rgba(0,0,0,0.6)"
            }}
          >
            {/* Left ornament */}
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-[#6b6b6b] shadow-lg"
                style={{ boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.4), 0 2px 4px rgba(255,255,255,0.2)" }}
              />
              <div className="w-6 h-6 rounded-full bg-[#3d2d1f] shadow-lg border border-[#a8a8a8]" />
              <div className="w-3 h-5 bg-[#3d2d1f] rounded-sm"
                style={{ clipPath: "polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)" }}
              />
            </div>
            
            {/* Right ornament */}
            <div className="flex items-center gap-1">
              <div className="w-3 h-5 bg-[#3d2d1f] rounded-sm"
                style={{ clipPath: "polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)" }}
              />
              <div className="w-6 h-6 rounded-full bg-[#3d2d1f] shadow-lg border border-[#a8a8a8]" />
              <div className="w-4 h-4 rounded-full bg-[#6b6b6b] shadow-lg"
                style={{ boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.4), 0 2px 4px rgba(255,255,255,0.2)" }}
              />
            </div>
          </div>
          
          {/* Rolled paper cylinder */}
          <div 
            className="h-16 w-full relative"
            style={{
              background: "linear-gradient(to top, #d4c4a8 0%, #c9b896 20%, #bfa97c 50%, #c9b896 80%, #d4c4a8 100%)",
              boxShadow: "0 -4px 20px rgba(0,0,0,0.5)"
            }}
          >
            {/* Paper texture lines */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)"
              }}
            />
          </div>
          
          {/* Roll shadow */}
          <div 
            className="h-8 w-full"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)"
            }}
          />
        </div>
      </div>

      {/* Hidden content during animation */}
      <div ref={contentRef} className="opacity-0">
        {children}
      </div>
    </>
  )
}
