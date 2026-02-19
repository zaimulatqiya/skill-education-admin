import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

export const dynamic = "force-dynamic";

// Helper for standardized error response
const errorResponse = (message: string, details: any = null, status: number = 500) => {
  return NextResponse.json({ error: message, details }, { status });
};

// GET - Fetch all packages
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase.from("program_packages").select("*").order("id", { ascending: true });

    if (error) {
      return errorResponse("Failed to fetch packages", error.message);
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return errorResponse("Internal server error", error instanceof Error ? error.message : "Unknown error");
  }
}

// POST - Create new package
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, originalPrice, price, isBestValue } = body;

    if (!title || originalPrice === undefined || price === undefined) {
      return errorResponse("Missing required fields", null, 400);
    }

    // Using .select() to return the created data and confirm insert success
    const { data, error } = await supabase
      .from("program_packages")
      .insert([
        {
          title,
          original_price: originalPrice,
          price,
          is_best_value: isBestValue || false,
        },
      ])
      .select();

    if (error) {
      return errorResponse("Failed to create package", error.message);
    }

    if (!data || data.length === 0) {
      return errorResponse("Failed to create package: Access denied or data not returned", null, 403);
    }

    return NextResponse.json({ message: "Package created successfully", data }, { status: 201 });
  } catch (error) {
    return errorResponse("Internal server error", error instanceof Error ? error.message : "Unknown error");
  }
}

// PUT - Update existing package
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, originalPrice, price, isBestValue } = body;

    if (!id) {
      return errorResponse("Package ID is required", null, 400);
    }

    // Using .select() to verify the update happened
    const { data, error } = await supabase
      .from("program_packages")
      .update({
        title,
        original_price: originalPrice,
        price,
        is_best_value: isBestValue,
      })
      .eq("id", id)
      .select();

    if (error) {
      return errorResponse("Failed to update package", error.message);
    }

    if (!data || data.length === 0) {
      return errorResponse("Update failed: Record not found or access denied", null, 404);
    }

    return NextResponse.json({ message: "Package updated successfully", data }, { status: 200 });
  } catch (error) {
    return errorResponse("Internal server error", error instanceof Error ? error.message : "Unknown error");
  }
}

// DELETE - Delete package
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return errorResponse("Package ID is required", null, 400);
    }

    // Using .select() to verify deletion
    const { data, error } = await supabase.from("program_packages").delete().eq("id", id).select();

    if (error) {
      return errorResponse("Failed to delete package", error.message);
    }

    if (!data || data.length === 0) {
      return errorResponse("Delete failed: Record not found or access denied", null, 404);
    }

    return NextResponse.json({ message: "Package deleted successfully" }, { status: 200 });
  } catch (error) {
    return errorResponse("Internal server error", error instanceof Error ? error.message : "Unknown error");
  }
}
