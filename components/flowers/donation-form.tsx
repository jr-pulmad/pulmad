"use client"

import { useI18n } from "@/lib/i18n/context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Flower2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// 3 fixed donation amounts
const DONATION_OPTIONS = [
  { amount: 25, flowerCount: 3 },
  { amount: 50, flowerCount: 5 },
  { amount: 100, flowerCount: 8 },
]

export function DonationForm() {
  const { t, language } = useI18n()

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
        {/* Horizontal amount buttons */}
        <div className="grid grid-cols-3 gap-2">
          {DONATION_OPTIONS.map((option) => (
            <Link
              key={option.amount}
              href={`/flowers/${option.amount}`}
              className="group relative flex flex-col items-center gap-2 py-4 px-3 rounded-xl font-medium transition-all duration-300 bg-card border border-border text-foreground hover:border-primary hover:bg-primary/5"
            >
              {/* Amount */}
              <span className="text-lg font-semibold">
                {option.amount}{t.flowers.currency}
              </span>
              
              {/* Flower icons */}
              <div className="flex items-center justify-center gap-0.5">
                {Array.from({ length: option.flowerCount }).map((_, i) => (
                  <Flower2 
                    key={i} 
                    className={cn(
                      "w-3.5 h-3.5 transition-colors",
                      i % 3 === 0 && "text-rose-400",
                      i % 3 === 1 && "text-pink-400",
                      i % 3 === 2 && "text-primary"
                    )}
                  />
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* Info text */}
        <p className="text-xs text-muted-foreground text-center mt-4 px-2">
          {language === "et" 
            ? "Vali summa, et näha pangaandmeid." 
            : "Select amount to see bank details."}
        </p>
      </CardContent>
    </Card>
  )
}
