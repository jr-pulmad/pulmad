"use client"

import Link from "next/link"
import Image from "next/image"
import { useI18n } from "@/lib/i18n/context"
import { ArrowDown, Loader2, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function Hero() {
  const { t } = useI18n()
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setImageLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const scrollToContent = () => {
    const heroHeight = window.innerHeight
    window.scrollTo({ top: heroHeight, behavior: "smooth" })
  }

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Image Background */}
      <div className="absolute inset-0 z-0">
        {/* Loading state */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-background flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* Mobile: Portrait image (full height) */}
        <div className="block md:hidden absolute inset-0">
          <Image
            src="/images/hero_couple.jpeg"
            alt="Johanna & Rannar"
            fill
            priority
            style={{ objectPosition: "center 10%" }}
            className={cn(
              "object-cover transition-opacity duration-1000",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Desktop: Cropped landscape from face height */}
        <div className="hidden md:block absolute inset-0">
          <Image
            src="/images/hero_couple.jpeg"
            alt="Johanna & Rannar"
            fill
            priority
            className={cn(
              "object-cover object-[center_55%] transition-opacity duration-1000",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 dark:from-black/80 dark:via-black/50 dark:to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
      </div>

      {/* Content */}
      <div
        className={cn(
          "relative z-10 container mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-24 sm:pb-28 text-center flex flex-col items-center justify-center transition-transform duration-1000 delay-500",
          imageLoaded ? "translate-y-0" : "translate-y-4"
        )}
      >
        <div className="max-w-3xl mx-auto translate-y-4 md:translate-y-0">
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
            <div className="h-px w-10 sm:w-16 bg-white/40" />
            <span className="text-white/80 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-light">
              {t.hero.saveTheDate}
            </span>
            <div className="h-px w-10 sm:w-16 bg-white/40" />
          </div>

          {/* Names - & symbol in white */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white mb-3 sm:mb-4 text-balance drop-shadow-lg">
            <span
              className="inline-block animate-fade-in-up"
              style={{ animationDelay: "0.6s", animationFillMode: "both" }}
            >
              Johanna
            </span>{" "}
            <span
              className="inline-block text-white animate-fade-in-up"
              style={{ animationDelay: "0.8s", animationFillMode: "both" }}
            >
              &
            </span>{" "}
            <span
              className="inline-block animate-fade-in-up"
              style={{ animationDelay: "1s", animationFillMode: "both" }}
            >
              Rannar
            </span>
          </h1>

          {/* Date */}
          <p
            className="text-lg sm:text-xl md:text-2xl text-white font-light tracking-wide mb-8 sm:mb-12 animate-fade-in-up"
            style={{ animationDelay: "1.2s", animationFillMode: "both" }}
          >
            {t.hero.date}
          </p>

          {/* RSVP Button — liquid glass */}
          <div className="mt-28 md:mt-0">
            <Link
              href="/rsvp"
              className="rsvp-glass-btn group relative inline-flex items-center gap-3 px-9 py-4 rounded-2xl text-white text-sm font-medium tracking-widest uppercase no-underline transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <span>{t.cta.rsvp}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
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
