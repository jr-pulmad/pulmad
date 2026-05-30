"use client"

import { useParams, useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n/context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Flower2, Copy, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const VALID_AMOUNTS = ["25", "50", "100"]

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
  const referenceValue = language === "et" ? `Pulmalilled ${amount}` : `Wedding flowers ${amount}`

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
        <div className="container mx-auto px-4 sm:px-6 max-w-lg">

          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === "et" ? "Tagasi" : "Back"}
          </button>

          {/* Compact header with amount */}
          <div className="flex items-center gap-3 mb-5">
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

          {/* QR + Bank details in a compact grid */}
          <Card className="border-border bg-card/50">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                
                {/* QR code placeholder - left side */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center sm:w-36">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-secondary/40 border-2 border-dashed border-border flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-0.5 opacity-30">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-3 h-3 rounded-sm bg-foreground",
                            [0, 2, 6, 8].includes(i) && "w-4 h-4"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 text-center">
                    {language === "et" ? "QR tuleb varsti" : "QR coming soon"}
                  </p>
                </div>

                {/* Bank details - right side */}
                <div className="flex-1 space-y-2">
                  {fields.map((field) => (
                    <div
                      key={field.key}
                      className="flex items-center justify-between py-2 px-2.5 rounded-lg bg-secondary/30 border border-border"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-muted-foreground leading-tight">{field.label}</span>
                        <span className="text-xs font-medium text-foreground truncate">{field.value}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(field.value, field.key)}
                        className="ml-2 flex-shrink-0 p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        aria-label={`Copy ${field.label}`}
                      >
                        {copiedField === field.key
                          ? <Check className="w-3.5 h-3.5 text-primary" />
                          : <Copy className="w-3.5 h-3.5" />
                        }
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Footer note */}
          <p className="text-[10px] text-muted-foreground text-center mt-4 px-4">
            {language === "et"
              ? `Kasuta selgitusena "${referenceValue}".`
              : `Use "${referenceValue}" as reference.`}
          </p>

        </div>
      </main>
      <Footer />
    </div>
  )
}
