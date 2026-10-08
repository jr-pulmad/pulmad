import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ThankYou } from "@/components/sections/thank-you"
import { Countdown } from "@/components/sections/countdown"
import { LanternCursor } from "@/components/ui/lantern-cursor"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background lantern-page">
      <LanternCursor />
      <Header />
      <main className="flex-1 flex flex-col">
        <ThankYou />
        <div id="countdown">
          <Countdown />
        </div>
      </main>
      <Footer />
    </div>
  )
}
