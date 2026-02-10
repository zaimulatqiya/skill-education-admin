import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let queryBuatAkun = supabase.from("profile").select("id", { count: "exact", head: true });
    let queryUjian1 = supabase.from("profile").select("id", { count: "exact", head: true }).not("total_score", "is", null);
    let queryUjian2 = supabase.from("profile").select("id", { count: "exact", head: true }).not("total_score2", "is", null);

    // For Total Peserta Ujian - distinct users who have taken AT LEAST one exam (1 or 2)
    // Supabase doesn't easily support OR across columns for count in one go without raw SQL or multiple queries.
    // However, we can use the 'or' filter: .or('total_score.not.is.null,total_score2.not.is.null')
    let queryTotalPesertaUjian = supabase.from("profile").select("id", { count: "exact", head: true }).or("total_score.not.is.null,total_score2.not.is.null");

    if (from && to) {
      // Adjust to end of day for 'to' date if needed, but assuming ISO strings from frontend
      // typically from frontend: 2024-01-01T00:00:00.000Z
      const fromDate = new Date(from).toISOString();
      const toDate = new Date(to).toISOString();

      queryBuatAkun = queryBuatAkun.gte("created_at", fromDate).lte("created_at", toDate);
      queryUjian1 = queryUjian1.gte("created_at", fromDate).lte("created_at", toDate);
      queryUjian2 = queryUjian2.gte("created_at", fromDate).lte("created_at", toDate);
      queryTotalPesertaUjian = queryTotalPesertaUjian.gte("created_at", fromDate).lte("created_at", toDate);
    }

    const [{ count: countBuatAkun, error: errorBuatAkun }, { count: countUjian1, error: errorUjian1 }, { count: countUjian2, error: errorUjian2 }, { count: countTotalPesertaUjian, error: errorTotalPesertaUjian }] = await Promise.all([
      queryBuatAkun,
      queryUjian1,
      queryUjian2,
      queryTotalPesertaUjian,
    ]);

    if (errorBuatAkun || errorUjian1 || errorUjian2 || errorTotalPesertaUjian) {
      console.error("Error fetching statistics:", errorBuatAkun, errorUjian1, errorUjian2, errorTotalPesertaUjian);
      return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 });
    }

    return NextResponse.json(
      {
        data: {
          ujian1: countUjian1 || 0,
          ujian2: countUjian2 || 0,
          totalPesertaUjian: countTotalPesertaUjian || 0,
          totalPesertaBuatAkun: countBuatAkun || 0,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
