-- Fix function search path security issue
DROP FUNCTION IF EXISTS public.update_updated_at_column CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER update_diagnoses_updated_at
BEFORE UPDATE ON public.diagnoses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();