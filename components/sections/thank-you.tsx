"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export function ThankYou() {
  const { language } = useI18n()

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero_couple.jpeg"
          alt="Johanna ja Rannar"
          fill
          priority
          className="object-cover object-[center_55%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/85" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-28 text-center text-white">
        <p className="mb-5 text-xs uppercase tracking-[0.35em] text-white/75">Johanna & Rannar</p>
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-medium tracking-tight text-balance">
          Aitäh, et olite meiega
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-white/85">
          {language === "et"
            ? "Meie päev sai tänu teile veelgi ilusamaks. Siin on väike koht, kuhu tagasi tulla ja hetki meenutada."
            : "Thank you for being part of our day. This is a little place to return to and remember it with us."}
        </p>
        <Link
          href="/photos"
          className="group mt-9 inline-flex items-center gap-3 rounded-2xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.2em] backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          {language === "et" ? "Vaata galeriid" : "View gallery"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <a href="#countdown" aria-label="Vaata möödunud aega" className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full p-2 text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
        <ArrowDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  )
}
