"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n/context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FloatingInput, FloatingTextarea } from "@/components/ui/floating-input"
import { CheckCircle2, Loader2, UserCheck, UtensilsCrossed, ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

type Step = "rsvp" | "menu" | "success"

export function RSVPMenuForm() {
  const { t, language } = useI18n()
  const [currentStep, setCurrentStep] = useState<Step>("rsvp")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [emailError, setEmailError] = useState("")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    attendance: "",
    notes: "",
    mainCourseChoice: "",
    allergiesAndDiet: "",
    honeypot: "",
  })

  useEffect(() => {
    if (emailError && formData.email) {
      setEmailError("")
    }
  }, [formData.email, emailError])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validateEmail = (email: string): boolean => {
    if (!email) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const showMenuSection = formData.attendance === "ceremony_and_reception"

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setEmailError("")

    if (formData.email && !validateEmail(formData.email)) {
      setEmailError(language === "et" ? "Palun sisesta korrektne e-maili aadress" : "Please enter a valid email address")
      return
    }

    if (showMenuSection) {
      setCurrentStep("menu")
      return
    }

    await submitForm()
  }

  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    await submitForm()
  }

  const submitForm = async () => {
    setIsSubmitting(true)

    try {
      const rsvpResponse = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          attendance: formData.attendance,
          notes: formData.notes,
          honeypot: formData.honeypot,
          language,
        }),
      })

      if (!rsvpResponse.ok) {
        setError(t.rsvp.error)
        setIsSubmitting(false)
        return
      }

      if (showMenuSection && formData.mainCourseChoice) {
        const menuResponse = await fetch("/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            mainCourseChoice: formData.mainCourseChoice,
            allergiesAndDiet: formData.allergiesAndDiet,
            honeypot: formData.honeypot,
            language,
          }),
        })

        if (!menuResponse.ok) {
          setError(t.menu.error)
          setIsSubmitting(false)
          return
        }
      }

      setCurrentStep("success")
    } catch {
      setError(t.rsvp.error)
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

  if (currentStep === "success") {
    return (
      <Card className="max-w-2xl mx-auto bg-card/50 border-border backdrop-blur-sm animate-success-pop">
        <CardContent className="py-12 sm:py-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6 animate-success-pop" style={{ animationDelay: "0.1s" }}>
            <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" className="animate-success-check" />
            </svg>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-foreground mb-3 animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>{t.common.success}</h3>
          <p className="text-muted-foreground max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
            {showMenuSection ? (
              language === "et" 
                ? "Aitäh! Sinu osalemine ja menüüvalik on salvestatud." 
                : "Thank you! Your attendance and menu selection have been saved."
            ) : (
              t.rsvp.success
            )}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
          currentStep === "rsvp" 
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
            : "bg-secondary text-muted-foreground"
        )}>
          <UserCheck className="w-4 h-4" />
          <span>{t.nav.rsvp}</span>
        </div>
        {showMenuSection && (
          <>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <div className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
              currentStep === "menu" 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                : "bg-secondary text-muted-foreground"
            )}>
              <UtensilsCrossed className="w-4 h-4" />
              <span>{t.nav.menu}</span>
            </div>
          </>
        )}
      </div>

      {/* RSVP Step */}
      {currentStep === "rsvp" && (
        <Card className="bg-card/50 border-border backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4 mx-auto">
              <UserCheck className="w-7 h-7 text-primary" />
            </div>
            <CardTitle className="font-serif text-2xl sm:text-3xl font-medium text-foreground">{t.rsvp.title}</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">{t.rsvp.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleRSVPSubmit} className="space-y-5">
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

              {/* Name fields with floating labels */}
              <div className="grid sm:grid-cols-2 gap-4">
                <FloatingInput
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  label={`${t.rsvp.firstName} *`}
                />
                <FloatingInput
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  label={`${t.rsvp.lastName} *`}
                />
              </div>

              {/* Contact fields with floating labels */}
              <div className="grid sm:grid-cols-2 gap-4">
                <FloatingInput
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  label={t.rsvp.email}
                  error={emailError}
                />
                <FloatingInput
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  label={t.rsvp.phone}
                />
              </div>

              {/* Attendance */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {t.rsvp.attendance} <span className="text-destructive">*</span>
                </Label>
                <RadioGroup
                  value={formData.attendance}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, attendance: value }))}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-3 p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 hover:border-primary/30 transition-all duration-200 cursor-pointer group">
                    <RadioGroupItem value="ceremony_and_reception" id="ceremony_and_reception" />
                    <Label htmlFor="ceremony_and_reception" className="flex-1 cursor-pointer font-normal group-hover:text-foreground transition-colors">
                      {t.rsvp.attendanceOptions.ceremonyAndReception}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 hover:border-primary/30 transition-all duration-200 cursor-pointer group">
                    <RadioGroupItem value="ceremony_only" id="ceremony_only" />
                    <Label htmlFor="ceremony_only" className="flex-1 cursor-pointer font-normal group-hover:text-foreground transition-colors">
                      {t.rsvp.attendanceOptions.ceremonyOnly}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 hover:border-primary/30 transition-all duration-200 cursor-pointer group">
                    <RadioGroupItem value="cant_attend" id="cant_attend" />
                    <Label htmlFor="cant_attend" className="flex-1 cursor-pointer font-normal group-hover:text-foreground transition-colors">
                      {t.rsvp.attendanceOptions.cantAttend}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Notes with floating label */}
              <FloatingTextarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                label={t.rsvp.notes}
              />

              {/* Error message */}
              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
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
                ) : showMenuSection ? (
                  <>
                    {language === "et" ? "Jätka menüüvalikuga" : "Continue to menu"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  t.rsvp.submit
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground/60">{t.form.gdprNote}</p>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Menu Step */}
      {currentStep === "menu" && (
        <Card className="bg-card/50 border-border backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4 mx-auto">
              <UtensilsCrossed className="w-7 h-7 text-primary" />
            </div>
            <CardTitle className="font-serif text-2xl sm:text-3xl font-medium text-foreground">{t.menu.title}</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">{t.menu.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Guest name reminder */}
            <div className="mb-6 p-4 rounded-xl bg-secondary/30 border border-border">
              <p className="text-sm text-muted-foreground">
                {language === "et" ? "Menüüvalik külalisele:" : "Menu selection for:"}
              </p>
              <p className="font-medium text-foreground">{formData.firstName} {formData.lastName}</p>
            </div>

            <form onSubmit={handleMenuSubmit} className="space-y-5">
              {/* Main course selection */}
              <div className="space-y-2">
                <Label htmlFor="mainCourse" className="text-sm font-medium">
                  {t.menu.mainCourse} <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.mainCourseChoice}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, mainCourseChoice: value }))}
                >
                  <SelectTrigger className="h-14 rounded-xl bg-card border-input">
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

              {/* Allergies with floating label */}
              <FloatingTextarea
                id="allergiesAndDiet"
                name="allergiesAndDiet"
                value={formData.allergiesAndDiet}
                onChange={handleChange}
                required
                label={`${t.menu.allergies} *`}
              />

              {/* Error message */}
              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="sm:flex-1"
                  onClick={() => setCurrentStep("rsvp")}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {t.common.back}
                </Button>
                <Button 
                  type="submit" 
                  className="sm:flex-1" 
                  size="lg" 
                  disabled={isSubmitting || !formData.mainCourseChoice || !formData.allergiesAndDiet}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t.common.loading}
                    </>
                  ) : (
                    language === "et" ? "Salvesta kõik" : "Save all"
                  )}
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground/60">{t.form.gdprNote}</p>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
