import type React from "react"
import type { Metadata, Viewport } from "next"
import { Manrope, Playfair_Display, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { I18nProvider } from "@/lib/i18n/context"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const _manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
})

const _playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
})

const _geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Johanna & Rannar | Randmäe pulmad 2026",
  description: "Johanna ja Rannar pulmad Alatskivi lossis, 19. august 2026. Palun vasta, menüüvalik ja info.",
  keywords: ["pulmad", "wedding", "Randmäe", "Alatskivi Loss", "2026"],
  authors: [{ name: "Johanna & Rannar Randmäe" }],
  openGraph: {
    title: "Johanna & Rannar | Randmäe Wedding 2026",
    description: "Join us for our wedding at Alatskivi Castle on August 19, 2026",
    type: "website",
    locale: "et_EE",
    alternateLocale: "en_US",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="et" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
