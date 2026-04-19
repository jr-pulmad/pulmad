import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { Countdown } from "@/components/sections/countdown"
import { CTAGrid } from "@/components/sections/cta-grid"
import { Updates } from "@/components/sections/updates"
import { VenuePreview } from "@/components/sections/venue-preview"
import { ScrollIndicator } from "@/components/ui/scroll-indicator"
import { Scroll3DOverlay } from "@/components/scroll-3d/scroll-overlay"
import { PaperScrollFrame } from "@/components/paper-scroll-frame"

export default function HomePage() {
  return (
    <Scroll3DOverlay>
      <PaperScrollFrame>
        <div className="min-h-screen flex flex-col bg-background">
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
      </PaperScrollFrame>
    </Scroll3DOverlay>
  )
}
