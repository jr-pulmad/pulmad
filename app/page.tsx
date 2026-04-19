import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { Countdown } from "@/components/sections/countdown"
import { CTAGrid } from "@/components/sections/cta-grid"
import { Updates } from "@/components/sections/updates"
import { VenuePreview } from "@/components/sections/venue-preview"
import { ScrollIndicator } from "@/components/ui/scroll-indicator"
import { ScrollExperience } from "@/components/scroll-3d/scroll-experience"
import { BurntEdge } from "@/components/scroll-3d/burnt-edge"

export default function HomePage() {
  return (
    <ScrollExperience>
      {/* Outer wrapper carries the parchment paper texture — scrolls WITH the page,
          giving the impression of one continuous scroll of paper from top rod to
          bottom rod. padding-left/right constrain page content inside the paper area. */}
      <div
        className="relative flex flex-col"
        style={{
          minHeight: "100vh",
          paddingTop: "var(--scroll-safe-top)",
          paddingBottom: "var(--scroll-safe-bottom)",
          paddingLeft: "var(--scroll-safe-x)",
          paddingRight: "var(--scroll-safe-x)",
          backgroundImage: "url(/textures/parchment-detailed.jpg)",
          backgroundRepeat: "repeat-y",
          backgroundSize: "100% auto",
          backgroundPosition: "top center",
          backgroundColor: "#b89870",
          backgroundBlendMode: "multiply",
        }}
      >
        {/* Burnt edges live INSIDE the content wrapper so they scroll with the paper.
            Span the full height of the wrapper (including padding). */}
        <BurntEdge side="left" width={56} />
        <BurntEdge side="right" width={56} />

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
