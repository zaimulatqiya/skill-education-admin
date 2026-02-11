import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase.from("url_admin").select("*");

    if (error) {
      return NextResponse.json({ error: "Failed to fetch admin numbers", details: error.message }, { status: 500 });
    }

    // Map rows to the expected frontend structure
    const result = {
      wa_sertifikat: "",
      wa_test: "",
      wa_teknisi: "",
    };

    if (data) {
      data.forEach((row: any) => {
        if (row.role === "Sertifikat") result.wa_sertifikat = row.url || "";
        else if (row.role === "Test") result.wa_test = row.url || "";
        else if (row.role === "Teknisi") result.wa_teknisi = row.url || "";
      });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // We update each role individually
    // Using upsert would require a unique constraint on 'role', which we aren't sure of,
    // so we'll try to update first, and if that fails (though user said data exists), we might need to handle it.
    // Given the screenshot shows data exists, straightforward updates based on role are best.

    const updates = [
      supabase.from("url_admin").update({ url: body.wa_sertifikat }).eq("role", "Sertifikat"),
      supabase.from("url_admin").update({ url: body.wa_test }).eq("role", "Test"),
      supabase.from("url_admin").update({ url: body.wa_teknisi }).eq("role", "Teknisi"),
    ];

    const results = await Promise.all(updates);

    // Check for errors
    const errors = results.filter((r) => r.error).map((r) => r.error?.message);
    if (errors.length > 0) {
      return NextResponse.json({ error: "Some updates failed", details: errors }, { status: 500 });
    }

    return NextResponse.json({ message: "Saved successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
