"use client"

import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { LanternCursor } from "@/components/ui/lantern-cursor"

export function ThankYou() {
  const { t } = useI18n()
  const landing = t?.landing

  if (!landing) {
    return null
  }

  return (
    <section className="thank-you-section relative isolate min-h-[100dvh] flex items-center justify-center overflow-hidden">
      <LanternCursor />
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat brightness-[0.82]"
        style={{
          backgroundImage: "url('/images/castle-couple.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center calc(50% - 500px)",
        }}
        role="img"
        aria-label="Johanna ja Rannar"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/65" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-28 text-center text-white">
        <p className="mb-5 text-xs uppercase tracking-[0.35em] text-white/75">Johanna & Rannar</p>
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-medium tracking-tight text-balance">
          {t.landing.title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-white/85">
            {t.landing.subtitle}
        </p>
        <div className="animate-fade-in-up mt-10 sm:mt-14">
          <Link
            href="/photos"
            className="rsvp-glass-btn cursor-pointer group relative inline-flex items-center gap-3 rounded-2xl px-9 py-4 text-sm font-medium uppercase tracking-widest text-white no-underline transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
           >
             <span className="relative z-10">
             {t.landing.galleryCta}
            </span>
             <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
          </Link>
        </div>
      </div>

      <a href="#countdown" aria-label="Vaata möödunud aega" className="cursor-pointer absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full p-2 text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
        <ArrowDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  )
}
