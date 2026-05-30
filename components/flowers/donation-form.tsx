"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Flower2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const DONATION_OPTIONS = [
  { amount: 25, flowerCount: 3 },
  { amount: 50, flowerCount: 5 },
  { amount: 100, flowerCount: 8 },
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
                  "relative flex flex-col items-center justify-center gap-2.5 py-5 px-3 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isActive
                    ? "border-primary bg-primary/8 shadow-md shadow-primary/10 scale-[1.03]"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                {/* Amount label */}
                <span
                  className={cn(
                    "text-xl tabular-nums transition-all duration-200",
                    isActive ? "font-bold text-primary" : "font-semibold text-foreground"
                  )}
                >
                  {option.amount}{t.flowers.currency}
                </span>

                {/* Flower icons — hidden by default, fade in on hover */}
                <div
                  className={cn(
                    "flex items-center justify-center gap-0.5 transition-all duration-200",
                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
                  )}
                  aria-hidden="true"
                >
                  {Array.from({ length: option.flowerCount }).map((_, i) => (
                    <Flower2
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-150",
                        FLOWER_COLORS[i % FLOWER_COLORS.length],
                        isActive && "scale-110"
                      )}
                      style={{ transitionDelay: `${i * 20}ms` }}
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
