import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

export const dynamic = "force-dynamic";

// GET - Debug endpoint to check actual data format in database
export async function GET(request: NextRequest) {
  try {
    // Fetch a few sample profiles to see the actual format
    const { data, error } = await supabase.from("profile").select("id, nama, email, tahun, bulan").limit(10);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch debug data", details: error.message }, { status: 500 });
    }

    // Get unique years and months to see what formats are used
    const uniqueYears = [...new Set(data?.map((p) => p.tahun).filter(Boolean))];
    const uniqueMonths = [...new Set(data?.map((p) => p.bulan).filter(Boolean))];

    return NextResponse.json(
      {
        message: "Debug data from database",
        sampleData: data,
        uniqueYears,
        uniqueMonths,
        dataTypes: {
          tahun: typeof data?.[0]?.tahun,
          bulan: typeof data?.[0]?.bulan,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
