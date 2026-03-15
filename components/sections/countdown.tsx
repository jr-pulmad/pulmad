"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useI18n } from "@/lib/i18n/context"
import { ChevronDown, MousePointer2 } from "lucide-react"

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

// Bride with bigger wedding dress
function BrideStickman({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 220" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Head */}
      <circle cx="60" cy="35" r="15" />
      {/* Long flowing hair */}
      <path d="M45 30 Q35 50 40 80" strokeWidth="1.5" opacity="0.7" />
      <path d="M48 32 Q40 55 45 85" strokeWidth="1.5" opacity="0.7" />
      <path d="M75 30 Q85 50 80 80" strokeWidth="1.5" opacity="0.7" />
      <path d="M72 32 Q80 55 75 85" strokeWidth="1.5" opacity="0.7" />
      {/* Veil */}
      <path d="M45 25 Q30 45 35 75" strokeDasharray="3 2" opacity="0.5" />
      <path d="M75 25 Q90 45 85 75" strokeDasharray="3 2" opacity="0.5" />
      {/* Tiara/crown */}
      <path d="M50 22 L55 18 L60 22 L65 18 L70 22" strokeWidth="1.5" />
      {/* Body */}
      <line x1="60" y1="50" x2="60" y2="85" />
      {/* Big wedding dress (ball gown style) */}
      <path d="M60 75 Q20 140 15 200 L105 200 Q100 140 60 75" fill="currentColor" fillOpacity="0.12" />
      <path d="M60 75 Q30 120 25 180" strokeWidth="1.5" opacity="0.6" />
      <path d="M60 75 Q90 120 95 180" strokeWidth="1.5" opacity="0.6" />
      {/* Dress details - lace trim */}
      <path d="M25 185 Q40 180 60 185 Q80 180 95 185" strokeWidth="1" opacity="0.5" strokeDasharray="2 2" />
      <path d="M20 195 Q40 190 60 195 Q80 190 100 195" strokeWidth="1" opacity="0.5" strokeDasharray="2 2" />
      {/* Arms */}
      <line x1="60" y1="60" x2="40" y2="85" />
      <line x1="60" y1="60" x2="80" y2="85" />
      {/* Bouquet */}
      <circle cx="80" cy="90" r="10" fill="currentColor" fillOpacity="0.35" />
      <circle cx="77" cy="87" r="3" fill="currentColor" fillOpacity="0.5" />
      <circle cx="83" cy="87" r="3" fill="currentColor" fillOpacity="0.5" />
      <circle cx="80" cy="93" r="3" fill="currentColor" fillOpacity="0.5" />
      {/* Face details */}
      <path d="M54 38 Q60 44 66 38" />
      <circle cx="54" cy="33" r="1.5" fill="currentColor" />
      <circle cx="66" cy="33" r="1.5" fill="currentColor" />
      {/* Eyelashes */}
      <path d="M52 31 L50 29" strokeWidth="1" />
      <path d="M68 31 L70 29" strokeWidth="1" />
    </svg>
  )
}

