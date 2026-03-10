"use client"

import type React from "react"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Loader2, UtensilsCrossed, Info } from "lucide-react"

export function MenuForm() {
  const { t, language } = useI18n()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mainCourseChoice: "",
    allergiesAndDiet: "",
    honeypot: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/menu", {
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
        setError(t.menu.error)
      }
    } catch {
      setError(t.menu.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const menuOptions = [
    { value: "beef", label: t.menu.mainCourseOptions.option1 },
    { value: "salmon", label: t.menu.mainCourseOptions.option2 },
    { value: "chicken", label: t.menu.mainCourseOptions.option3 },
    { value: "vegan", label: t.menu.mainCourseOptions.option4 },
  ]

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto bg-card/50 border-border">
        <CardContent className="py-12 sm:py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-foreground mb-3">{t.common.success}</h3>
          <p className="text-muted-foreground max-w-md mx-auto">{t.menu.success}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto bg-card/50 border-border">
      <CardHeader className="text-center pb-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 mx-auto">
          <UtensilsCrossed className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="font-serif text-2xl sm:text-3xl font-medium text-foreground">{t.menu.title}</CardTitle>
        <CardDescription className="text-muted-foreground mt-2">{t.menu.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Note about attendance */}
        <Alert className="mb-6 bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm text-muted-foreground">{t.menu.note}</AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot */}
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
                {t.menu.firstName} <span className="text-destructive">*</span>
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
                {t.menu.lastName} <span className="text-destructive">*</span>
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

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">{t.menu.email}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-background/50 border-border"
            />
          </div>

          {/* Main course selection */}
          <div className="space-y-2">
            <Label htmlFor="mainCourse">
              {t.menu.mainCourse} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.mainCourseChoice}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, mainCourseChoice: value }))}
            >
              <SelectTrigger className="bg-background/50 border-border">
                <SelectValue placeholder={t.menu.mainCourseOptions.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {menuOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Allergies */}
          <div className="space-y-2">
            <Label htmlFor="allergiesAndDiet">
              {t.menu.allergies} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="allergiesAndDiet"
              name="allergiesAndDiet"
              value={formData.allergiesAndDiet}
              onChange={handleChange}
              placeholder={t.menu.allergiesPlaceholder}
              rows={3}
              required
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
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting || !formData.mainCourseChoice || !formData.allergiesAndDiet}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t.common.loading}
              </>
            ) : (
              t.menu.submit
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground/60">{t.form.gdprNote}</p>
        </form>
      </CardContent>
    </Card>
  )
}
