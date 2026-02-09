import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // 1. Fetch Link Test TOEFL
    const { data: toeflData, error: toeflError } = await supabase.from("link_test_toefl").select("*").order("created_at", { ascending: false }).limit(1).single();

    // 2. Fetch Link Ujian Ulang
    const { data: retakeData, error: retakeError } = await supabase.from("link_ujian_ulang").select("*").order("created_at", { ascending: false }).limit(1).single();

    // Prepare response data
    // Use default empty strings if data is missing/error (graceful fallback)
    const responseData = {
      test_toefl: {
        whatsapp: toeflData?.saluran_whatsapp || "",
        telegram: toeflData?.saluran_telegram || "",
        group: toeflData?.grup || "",
      },
      ujian_ulang: {
        instagram_post: retakeData?.postingan_instagram || "",
        instagram_account: retakeData?.akun_instagram || "",
        group: retakeData?.grup || "",
      },
      timestamp: new Date().toISOString(),
    };

    // Create response with CORS headers
    const response = NextResponse.json(
      {
        success: true,
        data: responseData,
      },
      { status: 200 },
    );

    // Add CORS headers to allow access from any domain (or restrict to your landing page domain)
    response.headers.set("Access-Control-Allow-Origin", "*"); // Change '*' to your landing page URL for better security
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return response;
  } catch (error) {
    console.error("Public API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}
