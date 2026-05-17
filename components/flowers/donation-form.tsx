"use client"

import type React from "react"
import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { Flower2, ExternalLink, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const PRESET_AMOUNTS = [35, 50]

// ─── Bank configuration ────────────────────────────────────────────────────
// Each bank's payment link accepts a pre-filled amount and recipient details.
// Replace PLACEHOLDER_IBAN and PLACEHOLDER_REFERENCE with the real values
// before going live. The beneficiary name and reference text are also editable.

const BENEFICIARY_NAME = "Johanna ja Rannar Randmäe"
const IBAN = "PLACEHOLDER_IBAN"                 // e.g. EE382200221020145685
const REFERENCE = "PLACEHOLDER_REFERENCE"       // e.g. 1234567890

/**
 * Build a payment link for a given Estonian bank.
 * Most Estonian banks accept an internet-bank payment URL with pre-filled fields.
 * Formats based on publicly documented deep-link schemes (2024).
 */
function buildBankUrl(bank: string, amount: number): string {
  const cents = Math.round(amount * 100)
  const amountStr = amount.toFixed(2)
  const encodedName = encodeURIComponent(BENEFICIARY_NAME)
  const encodedIban = encodeURIComponent(IBAN)
  const encodedRef = encodeURIComponent(REFERENCE)
  const description = encodeURIComponent("Pulmalilled – Johanna & Rannar")

  switch (bank) {
    case "swedbank":
      // Swedbank Estonia internet bank payment initiation
      return `https://www.swedbank.ee/private/home/main/confirm?lang=et&recvName=${encodedName}&recvIBAN=${encodedIban}&amount=${amountStr}&refNum=${encodedRef}&payComment=${description}`
    case "seb":
      // SEB Estonia payment link
      return `https://e.seb.ee/web/init.do?lang=est&recvName=${encodedName}&recvAccount=${encodedIban}&amount=${amountStr}&comment=${description}`
    case "lhv":
      // LHV internet bank
      return `https://www.lhv.ee/ibank/login?lang=et&to=${encodedIban}&toName=${encodedName}&sum=${amountStr}&ref=${encodedRef}&description=${description}`
    case "coop":
      // Coop Pank
      return `https://i.cooppank.ee/pay?lang=et&toName=${encodedName}&toIBAN=${encodedIban}&amount=${amountStr}&ref=${encodedRef}`
    case "luminor":
      // Luminor Estonia
      return `https://luminor.ee/et/private/payment?toIBAN=${encodedIban}&toName=${encodedName}&amount=${amountStr}&details=${description}`
    default:
      return "#"
  }
}

const BANKS = [
  { id: "swedbank", label: "Swedbank" },
  { id: "seb",      label: "SEB" },
  { id: "lhv",      label: "LHV" },
  { id: "coop",     label: "Coop Pank" },
  { id: "luminor",  label: "Luminor" },
]

export function DonationForm() {
  const { t, language } = useI18n()
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [copiedIban, setCopiedIban] = useState(false)
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
    if (customAmount) return parseFloat(customAmount)
    return 0
  }

  const handleBankClick = (bankId: string) => {
    const amount = getFinalAmount()
    if (amount < 1) {
      setError(t.flowers.minAmount)
      return
    }
    const url = buildBankUrl(bankId, amount)
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(IBAN)
      setCopiedIban(true)
      setTimeout(() => setCopiedIban(false), 2000)
    } catch {
      // fallback: select text
    }
  }

  const hasAmount = getFinalAmount() >= 1

  return (
    <Card className="max-w-xl mx-auto bg-card/40 border-border shadow-xl">
      <CardHeader className="text-center pb-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 mb-4 mx-auto">
          <Flower2 className="w-7 h-7 text-primary" />
        </div>
        <CardTitle className="font-serif text-2xl sm:text-3xl font-medium text-foreground">
          {t.flowers.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground mt-2 max-w-md mx-auto">
          {t.flowers.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* 1. Amount selection */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{t.flowers.presetAmounts}</p>
          <div className="grid grid-cols-2 gap-4">
            {PRESET_AMOUNTS.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handlePresetClick(amount)}
                className={cn(
                  "py-5 px-6 rounded-2xl font-semibold text-xl transition-all duration-200 border-2",
                  selectedAmount === amount
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card/60 border-border text-foreground hover:border-primary/60 hover:bg-card/80",
                )}
              >
                {amount}{t.flowers.currency}
              </button>
            ))}
          </div>
        </div>

        {/* Custom amount */}
        <div className="relative">
          <FloatingInput
            id="customAmount"
            type="text"
            inputMode="decimal"
            value={customAmount}
            onChange={handleCustomChange}
            label={t.flowers.customAmount}
            className={cn("pr-12 text-lg h-16", customAmount && "border-primary")}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            {t.flowers.currency}
          </span>
        </div>

        {/* Selected amount display */}
        {hasAmount && (
          <div className="text-center py-4 rounded-2xl bg-card/60 border border-border">
            <p className="text-xs text-muted-foreground mb-1">
              {language === "et" ? "Valitud summa" : "Selected amount"}
            </p>
            <p className="font-serif text-4xl font-medium text-primary">
              {getFinalAmount()}{t.flowers.currency}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium">
            {error}
          </div>
        )}

        {/* 2. Bank buttons */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            {language === "et" ? "Vali oma pank" : "Choose your bank"}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {BANKS.map((bank) => (
              <Button
                key={bank.id}
                variant="outline"
                className={cn(
                  "w-full justify-between h-12 text-base font-medium border-border bg-card/40 hover:bg-card/70 hover:border-foreground/30",
                  !hasAmount && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => handleBankClick(bank.id)}
                disabled={!hasAmount}
              >
                <span>{bank.label}</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </Button>
            ))}
          </div>
        </div>

        {/* 3. Manual bank transfer fallback */}
        <div className="pt-2 border-t border-border space-y-3">
          <p className="text-xs text-muted-foreground text-center">
            {language === "et"
              ? "Või tee ülekanne käsitsi:"
              : "Or transfer manually:"}
          </p>
          <div className="rounded-xl bg-card/60 border border-border p-4 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">
                {language === "et" ? "Saaja" : "Recipient"}
              </span>
              <span className="font-medium text-foreground text-right">{BENEFICIARY_NAME}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-muted-foreground">IBAN</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-medium text-foreground">{IBAN}</span>
                <button
                  onClick={copyIban}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Copy IBAN"
                >
                  {copiedIban
                    ? <Check className="w-4 h-4 text-primary" />
                    : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">
                {language === "et" ? "Viitenumber" : "Reference"}
              </span>
              <span className="font-mono font-medium text-foreground">{REFERENCE}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">
                {language === "et" ? "Selgitus" : "Description"}
              </span>
              <span className="font-medium text-foreground text-right">
                Pulmalilled – J&R
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