// Groom with cool gel hairstyle (styled up, not helmet)
function GroomStickman({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 200" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Head */}
      <circle cx="50" cy="35" r="15" />
      {/* Cool gel hairstyle - swept up and to the side */}
      <path d="M35 30 Q32 18 40 12 Q50 6 60 10 Q70 14 68 28" fill="currentColor" fillOpacity="0.5" />
      <path d="M38 25 Q36 15 45 10 Q55 5 62 12" fill="currentColor" fillOpacity="0.4" />
      <path d="M40 22 Q42 12 52 8 Q60 6 65 14" fill="currentColor" fillOpacity="0.3" />
      {/* Hair spikes/texture */}
      <path d="M42 14 Q45 6 50 8" strokeWidth="1.5" opacity="0.6" />
      <path d="M48 10 Q52 4 56 7" strokeWidth="1.5" opacity="0.6" />
      <path d="M54 9 Q60 5 63 12" strokeWidth="1.5" opacity="0.5" />
      {/* Side hair detail */}
      <path d="M35 32 Q32 28 35 24" strokeWidth="2" />
      <path d="M65 32 Q68 28 65 24" strokeWidth="2" />
      {/* Body */}
      <line x1="50" y1="50" x2="50" y2="110" />
      {/* Suit jacket - proper shape with shoulders */}
      <path d="M32 58 L32 110 L68 110 L68 58 Q60 52 50 52 Q40 52 32 58" fill="currentColor" fillOpacity="0.12" />
      {/* Suit shoulders - extended */}
      <path d="M32 58 Q26 56 22 62" strokeWidth="2.5" />
      <path d="M68 58 Q74 56 78 62" strokeWidth="2.5" />
      {/* Lapels */}
      <path d="M50 52 L42 68 L42 82" strokeWidth="1.5" />
      <path d="M50 52 L58 68 L58 82" strokeWidth="1.5" />
      {/* Bow tie */}
      <path d="M44 52 L50 56 L56 52 L50 48 Z" fill="currentColor" fillOpacity="0.5" />
      {/* Pocket square */}
      <path d="M36 72 L40 66 L44 72" fill="currentColor" fillOpacity="0.3" />
      {/* Arms - from shoulders, with sleeves */}
      <path d="M22 62 L18 82 L15 95" strokeWidth="2" />
      <path d="M78 62 L82 82 L85 95" strokeWidth="2" />
      {/* Suit sleeve cuffs */}
      <ellipse cx="15" cy="96" rx="4" ry="2" fill="currentColor" fillOpacity="0.2" />
      <ellipse cx="85" cy="96" rx="4" ry="2" fill="currentColor" fillOpacity="0.2" />
      {/* Hands */}
      <circle cx="15" cy="99" r="3.5" fill="currentColor" fillOpacity="0.3" />
      <circle cx="85" cy="99" r="3.5" fill="currentColor" fillOpacity="0.3" />
      {/* Legs */}
      <line x1="50" y1="110" x2="35" y2="190" strokeWidth="2" />
      <line x1="50" y1="110" x2="65" y2="190" strokeWidth="2" />
      {/* Shoes */}
      <ellipse cx="35" cy="192" rx="7" ry="3" fill="currentColor" fillOpacity="0.4" />
      <ellipse cx="65" cy="192" rx="7" ry="3" fill="currentColor" fillOpacity="0.4" />
      {/* Face */}
      <path d="M44 38 Q50 44 56 38" />
      <circle cx="44" cy="33" r="1.5" fill="currentColor" />
      <circle cx="56" cy="33" r="1.5" fill="currentColor" />
    </svg>
  )
}

