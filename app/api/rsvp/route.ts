import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, attendance, notes, language, honeypot } = body

    // Honeypot check - if this field is filled, it's likely a bot
    if (honeypot) {
      return NextResponse.json({ success: true }) // Silently ignore
    }

    // Validate required fields
    if (!firstName || !lastName || !attendance) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const rsvpData = {
      timestamp: new Date().toISOString(),
      language,
      firstName,
      lastName,
      email: email || "",
      phone: phone || "",
      attendance,
      notes: notes || "",
      userAgent: request.headers.get("user-agent") || "",
      sourcePage: "/rsvp",
    }

    // Submit to Google Sheets via Apps Script Web App
    const googleSheetsUrl = process.env.GOOGLE_SHEETS_RSVP_WEBHOOK_URL
    if (googleSheetsUrl) {
      // Google Apps Script returns a 302 redirect - we need to follow it
      const response = await fetch(googleSheetsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rsvpData),
        redirect: "follow",
      })
      // Google Apps Script may return 302 which becomes 200 after redirect
      // Check if response is ok or if it was a successful redirect
      if (!response.ok && response.status !== 302) {
        console.error("Google Sheets error:", response.status, await response.text())
      }
    } else {
      console.log("RSVP Submission (no webhook configured):", rsvpData)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("RSVP submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
