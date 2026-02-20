-- Add program_type to pembelajaran_schedules
ALTER TABLE public.pembelajaran_schedules
ADD COLUMN IF NOT EXISTS program_type VARCHAR(50) DEFAULT 'toefl' NOT NULL;
