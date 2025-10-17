-- Fix critical security issue: Restrict hazard_reports to authenticated users only
-- Currently anyone can view all hazard reports with precise GPS coordinates and user_id
DROP POLICY IF EXISTS "Anyone can view hazard reports" ON public.hazard_reports;

CREATE POLICY "Authenticated users can view hazard reports"
ON public.hazard_reports
FOR SELECT
TO authenticated
USING (true);

-- Add missing UPDATE and DELETE policies for hazard_reports
CREATE POLICY "Users can update own hazard reports"
ON public.hazard_reports
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own hazard reports"
ON public.hazard_reports
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add missing UPDATE policy for saved_routes
CREATE POLICY "Users can update own saved routes"
ON public.saved_routes
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add missing DELETE policy for profiles (GDPR compliance)
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Add missing DELETE policy for trip_history (GDPR compliance)
CREATE POLICY "Users can delete own trip history"
ON public.trip_history
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);