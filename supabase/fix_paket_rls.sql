-- FIX SCRIPT: Membuka akses tabel program_packages agar bisa diedit tanpa login (Public)
-- Jalankan script ini di SQL Editor Supabase untuk memperbaiki masalah "Gagal Hapus" / "Ghost Delete"

-- 1. Hapus Policy Lama yang terlalu ketat (hanya authenticated)
drop policy if exists "Enable read access for all users" on public.program_packages;
drop policy if exists "Enable insert for authenticated users only" on public.program_packages;
drop policy if exists "Enable update for authenticated users only" on public.program_packages;
drop policy if exists "Enable delete for authenticated users only" on public.program_packages;
drop policy if exists "Enable write access for authenticated users only" on public.program_packages;

-- 2. Buat Policy Baru (Full Access Public)
-- Ini mengizinkan SELECT, INSERT, UPDATE, DELETE untuk semua user (termasuk anonim)
create policy "Enable full access for all users" on public.program_packages
  for all using (true) with check (true);
