"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Flower2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const DONATION_OPTIONS = [
  { amount: 25, flowerCount: 2 },
  { amount: 50, flowerCount: 3 },
  { amount: 100, flowerCount: 4 },
]

const FLOWER_COLORS = ["text-rose-400", "text-pink-400", "text-primary"]

export function DonationForm() {
  const { t, language } = useI18n()
  const [hoveredAmount, setHoveredAmount] = useState<number | null>(null)

  return (
    <Card className="max-w-md mx-auto bg-card/50 border-border backdrop-blur-sm shadow-xl">
      <CardHeader className="text-center pb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-3 mx-auto">
          <Flower2 className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="font-serif text-2xl font-medium text-foreground">{t.flowers.title}</CardTitle>
        <CardDescription className="text-muted-foreground mt-1.5 text-sm">
          {t.flowers.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2 pb-6">
        <div className="grid grid-cols-3 gap-3">
          {DONATION_OPTIONS.map((option) => {
            const isActive = hoveredAmount === option.amount

            return (
              <Link
                key={option.amount}
                href={`/flowers/${option.amount}`}
                onMouseEnter={() => setHoveredAmount(option.amount)}
                onMouseLeave={() => setHoveredAmount(null)}
                onFocus={() => setHoveredAmount(option.amount)}
                onBlur={() => setHoveredAmount(null)}
                className={cn(
                  "relative flex flex-col items-center justify-center py-5 px-3 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[88px]",
                  isActive
                    ? "border-primary bg-primary/5 shadow-[inset_0_2px_8px_rgba(35,97,48,0.15)] scale-[1.02]"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                {/* Amount label - centered, moves up when flowers appear */}
                <span
                  className={cn(
                    "text-xl tabular-nums transition-all duration-200",
                    isActive 
                      ? "font-bold text-foreground -translate-y-2" 
                      : "font-normal text-foreground"
                  )}
                >
                  {option.amount}{t.flowers.currency}
                </span>

                {/* Flower icons — hidden by default, fade in on hover */}
                <div
                  className={cn(
                    "absolute bottom-3 flex items-center justify-center gap-1 transition-all duration-200",
                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
                  )}
                  aria-hidden="true"
                >
                  {Array.from({ length: option.flowerCount }).map((_, i) => (
                    <Flower2
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5 transition-all duration-150",
                        FLOWER_COLORS[i % FLOWER_COLORS.length]
                      )}
                      style={{ transitionDelay: `${i * 30}ms` }}
                    />
                  ))}
                </div>
              </Link>
            )
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          {language === "et"
            ? "Vali summa, et näha pangaandmeid."
            : "Select amount to see bank details."}
        </p>
      </CardContent>
    </Card>
  )
}
