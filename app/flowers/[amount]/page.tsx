"use client"

import { useParams, useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n/context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Flower2, Copy, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const VALID_AMOUNTS = ["25", "50", "100"]

const AMOUNT_LABELS: Record<string, { et: string; en: string }> = {
  "25": { et: "Väike kimp tulpe", en: "Small tulip bouquet" },
  "50": { et: "Keskmine segakimp", en: "Medium mixed bouquet" },
  "100": { et: "Suur roosikimp", en: "Large rose arrangement" },
}

// Placeholder bank details — replace with real values or move to env vars
const BANK_DETAILS = {
  recipient: "Janno & Katre",
  iban: "EE00 0000 0000 0000 0000",
  bank: "LHV Pank",
  swift: "LHVBEE22",
}

export default function FlowersPaymentPage() {
  const params = useParams()
  const router = useRouter()
  const { language } = useI18n()
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const amount = params.amount as string

  // Redirect back if invalid amount
  if (!VALID_AMOUNTS.includes(amount)) {
    router.replace("/flowers")
    return null
  }

  const label = AMOUNT_LABELS[amount]

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  const fields = [
    {
      key: "recipient",
      label: language === "et" ? "Saaja" : "Recipient",
      value: BANK_DETAILS.recipient,
    },
    {
      key: "iban",
      label: "IBAN",
      value: BANK_DETAILS.iban,
    },
    {
      key: "bank",
      label: language === "et" ? "Pank" : "Bank",
      value: BANK_DETAILS.bank,
    },
    {
      key: "swift",
      label: "BIC / SWIFT",
      value: BANK_DETAILS.swift,
    },
    {
      key: "amount",
      label: language === "et" ? "Summa" : "Amount",
      value: `${amount}€`,
    },
    {
      key: "reference",
      label: language === "et" ? "Selgitus" : "Reference",
      value: language === "et" ? "Pulmalilled" : "Wedding flowers",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 sm:pt-28 pb-16 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-lg">

          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === "et" ? "Tagasi" : "Back"}
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
              <Flower2 className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-medium text-foreground mb-1">
              {amount}€
            </h1>
            <p className="text-muted-foreground text-sm">
              {language === "et" ? label.et : label.en}
            </p>
          </div>

          {/* QR code placeholder */}
          <Card className="mb-6 border-border bg-card/50">
            <CardContent className="py-8 flex flex-col items-center gap-3">
              <div className="w-44 h-44 rounded-2xl bg-secondary/40 border-2 border-dashed border-border flex flex-col items-center justify-center gap-2">
                <div className="grid grid-cols-3 gap-1 opacity-30">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-5 h-5 rounded-sm bg-foreground",
                        [0, 2, 6, 8].includes(i) && "w-6 h-6"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center max-w-[200px]">
                {language === "et"
                  ? "QR-kood lisatakse varsti"
                  : "QR code will be added soon"}
              </p>
            </CardContent>
          </Card>

          {/* Bank details */}
          <Card className="border-border bg-card/50">
            <CardContent className="pt-6 pb-4">
              <p className="text-sm font-medium text-foreground mb-4">
                {language === "et" ? "Pangaandmed" : "Bank details"}
              </p>
              <div className="space-y-3">
                {fields.map((field) => (
                  <div
                    key={field.key}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-secondary/30 border border-border"
                  >
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-xs text-muted-foreground">{field.label}</span>
                      <span className="text-sm font-medium text-foreground truncate">{field.value}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(field.value, field.key)}
                      className="ml-3 flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      aria-label={`Copy ${field.label}`}
                    >
                      {copiedField === field.key
                        ? <Check className="w-4 h-4 text-primary" />
                        : <Copy className="w-4 h-4" />
                      }
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Footer note */}
          <p className="text-xs text-muted-foreground text-center mt-6 px-4">
            {language === "et"
              ? "Palun kasuta selgitusena \"Pulmalilled\", et saaksime makse tuvastada."
              : "Please use \"Wedding flowers\" as the reference so we can identify your transfer."}
          </p>

        </div>
      </main>
      <Footer />
    </div>
  )
}
