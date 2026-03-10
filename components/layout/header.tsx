"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const { t } = useI18n()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/rsvp", label: t.nav.rsvp },
    { href: "/menu", label: t.nav.menu },
    { href: "/flowers", label: t.nav.flowers },
    { href: "/info", label: t.nav.info },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start">
            <span className="font-serif text-lg sm:text-xl font-medium tracking-wide text-foreground">J & R</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground tracking-widest uppercase">Randmäe</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 lg:px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher className="hidden sm:flex" />
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/rsvp">{t.cta.rsvp}</Link>
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
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
          "md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border transition-all duration-300 overflow-hidden",
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
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
            <LanguageSwitcher />
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
