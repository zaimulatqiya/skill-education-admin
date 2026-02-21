import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/client";

export const dynamic = "force-dynamic";

// Month name to number mapping
const MONTH_MAP: Record<string, string> = {
  Januari: "1",
  Februari: "2",
  Maret: "3",
  April: "4",
  Mei: "5",
  Juni: "6",
  Juli: "7",
  Agustus: "8",
  September: "9",
  Oktober: "10",
  November: "11",
  Desember: "12",
};

// GET - Fetch profile(s)
// Query params:
//   - id (optional): fetch specific profile by ID
//   - bulan (optional): filter by month (supports both name and number)
//   - tahun (optional): filter by year
// If no params provided, returns all profiles in ascending order
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    let bulan = searchParams.get("bulan");
    const tahun = searchParams.get("tahun");
    const search = searchParams.get("search");

    if (id) {
      // Fetch specific profile by ID
      const { data, error } = await supabase.from("profile").select("*").eq("id", id).single();

      if (error) {
        return NextResponse.json({ error: "Profile not found", details: error.message }, { status: 404 });
      }

      return NextResponse.json({ data }, { status: 200 });
    } else {
      // Build query with optional filters
      let query = supabase.from("profile").select("*");
      // Apply filters if provided
      if (tahun) {
        // Filter: (tahun column matches) OR (created_at is within that year)
        const yearInt = parseInt(tahun);
        if (!isNaN(yearInt)) {
          const startYear = `${yearInt}-01-01T00:00:00.000Z`;
          const endYear = `${yearInt + 1}-01-01T00:00:00.000Z`;

          // Using raw PostgREST syntax for complex OR with AND
          // syntax: or(condition1,and(condition2,condition3))
          // IMPORTANT: with supabase-js, we need to be careful about the syntax string
          query = query.or(`tahun.eq.${tahun},and(created_at.gte.${startYear},created_at.lt.${endYear})`);
        } else {
          // Fallback if tahun is not a number (though it should be for filtering)
          query = query.eq("tahun", tahun);
        }
      }

      if (bulan) {
        // Convert month name to number if it's a name
        const monthVal = MONTH_MAP[bulan] || bulan;
        const monthInt = parseInt(monthVal);

        // Try to filter - use OR to support both formats + created_at if year is known
        // This will work whether database stores "1", "01", or "Januari"

        let orClause = `bulan.eq.${monthVal},bulan.eq.${monthVal.padStart(2, "0")},bulan.eq.${bulan}`;

        // Only add created_at filter if we have a valid year context (from tahun param)
        // AND we have a valid month number
        if (tahun && !isNaN(monthInt) && monthInt >= 1 && monthInt <= 12) {
          const yearInt = parseInt(tahun);
          if (!isNaN(yearInt)) {
            // Calculate start and end of month
            // Note: monthInt is 1-based (1=Jan)
            const startMonthDate = new Date(Date.UTC(yearInt, monthInt - 1, 1));
            // End date is start of next month
            const endMonthDate = new Date(Date.UTC(yearInt, monthInt, 1));

            const startIso = startMonthDate.toISOString();
            const endIso = endMonthDate.toISOString();

            orClause += `,and(created_at.gte.${startIso},created_at.lt.${endIso})`;
          }
        }

        query = query.or(orClause);
      }

      if (search) {
        query = query.or(`nama.ilike.%${search}%,email.ilike.%${search}%`);
      }

      // Order by created_at ascending
      query = query.order("created_at", { ascending: true });

      const { data, error } = await query;

      // total data
      console.log("count data", data?.length);
      if (error) {
        return NextResponse.json({ error: "Failed to fetch profiles", details: error.message }, { status: 500 });
      }

      return NextResponse.json({ data }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

// POST - Create new profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["nama", "email"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({ error: "Missing required fields", fields: missingFields }, { status: 400 });
    }

    // Insert new profile
    const { data, error } = await supabase
      .from("profile")
      .insert([
        {
          nama: body.nama,
          email: body.email,
          reading: body.reading || false,
          listening: body.listening || false,
          structure: body.structure || false,
          nomor_registrasi: body.nomor_registrasi || null,
          nomor_whatsapp: body.nomor_whatsapp || null,
          tempat_lahir: body.tempat_lahir || null,
          tanggal_lahir: body.tanggal_lahir || null,
          score_structure: body.score_structure || null,
          score_listening: body.score_listening || null,
          score_reading: body.score_reading || null,
          total_score: body.total_score || null,
          tahun: body.tahun || null,
          bulan: body.bulan || null,
          tanggal: body.tanggal || null,
          structure2: body.structure2 || false,
          listening2: body.listening2 || false,
          reading2: body.reading2 || false,
          score_listening2: body.score_listening2 || null,
          score_structure2: body.score_structure2 || null,
          score_reading2: body.score_reading2 || null,
          total_score2: body.total_score2 || null,

          tanggal_selesai_ujian: body.tanggal_selesai_ujian || null,
          kategori_soal: body.kategori_soal || null,
          tanggal_cetak_sertifikat: body.tanggal_cetak_sertifikat || null,
          expired_date: body.expired_date || null,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: "Failed to create profile", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Profile created successfully", data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

// PUT - Update existing profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Profile ID is required" }, { status: 400 });
    }

    // Update profile
    const { data, error } = await supabase.from("profile").update(updateData).eq("id", id).select();

    if (error) {
      return NextResponse.json({ error: "Failed to update profile", details: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated successfully", data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

// DELETE - Delete profile
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Profile ID is required" }, { status: 400 });
    }

    // Delete profile
    const { error } = await supabase.from("profile").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete profile", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Profile deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
