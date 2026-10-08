"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { FloatingInput, FloatingTextarea } from "@/components/ui/floating-input"
import { useI18n } from "@/lib/i18n/context"
import { translations } from "@/lib/i18n/translations"
import { Loader2, Send } from "lucide-react"

export default function FeedbackPage() {
  const { language, t } = useI18n()
  const feedback = t.feedback ?? translations.et.feedback
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!message.trim()) return
    setStatus("sending")
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, honeypot, language }),
      })
      setStatus(response.ok ? "success" : "error")
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center pt-24 pb-16">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">{feedback.eyebrow}</p>
          <h1 className="mt-3 font-serif text-5xl sm:text-6xl">{feedback.title}</h1>
          <p className="mt-4 max-w-lg text-muted-foreground">{feedback.subtitle}</p>

          {status === "success" ? (
            <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-center">
              <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 animate-success-pop">
                <svg className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" className="animate-success-check" />
                </svg>
              </div>
              <h2 className="mt-4 font-serif text-3xl animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>{feedback.successTitle}</h2>
              <p className="mt-2 text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>{feedback.successMessage}</p>
              <Link href="/photos" className="mt-7 inline-flex rounded-2xl bg-primary px-6 py-3 text-sm font-light uppercase tracking-widest text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{feedback.galleryCta}</Link>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-10 space-y-5 rounded-2xl border border-border bg-card/70 p-5 sm:p-8">
              <FloatingInput label={feedback.name} name="name" value={name} onChange={(e) => setName(e.target.value)} />
              <FloatingInput label={feedback.email} name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <FloatingTextarea label={feedback.message} name="message" required value={message} onChange={(e) => setMessage(e.target.value)} />
              <input aria-hidden="true" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px]" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              {status === "error" && <p className="text-sm text-destructive">{feedback.error}</p>}
              <Button type="submit" disabled={status === "sending"} className="gap-2 rounded-2xl px-6">
                {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {feedback.submit}
              </Button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
