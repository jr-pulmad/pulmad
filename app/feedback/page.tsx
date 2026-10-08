"use client"

import type React from "react"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { FloatingInput, FloatingTextarea } from "@/components/ui/floating-input"
import { useI18n } from "@/lib/i18n/context"
import { CheckCircle2, Loader2, Send } from "lucide-react"

export default function FeedbackPage() {
  const { language } = useI18n()
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
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Tagasiside</p>
          <h1 className="mt-3 font-serif text-5xl sm:text-6xl">Jaga meiega mõtet</h1>
          <p className="mt-4 max-w-lg text-muted-foreground">Kui soovid, jäta meile paar head sõna või mõni armas mälestus.</p>

          {status === "success" ? (
            <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
              <h2 className="mt-4 font-serif text-3xl">Aitäh!</h2>
              <p className="mt-2 text-muted-foreground">Sinu mõte jõudis meieni.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-10 space-y-5 rounded-2xl border border-border bg-card/70 p-5 sm:p-8">
              <FloatingInput label="Nimi (soovi korral)" name="name" value={name} onChange={(e) => setName(e.target.value)} />
              <FloatingInput label="E-mail (soovi korral)" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <FloatingTextarea label="Sinu sõnum" name="message" required value={message} onChange={(e) => setMessage(e.target.value)} />
              <input aria-hidden="true" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px]" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              {status === "error" && <p className="text-sm text-destructive">Midagi läks valesti. Palun proovi uuesti.</p>}
              <Button type="submit" disabled={status === "sending"} className="gap-2 rounded-2xl px-6">
                {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Saada tagasiside
              </Button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
