"use client"

import { AddToCalendar } from "@/components/ui/add-to-calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Info, Flower2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"

export default function TestCalendarPage() {
  const { language } = useI18n()
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-2xl mx-auto bg-card/50 border-border backdrop-blur-sm">
        <CardContent className="py-12 sm:py-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-foreground mb-3">
            {language === "et" ? "Õnnestus" : "Success"}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {language === "et" 
              ? "Aitäh! Sinu vastus on salvestatud."
              : "Thank you! Your response has been saved."}
          </p>
          
          {/* Navigation links with Calendar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <AddToCalendar />
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/info">
                <Info className="w-4 h-4" />
                {language === "et" ? "Kasulik info" : "Useful info"}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/flowers">
                <Flower2 className="w-4 h-4" />
                {language === "et" ? "Kingi lilli" : "Gift flowers"}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
