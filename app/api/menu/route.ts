import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, mainCourseChoice, allergiesAndDiet, language, honeypot } = body

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ success: true })
    }

    // Validate required fields
    if (!firstName || !lastName || !mainCourseChoice || !allergiesAndDiet) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const menuData = {
      timestamp: new Date().toISOString(),
      language,
      firstName,
      lastName,
      email: email || "",
      mainCourseChoice,
      allergiesAndDiet,
      userAgent: request.headers.get("user-agent") || "",
      sourcePage: "/menu",
    }

    // Submit to Google Sheets via Apps Script Web App
    const googleSheetsUrl = process.env.GOOGLE_SHEETS_MENU_WEBHOOK_URL
    if (googleSheetsUrl) {
      // Google Apps Script returns a 302 redirect - we need to follow it
      const response = await fetch(googleSheetsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuData),
        redirect: "follow",
      })
      if (!response.ok && response.status !== 302) {
        console.error("Google Sheets error:", response.status, await response.text())
      }
    } else {
      console.log("Menu Submission (no webhook configured):", menuData)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Menu submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
