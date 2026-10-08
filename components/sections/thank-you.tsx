"use client"

import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { LanternCursor } from "@/components/ui/lantern-cursor"

export function ThankYou() {
  const { language } = useI18n()

  return (
    <section className="thank-you-section relative isolate min-h-[100dvh] flex items-center justify-center overflow-hidden">
      <LanternCursor />
      <div
        className="absolute inset-0 z-0 bg-cover brightness-125"
        style={{ backgroundImage: "url('/images/castle-couple.jpg')", backgroundPosition: "center 72%" }}
        role="img"
        aria-label="Johanna ja Rannar"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/65" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-28 text-center text-white">
        <p className="mb-5 text-xs uppercase tracking-[0.35em] text-white/75">Johanna & Rannar</p>
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-medium tracking-tight text-balance">
          Aitäh, et olite meiega
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-white/85">
          {language === "et"
            ? "Meie päeva ilusamad hetked jäävad siia meenutamiseks."
            : "The most beautiful moments from our day remain here to remember."}
        </p>
        <Link
          href="/photos"
          className="rsvp-glass-btn group relative z-10 mt-9 inline-flex items-center gap-3 rounded-2xl px-9 py-4 text-sm font-normal uppercase tracking-widest text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <span>{language === "et" ? "Vaata galeriid" : "View gallery"}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <a href="#countdown" aria-label="Vaata möödunud aega" className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full p-2 text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
        <ArrowDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  )
}
