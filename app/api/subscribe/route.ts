import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, language } = body

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const subscribeData = {
      email,
      language: language || "et",
      timestamp: new Date().toISOString(),
      source: "wedding-website",
    }

    // Option 1: Mailchimp integration
    const mailchimpApiKey = process.env.MAILCHIMP_API_KEY
    const mailchimpListId = process.env.MAILCHIMP_LIST_ID
    const mailchimpServer = process.env.MAILCHIMP_SERVER // e.g., "us21"

    if (mailchimpApiKey && mailchimpListId && mailchimpServer) {
      const response = await fetch(
        `https://${mailchimpServer}.api.mailchimp.com/3.0/lists/${mailchimpListId}/members`,
        {
          method: "POST",
          headers: {
            Authorization: `apikey ${mailchimpApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_address: email,
            status: "subscribed",
            merge_fields: {
              LANGUAGE: language || "et",
            },
            tags: ["wedding-updates"],
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        // If already subscribed, treat as success
        if (error.title === "Member Exists") {
          return NextResponse.json({ success: true, alreadySubscribed: true })
        }
        console.error("Mailchimp error:", error)
      } else {
        return NextResponse.json({ success: true })
      }
    }

    // Option 2: Google Sheets fallback
    const googleSheetsUrl = process.env.GOOGLE_SHEETS_SUBSCRIBE_WEBHOOK_URL
    if (googleSheetsUrl) {
      // Google Apps Script returns a 302 redirect - we need to follow it
      const response = await fetch(googleSheetsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscribeData),
        redirect: "follow",
      })
      if (!response.ok && response.status !== 302) {
        console.error("Google Sheets error:", response.status, await response.text())
      }
    } else {
      console.log("Subscribe (no integration configured):", subscribeData)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Subscribe error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
