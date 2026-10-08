import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, message, honeypot, language: submittedLanguage } = await request.json()
    const language = submittedLanguage === "en" ? "en" : "et"

    if (honeypot) return NextResponse.json({ success: true })
    if (!message?.trim()) return NextResponse.json({ error: "Message is required" }, { status: 400 })

    const submissionData = {
      timestamp: new Date().toISOString(),
      language,
      userAgent: request.headers.get("user-agent") || "",
      mainGuest: {
        firstName: name?.trim() || "Anonüümne külaline",
        lastName: "",
        email: email?.trim() || "",
        phone: "",
        attendance: "feedback",
        transport: "",
        notes: message.trim(),
        starterChoice: "",
        mainCourseChoice: "",
        allergiesAndDiet: "",
      },
      additionalGuests: [],
      totalGuests: 1,
    }

    const webhookUrl = process.env.GOOGLE_SHEETS_RSVP_WEBHOOK_URL
    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
        redirect: "follow",
      })
      if (!response.ok && response.status !== 302) {
        console.error("Feedback webhook error:", response.status, await response.text())
      }
    } else {
      console.log("Feedback submission (no webhook configured):", JSON.stringify(submissionData))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Feedback submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
