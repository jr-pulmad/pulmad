import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang") ?? "en"

  const eventTitle = lang === "et" ? "Johanna & Rannari pulmad" : "Johanna & Rannar's Wedding"
  const eventDescription = lang === "et"
    ? "Palume kohal olla kell 13:45. Laulatustseremoonia algab kell 14:00."
    : "Please arrive by 13:45. Ceremony starts at 14:00."

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
    "LOCATION:Maarja-Magdaleena kirik\\, Maarja-Magdaleena\\, Tartu maakond\\, Estonia",
    "UID:johanna-rannar-wedding-2026@pulmad.ee",
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${lang === "et" ? "Homme on Johanna & Rannari pulmad!" : "Johanna & Rannar's Wedding is tomorrow!"}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  return new NextResponse(icsContent, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="johanna-rannar-pulmad.ics"',
    },
  })
}
