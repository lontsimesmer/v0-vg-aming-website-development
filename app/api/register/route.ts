import { NextRequest, NextResponse } from "next/server"

const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/B5v2sbcLstGABgVo9xIG/webhook-trigger/bab12b38-fb30-430a-8502-2bb68cb0d96d"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["fullName", "pseudo", "birthDate", "birthPlace", "phone", "level", "hasTeam", "categories"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Prepare payload for GHL webhook
    const ghlPayload = {
      // Contact Information
      fullName: body.fullName,
      firstName: body.fullName.split(" ")[0] || "",
      lastName: body.fullName.split(" ").slice(1).join(" ") || "",
      pseudo: body.pseudo,
      phone: body.phone,
      
      // Personal Details
      birthDate: body.birthDate,
      birthPlace: body.birthPlace,
      
      // Tournament Information
      howHeard: body.howHeard,
      howHeardSource: body.howHeardSource,
      level: body.level,
      hasTeam: body.hasTeam,
      categories: body.categories,
      
      // Photo (Base64)
      photo: body.photo || "",
      
      // Metadata
      language: body.language || "fr",
      submittedAt: body.submittedAt || new Date().toISOString(),
      source: "VGaming Battle Arena Registration",
      formType: "tournament_registration"
    }

    // Send to GHL Inbound Webhook
    const ghlResponse = await fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(ghlPayload)
    })

    // Check if GHL accepted the webhook
    if (!ghlResponse.ok) {
      const errorText = await ghlResponse.text()
      console.error("[v0] GHL webhook error:", errorText)
      return NextResponse.json(
        { success: false, error: "Failed to submit registration" },
        { status: 500 }
      )
    }

    // Success response
    return NextResponse.json({
      success: true,
      message: "Registration submitted successfully"
    })

  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
