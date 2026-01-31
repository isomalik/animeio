-- Fix overly permissive provenance_logs INSERT policy
DROP POLICY IF EXISTS "System can insert provenance" ON public.provenance_logs;

-- Replace with authenticated-only insert (triggers run as security definer anyway)
CREATE POLICY "Authenticated users can insert provenance" ON public.provenance_logs 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);