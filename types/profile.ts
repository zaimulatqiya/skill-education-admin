// Profile type definition based on database schema
export interface Profile {
  id: string; // uuid
  created_at: string; // timestamptz
  nama: string; // text
  email: string; // text
  reading: boolean; // bool
  listening: boolean; // bool
  structure: boolean; // bool
  nomor_registrasi: number | null; // int8
  nomor_whatsapp: string | null; // text
  tempat_lahir: string | null; // text
  tanggal_lahir: string | null; // date
  score_structure: number | null; // int4
  score_listening: number | null; // int4
  score_reading: number | null; // int4
  total_score: number | null; // float4
  tahun: string | null; // text
  bulan: string | null; // text
  tanggal: string | null; // text
  structure2: boolean; // bool
  listening2: boolean; // bool
  reading2: boolean; // bool
  score_listening2: number | null; // int4
  score_structure2: number | null; // int4
  score_reading2: number | null; // int4
  total_score2: number | null; // float4

  tanggal_selesai_ujian: string | null; // date
  kategori_soal: number | null; // int2
  tanggal_cetak_sertifikat?: string | null; // date
  expired_date?: string | null; // date
}

// Profile creation payload (without auto-generated fields)
export interface CreateProfilePayload {
  nama: string;
  email: string;
  reading?: boolean;
  listening?: boolean;
  structure?: boolean;
  nomor_registrasi?: number | null;
  nomor_whatsapp?: string | null;
  tempat_lahir?: string | null;
  tanggal_lahir?: string | null;
  score_structure?: number | null;
  score_listening?: number | null;
  score_reading?: number | null;
  total_score?: number | null;
  tahun?: string | null;
  bulan?: string | null;
  tanggal?: string | null;
  structure2?: boolean;
  listening2?: boolean;
  reading2?: boolean;
  score_listening2?: number | null;
  score_structure2?: number | null;
  score_reading2?: number | null;
  total_score2?: number | null;

  tanggal_selesai_ujian?: string | null;
  kategori_soal?: number | null;
  tanggal_cetak_sertifikat?: string | null;
  expired_date?: string | null;
}

// Profile update payload (all fields optional except id)
export interface UpdateProfilePayload extends Partial<CreateProfilePayload> {
  id: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: string;
  message?: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: string;
  fields?: string[];
}
