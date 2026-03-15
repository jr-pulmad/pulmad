"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useI18n } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { Button } from "@/components/ui/button"
import { Menu, X, MapPin, Flower2, Info, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const { t } = useI18n()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hasScrolledOnce, setHasScrolledOnce] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const prevPathRef = useRef(pathname)
  
  const isHomePage = pathname === "/"
  const showSolidBackground = !isHomePage || isScrolled || hasScrolledOnce

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20
      setIsScrolled(scrolled)
      if (scrolled) {
        setHasScrolledOnce(true)
      }
    }
    
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      if (hasScrolledOnce || !isHomePage) {
        setHasScrolledOnce(true)
      }
      prevPathRef.current = pathname
    }
  }, [pathname, hasScrolledOnce, isHomePage])

  useEffect(() => {
    if (isHomePage && window.scrollY <= 20) {
      const timer = setTimeout(() => {
        if (window.scrollY <= 20) {
          setHasScrolledOnce(false)
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isHomePage])

  const navItems = [
    { href: "/rsvp", label: t.nav.rsvp, icon: Heart, description: "Confirm attendance" },
    { href: "/flowers", label: t.nav.flowers, icon: Flower2, description: "Gift flowers" },
    { href: "/info", label: t.nav.info, icon: Info, description: "Event details" },
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
          {/* Logo with micro-animation */}
          <Link href="/" className="group flex flex-col items-start relative">
            <span className={cn(
              "font-serif text-lg sm:text-xl font-medium tracking-wide transition-all duration-300 group-hover:tracking-wider",
              showSolidBackground ? "text-foreground" : "text-white drop-shadow-md"
            )}>
              J <span className="inline-block transition-transform duration-300 group-hover:scale-110 group-hover:text-primary">&</span> R
            </span>
            <span className={cn(
              "text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300",
              showSolidBackground ? "text-muted-foreground" : "text-white/80"
            )}>Randmäe</span>
            {/* Subtle hover glow */}
            <div className="absolute -inset-2 rounded-lg bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 -z-10" />
          </Link>

          {/* Desktop Journey Navigation */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center bg-secondary/50 dark:bg-secondary/30 rounded-2xl p-1.5 backdrop-blur-sm border border-border/30">
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                const isHovered = hoveredItem === item.href
                
                return (
                  <div key={item.href} className="flex items-center">
                    <Link
                      href={item.href}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={cn(
                        "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : isHovered
                            ? "bg-background/80 text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className={cn(
                        "w-4 h-4 transition-transform duration-300",
                        (isActive || isHovered) && "scale-110"
                      )} />
                      <span>{item.label}</span>
                      
                      {/* Active indicator dot */}
                      {isActive && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-foreground" />
                      )}
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
            
            {/* CTA Button with glow effect */}
            <Button asChild size="sm" className="hidden sm:inline-flex relative overflow-hidden group">
              <Link href="/rsvp">
                <span className="relative z-10">{t.cta.rsvp}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-300" />
              </Link>
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "md:hidden p-2 rounded-xl transition-all duration-300",
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

      {/* Mobile Navigation with journey style */}
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
                const Icon = item.icon
                const isActive = pathname === item.href
                
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
                        {item.label}
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
            <Button asChild size="sm">
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
