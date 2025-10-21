-- Drop the problematic view since it's triggering false positives
DROP VIEW IF EXISTS public.public_hazards CASCADE;

-- The SECURITY DEFINER function already provides safe access to hazard data
-- No additional changes needed - the get_public_hazards() function is already configured correctly