import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const requestedExamId = searchParams.get("id"); // e.g., "1", "2", "3", "4"

    // Fetch the single configuration row from 'soal'
    // We assume there's only one row that controls the active exam state.
    const { data, error } = await supabase.from("soal").select("*").limit(1).single();

    if (error) {
      return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
    }

    if (!data) {
      // Should not happen based on screenshot, but handle gracefully
      return NextResponse.json({ is_active: false, debug: "No data in soal table" });
    }

    // Logic:
    // data.random contains the ID of the currently 'selected' or 'active' exam.
    // data.soal_aktif is the global switch.

    // If we are asking about a specific exam ID:
    if (requestedExamId) {
      // The exam is active IF:
      // 1. The global switch is ON (true)
      // 2. AND the active exam in DB matches the requested ID
      const isActive = data.soal_aktif && String(data.random) === String(requestedExamId);
      return NextResponse.json({ is_active: isActive });
    }

    // If no specific ID requested, return raw state (optional usage)
    return NextResponse.json({
      current_active_exam: String(data.random),
      is_global_active: data.soal_aktif,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, is_active } = body; // id is the exam number (e.g. "4"), is_active is boolean

    if (!id) {
      return NextResponse.json({ error: "Exam ID is required" }, { status: 400 });
    }

    // We need to update the single configuration row.
    // Since we don't know the exact Primary Key (id) from the request (it's 1 in screenshot),
    // we should first fetch it or just assume we update the first row if we can't target by PK.
    // Ideally, we target where currently existing id exists, but easier is to update the single known row.
    // Let's assume we update row with id=1 based on the screenshot, or we can use a trick if ID is unknown.
    // But standard practice for single-row config is to have a known ID. Let's assume ID=1.
    // If that fails, we can try to fetch the first ID.

    // Better approach: Fetch the first row's ID, then update it.
    const { data: current, error: fetchError } = await supabase.from("soal").select("id").limit(1).single();

    if (fetchError || !current) {
      return NextResponse.json({ error: "Configuration row not found in 'soal' table." }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("soal")
      .update({
        random: parseInt(id), // Update the active exam number
        soal_aktif: is_active, // Update the active status
      })
      .eq("id", current.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update status", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Status updated", data });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
