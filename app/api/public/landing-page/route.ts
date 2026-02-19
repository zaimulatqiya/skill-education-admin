import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // 1. Fetch Link Test TOEFL
    const { data: toeflData, error: toeflError } = await supabase.from("link_test_toefl").select("*").order("created_at", { ascending: false }).limit(1).single();

    // 2. Fetch Link Ujian Ulang
    const { data: retakeData, error: retakeError } = await supabase.from("link_ujian_ulang").select("*").order("created_at", { ascending: false }).limit(1).single();

    // 3. Fetch Program Packages
    const { data: packagesData, error: packagesError } = await supabase.from("program_packages").select("*").order("price", { ascending: true });

    // 4. Fetch Pembelajaran Schedules
    const { data: schedulesData, error: schedulesError } = await supabase.from("pembelajaran_schedules").select("*").order("year", { ascending: true }).order("month", { ascending: true }).order("day", { ascending: true });

    // Prepare response data matching Client expectations
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
      pricing: {
        program_packages: (packagesData || []).map((pkg) => ({
          id: pkg.id,
          title: pkg.title,
          original_price: pkg.original_price,
          price: pkg.price,
          is_best_value: pkg.is_best_value,
        })),
      },
      schedules: (schedulesData || []).map((sch) => ({
        id: sch.id,
        day: sch.day,
        month: sch.month,
        year: sch.year,
      })),
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

    response.headers.set("Access-Control-Allow-Origin", "*");
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

export async function OPTIONS(request: NextRequest) {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}
