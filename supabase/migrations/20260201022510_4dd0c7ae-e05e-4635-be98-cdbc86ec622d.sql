-- Fix profiles table RLS: Restrict public SELECT to authenticated users only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);