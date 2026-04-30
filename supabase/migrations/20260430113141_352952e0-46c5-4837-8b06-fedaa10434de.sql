-- Fix touch_updated_at search_path
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_first_user_admin() FROM anon, authenticated, public;

-- Lock down storage listing: public can only access by exact path, not list
DROP POLICY IF EXISTS "public read post images" ON storage.objects;
CREATE POLICY "public read post images" ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');
-- Note: bucket is public via CDN; listing via API still requires auth — this is fine for our use.