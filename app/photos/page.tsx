"use client"

import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useI18n } from "@/lib/i18n/context"

function getGalleryUrl(value: string | undefined) {
  if (!value) return null

  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null
  } catch {
    return null
  }
}

const galleryLinks = [
  { key: "weddingParty", href: getGalleryUrl(process.env.NEXT_PUBLIC_GALLERY_WEDDING_PARTY_URL), position: "object-[center_68%]" },
  { key: "ceremony", href: getGalleryUrl(process.env.NEXT_PUBLIC_GALLERY_CEREMONY_URL), position: "object-[center_52%]" },
  { key: "paparazzi", href: getGalleryUrl(process.env.NEXT_PUBLIC_GALLERY_PAPARAZZI_URL), position: "object-[center_82%]" },
] as const

export default function PhotosPage() {
  const { t } = useI18n()
  const galleries = galleryLinks.map((gallery) => ({ ...gallery, title: t.photos[gallery.key] }))

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center pt-24 pb-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8">
            <h1 className="font-serif text-5xl sm:text-6xl">{t.photos.title}</h1>
            <p className="mt-3 max-w-xl text-muted-foreground">{t.photos.subtitle}</p>
          </div>

          <div className="grid h-[58vh] min-h-[390px] grid-cols-1 gap-3 sm:grid-cols-3">
            {galleries.map((gallery) => (
              <a
                key={gallery.title}
                href={gallery.href ?? undefined}
                target={gallery.href ? "_blank" : undefined}
                rel={gallery.href ? "noopener noreferrer" : undefined}
                aria-disabled={!gallery.href}
                onClick={(event) => {
                  if (!gallery.href) event.preventDefault()
                }}
                className={`group relative min-h-[120px] overflow-hidden rounded-2xl border border-border/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${!gallery.href ? "cursor-default" : ""}`}
              >
                <Image src="/images/castle-couple.jpg" alt={gallery.title} fill className={`object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0 ${gallery.position}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent transition group-hover:from-black/60" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white">
                  <h2 className="font-serif text-3xl">{gallery.title}</h2>
                  <ArrowUpRight className="h-5 w-5 opacity-70 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
