import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const GHL_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/B5v2sbcLstGABgVo9xIG/webhook-trigger/62b3b92c-fd4b-4af4-a536-ade5c787b96c";

const isValidUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const isSupabaseConfigValid = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return isValidUrl(url) && key !== "";
};

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigValid()) {
      return NextResponse.json(
        {
          error: "Supabase environment is not configured or invalid",
          details:
            "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY with valid values",
        },
        { status: 503 },
      );
    }

    const supabase = await createClient();
    const body = await request.json();
    const ids = Array.isArray(body.ids)
      ? body.ids.filter(
          (id: unknown): id is string =>
            typeof id === "string" && id.trim() !== "",
        )
      : [];

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "Missing enrollment id(s) to retry" },
        { status: 400 },
      );
    }

    const { data: enrollments, error: enrollmentsError } = await supabase
      .from("enrollments")
      .select(
        `
          id,
          full_name,
          pseudo,
          birth_date,
          birth_place,
          how_heard,
          how_heard_source,
          photo_url,
          phone,
          level,
          has_team,
          categories,
          language
        `,
      )
      .in("id", ids);

    if (enrollmentsError) {
      console.error(
        "[v0] Failed to fetch enrollments for retry:",
        enrollmentsError,
      );
      return NextResponse.json(
        {
          error: "Failed to retrieve enrollments for retry",
          details: enrollmentsError.message,
        },
        { status: 500 },
      );
    }

    const enrollmentMap = new Map(
      enrollments.map((enrollment) => [enrollment.id, enrollment]),
    );

    const results: Array<{
      id: string;
      success: boolean;
      status: string;
      error?: string;
    }> = [];

    for (const id of ids) {
      const enrollment = enrollmentMap.get(id);
      if (!enrollment) {
        results.push({
          id,
          success: false,
          status: "failed",
          error: "Enrollment not found",
        });
        continue;
      }

      const webhookPayload = {
        fullName: enrollment.full_name,
        pseudo: enrollment.pseudo,
        birthDate: enrollment.birth_date,
        birthPlace: enrollment.birth_place,
        howHeard: enrollment.how_heard,
        howHeardSource: enrollment.how_heard_source,
        photo: enrollment.photo_url,
        phone: enrollment.phone,
        level: enrollment.level,
        hasTeam: enrollment.has_team,
        categories: enrollment.categories,
        language: enrollment.language,
        submittedAt: new Date().toISOString(),
        enrollmentId: enrollment.id,
      };

      let ghlSuccess = false;
      let ghlResponseStatus = "unknown";
      let ghlResponseBody = "";
      let ghlErrorMessage = "";

      try {
        const ghlResponse = await fetch(GHL_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(webhookPayload),
        });

        ghlResponseStatus = ghlResponse.status.toString();
        ghlSuccess = ghlResponse.ok;

        try {
          ghlResponseBody = await ghlResponse.text();
        } catch {
          ghlResponseBody = "Could not read response body";
        }
      } catch (webhookError) {
        ghlErrorMessage =
          webhookError instanceof Error
            ? webhookError.message
            : "Unknown webhook error";
        console.error("[v0] GHL retry webhook error:", ghlErrorMessage);
      }

      const { error: logError } = await supabase
        .from("ghl_execution_logs")
        .insert({
          enrollment_id: enrollment.id,
          webhook_url: GHL_WEBHOOK_URL,
          request_payload: webhookPayload,
          response_status: ghlResponseStatus,
          response_body: ghlResponseBody,
          success: ghlSuccess,
          error_message: ghlErrorMessage || null,
          executed_at: new Date().toISOString(),
        });

      if (logError) {
        console.error("[v0] Retry GHL log insert error:", logError);
      }

      results.push({
        id: enrollment.id,
        success: ghlSuccess,
        status: ghlSuccess ? "synced" : "failed",
        error: ghlErrorMessage || undefined,
      });
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[v0] Enrollment retry API error:", errorMessage);
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 },
    );
  }
}
