"use client"

import { useViewMode } from "@/lib/view-mode/context"
import { Hero } from "@/components/sections/hero"
import { Countdown } from "@/components/sections/countdown"
import { CTAGrid } from "@/components/sections/cta-grid"
import { VenuePreview } from "@/components/sections/venue-preview"
import { Updates } from "@/components/sections/updates"

/**
 * Client component that reads the view mode cookie and conditionally renders
 * sections. "ceremony" view shows only ceremony info (hero + countdown +
 * venue). "full" view shows everything including party info, RSVP, flowers.
 */
export function HomeContent() {
  const { viewMode } = useViewMode()
  const isCeremonyOnly = viewMode === "ceremony"

  return (
    <main className="flex-1 flex flex-col">
      <Hero />
      <Countdown />
      {/* Party info, RSVP and flowers CTA hidden for ceremony-only visitors */}
      {!isCeremonyOnly && (
        <>
          <CTAGrid />
          <VenuePreview />
          <Updates />
        </>
      )}
      {/* Ceremony-only: still show venue but with ceremony section only */}
      {isCeremonyOnly && <VenuePreview ceremonyOnly />}
    </main>
  )
}
