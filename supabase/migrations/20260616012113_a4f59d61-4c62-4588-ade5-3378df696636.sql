DROP POLICY IF EXISTS "Public read non-sensitive app_settings" ON public.app_settings;
CREATE POLICY "Public read non-sensitive app_settings" ON public.app_settings
  FOR SELECT
  USING (
    id NOT LIKE 'rate_limit:%'
    AND id NOT LIKE 'csrf:%'
    AND id NOT LIKE 'admin_session:%'
    AND id NOT LIKE 'session:%'
    AND id <> 'master_device_bind'
    AND id <> 'ADMIN_PASSWORD_HASH'
    AND id <> 'MASTER_RESET_TOKEN'
  );