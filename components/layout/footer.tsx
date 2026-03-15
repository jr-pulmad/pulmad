"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-border bg-background mt-auto">
      {/* Footer with safe area padding */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl sm:text-3xl font-medium tracking-wide text-foreground">
              Johanna & Rannar
            </span>
            <span className="text-sm text-muted-foreground tracking-widest uppercase mt-1">Randmäed · 2026</span>
          </div>

          {/* Quick links */}
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
            <Link href="/rsvp" className="hover:text-foreground transition-colors">
              {t.nav.rsvp}
            </Link>
            <Link href="/flowers" className="hover:text-foreground transition-colors">
              {t.nav.flowers}
            </Link>
            <Link href="/info" className="hover:text-foreground transition-colors">
              {t.nav.info}
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              {t.footer.privacy}
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/60">© 2026 Randmäed. {t.footer.allRights}.</p>
        </div>
      </div>
      
      {/* Safe area spacer - matches background color */}
      <div className="h-[env(safe-area-inset-bottom,0px)] bg-background" />
    </footer>
  )
}