// Hearts floating animation component with multiple colors - more visible
function FloatingHearts() {
  const colors = [
    "text-pink-400/40 dark:text-pink-300/25",
    "text-rose-400/40 dark:text-rose-300/25",
    "text-red-400/35 dark:text-red-300/20",
    "text-primary/30 dark:text-primary/15",
    "text-accent/35 dark:text-accent/20",
    "text-pink-300/45 dark:text-pink-200/30",
  ]
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(16)].map((_, i) => (
        <div
          key={i}
          className={`absolute animate-float ${colors[i % colors.length]}`}
          style={{
            left: `${8 + (i * 5.5) % 84}%`,
            top: `${12 + (i % 5) * 18}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${3.5 + (i % 4) * 0.6}s`,
          }}
        >
          <svg width={14 + (i % 4) * 3} height={14 + (i % 4) * 3} viewBox="0 0 24 24" fill="currentColor">
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
  containerRef,
  onPositionUpdate,
  otherPosition,
  hasInteracted,
  onInteraction,
}: { 
  type: "bride" | "groom"
  initialPosition: { x: number, y: number }
  containerRef: React.RefObject<HTMLDivElement | null>
  onPositionUpdate: (pos: { x: number, y: number }) => void
  otherPosition: { x: number, y: number }
  hasInteracted: boolean
  onInteraction: () => void
}) {
  const [position, setPosition] = useState<StickmanPosition>({
    x: initialPosition.x,
    y: initialPosition.y,
    isDragging: false,
    isFalling: false,
    velocityY: 0,
    rotation: 0,
  })
  const [isDancing, setIsDancing] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  // Check if close to other stickman for dance
  useEffect(() => {
    const distance = Math.sqrt(
      Math.pow(position.x - otherPosition.x, 2) + 
      Math.pow(position.y - otherPosition.y, 2)
    )
    if (distance < 15 && !position.isDragging && !position.isFalling) {
      setIsDancing(true)
    } else {
      setIsDancing(false)
    }
  }, [position.x, position.y, position.isDragging, position.isFalling, otherPosition])

  // Update parent with position
  useEffect(() => {
    onPositionUpdate({ x: position.x, y: position.y })
  }, [position.x, position.y, onPositionUpdate])

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    onInteraction()
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setPosition(prev => ({ ...prev, isDragging: true, isFalling: false, velocityY: 0 }))
  }, [onInteraction])

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
      y: Math.max(5, Math.min(85, y)),
      rotation: (x - prev.x) * 2
    }))
  }, [position.isDragging, containerRef])

  const handleMouseUp = useCallback(() => {
    if (!position.isDragging) return
    setPosition(prev => ({ ...prev, isDragging: false, isFalling: true }))
  }, [position.isDragging])

  // Physics simulation for falling - MUCH SLOWER floating effect
  useEffect(() => {
    if (!position.isFalling) return

    const gravity = 0.06 // Very slow gravity for floating effect
    const bounce = 0.25
    const groundLevel = 72

    const animate = () => {
      setPosition(prev => {
        const newVelocity = prev.velocityY + gravity
        const newY = prev.y + newVelocity
        const newRotation = prev.rotation * 0.98

        if (newY >= groundLevel) {
          if (Math.abs(newVelocity) < 0.25) {
            return { ...prev, y: groundLevel, velocityY: 0, isFalling: false, rotation: 0 }
          }
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
  // Bride is pink (slightly darker), groom is green
  const colorClass = type === "bride" ? "text-pink-400/85" : "text-primary"

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
        transition: position.isDragging ? 'none' : 'transform 0.15s ease-out',
        zIndex: position.isDragging ? 50 : 10,
      }}
    >
      {/* Larger invisible hitbox for easier grabbing */}
      <div className="absolute inset-[-24px] sm:inset-[-20px]" />
      <StickmanComponent 
        className={`w-20 sm:w-24 lg:w-28 h-auto ${colorClass} transition-all duration-300 ${
          position.isDragging ? 'opacity-90 scale-110' : 'opacity-50 hover:opacity-70'
        } ${!position.isDragging && !position.isFalling && !isDancing ? 'animate-sway' : ''} ${
          isDancing ? 'animate-dance' : ''
        }`} 
      />
      
      {/* Cursor hint - only show if not interacted */}
      {!hasInteracted && !position.isDragging && (
        <div className="absolute -top-2 -right-2 animate-pulse hidden sm:block">
          <MousePointer2 className="w-4 h-4 text-muted-foreground/50" />
        </div>
      )}
    </div>
  )
}

// Scroll hint component with custom text - clickable
function ScrollHint({ text, targetId }: { text: string, targetId?: string }) {
  const handleClick = () => {
    if (targetId) {
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      // Scroll one viewport height down
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
    }
  }

  return (
    <button 
      onClick={handleClick}
      className="absolute bottom-8 sm:bottom-8 mt-8 sm:mt-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50 hover:opacity-80 transition-opacity max-w-xs text-center px-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
    >
      <span className="text-xs text-muted-foreground/70 leading-relaxed">
        {text}
      </span>
      <ChevronDown className="w-5 h-5 text-muted-foreground/70" />
    </button>
  )
}

export function Countdown() {
  const { t, language } = useI18n()
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [bridePos, setBridePos] = useState({ x: 12, y: 70 })
  const [groomPos, setGroomPos] = useState({ x: 88, y: 70 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const weddingDate = new Date("2026-08-19T14:00:00+03:00")

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

  const scrollHintText = language === "et" 
    ? "Kinnita osalemine ja tutvu infoga" 
    : "Confirm attendance and learn more"

  return (
    <section 
      ref={containerRef}
      className="min-h-[100dvh] flex items-center justify-center bg-card/30 relative overflow-hidden"
    >
      {/* Floating hearts background */}
      <FloatingHearts />
      
      {/* Draggable Bride stickman - left side */}
      <DraggableStickman 
        type="bride" 
        initialPosition={{ x: 12, y: 70 }}
        containerRef={containerRef}
        onPositionUpdate={setBridePos}
        otherPosition={groomPos}
        hasInteracted={hasInteracted}
        onInteraction={() => setHasInteracted(true)}
      />
      
      {/* Draggable Groom stickman - right side */}
      <DraggableStickman 
        type="groom" 
        initialPosition={{ x: 88, y: 70 }}
        containerRef={containerRef}
        onPositionUpdate={setGroomPos}
        otherPosition={bridePos}
        hasInteracted={hasInteracted}
        onInteraction={() => setHasInteracted(true)}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Countdown grid */}
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
      
      {/* Scroll hint with custom text */}
      <ScrollHint text={scrollHintText} />
    </section>
  )
}
