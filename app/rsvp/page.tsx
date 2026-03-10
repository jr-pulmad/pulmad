import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RSVPForm } from "@/components/forms/rsvp-form"

export default function RSVPPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 sm:pt-28 pb-16 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <RSVPForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
