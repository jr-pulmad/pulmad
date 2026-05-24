"use client"

import { useI18n } from "@/lib/i18n/context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Flower2, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// 3 fixed donation amounts with descriptions
const DONATION_OPTIONS = [
  {
    amount: 25,
    flowerCount: 3,
    description_et: "Väike kimp tulpe",
    description_en: "Small tulip bouquet",
    envKey: "FLOWERS_PAYMENT_URL_25",
  },
  {
    amount: 50,
    flowerCount: 5,
    description_et: "Keskmine segakimp",
    description_en: "Medium mixed bouquet",
    envKey: "FLOWERS_PAYMENT_URL_50",
  },
  {
    amount: 100,
    flowerCount: 8,
    description_et: "Suur roosikimp",
    description_en: "Large rose arrangement",
    envKey: "FLOWERS_PAYMENT_URL_100",
  },
]

// Payment URLs from environment variables
const PAYMENT_URLS: Record<string, string> = {
  FLOWERS_PAYMENT_URL_25: process.env.NEXT_PUBLIC_FLOWERS_PAYMENT_URL_25 || "#",
  FLOWERS_PAYMENT_URL_50: process.env.NEXT_PUBLIC_FLOWERS_PAYMENT_URL_50 || "#",
  FLOWERS_PAYMENT_URL_100: process.env.NEXT_PUBLIC_FLOWERS_PAYMENT_URL_100 || "#",
}

function FlowerPreview({ count, description }: { count: number; description: string }) {
  const colors = ["text-rose-400", "text-pink-400", "text-primary"]
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: count }).map((_, i) => (
          <Flower2 
            key={i} 
            className={cn("w-5 h-5", colors[i % colors.length])}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center">
        {description}
      </p>
    </div>
  )
}

export function DonationForm() {
  const { t, language } = useI18n()

  return (
    <Card className="max-w-xl mx-auto bg-card/50 border-border backdrop-blur-sm shadow-xl">
      <CardHeader className="text-center pb-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4 mx-auto">
          <Flower2 className="w-7 h-7 text-primary" />
        </div>
        <CardTitle className="font-serif text-2xl sm:text-3xl font-medium text-foreground">{t.flowers.title}</CardTitle>
        <CardDescription className="text-muted-foreground mt-2 max-w-md mx-auto">
          {t.flowers.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-5">
          {/* Preset amounts */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{t.flowers.presetAmounts}</p>
            <div className="grid grid-cols-1 gap-3">
              {DONATION_OPTIONS.map((option) => {
                const url = PAYMENT_URLS[option.envKey]
                const description = language === "et" ? option.description_et : option.description_en
                
                return (
                  <Link
                    key={option.amount}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-between py-4 px-5 rounded-xl font-medium transition-all duration-300 bg-card border border-border text-foreground hover:border-primary hover:bg-primary/5"
                  >
                    {/* Left side - amount and description */}
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="text-lg font-semibold">
                        {option.amount}{t.flowers.currency}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {description}
                      </span>
                    </div>
                    
                    {/* Right side - flower icons (visible on hover) */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        {Array.from({ length: option.flowerCount }).map((_, i) => (
                          <Flower2 
                            key={i} 
                            className={cn(
                              "w-4 h-4",
                              i % 3 === 0 && "text-rose-400",
                              i % 3 === 1 && "text-pink-400",
                              i % 3 === 2 && "text-primary"
                            )}
                          />
                        ))}
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Info text */}
          <div className="text-center py-3 px-4 rounded-xl bg-secondary/30 border border-border">
            <p className="text-sm text-muted-foreground">
              {language === "et" 
                ? "Klikkides avaneb makseleht QR-koodi ja pangaandmetega" 
                : "Click to open payment page with QR code and bank details"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
