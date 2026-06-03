"use client"

import { useEffect, useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { CalendarPlus } from "lucide-react"

interface AddToCalendarProps {
  className?: string
}

export function AddToCalendar({ className }: AddToCalendarProps) {
  const { t, language } = useI18n()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleAddToCalendar = async () => {
    // Dynamically import to avoid SSR issues
    const { atcb_action } = await import("add-to-calendar-button")
    
    atcb_action({
      name: t.calendar.eventName,
      description: t.calendar.eventDescription,
      startDate: "2026-08-19",
      startTime: "14:00",
      endTime: "16:00",
      timeZone: "Europe/Tallinn",
      location: "Maarja-Magdaleena kirik, Maarja-Magdaleena, Tartumaa, Estonia",
      options: ["Apple", "Google", "iCal", "Outlook.com", "Yahoo"],
      buttonStyle: "flat",
      hideBackground: true,
      trigger: "click",
      language: language === "et" ? "et" : "en",
    })
  }

  if (!isClient) {
    return (
      <Button variant="outline" size="lg" className={`gap-2 ${className || ""}`} disabled>
        <CalendarPlus className="w-4 h-4" />
        {t.calendar.addToCalendar}
      </Button>
    )
  }

  return (
    <Button 
      variant="outline" 
      size="lg" 
      className={`gap-2 ${className || ""}`}
      onClick={handleAddToCalendar}
    >
      <CalendarPlus className="w-4 h-4" />
      {t.calendar.addToCalendar}
    </Button>
  )
}
