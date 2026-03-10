"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Home } from "lucide-react"

export default function FlowersSuccessPage() {
  const { t, language } = useI18n()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 sm:pt-28 pb-16 sm:pb-24 flex items-center">
        <div className="container mx-auto px-4 sm:px-6">
          <Card className="max-w-lg mx-auto bg-card/50 border-border">
            <CardContent className="py-12 sm:py-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mb-4">{t.flowers.success}</h1>
              <p className="text-muted-foreground mb-8">
                {language === "et"
                  ? "Sinu panus aitab meil luua kaunid pulmalilled. Suur tänu!"
                  : "Your contribution helps us create beautiful wedding flowers. Thank you so much!"}
              </p>
              <Button asChild size="lg">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  {t.common.back}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
