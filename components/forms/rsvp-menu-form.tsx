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
import { CheckCircle2, Loader2, UserCheck, UtensilsCrossed, ChevronRight, ChevronLeft, Users, Plus, Trash2, Bus, Car } from "lucide-react"
import { cn } from "@/lib/utils"

type Step = "rsvp" | "guests" | "menu" | "success"

interface GuestData {
  id: string
  firstName: string
  lastName: string
  mainCourseChoice: string
  allergiesAndDiet: string
}

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
    transport: "",
    mainCourseChoice: "",
    allergiesAndDiet: "",
    honeypot: "",
  })

  // Additional guests
  const [additionalGuests, setAdditionalGuests] = useState<GuestData[]>([])

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
  const hasAdditionalGuests = additionalGuests.length > 0

  const addGuest = () => {
    setAdditionalGuests(prev => [...prev, {
      id: crypto.randomUUID(),
      firstName: "",
      lastName: "",
      mainCourseChoice: "",
      allergiesAndDiet: "",
    }])
  }

  const removeGuest = (id: string) => {
    setAdditionalGuests(prev => prev.filter(g => g.id !== id))
  }

  const updateGuest = (id: string, field: keyof GuestData, value: string) => {
    setAdditionalGuests(prev => prev.map(g => 
      g.id === id ? { ...g, [field]: value } : g
    ))
  }

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setEmailError("")

    if (!formData.email) {
      setEmailError(language === "et" ? "E-mail on kohustuslik" : "Email is required")
      return
    }

    if (!validateEmail(formData.email)) {
      setEmailError(language === "et" ? "Palun sisesta korrektne e-maili aadress" : "Please enter a valid email address")
      return
    }

    if (showMenuSection) {
      // Go to guests confirmation step
      setCurrentStep("guests")
      return
    }

    await submitForm()
  }

  const handleGuestsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setCurrentStep("menu")
  }

  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    await submitForm()
  }

  const submitForm = async () => {
    setIsSubmitting(true)

    try {
      // Submit main guest RSVP
      const rsvpResponse = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          attendance: formData.attendance,
          transport: formData.transport,
          notes: formData.notes,
          additionalGuests: additionalGuests.length,
          honeypot: formData.honeypot,
          language,
        }),
      })

      if (!rsvpResponse.ok) {
        setError(t.rsvp.error)
        setIsSubmitting(false)
        return
      }

      // Submit menu for main guest if attending reception
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

        // Submit menu for each additional guest
        for (const guest of additionalGuests) {
          if (guest.mainCourseChoice) {
            const guestMenuResponse = await fetch("/api/menu", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                firstName: guest.firstName,
                lastName: guest.lastName,
                email: formData.email, // Use main guest's email
                mainCourseChoice: guest.mainCourseChoice,
                allergiesAndDiet: guest.allergiesAndDiet,
                honeypot: formData.honeypot,
                language,
              }),
            })

            if (!guestMenuResponse.ok) {
              setError(t.menu.error)
              setIsSubmitting(false)
              return
            }
          }
        }
      }

      setCurrentStep("success")
      // Scroll to top when success page appears
      window.scrollTo({ top: 0, behavior: "smooth" })
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

  const transportOptions = [
    { value: "own", label: language === "et" ? "Tulen oma transpordiga" : "Coming by own transport", icon: Car },
    { value: "bus_tartu", label: language === "et" ? "Vajan bussitransporti Tartust ja tagasi" : "Need bus transfer from Tartu and back", icon: Bus },
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
                ? `Aitäh! ${hasAdditionalGuests ? `${additionalGuests.length + 1} külalise` : "Sinu"} osalemine ja menüüvalik on salvestatud.`
                : `Thank you! ${hasAdditionalGuests ? `${additionalGuests.length + 1} guests'` : "Your"} attendance and menu selection have been saved.`
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
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 flex-wrap">
        <div className={cn(
          "flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300",
          currentStep === "rsvp" 
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
            : "bg-secondary text-muted-foreground"
        )}>
          <UserCheck className="w-7 h-7 text-primary" />
          <span>{t.nav.rsvp}</span>
        </div>
        {showMenuSection && (
          <>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <div className={cn(
              "flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300",
              currentStep === "guests" 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                : "bg-secondary text-muted-foreground"
            )}>
              <Users className="w-7 h-7" />
              <span>{language === "et" ? "Külalised" : "Guests"}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <div className={cn(
              "flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300",
              currentStep === "menu" 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                : "bg-secondary text-muted-foreground"
            )}>
              <UtensilsCrossed className="w-7 h-7" />
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
              <div className="inline-flex items-center justify-center mb-8 mx-auto max-w-full">
                <div className="inline-flex items-center justify-center gap-2 sm:gap-3 flex-nowrap max-w-full">
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 px-3 sm:px-4 h-14 rounded-2xl bg-primary/10 text-primary text-sm font-medium whitespace-nowrap shrink-0",
                      currentStep === "rsvp" && "bg-primary/10 text-primary"
                    )}
                  >
                    <UserCheck className="w-7 h-7 text-primary shrink-0" />
                    <span>{t.nav.rsvp}</span>
                  </div>
              
                  {showMenuSection && (
                    <>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 px-3 sm:px-4 h-14 rounded-2xl bg-primary/10 text-primary text-sm font-medium whitespace-nowrap shrink-0",
                          currentStep === "guests" && "bg-primary/10 text-primary"
                        )}
                      >
                        <Users className="w-7 h-7 text-primary shrink-0" />
                        <span>{language === "et" ? "Külalised" : "Guests"}</span>
                      </div>
              
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 px-3 sm:px-4 h-14 rounded-2xl bg-primary/10 text-primary text-sm font-medium whitespace-nowrap shrink-0",
                          currentStep === "menu" && "bg-primary/10 text-primary"
                        )}
                      >
                        <UtensilsCrossed className="w-7 h-7 text-primary shrink-0" />
                        <span>{t.nav.menu}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
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
                  label={<>{t.rsvp.firstName} <span className="text-red-500">*</span></>}
                />
                <FloatingInput
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  label={<>{t.rsvp.lastName} <span className="text-red-500">*</span></>}
                />
              </div>

              {/* Contact fields with floating labels */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <FloatingInput
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    label={<>{t.rsvp.email} <span className="text-red-500">*</span></>}
                    error={emailError}
                  />
                  <p className="text-xs text-muted-foreground/70 px-1">
                    {language === "et" 
                      ? "Vajalik ürituse uuenduste saamiseks" 
                      : "Required to receive event updates"}
                  </p>
                </div>
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
                  {t.rsvp.attendance} <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.attendance}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, attendance: value }))}
                  className="space-y-2"
                >
                  <label 
                    htmlFor="ceremony_and_reception" 
                    className="flex items-center space-x-3 p-4 rounded-xl border border-border bg-card dark:bg-background hover:bg-secondary/50 hover:border-primary/30 transition-all duration-200 cursor-pointer group"
                  >
                    <RadioGroupItem value="ceremony_and_reception" id="ceremony_and_reception" />
                    <span className="flex-1 font-normal group-hover:text-foreground transition-colors">
                      {t.rsvp.attendanceOptions.ceremonyAndReception}
                    </span>
                  </label>
                  <label 
                    htmlFor="ceremony_only" 
                    className="flex items-center space-x-3 p-4 rounded-xl border border-border bg-card dark:bg-background hover:bg-secondary/50 hover:border-primary/30 transition-all duration-200 cursor-pointer group"
                  >
                    <RadioGroupItem value="ceremony_only" id="ceremony_only" />
                    <span className="flex-1 font-normal group-hover:text-foreground transition-colors">
                      {t.rsvp.attendanceOptions.ceremonyOnly}
                    </span>
                  </label>
                  <label 
                    htmlFor="cant_attend" 
                    className="flex items-center space-x-3 p-4 rounded-xl border border-border bg-card dark:bg-background hover:bg-secondary/50 hover:border-primary/30 transition-all duration-200 cursor-pointer group"
                  >
                    <RadioGroupItem value="cant_attend" id="cant_attend" />
                    <span className="flex-1 font-normal group-hover:text-foreground transition-colors">
                      {t.rsvp.attendanceOptions.cantAttend}
                    </span>
                  </label>
                </RadioGroup>
              </div>

              {/* Transport options - only show if attending reception */}
              {formData.attendance === "ceremony_and_reception" && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    {language === "et" ? "Transport" : "Transport"}
                  </Label>
                  <RadioGroup
                    value={formData.transport}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, transport: value }))}
                    className="space-y-2"
                  >
                    {transportOptions.map((option) => (
                      <label 
                        key={option.value}
                        htmlFor={`transport_${option.value}`}
                        className="flex items-center space-x-3 p-4 rounded-xl border border-border bg-card dark:bg-background hover:bg-secondary/50 hover:border-primary/30 transition-all duration-200 cursor-pointer group"
                      >
                        <RadioGroupItem value={option.value} id={`transport_${option.value}`} />
                        <option.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="flex-1 font-normal group-hover:text-foreground transition-colors">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              )}

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
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || !formData.attendance || !formData.email}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t.common.loading}
                  </>
                ) : showMenuSection ? (
                  <>
                    {language === "et" ? "Jätka" : "Continue"}
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

      {/* Guests Step */}
      {currentStep === "guests" && (
        <Card className="bg-card/50 border-border backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-8 mx-auto">
              <div className="inline-flex items-center justify-center mb-8 mx-auto max-w-full">
                <div className="inline-flex items-center justify-center gap-2 sm:gap-3 flex-nowrap max-w-full">
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 px-3 sm:px-4 h-14 rounded-2xl bg-primary/10 text-primary text-sm font-medium whitespace-nowrap shrink-0",
                      currentStep === "rsvp" && "bg-primary/10 text-primary"
                    )}
                  >
                    <UserCheck className="w-7 h-7 text-primary shrink-0" />
                    <span>{t.nav.rsvp}</span>
                  </div>
              
                  {showMenuSection && (
                    <>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 px-3 sm:px-4 h-14 rounded-2xl bg-primary/10 text-primary text-sm font-medium whitespace-nowrap shrink-0",
                          currentStep === "guests" && "bg-primary/10 text-primary"
                        )}
                      >
                        <Users className="w-7 h-7 text-primary shrink-0" />
                        <span>{language === "et" ? "Külalised" : "Guests"}</span>
                      </div>
              
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 px-3 sm:px-4 h-14 rounded-2xl bg-primary/10 text-primary text-sm font-medium whitespace-nowrap shrink-0",
                          currentStep === "menu" && "bg-primary/10 text-primary"
                        )}
                      >
                        <UtensilsCrossed className="w-7 h-7 text-primary shrink-0" />
                        <span>{t.nav.menu}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <CardTitle className="font-serif text-2xl sm:text-3xl font-medium text-foreground">
              {language === "et" ? "Lisage kaastulijad" : "Add companions"}
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              {language === "et" 
                ? "Kas tuled üksi või kellegagi koos? Lisa siia oma kaaslased." 
                : "Coming alone or with someone? Add your companions here."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleGuestsSubmit} className="space-y-5">
              {/* Main guest reminder */}
              <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                <p className="text-sm text-muted-foreground">{language === "et" ? "Peamine külaline:" : "Primary guest:"}</p>
                <p className="font-medium text-foreground">{formData.firstName} {formData.lastName}</p>
              </div>

              {/* Additional guests */}
              {additionalGuests.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-sm font-medium">
                    {language === "et" ? "Kaastulijad" : "Additional guests"}
                  </Label>
                  {additionalGuests.map((guest, index) => (
                    <div key={guest.id} className="p-4 rounded-xl border border-border bg-card dark:bg-background space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          {language === "et" ? `Külaline ${index + 2}` : `Guest ${index + 2}`}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGuest(guest.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <FloatingInput
                          id={`guest-${guest.id}-firstName`}
                          value={guest.firstName}
                          onChange={(e) => updateGuest(guest.id, "firstName", e.target.value)}
                          required
                          label={<>{t.rsvp.firstName} <span className="text-red-500">*</span></>}
                        />
                        <FloatingInput
                          id={`guest-${guest.id}-lastName`}
                          value={guest.lastName}
                          onChange={(e) => updateGuest(guest.id, "lastName", e.target.value)}
                          required
                          label={<>{t.rsvp.lastName} <span className="text-red-500">*</span></>}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add guest button */}
              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent border-dashed"
                onClick={addGuest}
              >
                <Plus className="w-4 h-4 mr-2" />
                {language === "et" ? "Lisa kaastulija" : "Add companion"}
              </Button>

              {/* Info note */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  {language === "et" 
                    ? "Iga külalise jaoks on vaja eraldi menüüvalikut. Saad menüü valida järgmises sammus." 
                    : "Each guest needs a separate menu selection. You can select menus in the next step."}
                </p>
              </div>

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
                >
                  {language === "et" ? "Jätka menüüvalikuga" : "Continue to menu"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Menu Step */}
      {currentStep === "menu" && (
        <Card className="bg-card/50 border-border backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-8 mx-auto">
              <div className="inline-flex items-center justify-center mb-8 mx-auto max-w-full">
                <div className="inline-flex items-center justify-center gap-2 sm:gap-3 flex-nowrap max-w-full">
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 px-3 sm:px-4 h-14 rounded-2xl bg-primary/10 text-primary text-sm font-medium whitespace-nowrap shrink-0",
                      currentStep === "rsvp" && "bg-primary/10 text-primary"
                    )}
                  >
                    <UserCheck className="w-7 h-7 text-primary shrink-0" />
                    <span>{t.nav.rsvp}</span>
                  </div>
              
                  {showMenuSection && (
                    <>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 px-3 sm:px-4 h-14 rounded-2xl bg-primary/10 text-primary text-sm font-medium whitespace-nowrap shrink-0",
                          currentStep === "guests" && "bg-primary/10 text-primary"
                        )}
                      >
                        <Users className="w-7 h-7 text-primary shrink-0" />
                        <span>{language === "et" ? "Külalised" : "Guests"}</span>
                      </div>
              
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 px-3 sm:px-4 h-14 rounded-2xl bg-primary/10 text-primary text-sm font-medium whitespace-nowrap shrink-0",
                          currentStep === "menu" && "bg-primary/10 text-primary"
                        )}
                      >
                        <UtensilsCrossed className="w-7 h-7 text-primary shrink-0" />
                        <span>{t.nav.menu}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <CardTitle className="font-serif text-2xl sm:text-3xl font-medium text-foreground">{t.menu.title}</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">{t.menu.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleMenuSubmit} className="space-y-6">
              {/* Main guest menu */}
              <div className="p-4 rounded-xl border border-border bg-card dark:bg-background space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">1</div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "et" ? "Peamine külaline" : "Primary guest"}</p>
                    <p className="font-medium text-foreground">{formData.firstName} {formData.lastName}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mainCourse" className="text-sm font-medium">
                    {t.menu.mainCourse} <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.mainCourseChoice}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, mainCourseChoice: value }))}
                  >
                    <SelectTrigger className="h-14 rounded-xl bg-card dark:bg-background border-input">
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

                <FloatingTextarea
                  id="allergiesAndDiet"
                  name="allergiesAndDiet"
                  value={formData.allergiesAndDiet}
                  onChange={handleChange}
                  required
                  label={<>{t.menu.allergies} <span className="text-red-500">*</span></>}
                />
              </div>

              {/* Additional guests menu */}
              {additionalGuests.map((guest, index) => (
                <div key={guest.id} className="p-4 rounded-xl border border-border bg-card dark:bg-background space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">{index + 2}</div>
                    <div>
                      <p className="text-sm text-muted-foreground">{language === "et" ? "Kaastulija" : "Companion"}</p>
                      <p className="font-medium text-foreground">{guest.firstName} {guest.lastName}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      {t.menu.mainCourse} <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={guest.mainCourseChoice}
                      onValueChange={(value) => updateGuest(guest.id, "mainCourseChoice", value)}
                    >
                      <SelectTrigger className="h-14 rounded-xl bg-card dark:bg-background border-input">
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

                  <FloatingTextarea
                    id={`guest-${guest.id}-allergies`}
                    value={guest.allergiesAndDiet}
                    onChange={(e) => updateGuest(guest.id, "allergiesAndDiet", e.target.value)}
                    required
                    label={<>{t.menu.allergies} <span className="text-red-500">*</span></>}
                  />
                </div>
              ))}

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
                  onClick={() => setCurrentStep("guests")}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {t.common.back}
                </Button>
                <Button 
                  type="submit" 
                  className="sm:flex-1" 
                  size="lg" 
                  disabled={isSubmitting || !formData.mainCourseChoice || !formData.allergiesAndDiet || additionalGuests.some(g => !g.mainCourseChoice || !g.allergiesAndDiet)}
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
