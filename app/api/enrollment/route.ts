import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/B5v2sbcLstGABgVo9xIG/webhook-trigger/62b3b92c-fd4b-4af4-a536-ade5c787b96c"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const data = await request.json()

    // Insert enrollment into database
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .insert({
        full_name: data.fullName,
        pseudo: data.pseudo,
        birth_date: data.birthDate,
        birth_place: data.birthPlace,
        how_heard: data.howHeard,
        how_heard_source: data.howHeardSource,
        photo_url: data.photo ? "photo_attached" : null,
        phone: data.phone,
        level: data.level,
        has_team: data.hasTeam,
        categories: data.categories,
        language: data.language,
      })
      .select()
      .single()

    if (enrollmentError) {
      console.error("[v0] Enrollment insert error:", enrollmentError)
      return NextResponse.json(
        { error: "Failed to save enrollment", details: enrollmentError.message },
        { status: 500 }
      )
    }

    // Prepare webhook payload
    const webhookPayload = {
      fullName: data.fullName,
      pseudo: data.pseudo,
      birthDate: data.birthDate,
      birthPlace: data.birthPlace,
      howHeard: data.howHeard,
      howHeardSource: data.howHeardSource,
      photo: data.photo,
      phone: data.phone,
      level: data.level,
      hasTeam: data.hasTeam,
      categories: data.categories,
      language: data.language,
      submittedAt: new Date().toISOString(),
      enrollmentId: enrollment.id,
    }

    // Send to GHL webhook
    let ghlSuccess = false
    let ghlResponseStatus = "unknown"
    let ghlResponseBody = ""
    let ghlErrorMessage = ""

    try {
      const ghlResponse = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookPayload),
      })

      ghlResponseStatus = ghlResponse.status.toString()
      ghlSuccess = ghlResponse.ok
      
      try {
        ghlResponseBody = await ghlResponse.text()
      } catch {
        ghlResponseBody = "Could not read response body"
      }
    } catch (webhookError) {
      ghlErrorMessage = webhookError instanceof Error ? webhookError.message : "Unknown webhook error"
      console.error("[v0] GHL webhook error:", ghlErrorMessage)
    }

    // Log GHL execution
    const { error: logError } = await supabase.from("ghl_execution_logs").insert({
      enrollment_id: enrollment.id,
      webhook_url: GHL_WEBHOOK_URL,
      request_payload: webhookPayload,
      response_status: ghlResponseStatus,
      response_body: ghlResponseBody,
      success: ghlSuccess,
      error_message: ghlErrorMessage || null,
    })

    if (logError) {
      console.error("[v0] GHL log insert error:", logError)
    }

    return NextResponse.json({
      success: true,
      enrollmentId: enrollment.id,
      ghlStatus: ghlSuccess ? "sent" : "failed",
    })
  } catch (error) {
    console.error("[v0] Enrollment API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    // Get all enrollments with their GHL logs
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from("enrollments")
      .select(`
        *,
        ghl_execution_logs (*)
      `)
      .order("created_at", { ascending: false })

    if (enrollmentsError) {
      console.error("[v0] Enrollments fetch error:", enrollmentsError)
      return NextResponse.json(
        { error: "Failed to fetch enrollments" },
        { status: 500 }
      )
    }

    return NextResponse.json({ enrollments })
  } catch (error) {
    console.error("[v0] Enrollment GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
