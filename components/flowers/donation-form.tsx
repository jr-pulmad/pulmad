"use client"

import { useI18n } from "@/lib/i18n/context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Flower2 } from "lucide-react"
import { cn } from "@/lib/utils"

// 3 fixed donation amounts with flower previews
// Estonian flower prices: roses ~3-5€, tulips ~2-3€, mixed bouquet ~25-50€
const DONATION_OPTIONS = [
  {
    amount: 25,
    flowerCount: 8,
    description_et: "Väike kimp tulpe ja roose",
    description_en: "Small bouquet of tulips and roses",
    envKey: "FLOWERS_PAYMENT_URL_25",
  },
  {
    amount: 50,
    flowerCount: 18,
    description_et: "Keskmine kimp segatud lilledega",
    description_en: "Medium bouquet with mixed flowers",
    envKey: "FLOWERS_PAYMENT_URL_50",
  },
  {
    amount: 100,
    flowerCount: 35,
    description_et: "Suur luksuslillede kimp",
    description_en: "Large luxury flower arrangement",
    envKey: "FLOWERS_PAYMENT_URL_100",
  },
]

// Payment URLs from environment variables (will be set later)
const getPaymentUrl = (envKey: string): string => {
  const urls: Record<string, string | undefined> = {
    FLOWERS_PAYMENT_URL_25: process.env.NEXT_PUBLIC_FLOWERS_PAYMENT_URL_25,
    FLOWERS_PAYMENT_URL_50: process.env.NEXT_PUBLIC_FLOWERS_PAYMENT_URL_50,
    FLOWERS_PAYMENT_URL_100: process.env.NEXT_PUBLIC_FLOWERS_PAYMENT_URL_100,
  }
  return urls[envKey] || "#"
}

function FlowerIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2a3 3 0 0 0 0 6 3 3 0 0 0 0-6z" />
      <path d="M19 9a3 3 0 0 0-4.5 2.5M5 9a3 3 0 0 1 4.5 2.5" />
      <path d="M19 15a3 3 0 0 1-4.5-2.5M5 15a3 3 0 0 0 4.5-2.5" />
      <path d="M12 22a3 3 0 0 1 0-6 3 3 0 0 1 0 6z" />
      <path d="M12 22v-6" />
    </svg>
  )
}

function FlowerPreview({ count, description }: { count: number; description: string }) {
  // Show flowers in rows, max 7 per row
  const rows = []
  let remaining = count
  const rowSizes = [Math.min(remaining, 5)]
  remaining -= rowSizes[0]
  if (remaining > 0) {
    rowSizes.push(Math.min(remaining, 7))
    remaining -= rowSizes[1]
  }
  if (remaining > 0) {
    rowSizes.push(Math.min(remaining, 9))
    remaining -= rowSizes[2]
  }
  if (remaining > 0) {
    rowSizes.push(Math.min(remaining, 11))
    remaining -= rowSizes[3]
  }
  if (remaining > 0) {
    rowSizes.push(remaining)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col items-center gap-1">
        {rowSizes.map((size, rowIndex) => (
          <div key={rowIndex} className="flex items-center justify-center gap-0.5">
            {Array.from({ length: size }).map((_, i) => (
              <FlowerIcon 
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
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center leading-tight mt-1">
        ~{count} {count === 1 ? "lill" : "lille"} • {description}
      </p>
    </div>
  )
}

export function DonationForm() {
  const { t, language } = useI18n()

  const handleDonationClick = (envKey: string) => {
    const url = getPaymentUrl(envKey)
    if (url && url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

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
        <div className="space-y-6">
          {/* Preset amounts */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{t.flowers.presetAmounts}</p>
            <div className="grid grid-cols-1 gap-4">
              {DONATION_OPTIONS.map((option) => (
                <button
                  key={option.amount}
                  type="button"
                  onClick={() => handleDonationClick(option.envKey)}
                  className="group relative py-6 px-6 rounded-2xl font-semibold text-xl transition-all duration-300 bg-card border-2 border-border text-foreground hover:border-primary hover:bg-primary/5 hover:shadow-lg overflow-hidden"
                >
                  {/* Default state - just the amount */}
                  <div className="transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-[-10px]">
                    {option.amount}{t.flowers.currency}
                  </div>
                  
                  {/* Hover state - flower preview */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 translate-y-[10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 p-4">
                    <div className="text-lg font-semibold text-primary mb-2">
                      {option.amount}{t.flowers.currency}
                    </div>
                    <FlowerPreview 
                      count={option.flowerCount} 
                      description={language === "et" ? option.description_et : option.description_en}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Info text */}
          <div className="text-center py-4 rounded-2xl bg-secondary/30 border border-border">
            <p className="text-sm text-muted-foreground">
              {language === "et" 
                ? "Klõpsates suunatakse teid turvalisele makselehele" 
                : "Clicking will redirect you to a secure payment page"}
            </p>
          </div>

          {/* Bank transfer info hint */}
          <p className="text-xs text-muted-foreground/60 text-center">
            {language === "et" 
              ? "Makselehel leiate QR-koodi ja pangaülekande andmed" 
              : "The payment page includes QR code and bank transfer details"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
