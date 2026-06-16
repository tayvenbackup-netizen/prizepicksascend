DROP POLICY IF EXISTS "Public read non-sensitive app_settings" ON public.app_settings;
CREATE POLICY "Public read non-sensitive app_settings" ON public.app_settings
  FOR SELECT
  USING (
    lower(id) NOT LIKE 'rate_limit:%'
    AND lower(id) NOT LIKE 'csrf:%'
    AND lower(id) NOT LIKE 'admin_session:%'
    AND lower(id) NOT LIKE 'session:%'
    AND lower(id) <> 'master_device_bind'
    AND lower(id) <> 'admin_password_hash'
    AND lower(id) <> 'admin_password'
    AND lower(id) <> 'master_reset_token'
  );