import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get("lang") || "en"

  const eventTitle = lang === "et" ? "Johanna & Rannari pulmad" : "Johanna & Rannar's Wedding"
  const eventDescription = lang === "et" 
    ? "Palume kohal olla kell 13:45. Laulatustseremoonia algab kell 15:00. Peolaud algab kell 17:00 Alatskivi lossis."
    : "Please arrive by 13:45. Ceremony starts at 15:00. Reception begins at 17:00 at Alatskivi Castle."
  const eventLocation = "Maarja-Magdaleena kirik, Maarja-Magdaleena, Tartu maakond, Estonia"
  const alarmDescription = lang === "et" ? "Homme on Johanna & Rannari pulmad!" : "Johanna & Rannar's Wedding is tomorrow!"

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Johanna & Rannar Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "DTSTART:20260819T134500",
    "DTEND:20260819T230000",
    `SUMMARY:${eventTitle}`,
    `DESCRIPTION:${eventDescription.replace(/\n/g, "\\n")}`,
    `LOCATION:${eventLocation}`,
    "UID:johanna-rannar-wedding-2026@pulmad.ee",
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${alarmDescription}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n")

  return new NextResponse(icsContent, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": "attachment; filename=johanna-rannar-pulmad.ics",
    },
  })
}
