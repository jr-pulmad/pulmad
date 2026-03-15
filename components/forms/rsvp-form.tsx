"use client"

import type React from "react"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle2, Loader2, UserCheck } from "lucide-react"

export function RSVPForm() {
  const { t, language } = useI18n()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    attendance: "",
    notes: "",
    honeypot: "", // Spam protection
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          language,
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
      } else {
        setError(t.rsvp.error)
      }
    } catch {
      setError(t.rsvp.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto bg-card/50 border-border">
        <CardContent className="py-12 sm:py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-foreground mb-3">{t.common.success}</h3>
          <p className="text-muted-foreground max-w-md mx-auto">{t.rsvp.success}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto bg-card/50 border-border">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleChange}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {/* Name fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                {t.rsvp.firstName} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="bg-background/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                {t.rsvp.lastName} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="bg-background/50 border-border"
              />
            </div>
          </div>

          {/* Contact fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.rsvp.email}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-background/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t.rsvp.phone}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="bg-background/50 border-border"
              />
            </div>
          </div>

          {/* Attendance */}
          <div className="space-y-3">
            <Label>
              {t.rsvp.attendance} <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={formData.attendance}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, attendance: value }))}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border bg-background/30 hover:bg-background/50 transition-colors cursor-pointer">
                <RadioGroupItem value="ceremony_and_reception" id="ceremony_and_reception" />
                <Label htmlFor="ceremony_and_reception" className="flex-1 cursor-pointer font-normal">
                  {t.rsvp.attendanceOptions.ceremonyAndReception}
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border bg-background/30 hover:bg-background/50 transition-colors cursor-pointer">
                <RadioGroupItem value="ceremony_only" id="ceremony_only" />
                <Label htmlFor="ceremony_only" className="flex-1 cursor-pointer font-normal">
                  {t.rsvp.attendanceOptions.ceremonyOnly}
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border bg-background/30 hover:bg-background/50 transition-colors cursor-pointer">
                <RadioGroupItem value="cant_attend" id="cant_attend" />
                <Label htmlFor="cant_attend" className="flex-1 cursor-pointer font-normal">
                  {t.rsvp.attendanceOptions.cantAttend}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t.rsvp.notes}</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder={t.rsvp.notesPlaceholder}
              rows={3}
              className="bg-background/50 border-border resize-none"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Submit button */}
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || !formData.attendance}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t.common.loading}
              </>
            ) : (
              t.rsvp.submit
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground/60">{t.form.gdprNote}</p>
        </form>
      </CardContent>
    </Card>
  )
}
