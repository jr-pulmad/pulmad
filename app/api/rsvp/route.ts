import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      language,
      honeypot,
      // Main guest RSVP info
      mainGuest,
      // Additional guests with their menu choices
      additionalGuests,
    } = body

    // Honeypot check - if this field is filled, it's likely a bot
    if (honeypot) {
      return NextResponse.json({ success: true }) // Silently ignore
    }

    // Validate required fields
    if (!mainGuest?.firstName || !mainGuest?.lastName || !mainGuest?.attendance) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const timestamp = new Date().toISOString()
    const userAgent = request.headers.get("user-agent") || ""

    // Build the unified submission data
    const submissionData = {
      timestamp,
      language,
      userAgent,
      
      // Main guest RSVP data
      mainGuest: {
        firstName: mainGuest.firstName,
        lastName: mainGuest.lastName,
        email: mainGuest.email || "",
        phone: mainGuest.phone || "",
        attendance: mainGuest.attendance,
        transport: mainGuest.transport || "",
        notes: mainGuest.notes || "",
        // Menu data (only if attending reception)
        starterChoice: mainGuest.starterChoice || "",
        mainCourseChoice: mainGuest.mainCourseChoice || "",
        allergiesAndDiet: mainGuest.allergiesAndDiet || "",
      },
      
      // Additional guests with their menu choices
      additionalGuests: (additionalGuests || []).map((guest: {
        firstName: string
        lastName: string
        starterChoice?: string
        mainCourseChoice?: string
        allergiesAndDiet?: string
      }) => ({
        firstName: guest.firstName,
        lastName: guest.lastName,
        starterChoice: guest.starterChoice || "",
        mainCourseChoice: guest.mainCourseChoice || "",
        allergiesAndDiet: guest.allergiesAndDiet || "",
      })),
      
      // Metadata
      totalGuests: 1 + (additionalGuests?.length || 0),
    }

    // Submit to Google Sheets via Apps Script Web App
    const googleSheetsUrl = process.env.GOOGLE_SHEETS_RSVP_WEBHOOK_URL
    if (googleSheetsUrl) {
      const response = await fetch(googleSheetsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
        redirect: "follow",
      })
      if (!response.ok && response.status !== 302) {
        console.error("Google Sheets error:", response.status, await response.text())
      }
    } else {
      console.log("RSVP Submission (no webhook configured):", JSON.stringify(submissionData, null, 2))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("RSVP submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
