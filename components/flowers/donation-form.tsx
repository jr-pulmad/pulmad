"use client"

import type React from "react"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Flower2, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const PRESET_AMOUNTS = [35, 50]

export function DonationForm() {
  const { t, language } = useI18n()
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount("")
    setError("")
  }

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "")
    setCustomAmount(value)
    setSelectedAmount(null)
    setError("")
  }

  const getFinalAmount = (): number => {
    if (selectedAmount) return selectedAmount
    if (customAmount) return Number.parseFloat(customAmount)
    return 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = getFinalAmount()

    if (amount < 1) {
      setError(t.flowers.minAmount)
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/flowers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          language,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // In production, redirect to payment provider URL
        // if (data.paymentUrl) {
        //   window.location.href = data.paymentUrl
        // }
        setIsSuccess(true)
      } else {
        setError(data.error || t.flowers.cancel)
      }
    } catch {
      setError(t.flowers.cancel)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="max-w-xl mx-auto bg-card/50 border-border">
        <CardContent className="py-12 sm:py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-foreground mb-3">{t.common.success}</h3>
          <p className="text-muted-foreground max-w-md mx-auto">{t.flowers.success}</p>
          <p className="text-sm text-muted-foreground/60 mt-4">
            {language === "et" ? "Makse integratsioon tuleb peagi." : "Payment integration coming soon."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-xl mx-auto bg-card/50 border-border">
      <CardHeader className="text-center pb-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 mx-auto">
          <Flower2 className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="font-serif text-2xl sm:text-3xl font-medium text-foreground">{t.flowers.title}</CardTitle>
        <CardDescription className="text-muted-foreground mt-2 max-w-md mx-auto">
          {t.flowers.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preset amounts */}
          <div className="space-y-3">
            <Label>{t.flowers.presetAmounts}</Label>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handlePresetClick(amount)}
                  className={cn(
                    "py-4 px-4 rounded-xl border-2 font-medium text-lg transition-all duration-200",
                    selectedAmount === amount
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background/30 text-foreground hover:border-primary/50 hover:bg-background/50",
                  )}
                >
                  {amount}
                  {t.flowers.currency}
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div className="space-y-2">
            <Label htmlFor="customAmount">{t.flowers.customAmount}</Label>
            <div className="relative">
              <Input
                id="customAmount"
                type="text"
                inputMode="decimal"
                placeholder={t.flowers.customAmountPlaceholder}
                value={customAmount}
                onChange={handleCustomChange}
                className={cn("bg-background/50 border-border pr-10 text-lg h-12", customAmount && "border-primary")}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                {t.flowers.currency}
              </span>
            </div>
          </div>

          {/* Selected amount display */}
          {getFinalAmount() > 0 && (
            <div className="text-center py-4 rounded-xl bg-secondary/30 border border-border">
              <p className="text-sm text-muted-foreground mb-1">
                {language === "et" ? "Valitud summa" : "Selected amount"}
              </p>
              <p className="font-serif text-3xl font-medium text-primary">
                {getFinalAmount()}
                {t.flowers.currency}
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Apple Pay note */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M17.72 12.63c-.03-2.37 1.95-3.52 2.04-3.58-1.11-1.61-2.84-1.83-3.45-1.86-1.47-.15-2.87.86-3.62.86-.75 0-1.9-.84-3.12-.82-1.61.02-3.09.93-3.92 2.37-1.67 2.89-.43 7.17 1.2 9.52.8 1.15 1.75 2.44 3 2.39 1.2-.05 1.65-.77 3.1-.77 1.45 0 1.86.77 3.13.75 1.29-.02 2.11-1.17 2.9-2.33.91-1.34 1.29-2.63 1.31-2.7-.03-.01-2.52-1-2.57-3.83zM15.36 5.23c.66-.8 1.11-1.91.99-3.02-1 .04-2.18.66-2.89 1.49-.64.74-1.2 1.92-1.05 3.05 1.11.09 2.24-.56 2.95-1.52z" />
            </svg>
            <span>Apple Pay {language === "et" ? "toetatud" : "supported"}</span>
          </div>

          {/* Submit button */}
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || getFinalAmount() < 1}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t.flowers.processing}
              </>
            ) : (
              <>
                {t.flowers.donate}
                {getFinalAmount() > 0 && ` ${getFinalAmount()}${t.flowers.currency}`}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
