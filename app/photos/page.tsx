import Link from "next/link"
import { ExternalLink, ImageIcon } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function PhotosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-28 pb-20">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Meie hetked</p>
            <h1 className="mt-4 font-serif text-5xl sm:text-6xl">Galerii</h1>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Siia kogume meie pulmapäeva pilte. Fotograafi galerii ja jagatud albumite lingid lisame siia peagi.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {["Pulmapäev", "Tseremoonia", "Peoõhtu"].map((title) => (
              <div key={title} className="group overflow-hidden rounded-3xl border border-border bg-card">
                <div className="flex aspect-[4/3] items-center justify-center bg-secondary/60 text-muted-foreground">
                  <ImageIcon className="h-8 w-8 transition-transform group-hover:scale-110" />
                </div>
                <div className="p-5">
                  <h2 className="font-serif text-2xl">{title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Fotod lisanduvad peagi.</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-border bg-secondary/40 p-6 sm:p-8">
            <h2 className="font-serif text-3xl">Jagatud album</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">Kui album on valmis, lisame siia turvalise lingi fotograafi või Google Drive&apos;i galeriisse.</p>
            <Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              Tagasi avalehele <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
