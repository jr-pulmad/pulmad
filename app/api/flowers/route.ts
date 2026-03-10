import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, language } = body

    // Validate amount
    const numAmount = Number.parseFloat(amount)
    if (isNaN(numAmount) || numAmount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com"
    const reference = `FLOWERS-${Date.now()}`

    // Maksekeskus integration
    const maksekeskusApiKey = process.env.MAKSEKESKUS_API_KEY
    const maksekeskusShopId = process.env.MAKSEKESKUS_SHOP_ID

    if (maksekeskusApiKey && maksekeskusShopId) {
      const response = await fetch("https://api.maksekeskus.ee/v1/transactions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${maksekeskusApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shop: maksekeskusShopId,
          transaction: {
            amount: numAmount.toFixed(2),
            currency: "EUR",
            reference: reference,
          },
          customer: {
            email: "flowers@wedding.ee",
            country: "EE",
            locale: language === "et" ? "et" : "en",
          },
          return_url: {
            url: `${baseUrl}/flowers/success`,
            method: "GET",
          },
          cancel_url: {
            url: `${baseUrl}/flowers?cancelled=true`,
            method: "GET",
          },
          notification_url: {
            url: `${baseUrl}/api/flowers/webhook`,
            method: "POST",
          },
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({
          success: true,
          paymentUrl: data.transaction?.url || data.url,
        })
      } else {
        console.error("Maksekeskus error:", await response.text())
      }
    }

    // Fallback: Log and return demo message
    console.log("Flower donation initiated (no payment provider configured):", {
      amount: numAmount,
      currency: "EUR",
      reference,
      language,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "Payment integration pending - please configure MAKSEKESKUS_API_KEY and MAKSEKESKUS_SHOP_ID",
    })
  } catch (error) {
    console.error("Flowers payment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
