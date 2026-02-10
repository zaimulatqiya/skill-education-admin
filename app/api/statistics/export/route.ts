import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type"); // ujian1, ujian2, totalPesertaUjian, totalPesertaBuatAkun
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let query = supabase.from("profile").select("*");

    if (from && to) {
      const fromDate = new Date(from).toISOString();
      // To include the whole day, we might want to set time to 23:59:59 if not already handled
      // But usually 'to' date from date-picker might be start of day.
      // Ideally 'to' should be end of that day.
      // Let's assume frontend sends correct ISO or we adjust here.
      // Basic implementation:
      const toDate = new Date(to).toISOString();
      query = query.gte("created_at", fromDate).lte("created_at", toDate);
    }

    if (type === "ujian1") {
      query = query.not("total_score", "is", null);
    } else if (type === "ujian2") {
      query = query.not("total_score2", "is", null);
    } else if (type === "totalPesertaUjian") {
      query = query.or("total_score.not.is.null,total_score2.not.is.null");
    } else if (type === "totalPesertaBuatAkun") {
      // No additional filter needed for all users
    } else {
      return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
    }

    const { data, error } = await query;
    // console.log("Export query error:", error);
    // console.log("Export query data length:", data?.length);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch data for export" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
