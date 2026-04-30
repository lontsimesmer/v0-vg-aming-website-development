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
    console.log("[v0] POST /api/enrollment called");
    if (!isSupabaseConfigValid()) {
      console.error("[v0] Supabase config invalid");
      return NextResponse.json(
        {
          error: "Supabase environment is not configured or invalid",
          details:
            "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY with valid values in .env.local",
        },
        { status: 503 },
      );
    }

    const supabase = await createClient();
    const data = await request.json();
    console.log("[v0] Received data:", Object.keys(data));

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
      .single();

    if (enrollmentError) {
      console.error("[v0] Enrollment insert error:", enrollmentError);
      return NextResponse.json(
        {
          error: "Failed to save enrollment",
          details: enrollmentError.message,
          code: enrollmentError.code,
          hint: enrollmentError.hint,
        },
        { status: 500 },
      );
    }

    console.log("[v0] Enrollment inserted:", enrollment.id);

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
    };

    // Send to GHL webhook
    let ghlSuccess = false;
    let ghlResponseStatus = "unknown";
    let ghlResponseBody = "";
    let ghlErrorMessage = "";

    try {
      const ghlResponse = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      console.error("[v0] GHL webhook error:", ghlErrorMessage);
    }

    // Log GHL execution
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
      console.error("[v0] GHL log insert error:", logError);
    }

    return NextResponse.json({
      success: true,
      enrollmentId: enrollment.id,
      ghlStatus: ghlSuccess ? "sent" : "failed",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[v0] Enrollment API error:", errorMessage);
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isSupabaseConfigValid()) {
      return NextResponse.json(
        {
          error: "Supabase environment is not configured or invalid",
        },
        { status: 503 },
      );
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const ids = searchParams.getAll("id");

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "Missing enrollment id(s) to delete" },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("enrollments").delete().in("id", ids);

    if (error) {
      console.error("[v0] Enrollment delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete enrollment", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, deletedIds: ids });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[v0] Enrollment DELETE error:", errorMessage);
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!isSupabaseConfigValid()) {
      return NextResponse.json(
        {
          error: "Supabase environment is not configured or invalid",
        },
        { status: 503 },
      );
    }

    const supabase = await createClient();
    const data = await request.json();
    const { id, ...updateFields } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Missing enrollment id to update" },
        { status: 400 },
      );
    }

    const { data: updatedEnrollment, error } = await supabase
      .from("enrollments")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[v0] Enrollment update error:", error);
      return NextResponse.json(
        { error: "Failed to update enrollment", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, enrollment: updatedEnrollment });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[v0] Enrollment PATCH error:", errorMessage);
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigValid()) {
      console.error("[v0] Supabase config invalid");
      return NextResponse.json(
        {
          error: "Supabase not configured",
          details:
            "Missing or invalid NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
        },
        { status: 503 },
      );
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "50", 10),
      100,
    );
    const offset = (page - 1) * limit;
    console.log(
      `[v0] Fetching enrollments: page=${page}, limit=${limit}, offset=${offset}`,
    );
    // First, fetch enrollments with pagination
    const {
      data: enrollmentsData,
      error: enrollmentsError,
      count,
    } = await supabase
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
        language,
        created_at
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (enrollmentsError) {
      console.error("[v0] Supabase query error:", enrollmentsError);
      return NextResponse.json(
        {
          error: "Failed to fetch enrollments",
          details: enrollmentsError.message,
          code: enrollmentsError.code,
        },
        { status: 500 },
      );
    }

    if (!enrollmentsData || !Array.isArray(enrollmentsData)) {
      console.error("[v0] Invalid enrollments response:", enrollmentsData);
      return NextResponse.json(
        { error: "Invalid enrollments data" },
        { status: 500 },
      );
    }

    // Get enrollment IDs for the current page
    const enrollmentIds = enrollmentsData.map((e) => e.id);

    // Fetch the GHL logs for enrollments in the current page only
    let logsData: any[] | null = [];
    let logsError: any = null;

    if (enrollmentIds.length > 0) {
      const logsResult = await supabase
        .from("ghl_execution_logs")
        .select(
          `
          id,
          enrollment_id,
          webhook_url,
          request_payload,
          response_status,
          response_body,
          success,
          error_message,
          executed_at
        `,
        )
        .in("enrollment_id", enrollmentIds)
        .order("executed_at", { ascending: false });

      logsData = logsResult.data || [];
      logsError = logsResult.error;
      console.log(
        `[v0] Fetched ${logsData.length} logs for ${enrollmentIds.length} enrollments`,
      );
      if (logsData.length > 0) {
        console.log("[v0] Sample log:", logsData[0]);
      }
    }

    if (logsError) {
      console.error("[v0] GHL logs query error:", logsError);
      // Don't fail the request if logs fail, just return empty logs
    }

    // Group logs by enrollment_id
    const logsByEnrollment: Record<string, any[]> = {};
    if (logsData) {
      for (const log of logsData) {
        if (!logsByEnrollment[log.enrollment_id]) {
          logsByEnrollment[log.enrollment_id] = [];
        }
        logsByEnrollment[log.enrollment_id].push(log);
      }
    }
    console.log(
      `[v0] Grouped logs: ${Object.keys(logsByEnrollment).length} enrollments have logs`,
    );

    // Efficiently get global stats by counting distinct enrollments
    // Successful: enrollments with at least one successful log
    const { data: successfulEnrollments, error: successfulError } =
      await supabase
        .from("ghl_execution_logs")
        .select("enrollment_id", { count: "exact" })
        .eq("success", true);

    // Failed: enrollments with failed logs but no successful logs
    const { data: failedEnrollments, error: failedError } = await supabase.from(
      "ghl_execution_logs",
    ).select(`
        enrollment_id,
        success
      `);

    // Calculate stats from the data
    const successfulIds = new Set(
      successfulEnrollments?.map((log) => log.enrollment_id) || [],
    );
    const totalSuccessful = successfulIds.size;

    // Failed are enrollments that have failed logs but are not in successful
    const failedIds = new Set();
    if (failedEnrollments) {
      for (const log of failedEnrollments) {
        if (!log.success && !successfulIds.has(log.enrollment_id)) {
          failedIds.add(log.enrollment_id);
        }
      }
    }
    const totalFailed = failedIds.size;

    // Calculate pending: enrollments with no logs at all
    const totalPending = (count || 0) - totalSuccessful - totalFailed;
    const enrollments = enrollmentsData.map((enrollment) => ({
      ...enrollment,
      ghl_execution_logs: logsByEnrollment[enrollment.id] || [],
    }));
    console.log(`[v0] Successfully fetched ${enrollments.length} enrollments`);
    return NextResponse.json({
      enrollments,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit),
      },
      stats: {
        totalEnrollments: count || 0,
        successfulSyncs: totalSuccessful,
        failedSyncs: totalFailed,
        pendingSyncs: Math.max(totalPending, 0),
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[v0] Enrollment API GET error:", errorMessage, error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
