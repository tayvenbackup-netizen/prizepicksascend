DROP POLICY IF EXISTS "Public read app_settings" ON public.app_settings;
CREATE POLICY "Public read non-sensitive app_settings"
  ON public.app_settings FOR SELECT
  TO anon, authenticated
  USING (id NOT LIKE 'rate_limit:%');