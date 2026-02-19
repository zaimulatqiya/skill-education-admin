-- 1. First, we MUST drop the existing check constraint because it compares 'month' (which we want to be text) with an integer.
-- This was causing the "operator does not exist: text >= integer" error.
ALTER TABLE public.pembelajaran_schedules
DROP CONSTRAINT IF EXISTS pembelajaran_schedules_month_check;

-- 2. Now we can safely change the column type to text.
ALTER TABLE public.pembelajaran_schedules
ALTER COLUMN month TYPE text;
