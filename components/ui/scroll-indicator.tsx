"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function ScrollIndicator() {
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const percentage = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0
      setScrollPercentage(percentage)
      setIsVisible(scrollTop > 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div 
      className={cn(
        "fixed bottom-6 right-6 z-40 items-center gap-2 transition-all duration-300",
        "text-xs font-mono text-muted-foreground/70",
        "hidden sm:flex", // Hide on mobile
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <span className="text-[10px] uppercase tracking-wider opacity-60">scroll</span>
      <div className="relative w-12 h-[2px] bg-border/50 rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-primary/60 rounded-full transition-all duration-150"
          style={{ width: `${scrollPercentage}%` }}
        />
      </div>
      <span className="tabular-nums w-8 text-right">{scrollPercentage}%</span>
    </div>
  )
}
