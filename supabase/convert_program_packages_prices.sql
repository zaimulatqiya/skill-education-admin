-- Clean up data: Remove non-numeric characters from price columns (except digits)
-- Note: This regex [^0-9] replaces everything that isn't a digit with empty string.
-- Warning: This assumes the existing data is in a format like "Rp 10.000" or similar.
-- If there are decimals like "10.000,00", this simplistic regex would turn it into 1000000.
-- Assuming integer representation is desired.

-- 1. Remove non-digits and cast to BIGINT for original_price
ALTER TABLE public.program_packages
ALTER COLUMN original_price TYPE BIGINT
USING (
  CASE 
    WHEN original_price IS NULL OR original_price = '' THEN 0
    ELSE regexp_replace(original_price, '[^0-9]', '', 'g')::BIGINT
  END
);

-- 2. Remove non-digits and cast to BIGINT for price
ALTER TABLE public.program_packages
ALTER COLUMN price TYPE BIGINT
USING (
  CASE 
    WHEN price IS NULL OR price = '' THEN 0
    ELSE regexp_replace(price, '[^0-9]', '', 'g')::BIGINT
  END
);
