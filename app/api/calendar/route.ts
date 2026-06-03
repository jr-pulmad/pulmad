import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get("lang") || "en"

  const eventTitle = lang === "et" ? "Johanna & Rannari pulmad" : "Johanna & Rannar's Wedding"
  const eventDescription = lang === "et" 
    ? "Palume kohal olla kell 13:45. Laulatustseremoonia algab kell 14:00."
    : "Please arrive by 13:45. Ceremony starts at 14:00."
  const eventLocation = "Maarja-Magdaleena kirik, Maarja-Magdaleena, Tartu maakond, Estonia"
  const alarmDescription = lang === "et" ? "Homme on Johanna & Rannari pulmad!" : "Johanna & Rannar's Wedding is tomorrow!"

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Johanna & Rannar Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "DTSTART;VALUE=DATE-TIME:20260819T134500",
    "DTEND;VALUE=DATE-TIME:20260819T230000",
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
