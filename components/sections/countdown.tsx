"use client"

import { useState, useEffect, useCallback } from "react"
import { useI18n } from "@/lib/i18n/context"
import { Lightbulb, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// Fun facts and suggestions based on time remaining
const funFacts = {
  et: [
    { minDays: 500, text: "Sellise ajaga saaks käia 3 korda ümber maailma jala." },
    { minDays: 400, text: "Sellise ajaga kasvab keskmine inimese juus umbes 15cm." },
    { minDays: 300, text: "Piisavalt aega, et õppida selgeks uus keel... või vähemalt 'Jah, tahan!'." },
    { minDays: 200, text: "Aega on veel piisavalt, et harjutada oma tantsulliigutusi." },
    { minDays: 150, text: "Võiksid jõuda vaadata kõik 'Sõrmuste Isanda' filmid 50 korda." },
    { minDays: 100, text: "100+ päeva! Ideaalne aeg alustada oma kõne kirjutamist." },
    { minDays: 60, text: "Umbes 2 kuud! Täiuslik aeg uue ülikonna soetamiseks." },
    { minDays: 30, text: "Kuu aega! Ära unusta kingakotti kontrollida." },
    { minDays: 14, text: "2 nädalat! Aeg teha viimased ilutoimingud." },
    { minDays: 7, text: "Nädal veel! Kontrolli üle, kas su riided mahuvad." },
    { minDays: 3, text: "Peaaegu kohal! Ära unusta laadida oma telefoni." },
    { minDays: 1, text: "Homme on suur päev! Magama õigel ajal!" },
    { minDays: 0, text: "Täna on see päev! Näeme varsti!" },
  ],
  en: [
    { minDays: 500, text: "That's enough time to walk around the world 3 times!" },
    { minDays: 400, text: "In this time, average human hair grows about 15cm." },
    { minDays: 300, text: "Enough time to learn a new language... or at least 'I do!'." },
    { minDays: 200, text: "Still time to perfect those dance moves." },
    { minDays: 150, text: "You could watch all Lord of the Rings movies 50 times." },
    { minDays: 100, text: "100+ days! Perfect time to start writing your speech." },
    { minDays: 60, text: "About 2 months! Ideal for getting that new suit." },
    { minDays: 30, text: "One month! Don't forget to check your shoe collection." },
    { minDays: 14, text: "2 weeks! Time for those final beauty treatments." },
    { minDays: 7, text: "One week! Double-check your outfit fits." },
    { minDays: 3, text: "Almost there! Don't forget to charge your phone." },
    { minDays: 1, text: "Tomorrow's the big day! Get some beauty sleep!" },
    { minDays: 0, text: "Today's the day! See you soon!" },
  ],
}

export function Countdown() {
  const { t, language } = useI18n()
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)
  const [showFunFact, setShowFunFact] = useState(false)
  const [currentFact, setCurrentFact] = useState("")

  const getFunFact = useCallback((days: number): string => {
    const facts = funFacts[language]
    for (const fact of facts) {
      if (days >= fact.minDays) {
        return fact.text
      }
    }
    return facts[facts.length - 1].text
  }, [language])

  useEffect(() => {
    setMounted(true)
    const weddingDate = new Date("2026-08-19T14:00:00+03:00") // Tallinn timezone

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = weddingDate.getTime() - now.getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        setTimeLeft({
          days,
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
        setCurrentFact(getFunFact(days))
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    // Show fun fact after 3 seconds, then hide after 8 more seconds
    const showTimer = setTimeout(() => {
      setShowFunFact(true)
    }, 3000)

    const hideTimer = setTimeout(() => {
      setShowFunFact(false)
    }, 11000)

    return () => {
      clearInterval(timer)
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [getFunFact])

  if (!mounted) {
    return (
      <section className="py-16 sm:py-24 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="grid grid-cols-4 gap-4 sm:gap-8">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-xl bg-secondary/50 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  const timeUnits = [
    { value: timeLeft.days, label: t.countdown.days },
    { value: timeLeft.hours, label: t.countdown.hours },
    { value: timeLeft.minutes, label: t.countdown.minutes },
    { value: timeLeft.seconds, label: t.countdown.seconds },
  ]

  return (
    <section className="py-16 sm:py-24 bg-card/30 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Countdown grid */}
          <div className="grid grid-cols-4 gap-3 sm:gap-8 mb-6 sm:mb-8">
            {timeUnits.map((unit, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative w-full aspect-square max-w-[120px] flex items-center justify-center">
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-border bg-secondary/30 backdrop-blur-sm" />
                  <span className="relative font-serif text-3xl sm:text-5xl md:text-6xl font-light text-foreground tabular-nums">
                    {unit.value.toString().padStart(2, "0")}
                  </span>
                </div>
                <span className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          {/* Until text */}
          <p className="text-sm sm:text-base text-muted-foreground tracking-wide">{t.countdown.until}</p>

          {/* Fun fact tooltip - positioned below countdown, non-blocking */}
          <div
            className={cn(
              "mt-8 transition-all duration-500 ease-out",
              showFunFact 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-4 pointer-events-none"
            )}
          >
            <div className="inline-flex items-start gap-3 max-w-md mx-auto p-4 rounded-xl bg-primary/5 border border-primary/20 text-left">
              <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-foreground/80 leading-relaxed">{currentFact}</p>
              </div>
              <button
                onClick={() => setShowFunFact(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 -mr-1 -mt-1"
                aria-label={language === "et" ? "Sulge" : "Close"}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
