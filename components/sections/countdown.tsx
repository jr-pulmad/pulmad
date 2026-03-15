"use client"

import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n/context"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function Countdown() {
  const { t } = useI18n()
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const weddingDate = new Date("2026-08-19T14:00:00+03:00") // Tallinn timezone

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = weddingDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return (
      <section className="py-10 sm:py-14 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="grid grid-cols-4 gap-3 sm:gap-6">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-14 sm:w-20 h-14 sm:h-20 rounded-xl bg-secondary/50 animate-pulse" />
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
    <section className="py-10 sm:py-14 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Countdown grid */}
          <div className="grid grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6">
            {timeUnits.map((unit, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative w-full aspect-square max-w-[90px] flex items-center justify-center">
                  <div className="absolute inset-0 rounded-xl border border-border bg-secondary/30 backdrop-blur-sm" />
                  <span className="relative font-serif text-2xl sm:text-4xl md:text-5xl font-light text-foreground tabular-nums">
                    {unit.value.toString().padStart(2, "0")}
                  </span>
                </div>
                <span className="mt-2 text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          {/* Until text */}
          <p className="text-xs sm:text-sm text-muted-foreground tracking-wide">{t.countdown.until}</p>
        </div>
      </div>
    </section>
  )
}
