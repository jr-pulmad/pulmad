"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { ArrowDown, Church, PartyPopper } from "lucide-react"
import { useEffect, useState } from "react"

export function Hero() {
  const { t, language } = useI18n()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToContent = () => {
    const heroHeight = window.innerHeight
    window.scrollTo({ top: heroHeight, behavior: "smooth" })
  }

  // Use different hero images for light/dark mode
  const heroImage = mounted && resolvedTheme === "dark" 
    ? "/romantic-castle-evening-twilight-dark-moody-estoni.jpg"
    : "/alatskivi-castle-hero.jpg"

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Alatskivi Castle" 
          className="w-full h-full object-cover transition-opacity duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 dark:from-black/75 dark:via-black/55 dark:to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-24 sm:pb-28 text-center flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto">
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-5 sm:mb-8">
            <div className="h-px w-12 sm:w-20 bg-white/50" />
            <span className="text-white/90 text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-medium">{t.hero.saveTheDate}</span>
            <div className="h-px w-12 sm:w-20 bg-white/50" />
          </div>

          {/* Names */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white mb-2 sm:mb-3 text-balance drop-shadow-lg">
            Johanna <span className="text-primary">&</span> Rannar
          </h1>

          {/* Family name */}
          <p className="text-sm sm:text-base md:text-lg text-white/80 tracking-[0.2em] sm:tracking-[0.25em] uppercase mb-6 sm:mb-10 font-light">
            Randmäe
          </p>

          {/* Date badge */}
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-5 sm:mb-8">
            <span className="text-sm sm:text-base font-semibold tracking-wide text-white">{t.hero.date}</span>
          </div>

          {/* Venues - improved visibility with card backgrounds */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 border border-primary/30">
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
              <div className="w-1.5 h-1.5 rounded-full bg-primary/80" />
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 border border-primary/30">
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

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto min-w-[160px] h-11 sm:h-12 text-sm sm:text-base font-medium">
              <Link href="/rsvp">{t.cta.rsvp}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto min-w-[160px] h-11 sm:h-12 text-sm sm:text-base font-medium bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 dark:bg-white/5 dark:border-white/20 dark:hover:bg-white/10">
              <Link href="/info">{t.cta.info}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator - positioned to be visible on mobile */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full p-2"
        aria-label="Scroll down"
      >
        <div className="flex flex-col items-center gap-1">
          <div className="w-px h-5 sm:h-6 bg-gradient-to-b from-transparent to-white/70" />
          <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 group-hover:text-white transition-colors animate-bounce" />
        </div>
      </button>
    </section>
  )
}
