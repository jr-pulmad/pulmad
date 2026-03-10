"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, ArrowDown } from "lucide-react"

export function Hero() {
  const { t } = useI18n()

  const scrollToContent = () => {
    const heroHeight = window.innerHeight
    window.scrollTo({ top: heroHeight, behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with overlay - stronger gradient for text contrast */}
      <div className="absolute inset-0 z-0">
        <img src="/alatskivi-castle-hero.jpg" alt="Alatskivi Castle" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 dark:from-black/80 dark:via-black/60 dark:to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-24 pb-32 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-8 sm:mb-10">
            <div className="h-px w-16 sm:w-24 bg-white/40" />
            <span className="text-white/80 text-[10px] sm:text-xs tracking-[0.4em] uppercase font-medium">{t.hero.saveTheDate}</span>
            <div className="h-px w-16 sm:w-24 bg-white/40" />
          </div>

          {/* Names */}
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-medium tracking-tight text-white mb-3 sm:mb-4 text-balance drop-shadow-xl">
            Johanna <span className="text-primary">&</span> Rannar
          </h1>

          {/* Family name */}
          <p className="text-base sm:text-lg md:text-xl text-white/70 tracking-[0.25em] uppercase mb-12 sm:mb-16 font-light">
            Randmäe
          </p>

          {/* Date and venue */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-12 sm:mb-16">
            <div className="flex items-center gap-2.5 text-white/90">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-sm sm:text-base font-medium tracking-wide">{t.hero.date}</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/40" />
            <div className="flex items-center gap-2.5 text-white/90">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-sm sm:text-base font-medium tracking-wide">{t.hero.venue}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <Button asChild size="lg" className="w-full sm:w-auto min-w-[180px] h-12 text-base font-medium">
              <Link href="/rsvp">{t.cta.rsvp}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto min-w-[180px] h-12 text-base font-medium bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 dark:bg-white/5 dark:border-white/20 dark:hover:bg-white/10">
              <Link href="/info">{t.cta.info}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator - elegant arrow */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full p-3"
        aria-label="Scroll down"
      >
        <div className="relative flex flex-col items-center">
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/50 to-white/80 mb-2" />
          <ArrowDown className="w-5 h-5 text-white/80 group-hover:text-white transition-colors animate-bounce" />
        </div>
      </button>
    </section>
  )
}
