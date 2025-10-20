-- Fix the SECURITY DEFINER view issue by explicitly setting SECURITY INVOKER
DROP VIEW IF EXISTS public.public_hazards;

CREATE OR REPLACE VIEW public.public_hazards
WITH (security_invoker = true)
AS
SELECT 
  id,
  hazard_type,
  location_lat,
  location_lng,
  severity,
  description,
  created_at
FROM public.hazard_reports;