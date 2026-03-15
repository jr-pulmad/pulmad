"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

export function Hero() {
  const { t } = useI18n()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setShowVideo(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const scrollToContent = () => {
    const heroHeight = window.innerHeight
    window.scrollTo({ top: heroHeight, behavior: "smooth" })
  }

  const heroImage = mounted && resolvedTheme === "dark" 
    ? "/romantic-castle-evening-twilight-dark-moody-estoni.jpg"
    : "/alatskivi-castle-hero.jpg"

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Video Background - always playing, always muted, no controls */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-1000",
            showVideo ? "opacity-100" : "opacity-0"
          )}
          autoPlay
          muted
          loop
          playsInline
          poster={heroImage}
        >
          <source 
            src="https://assets.mixkit.co/videos/1946/1946-720.mp4" 
            type="video/mp4" 
          />
        </video>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 dark:from-black/80 dark:via-black/50 dark:to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
      </div>

      {/* Content */}
      <div className={cn(
        "relative z-10 container mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-24 sm:pb-28 text-center flex flex-col items-center justify-center transition-all duration-1000 delay-500",
        showVideo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        <div className="max-w-3xl mx-auto">
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
            <div className="h-px w-10 sm:w-16 bg-white/40" />
            <span className="text-white/80 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-light">{t.hero.saveTheDate}</span>
            <div className="h-px w-10 sm:w-16 bg-white/40" />
          </div>

          {/* Names - & symbol in white */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white mb-3 sm:mb-4 text-balance drop-shadow-lg">
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "0.6s", animationFillMode: "both" }}>Johanna</span>
            {" "}
            <span className="inline-block text-white animate-fade-in-up" style={{ animationDelay: "0.8s", animationFillMode: "both" }}>&</span>
            {" "}
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "1s", animationFillMode: "both" }}>Rannar</span>
          </h1>

          {/* Date */}
          <p className="text-lg sm:text-xl md:text-2xl text-white font-light tracking-wide mb-8 sm:mb-12 animate-fade-in-up" style={{ animationDelay: "1.2s", animationFillMode: "both" }}>
            {t.hero.date}
          </p>

          {/* Luxurious RSVP Button - more blur, more rounded to match header */}
          <div className="animate-fade-in-up" style={{ animationDelay: "1.4s", animationFillMode: "both" }}>
            <Button 
              asChild 
              size="lg" 
              className="min-w-[200px] h-14 sm:h-16 text-sm sm:text-base font-medium rounded-2xl bg-white/15 backdrop-blur-xl border border-white/40 text-white hover:bg-white/25 hover:border-white/60 shadow-xl shadow-black/30 transition-all duration-300"
            >
              <Link href="/rsvp">{t.cta.rsvp}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full p-2"
        aria-label="Scroll down"
      >
        <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 group-hover:text-white transition-colors animate-bounce" />
      </button>
    </section>
  )
}
