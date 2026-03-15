"use client"

import { useState, useRef, useEffect } from "react"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"
import { Globe, Check, ChevronDown } from "lucide-react"

const languages = [
  { code: "et" as const, label: "Eesti", flag: "🇪🇪" },
  { code: "en" as const, label: "English", flag: "🇬🇧" },
]

interface LanguageSwitcherProps {
  className?: string
  variant?: "default" | "transparent"
  isMobile?: boolean
}

export function LanguageSwitcher({ className, variant = "default", isMobile = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const currentLang = languages.find((l) => l.code === language) || languages[0]

  // For mobile, use a simple inline selection instead of dropdown
  if (isMobile) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              language === lang.code
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <span className="text-base">{lang.flag}</span>
            <span>{lang.code.toUpperCase()}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
          variant === "default" 
            ? "bg-secondary/50 hover:bg-secondary text-foreground"
            : "bg-white/10 hover:bg-white/20 text-white"
        )}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLang.label}</span>
        <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-40 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-[60]"
          role="listbox"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code)
                setIsOpen(false)
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left",
                language === lang.code
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              role="option"
              aria-selected={language === lang.code}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="flex-1">{lang.label}</span>
              {language === lang.code && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
