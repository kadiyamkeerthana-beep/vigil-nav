-- Drop the existing view
DROP VIEW IF EXISTS public.public_hazards;

-- Recreate it as a proper view (views don't need RLS, they inherit from base table)
-- But we need to add a policy to hazard_reports to allow public SELECT
CREATE POLICY "Anyone can view all hazard reports for safety"
ON public.hazard_reports
FOR SELECT
USING (true);