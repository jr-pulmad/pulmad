import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HomeContent } from "@/components/home-content"
import { ScrollIndicator } from "@/components/ui/scroll-indicator"
import { ScrollExperience } from "@/components/scroll-3d/scroll-experience"
import { BurntEdge } from "@/components/scroll-3d/burnt-edge"

export default function HomePage() {
  return (
    <ScrollExperience>
      {/* Content wrapper — transparent; the parchment renders behind as a
          viewport-fixed layer in ScrollExperience so it's truly continuous.
          Horizontal padding matches the ornament bulb's inner edge so content
          width = paper width between the ornamented knobs. */}
      <div
        className="relative flex flex-col"
        style={{
          minHeight: "100vh",
          paddingTop: "var(--scroll-safe-top)",
          paddingBottom: "var(--scroll-safe-bottom)",
          paddingLeft: "var(--scroll-safe-x)",
          paddingRight: "var(--scroll-safe-x)",
        }}
      >
        {/* Burnt edges — fixed to viewport so they visually anchor to the paper
            (which is also viewport-fixed). Dark top/bottom masks cover them in
            the outer regions, so they only show in the visible paper band. */}
        <BurntEdge side="left" width={56} />
        <BurntEdge side="right" width={56} />

        <Header />
        <HomeContent />
        <Footer />
        <ScrollIndicator />
      </div>
    </ScrollExperience>
  )
}
