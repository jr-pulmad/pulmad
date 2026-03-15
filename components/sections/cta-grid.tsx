"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"
import { Card, CardContent } from "@/components/ui/card"
import { UserCheck, Flower2, Info, ArrowRight, ChevronDown } from "lucide-react"

// Scroll hint component with custom text
function ScrollHint({ text }: { text: string }) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50 hover:opacity-80 transition-opacity max-w-xs text-center px-4">
      <span className="text-xs text-muted-foreground/70 leading-relaxed">
        {text}
      </span>
      <ChevronDown className="w-5 h-5 text-muted-foreground/70" />
    </div>
  )
}

export function CTAGrid() {
  const { t, language } = useI18n()

  const cards = [
    {
      href: "/rsvp",
      icon: UserCheck,
      title: t.cta.rsvp,
      description: language === "et" 
        ? "Kinnita osalemine ja vali oma menüü" 
        : "Confirm attendance and select your menu",
    },
    {
      href: "/flowers",
      icon: Flower2,
      title: t.cta.flowers,
      description: t.flowers.subtitle,
    },
    {
      href: "/info",
      icon: Info,
      title: t.cta.info,
      description: t.info.title,
    },
  ]

  const scrollHintText = language === "et" 
    ? "Vaata viimaseid uuendusi" 
    : "See the latest updates"

  return (
    <section className="min-h-[100dvh] flex items-center py-16 sm:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {cards.map((card, index) => (
              <Link key={index} href={card.href} className="group">
                <Card className="h-full bg-card/50 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <card.icon className="w-6 h-6" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-medium text-foreground mb-2">{card.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{card.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll hint with custom text */}
      <ScrollHint text={scrollHintText} />
    </section>
  )
}
