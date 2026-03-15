"use client"

import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n/context"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// Simple cute stickman SVG components
function BrideStickman({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 200" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Head */}
      <circle cx="50" cy="30" r="15" />
      {/* Veil */}
      <path d="M35 25 Q25 40 30 60" strokeDasharray="4 2" opacity="0.5" />
      <path d="M65 25 Q75 40 70 60" strokeDasharray="4 2" opacity="0.5" />
      {/* Body */}
      <line x1="50" y1="45" x2="50" y2="90" />
      {/* Dress (triangle shape) */}
      <path d="M50 70 L25 150 L75 150 Z" fill="currentColor" fillOpacity="0.1" />
      {/* Arms */}
      <line x1="50" y1="60" x2="30" y2="80" />
      <line x1="50" y1="60" x2="70" y2="80" />
      {/* Bouquet */}
      <circle cx="70" cy="85" r="8" fill="currentColor" fillOpacity="0.3" />
      {/* Legs */}
      <line x1="50" y1="150" x2="40" y2="190" />
      <line x1="50" y1="150" x2="60" y2="190" />
      {/* Smile */}
      <path d="M44 32 Q50 38 56 32" />
      {/* Eyes */}
      <circle cx="44" cy="28" r="1.5" fill="currentColor" />
      <circle cx="56" cy="28" r="1.5" fill="currentColor" />
    </svg>
  )
}

function GroomStickman({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 200" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Head */}
      <circle cx="50" cy="30" r="15" />
      {/* Top hat */}
      <rect x="35" y="8" width="30" height="12" rx="2" fill="currentColor" fillOpacity="0.2" />
      <rect x="30" y="18" width="40" height="4" rx="1" fill="currentColor" fillOpacity="0.3" />
      {/* Body */}
      <line x1="50" y1="45" x2="50" y2="110" />
      {/* Suit jacket */}
      <path d="M35 50 L35 110 L65 110 L65 50" fill="currentColor" fillOpacity="0.1" />
      {/* Bow tie */}
      <path d="M44 48 L50 52 L56 48 L50 44 Z" fill="currentColor" fillOpacity="0.4" />
      {/* Arms */}
      <line x1="50" y1="55" x2="25" y2="85" />
      <line x1="50" y1="55" x2="75" y2="85" />
      {/* Legs */}
      <line x1="50" y1="110" x2="35" y2="190" />
      <line x1="50" y1="110" x2="65" y2="190" />
      {/* Smile */}
      <path d="M44 32 Q50 38 56 32" />
      {/* Eyes */}
      <circle cx="44" cy="28" r="1.5" fill="currentColor" />
      <circle cx="56" cy="28" r="1.5" fill="currentColor" />
    </svg>
  )
}

// Hearts floating animation component
function FloatingHearts() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute text-primary/20 animate-float"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${3 + i * 0.5}s`,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  )
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
      <section className="min-h-[100dvh] flex items-center justify-center bg-card/30 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="grid grid-cols-4 gap-4 sm:gap-8">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-20 sm:w-32 h-20 sm:h-32 rounded-2xl bg-secondary/50 animate-pulse" />
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
    <section className="min-h-[100dvh] flex items-center justify-center bg-card/30 relative overflow-hidden">
      {/* Floating hearts background */}
      <FloatingHearts />
      
      {/* Bride stickman - left side */}
      <div className="absolute left-4 sm:left-8 lg:left-16 bottom-1/4 opacity-20 hover:opacity-40 transition-opacity duration-500">
        <BrideStickman className="w-16 sm:w-24 lg:w-32 h-auto text-primary animate-sway" />
      </div>
      
      {/* Groom stickman - right side */}
      <div className="absolute right-4 sm:right-8 lg:right-16 bottom-1/4 opacity-20 hover:opacity-40 transition-opacity duration-500">
        <GroomStickman className="w-16 sm:w-24 lg:w-32 h-auto text-primary animate-sway-reverse" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Countdown grid - larger and more prominent */}
          <div className="grid grid-cols-4 gap-3 sm:gap-6 lg:gap-8 mb-6 sm:mb-10">
            {timeUnits.map((unit, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative w-full max-w-[120px] sm:max-w-[160px] aspect-square flex items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-border bg-secondary/30 backdrop-blur-sm shadow-lg" />
                  <span className="relative font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-foreground tabular-nums">
                    {unit.value.toString().padStart(2, "0")}
                  </span>
                </div>
                <span className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground uppercase tracking-widest">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          {/* Until text */}
          <p className="text-sm sm:text-base text-muted-foreground tracking-wide">{t.countdown.until}</p>
        </div>
      </div>
    </section>
  )
}
