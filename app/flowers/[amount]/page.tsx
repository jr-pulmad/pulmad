"use client"

import { useParams, useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n/context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Flower2, Copy, Check, Smartphone } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

const VALID_AMOUNTS = ["25", "50", "100"]

// QR code images mapped by amount
const QR_CODES: Record<string, string> = {
  "25": "/images/qr-25.jpeg",
  "50": "/images/qr-50.jpeg",
  "100": "/images/qr-100.jpeg",
}

// Bank details from env vars (with fallbacks for preview)
const BANK_RECIPIENT = process.env.NEXT_PUBLIC_BANK_RECIPIENT || "Saaja nimi"
const BANK_IBAN = process.env.NEXT_PUBLIC_BANK_IBAN || "EE00 0000 0000 0000 0000"
const BANK_BIC = process.env.NEXT_PUBLIC_BANK_BIC || "LHVBEE22"

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

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  // Reference includes amount without currency
  const referenceValue = `Pulmalilled ${amount}`

  const fields = [
    {
      key: "recipient",
      label: language === "et" ? "Saaja" : "Recipient",
      value: BANK_RECIPIENT,
    },
    {
      key: "iban",
      label: "IBAN",
      value: BANK_IBAN,
    },
    {
      key: "swift",
      label: "BIC",
      value: BANK_BIC,
    },
    {
      key: "amount",
      label: language === "et" ? "Summa" : "Amount",
      value: `${amount}€`,
    },
    {
      key: "reference",
      label: language === "et" ? "Selgitus" : "Reference",
      value: referenceValue,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 sm:pt-28 pb-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === "et" ? "Tagasi" : "Back"}
          </button>

          {/* Compact header with amount */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <Flower2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-medium text-foreground">
                {language === "et" ? "Lilled" : "Flowers"} — {amount}€
              </h1>
              <p className="text-xs text-muted-foreground">
                {language === "et" ? "Pangaülekanne" : "Bank transfer"}
              </p>
            </div>
          </div>

          {/* Payment options - horizontal on desktop, stacked on mobile */}
          <Card className="border-border bg-card/50">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-stretch gap-4">
                {/* QR Code - left side */}
                <div className="flex flex-col items-center sm:flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {language === "et" ? "Skaneeri" : "Scan"}
                    </span>
                  </div>

                  <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-lg overflow-hidden bg-white p-0">
                    <Image
                      src={QR_CODES[amount]}
                      alt={`QR code for ${amount}€ payment`}
                      width={240}
                      height={240}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <p className="text-[10px] text-muted-foreground mt-1.5 text-center max-w-[140px]">
                    {language === "et"
                      ? "Ava pangaäpp ja skaneeri"
                      : "Open bank app & scan"}
                  </p>
                </div>

                {/* OR Divider - vertical on desktop, horizontal on mobile */}
                <div className="flex sm:flex-col items-center gap-2 sm:gap-3 sm:py-2">
                  <div className="flex-1 h-px sm:h-auto sm:w-px sm:flex-1 bg-border" />
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {language === "et" ? "VÕI" : "OR"}
                  </span>
                  <div className="flex-1 h-px sm:h-auto sm:w-px sm:flex-1 bg-border" />
                </div>

                {/* Manual Bank Details - right side */}
                <div className="flex-1 sm:flex-[1]">
                  <p className="text-sm font-medium text-foreground mb-2 text-center sm:text-left">
                    {language === "et" ? "Sisesta käsitsi" : "Enter manually"}
                  </p>

                  <div className="space-y-1.5">
                    {fields.map((field) => (
                      <div
                        key={field.key}
                        className="flex items-center justify-between py-2 px-2 rounded-md bg-secondary/30 border border-border"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="text-[11px] text-muted-foreground leading-tight">
                            {field.label}
                          </span>
                          <span className="text-sm font-medium text-foreground truncate">
                            {field.value}
                          </span>
                        </div>

                        <button
                          onClick={() => copyToClipboard(field.value, field.key)}
                          className="ml-2 flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                          aria-label={`Copy ${field.label}`}
                        >
                          {copiedField === field.key ? (
                            <Check className="w-4 h-4 text-primary" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
