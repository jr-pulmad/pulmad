"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useI18n } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const { t } = useI18n()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hasScrolledOnce, setHasScrolledOnce] = useState(false)
  const prevPathRef = useRef(pathname)
  
  // Determine if we're on the home page (hero section)
  const isHomePage = pathname === "/"
  
  // Always show solid background on non-home pages
  const showSolidBackground = !isHomePage || isScrolled || hasScrolledOnce

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20
      setIsScrolled(scrolled)
      if (scrolled) {
        setHasScrolledOnce(true)
      }
    }
    
    // Check scroll position on mount
    handleScroll()
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Track page changes to maintain header background
  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      // Keep the solid background when navigating between pages
      if (hasScrolledOnce || !isHomePage) {
        setHasScrolledOnce(true)
      }
      prevPathRef.current = pathname
    }
  }, [pathname, hasScrolledOnce, isHomePage])

  // Reset scroll state only when navigating TO home page and at top
  useEffect(() => {
    if (isHomePage && window.scrollY <= 20) {
      // Small delay to allow smooth transition
      const timer = setTimeout(() => {
        if (window.scrollY <= 20) {
          setHasScrolledOnce(false)
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isHomePage])

  const navItems = [
    { href: "/rsvp", label: t.nav.rsvp },
    { href: "/flowers", label: t.nav.flowers },
    { href: "/info", label: t.nav.info },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        showSolidBackground 
          ? "bg-background/95 backdrop-blur-md border-b border-border" 
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start">
            <span className={cn(
              "font-serif text-lg sm:text-xl font-medium tracking-wide transition-colors",
              showSolidBackground ? "text-foreground" : "text-white drop-shadow-md"
            )}>J & R</span>
            <span className={cn(
              "text-[10px] sm:text-xs tracking-widest uppercase transition-colors",
              showSolidBackground ? "text-muted-foreground" : "text-white/80"
            )}>Randmäe</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 lg:px-4 py-2 text-sm font-medium transition-colors",
                  showSolidBackground 
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-white/80 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher className="hidden sm:flex" variant={showSolidBackground ? "default" : "transparent"} />
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/rsvp">{t.cta.rsvp}</Link>
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "md:hidden p-2 transition-colors",
                showSolidBackground ? "text-foreground" : "text-white"
              )}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-md border-b border-border transition-all duration-300 overflow-visible",
          isMobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
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
