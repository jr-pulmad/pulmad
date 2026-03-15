"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { ArrowDown, Church, PartyPopper, Play, Pause, Volume2, VolumeX } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

export function Hero() {
  const { t, language } = useI18n()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [showVideo, setShowVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setMounted(true)
    // Show video after a brief delay for a cinematic entrance
    const timer = setTimeout(() => setShowVideo(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const scrollToContent = () => {
    const heroHeight = window.innerHeight
    window.scrollTo({ top: heroHeight, behavior: "smooth" })
  }

  // Fallback image for when video is not available
  const heroImage = mounted && resolvedTheme === "dark" 
    ? "/romantic-castle-evening-twilight-dark-moody-estoni.jpg"
    : "/alatskivi-castle-hero.jpg"

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {/* Sample video - replace with your actual video */}
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
          {/* Sample wedding video - can be replaced */}
          <source 
            src="https://assets.mixkit.co/videos/1946/1946-720.mp4" 
            type="video/mp4" 
          />
          {/* Fallback to image if video fails */}
        </video>
        
        {/* Gradient overlays for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 dark:from-black/80 dark:via-black/50 dark:to-background" />
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
      </div>

      {/* Video Controls - minimalist */}
      <div className="absolute bottom-24 sm:bottom-28 left-6 z-20 flex items-center gap-2">
        <button
          onClick={togglePlay}
          className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
          aria-label={isVideoPlaying ? "Pause video" : "Play video"}
        >
          {isVideoPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white ml-0.5" />
          )}
        </button>
        <button
          onClick={toggleMute}
          className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className={cn(
        "relative z-10 container mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-24 sm:pb-28 text-center flex flex-col items-center justify-center transition-all duration-1000 delay-500",
        showVideo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        <div className="max-w-4xl mx-auto">
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-5 sm:mb-8">
            <div className="h-px w-12 sm:w-20 bg-white/50" />
            <span className="text-white/90 text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-medium">{t.hero.saveTheDate}</span>
            <div className="h-px w-12 sm:w-20 bg-white/50" />
          </div>

          {/* Names with entrance animation */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white mb-2 sm:mb-3 text-balance drop-shadow-lg">
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "0.6s", animationFillMode: "both" }}>Johanna</span>
            {" "}
            <span className="inline-block text-primary animate-fade-in-up" style={{ animationDelay: "0.8s", animationFillMode: "both" }}>&</span>
            {" "}
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "1s", animationFillMode: "both" }}>Rannar</span>
          </h1>

          {/* Family name */}
          <p className="text-sm sm:text-base md:text-lg text-white/80 tracking-[0.2em] sm:tracking-[0.25em] uppercase mb-6 sm:mb-10 font-light animate-fade-in-up" style={{ animationDelay: "1.2s", animationFillMode: "both" }}>
            Randmäe
          </p>

          {/* Date badge with glow */}
          <div className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-5 sm:mb-8 shadow-[0_0_30px_rgba(154,188,6,0.2)] animate-fade-in-up" style={{ animationDelay: "1.4s", animationFillMode: "both" }}>
            <span className="text-sm sm:text-base font-semibold tracking-wide text-white">{t.hero.date}</span>
          </div>

          {/* Venues - glass cards with hover effects */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 animate-fade-in-up" style={{ animationDelay: "1.6s", animationFillMode: "both" }}>
            <div className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 hover:border-white/25 transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/25 border border-primary/40 group-hover:bg-primary/35 transition-colors duration-300">
                <Church className="w-4 h-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-[10px] sm:text-xs text-white/70 uppercase tracking-wider font-medium">
                  {language === "et" ? "Tseremoonia" : "Ceremony"}
                </p>
                <span className="text-sm sm:text-base font-medium text-white">
                  {language === "et" ? "Tartu Peetri kirik" : "St. Peter's Church"}
                </span>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center justify-center w-6 h-6">
              <div className="w-2 h-2 rounded-full bg-primary/80 animate-pulse" />
            </div>
            
            <div className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 hover:border-white/25 transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/25 border border-primary/40 group-hover:bg-primary/35 transition-colors duration-300">
                <PartyPopper className="w-4 h-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-[10px] sm:text-xs text-white/70 uppercase tracking-wider font-medium">
                  {language === "et" ? "Pidu" : "Reception"}
                </p>
                <span className="text-sm sm:text-base font-medium text-white">Alatskivi Loss</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons with micro-interactions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: "1.8s", animationFillMode: "both" }}>
            <Button asChild size="lg" className="w-full sm:w-auto min-w-[160px] h-12 sm:h-14 text-sm sm:text-base font-medium shadow-[0_8px_32px_rgba(35,97,48,0.4)] hover:shadow-[0_12px_40px_rgba(35,97,48,0.5)]">
              <Link href="/rsvp">{t.cta.rsvp}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto min-w-[160px] h-12 sm:h-14 text-sm sm:text-base font-medium bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm">
              <Link href="/info">{t.cta.info}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator with animation */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full p-2"
        aria-label="Scroll down"
      >
        <div className="flex flex-col items-center gap-1">
          <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-transparent via-white/50 to-white/70 animate-pulse" />
          <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 group-hover:text-white transition-colors animate-bounce" />
        </div>
      </button>
    </section>
  )
}
