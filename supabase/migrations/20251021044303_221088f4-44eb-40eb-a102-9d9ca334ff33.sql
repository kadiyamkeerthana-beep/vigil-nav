-- 1) Drop public SELECT policy that exposed user_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'hazard_reports' AND policyname = 'Anyone can view all hazard reports for safety'
  ) THEN
    EXECUTE 'DROP POLICY "Anyone can view all hazard reports for safety" ON public.hazard_reports';
  END IF;
END $$;

-- 2) Recreate the view (safe to create if missing)
CREATE OR REPLACE VIEW public.public_hazards AS
SELECT id, hazard_type, location_lat, location_lng, severity, description, created_at
FROM public.hazard_reports;

-- 3) Create a SECURITY DEFINER function to expose sanitized hazards, bypassing RLS safely
CREATE OR REPLACE FUNCTION public.get_public_hazards()
RETURNS TABLE (
  id uuid,
  hazard_type text,
  location_lat double precision,
  location_lng double precision,
  severity text,
  description text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, hazard_type, location_lat, location_lng, severity, description, created_at
  FROM public.hazard_reports;
$$;

-- 4) Grant execute to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.get_public_hazards() TO anon, authenticated;