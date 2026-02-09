import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

export const dynamic = "force-dynamic";

// GET - Fetch link ujian ulang
// Returns the first (and should be only) record
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase.from("link_ujian_ulang").select("*").order("created_at", { ascending: false }).limit(1).single();

    if (error) {
      // If no data exists yet, return empty structure
      if (error.code === "PGRST116") {
        return NextResponse.json(
          {
            data: {
              id: null,
              postingan_instagram: "",
              akun_instagram: "",
              grup: "",
            },
          },
          { status: 200 },
        );
      }
      return NextResponse.json({ error: "Failed to fetch link", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

// POST - Create new link ujian ulang
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("POST /api/link/ujian-ulang - Request body:", body);

    // Validate required fields
    const requiredFields = ["postingan_instagram", "akun_instagram", "grup"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields);
      return NextResponse.json({ error: "Missing required fields", fields: missingFields }, { status: 400 });
    }

    // Insert new link
    const { data, error } = await supabase
      .from("link_ujian_ulang")
      .insert([
        {
          postingan_instagram: body.postingan_instagram,
          akun_instagram: body.akun_instagram,
          grup: body.grup,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to create link", details: error.message, code: error.code }, { status: 500 });
    }

    console.log("Link created successfully:", data);
    return NextResponse.json({ message: "Link created successfully", data }, { status: 201 });
  } catch (error) {
    console.error("POST /api/link/ujian-ulang error:", error);
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

// PUT - Update existing link ujian ulang
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Link ID is required" }, { status: 400 });
    }

    // Update link
    const { data, error } = await supabase.from("link_ujian_ulang").update(updateData).eq("id", id).select();

    if (error) {
      return NextResponse.json({ error: "Failed to update link", details: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Link updated successfully", data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

// DELETE - Delete link ujian ulang
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Link ID is required" }, { status: 400 });
    }

    // Delete link
    const { error } = await supabase.from("link_ujian_ulang").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete link", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Link deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
