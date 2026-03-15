"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useI18n } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { Button } from "@/components/ui/button"
import { Menu, X, MapPin, Flower2, Info, Heart, FlowerIcon as Flower2Filled } from "lucide-react"
import { cn } from "@/lib/utils"

// Filled heart icon
function HeartFilled({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

// Filled info icon
function InfoFilled({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  )
}

export function Header() {
  const { t, language } = useI18n()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const isHomePage = pathname === "/"
  const showSolidBackground = !isHomePage || isScrolled
  // Hide RSVP button on homepage when at top (hero section visible)
  const showRsvpButton = !isHomePage || isScrolled

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to top when pathname changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname])

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isHomePage) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const navItems = [
    { 
      href: "/rsvp", 
      label: t.nav.rsvp,
      mobileLabel: language === "et" ? "Kinnita osalemine" : "RSVP",
      icon: Heart, 
      iconFilled: HeartFilled,
      description: language === "et" ? "Kinnita osalemine" : "Confirm attendance" 
    },
    { 
      href: "/flowers", 
      label: t.nav.flowers,
      mobileLabel: language === "et" ? "Lilled" : "Flowers",
      icon: Flower2, 
      iconFilled: Flower2Filled,
      description: language === "et" ? "Kingi lilli" : "Gift flowers" 
    },
    { 
      href: "/info", 
      label: t.nav.info,
      mobileLabel: language === "et" ? "Info" : "Info",
      icon: Info, 
      iconFilled: InfoFilled,
      description: language === "et" ? "Kasulik info" : "Useful info" 
    },
  ]

  const currentNavIndex = navItems.findIndex(item => item.href === pathname)

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        showSolidBackground 
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm" 
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo - always visible on left */}
          <Link 
            href="/" 
            onClick={handleLogoClick}
            className="flex flex-col items-start relative"
          >
            <span className={cn(
              "font-serif text-lg sm:text-xl font-medium tracking-wide transition-colors duration-300",
              showSolidBackground ? "text-foreground" : "text-white drop-shadow-md"
            )}>
              J & R
            </span>
            <span className={cn(
              "text-[10px] sm:text-xs tracking-widest uppercase transition-colors duration-300",
              showSolidBackground ? "text-muted-foreground" : "text-white/80"
            )}>Randmäe</span>
          </Link>

          {/* Desktop Navigation - centered */}
          <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
            <div className="relative flex items-center bg-secondary/50 dark:bg-secondary/30 rounded-2xl p-1.5 backdrop-blur-sm border border-border/30">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href
                const Icon = isActive ? item.iconFilled : item.icon
                const isRsvp = item.href === "/rsvp"
                
                return (
                  <div key={item.href} className="flex items-center">
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-2 px-4 py-2 h-9 rounded-xl text-sm font-medium transition-all duration-300 z-10",
                        isActive 
                          ? "text-foreground bg-primary/10 dark:bg-primary/20" 
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      <Icon className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isRsvp && "md:group-hover:animate-heartbeat",
                        !isRsvp && "md:group-hover:scale-110"
                      )} />
                      <span>{item.label}</span>
                    </Link>
                    
                    {/* Journey connector line */}
                    {index < navItems.length - 1 && (
                      <div className={cn(
                        "w-6 h-px mx-1 transition-colors duration-300",
                        currentNavIndex > index 
                          ? "bg-primary" 
                          : "bg-border"
                      )} />
                    )}
                  </div>
                )
              })}
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher className="hidden sm:flex" variant={showSolidBackground ? "default" : "transparent"} />
            
            {/* CTA Button - hide on homepage hero */}
            <Button 
              asChild 
              size="sm" 
              className={cn(
                "hidden sm:inline-flex h-9 transition-all duration-300",
                !showRsvpButton && "opacity-0 pointer-events-none scale-90"
              )}
            >
              <Link href="/rsvp">
                <span>{t.cta.rsvp}</span>
              </Link>
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "md:hidden p-2 rounded-xl transition-all duration-300 h-10 w-10 flex items-center justify-center",
                showSolidBackground 
                  ? "text-foreground hover:bg-secondary" 
                  : "text-white hover:bg-white/10",
                isMobileMenuOpen && "bg-secondary"
              )}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <Menu className={cn(
                  "w-6 h-6 absolute inset-0 transition-all duration-300",
                  isMobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                )} />
                <X className={cn(
                  "w-6 h-6 absolute inset-0 transition-all duration-300",
                  isMobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                )} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-xl border-b border-border transition-all duration-300 overflow-hidden",
          isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        <nav className="container mx-auto px-4 py-4">
          {/* Journey path visualization */}
          <div className="relative">
            <div className="absolute left-6 top-6 bottom-6 w-px bg-border" />
            
            <div className="space-y-2">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href
                const Icon = isActive ? item.iconFilled : item.icon
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300",
                      isActive 
                        ? "bg-primary/10 border border-primary/20" 
                        : "hover:bg-secondary/50"
                    )}
                  >
                    {/* Journey node */}
                    <div className={cn(
                      "relative z-10 flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-lg" 
                        : "bg-secondary text-muted-foreground"
                    )}>
                      <Icon className="w-5 h-5" />
                      
                      {/* Completion indicator */}
                      {currentNavIndex >= index && currentNavIndex !== -1 && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent border-2 border-background" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className={cn(
                        "font-medium transition-colors",
                        isActive ? "text-primary" : "text-foreground"
                      )}>
                        {item.mobileLabel}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    
                    {/* Arrow indicator */}
                    <MapPin className={cn(
                      "w-4 h-4 transition-all duration-300",
                      isActive ? "text-primary opacity-100" : "opacity-0"
                    )} />
                  </Link>
                )
              })}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <LanguageSwitcher isMobile />
            <Button asChild size="sm" className="h-9">
              <Link href="/rsvp" onClick={() => setIsMobileMenuOpen(false)}>
                {t.cta.rsvp}
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
