import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const galleries = [
  { title: "Pulmapidu", href: "https://drive.google.com/", position: "object-[center_68%]" },
  { title: "Tseremoonia", href: "https://drive.google.com/", position: "object-[center_52%]" },
  { title: "Paparazzi", href: "https://drive.google.com/", position: "object-[center_82%]" },
]

export default function PhotosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center pt-24 pb-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary">Johanna & Rannar</p>
              <h1 className="mt-3 font-serif text-5xl sm:text-6xl">Meie pulmapäev</h1>
              <p className="mt-3 max-w-xl text-muted-foreground">Vali galerii ja astu tagasi meie päeva kõige ilusamatesse hetkedesse.</p>
            </div>
            <Link href="/" className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground">Tagasi</Link>
          </div>

          <div className="grid h-[58vh] min-h-[390px] grid-cols-1 gap-3 sm:grid-cols-3">
            {galleries.map((gallery) => (
              <a key={gallery.title} href={gallery.href} target="_blank" rel="noopener noreferrer" className="group relative min-h-[120px] overflow-hidden rounded-2xl border border-border/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Image src="/images/castle-couple.jpg" alt={`${gallery.title} galerii`} fill className={`object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0 ${gallery.position}`} />
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
