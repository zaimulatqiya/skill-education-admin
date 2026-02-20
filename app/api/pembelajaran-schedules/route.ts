import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

export const dynamic = "force-dynamic";

// Helper for standardized error response
const errorResponse = (message: string, details: any = null, status: number = 500) => {
  return NextResponse.json({ error: message, details }, { status });
};

// GET - Fetch all schedules
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase.from("pembelajaran_schedules").select("*").order("created_at", { ascending: false });

    if (error) {
      return errorResponse("Failed to fetch schedules", error.message);
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return errorResponse("Internal server error", error.message || "Unknown error");
  }
}

// POST - Create new schedule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { day, month, year, program_type = "toefl" } = body;

    if (!day || !month || !year) {
      return errorResponse("Missing required fields (day, month, year)", null, 400);
    }

    // Insert into DB
    const { data, error } = await supabase
      .from("pembelajaran_schedules")
      .insert([
        {
          day: parseInt(day),
          month: month, // Store directly as string
          year: parseInt(year),
          program_type: program_type,
        },
      ])
      .select();

    if (error) {
      return errorResponse("Failed to create schedule", error.message);
    }

    return NextResponse.json({ message: "Schedule created successfully", data }, { status: 201 });
  } catch (error: any) {
    return errorResponse("Internal server error", error.message || "Unknown error");
  }
}

// PUT - Update existing schedule
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, day, month, year, program_type } = body;

    if (!id) {
      return errorResponse("Schedule ID is required", null, 400);
    }

    // Prepare update object
    const updateData: any = {
      day: parseInt(day),
      month: month, // Store directly as string
      year: parseInt(year),
    };
    if (program_type) updateData.program_type = program_type;

    // Update in DB
    const { data, error } = await supabase.from("pembelajaran_schedules").update(updateData).eq("id", id).select();

    if (error) {
      return errorResponse("Failed to update schedule", error.message);
    }

    if (!data || data.length === 0) {
      return errorResponse("Update failed: Record not found", null, 404);
    }

    return NextResponse.json({ message: "Schedule updated successfully", data }, { status: 200 });
  } catch (error: any) {
    return errorResponse("Internal server error", error.message || "Unknown error");
  }
}

// DELETE - Delete schedule
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return errorResponse("Schedule ID is required", null, 400);
    }

    // Delete from DB
    const { data, error } = await supabase.from("pembelajaran_schedules").delete().eq("id", id).select();

    if (error) {
      return errorResponse("Failed to delete schedule", error.message);
    }

    if (!data || data.length === 0) {
      return errorResponse("Delete failed: Record not found", null, 404);
    }

    return NextResponse.json({ message: "Schedule deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return errorResponse("Internal server error", error.message || "Unknown error");
  }
}
