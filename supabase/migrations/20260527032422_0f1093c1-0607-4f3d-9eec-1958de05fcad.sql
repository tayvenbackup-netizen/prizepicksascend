
-- Unbind all keys from their current device so they re-lock on next activation
UPDATE public.access_keys
SET device_fingerprint = NULL,
    device_count = 0;

-- Clear master admin device binding
DELETE FROM public.app_settings WHERE id = 'master_device_bind';

-- Clear stale device attempt logs and security alerts tied to wrong devices
DELETE FROM public.device_attempts;
DELETE FROM public.security_alerts;

-- Invalidate all existing sessions so everyone re-authenticates and re-locks
DELETE FROM public.access_sessions;
DELETE FROM public.key_sessions;
DELETE FROM public.app_settings WHERE id LIKE 'admin_session:%';
DELETE FROM public.app_settings WHERE id LIKE 'csrf:%';
