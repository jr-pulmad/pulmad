"use client"

import type React from "react"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Bell, Clock, CheckCircle2, Loader2 } from "lucide-react"

// Sample updates - in production, this would come from a CMS or database
const sampleUpdates = [
  {
    id: 1,
    date: "2025-01-08",
    title_et: "Veebileht on avatud!",
    title_en: "Website is live!",
    content_et: "Tere tulemast meie pulmade veebilehele. Siin saate tutvuda info ja kinnitada osalemist.",
    content_en: "Welcome to our wedding website. Here you can find information and RSVP.",
  },
]

export function Updates() {
  const { t, language } = useI18n()
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !consent) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, language }),
      })

      if (response.ok) {
        setIsSubscribed(true)
      }
    } catch (error) {
      console.error("Subscribe error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(language === "et" ? "et-EE" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <section className="py-16 sm:py-24 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <Bell className="w-5 h-5" />
              <span className="text-sm tracking-widest uppercase">{t.updates.title}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-foreground">
              {t.updates.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Updates list */}
            <div className="space-y-4">
              {sampleUpdates.length > 0 ? (
                sampleUpdates.map((update) => (
                  <Card key={update.id} className="bg-secondary/30 border-border">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(update.date)}
                      </div>
                      <CardTitle className="font-serif text-lg font-medium text-foreground">
                        {language === "et" ? update.title_et : update.title_en}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {language === "et" ? update.content_et : update.content_en}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">{t.updates.noUpdates}</div>
              )}

              {/* Last updated */}
              {sampleUpdates.length > 0 && (
                <p className="text-xs text-muted-foreground/60 text-center pt-4">
                  {t.updates.lastUpdated}: {formatDate(sampleUpdates[0].date)}
                </p>
              )}
            </div>

            {/* Subscribe form */}
            <Card className="bg-secondary/30 border-border h-fit">
              <CardHeader>
                <CardTitle className="font-serif text-xl font-medium text-foreground">
                  {t.updates.subscribeTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubscribed ? (
                  <div className="flex flex-col items-center text-center py-4">
                    <CheckCircle2 className="w-12 h-12 text-primary mb-4" />
                    <p className="text-foreground font-medium">{t.common.success}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t.rsvp.success}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">{t.updates.subscribeText}</p>

                    <div className="space-y-2">
                      <Label htmlFor="subscribe-email" className="sr-only">
                        {t.form.email}
                      </Label>
                      <Input
                        id="subscribe-email"
                        type="email"
                        placeholder={t.form.emailPlaceholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background/50 border-border"
                      />
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="consent"
                        checked={consent}
                        onCheckedChange={(checked) => setConsent(checked === true)}
                        required
                      />
                      <Label htmlFor="consent" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                        {t.form.consent}
                      </Label>
                    </div>

                    <p className="text-xs text-muted-foreground/60">{t.form.gdprNote}</p>

                    <Button type="submit" className="w-full" disabled={isSubmitting || !email || !consent}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t.common.loading}
                        </>
                      ) : (
                        t.cta.subscribe
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
