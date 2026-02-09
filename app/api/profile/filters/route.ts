import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

export const dynamic = "force-dynamic";

// GET - Fetch unique years and months from profiles
export async function GET(request: NextRequest) {
  try {
    // Fetch all profiles to get unique years and months
    const { data, error } = await supabase.from("profile").select("tahun, bulan").order("tahun", { ascending: true });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch filter options", details: error.message }, { status: 500 });
    }

    // Extract unique years and months
    const uniqueYears = [...new Set(data?.map((p) => p.tahun).filter(Boolean))].sort();
    const uniqueMonths = [...new Set(data?.map((p) => p.bulan).filter(Boolean))];

    return NextResponse.json(
      {
        data: {
          years: uniqueYears,
          months: uniqueMonths,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
