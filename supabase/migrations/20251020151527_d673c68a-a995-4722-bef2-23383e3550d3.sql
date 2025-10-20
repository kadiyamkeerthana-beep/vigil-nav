-- Fix critical privacy issue: Restrict direct hazard_reports access to owners only
-- Create sanitized public view for general hazard visibility

-- Drop the overly permissive policy that allows all authenticated users to see user_id
DROP POLICY IF EXISTS "Authenticated users can view hazard reports" ON public.hazard_reports;

-- Restrict SELECT on hazard_reports to owners only
CREATE POLICY "Users can view own hazard reports"
ON public.hazard_reports
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create a public view without user_id for safety routing features
CREATE OR REPLACE VIEW public.public_hazards AS
SELECT 
  id,
  hazard_type,
  location_lat,
  location_lng,
  severity,
  description,
  created_at
FROM public.hazard_reports;

-- Grant SELECT access on the view to authenticated users
GRANT SELECT ON public.public_hazards TO authenticated;