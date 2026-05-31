"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Flower2, Copy, Check, Smartphone, ExternalLink } from "lucide-react"

import { useI18n } from "@/lib/i18n/context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"

const VALID_AMOUNTS = ["25", "50", "100"] as const
type ValidAmount = (typeof VALID_AMOUNTS)[number]

// QR code images mapped by amount
const QR_CODES: Record<ValidAmount, string> = {
  "25": "/images/qr-25.jpeg",
  "50": "/images/qr-50.jpeg",
  "100": "/images/qr-100.jpeg",
}

// Bank payment links from env vars (with fallbacks for preview)
const BANK_LINKS: Record<ValidAmount, string> = {
  "25": process.env.NEXT_PUBLIC_FLOWERS_PAYMENT_LINK_25 || "",
  "50": process.env.NEXT_PUBLIC_FLOWERS_PAYMENT_LINK_50 || "",
  "100": process.env.NEXT_PUBLIC_FLOWERS_PAYMENT_LINK_100 || "",
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
  const isValidAmount = VALID_AMOUNTS.includes(amount as ValidAmount)
  const paymentLink = isValidAmount ? BANK_LINKS[amount as ValidAmount] : ""

  useEffect(() => {
    if (!isValidAmount) {
      router.replace("/flowers")
    }
  }, [isValidAmount, router])

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  if (!isValidAmount) {
    return null
  }

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

          {/* Header */}
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

          {/* Payment card */}
          <Card className="border-border bg-card/50">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-stretch gap-4">
                {/* QR / Bank link section */}
                <div className="flex flex-col items-center justify-center sm:flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Smartphone className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {language === "et" ? "Maksa lingiga" : "Pay with a link"}
                    </span>
                  </div>

                  <div className="w-full max-w-xs flex flex-col items-center gap-3">
                    {paymentLink ? (
                      <a
                        href={paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {language === "et" ? "Ava makselink" : "Open payment link"}
                      </a>
                    ) : (
                      <div className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
                        <ExternalLink className="w-4 h-4" />
                        {language === "et" ? "Makselink puudub" : "Payment link missing"}
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground text-center">
                      {language === "et" ? "Või skaneeri QR-kood" : "Or scan the QR code"}
                    </div>

                    <a
                      href={paymentLink || "#"}
                      target={paymentLink ? "_blank" : undefined}
                      rel={paymentLink ? "noopener noreferrer" : undefined}
                      onClick={(e) => {
                        if (!paymentLink) e.preventDefault()
                      }}
                      className={`block w-48 h-48 sm:w-52 sm:h-52 rounded-lg overflow-hidden bg-white p-0 mx-auto ring-1 transition ${
                        paymentLink
                          ? "ring-border hover:ring-primary/40 cursor-pointer"
                          : "ring-border cursor-default opacity-70"
                      }`}
                      aria-label={language === "et" ? "Ava makselink" : "Open payment link"}
                    >
                      <Image
                        src={QR_CODES[amount as ValidAmount]}
                        alt={`QR code for ${amount}€ payment`}
                        width={240}
                        height={240}
                        className="w-full h-full object-contain"
                      />
                    </a>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex sm:flex-col items-center gap-2 sm:gap-3 sm:py-2">
                  <div className="flex-1 h-px sm:h-auto sm:w-px sm:flex-1 bg-border" />

                  <span className="text-xs text-muted-foreground font-medium">
                    {language === "et" ? "VÕI" : "OR"}
                  </span>

                  <div className="flex-1 h-px sm:h-auto sm:w-px sm:flex-1 bg-border" />
                </div>

                {/* Manual entry */}
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
