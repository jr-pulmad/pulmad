"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useI18n } from "@/lib/i18n/context"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface StickmanPosition {
  x: number
  y: number
  isDragging: boolean
  isFalling: boolean
  velocityY: number
  rotation: number
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

// Hearts floating animation component with more hearts
function FloatingHearts() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute text-primary/20 animate-float"
          style={{
            left: `${10 + (i * 7) % 80}%`,
            top: `${15 + (i % 4) * 20}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + (i % 3) * 0.5}s`,
          }}
        >
          <svg width={16 + (i % 3) * 4} height={16 + (i % 3) * 4} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  )
}

// Draggable stickman component
function DraggableStickman({ 
  type, 
  initialPosition,
  containerRef 
}: { 
  type: "bride" | "groom"
  initialPosition: { x: number, y: number }
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  const [position, setPosition] = useState<StickmanPosition>({
    x: initialPosition.x,
    y: initialPosition.y,
    isDragging: false,
    isFalling: false,
    velocityY: 0,
    rotation: 0,
  })
  const elementRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setPosition(prev => ({ ...prev, isDragging: true, isFalling: false, velocityY: 0 }))
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!position.isDragging || !containerRef.current) return
    
    const container = containerRef.current.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    const x = ((clientX - container.left) / container.width) * 100
    const y = ((clientY - container.top) / container.height) * 100
    
    setPosition(prev => ({ 
      ...prev, 
      x: Math.max(5, Math.min(95, x)), 
      y: Math.max(5, Math.min(95, y)),
      rotation: (x - prev.x) * 2
    }))
  }, [position.isDragging, containerRef])

  const handleMouseUp = useCallback(() => {
    if (!position.isDragging) return
    setPosition(prev => ({ ...prev, isDragging: false, isFalling: true }))
  }, [position.isDragging])

  // Physics simulation for falling
  useEffect(() => {
    if (!position.isFalling) return

    const gravity = 0.5
    const bounce = 0.4
    const groundLevel = 75 // percentage from top

    const animate = () => {
      setPosition(prev => {
        const newVelocity = prev.velocityY + gravity
        const newY = prev.y + newVelocity
        const newRotation = prev.rotation * 0.95

        // Check if hit ground
        if (newY >= groundLevel) {
          if (Math.abs(newVelocity) < 1) {
            // Settled
            return { ...prev, y: groundLevel, velocityY: 0, isFalling: false, rotation: 0 }
          }
          // Bounce
          return { 
            ...prev, 
            y: groundLevel, 
            velocityY: -newVelocity * bounce,
            rotation: newRotation
          }
        }

        return { ...prev, y: newY, velocityY: newVelocity, rotation: newRotation }
      })
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [position.isFalling])

  // Global mouse/touch events
  useEffect(() => {
    if (position.isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleMouseMove)
      window.addEventListener('touchend', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleMouseMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [position.isDragging, handleMouseMove, handleMouseUp])

  const StickmanComponent = type === "bride" ? BrideStickman : GroomStickman

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      className="absolute cursor-grab active:cursor-grabbing select-none touch-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) rotate(${position.rotation}deg)`,
        transition: position.isDragging ? 'none' : 'transform 0.1s ease-out',
        zIndex: position.isDragging ? 50 : 10,
      }}
    >
      <StickmanComponent 
        className={`w-16 sm:w-20 lg:w-24 h-auto text-primary transition-opacity duration-300 ${
          position.isDragging ? 'opacity-80' : 'opacity-30 hover:opacity-50'
        } ${!position.isDragging && !position.isFalling ? 'animate-sway' : ''}`} 
      />
    </div>
  )
}

export function Countdown() {
  const { t } = useI18n()
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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
    <section 
      ref={containerRef}
      className="min-h-[100dvh] flex items-center justify-center bg-card/30 relative overflow-hidden"
    >
      {/* Floating hearts background - more hearts */}
      <FloatingHearts />
      
      {/* Draggable Bride stickman - left side */}
      <DraggableStickman 
        type="bride" 
        initialPosition={{ x: 12, y: 70 }}
        containerRef={containerRef}
      />
      
      {/* Draggable Groom stickman - right side */}
      <DraggableStickman 
        type="groom" 
        initialPosition={{ x: 88, y: 70 }}
        containerRef={containerRef}
      />

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
          
          {/* Drag hint */}
          <p className="text-xs text-muted-foreground/50 mt-8 hidden sm:block">
            Drag the figures to play!
          </p>
        </div>
      </div>
    </section>
  )
}
