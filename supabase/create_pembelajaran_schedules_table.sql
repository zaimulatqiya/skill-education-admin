-- Create table for pembelajaran schedules
CREATE TABLE IF NOT EXISTS public.pembelajaran_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    day INTEGER NOT NULL CHECK (day >= 1 AND day <= 31),
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.pembelajaran_schedules ENABLE ROW LEVEL SECURITY;

-- Create policies for access control (Public read/write for now as requested for simplicity, but ideally authenticated)
-- Allow public read access
CREATE POLICY "Allow public select" ON public.pembelajaran_schedules FOR SELECT USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert" ON public.pembelajaran_schedules FOR INSERT WITH CHECK (true);

-- Allow public update access
CREATE POLICY "Allow public update" ON public.pembelajaran_schedules FOR UPDATE USING (true);

-- Allow public delete access
CREATE POLICY "Allow public delete" ON public.pembelajaran_schedules FOR DELETE USING (true);
