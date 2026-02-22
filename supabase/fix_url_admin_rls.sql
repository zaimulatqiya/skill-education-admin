-- FIX SCRIPT: Membuka akses tabel url_admin agar bisa dibaca dan diedit
-- Jalankan script ini di SQL Editor Supabase untuk memperbaiki masalah data tidak muncul di Nomor Admin

-- 1. Pastikan tabelnya memiliki RLS yang aktif
ALTER TABLE public.url_admin ENABLE ROW LEVEL SECURITY;

-- 2. Hapus policy lama jika ada yang terlalu ketat (hanya authenticated)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.url_admin;
DROP POLICY IF EXISTS "Enable full access for all users" ON public.url_admin;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.url_admin;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.url_admin;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.url_admin;

-- 3. Buat policy baru (Full Access Public) yang mengizinkan SELECT, INSERT, UPDATE, DELETE untuk semua user
CREATE POLICY "Enable full access for all users" ON public.url_admin
  FOR ALL USING (true) WITH CHECK (true);
