import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { Countdown } from "@/components/sections/countdown"
import { CTAGrid } from "@/components/sections/cta-grid"
import { Updates } from "@/components/sections/updates"
import { VenuePreview } from "@/components/sections/venue-preview"
import { ScrollIndicator } from "@/components/ui/scroll-indicator"
import { ScrollExperience } from "@/components/scroll-3d/scroll-experience"

export default function HomePage() {
  return (
    <ScrollExperience>
      <div
        className="min-h-screen flex flex-col"
        style={{
          paddingTop: "var(--scroll-safe-top)",
          paddingBottom: "var(--scroll-safe-bottom)",
        }}
      >
        <Header />
        <main className="flex-1 flex flex-col">
          <Hero />
          <Countdown />
          <CTAGrid />
          <VenuePreview />
          <Updates />
        </main>
        <Footer />
        <ScrollIndicator />
      </div>
    </ScrollExperience>
  )
}
