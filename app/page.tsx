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
      {/* Content wrapper. The parchment is `background-attachment: fixed` so we
          get ONE continuous visible sheet of paper across the whole page — it
          never tiles and never shows horizontal/vertical seams as the user
          scrolls. Content scrolls OVER the fixed sheet, which matches how a
          reader sees a physical scroll: the visible portion of the parchment
          stays the same while the writing on it moves. */}
      <div
        className="relative flex flex-col"
        style={{
          minHeight: "100vh",
          paddingTop: "var(--scroll-safe-top)",
          paddingBottom: "var(--scroll-safe-bottom)",
          paddingLeft: "var(--scroll-safe-x)",
          paddingRight: "var(--scroll-safe-x)",
          backgroundImage: "url(/textures/parchment-detailed.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundAttachment: "fixed",
          backgroundColor: "#a68862",
          backgroundBlendMode: "multiply",
        }}
      >
        {/* Burnt edges — absolute inside this wrapper, so they scroll with the
            content and are confined to the paper area (never overlap the 3D
            rods or the outer dark frame). */}
        <BurntEdge side="left" width={52} />
        <BurntEdge side="right" width={52} />

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
