// Native-only bootstrap. Runs only inside the Capacitor iOS shell — never on
// the web preview. Initializes OneSignal push and configures the status bar.

let bootstrapped = false;

export async function initNative() {
  if (bootstrapped) return;
  if (typeof window === 'undefined') return;

  // Detect Capacitor at runtime — no static imports so the web bundle stays clean.
  const w = window as unknown as { Capacitor?: { isNativePlatform?: () => boolean; getPlatform?: () => string } };
  const cap = w.Capacitor;
  if (!cap || typeof cap.isNativePlatform !== 'function' || !cap.isNativePlatform()) return;

  bootstrapped = true;

  // Status bar (iOS) — dark content over black background
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    // Keep the status bar (clock/battery) visually separate from the WebView
    // so buttons positioned at the top of the WebView never sit on the clock.
    await StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#000000' }).catch(() => {});
  } catch {}

  // Hide splash quickly once the web view is ready
  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    setTimeout(() => SplashScreen.hide().catch(() => {}), 400);
  } catch {}

  // OneSignal push notifications
  try {
    const appId = (import.meta.env.VITE_ONESIGNAL_APP_ID as string | undefined) || '';
    if (!appId) {
      console.warn('[native] VITE_ONESIGNAL_APP_ID not set — push disabled');
      return;
    }
    // onesignal-cordova-plugin exposes window.OneSignal once loaded by Capacitor
    const OneSignal = (window as any).OneSignal ?? (await import('onesignal-cordova-plugin' as any)).default;
    if (!OneSignal) return;
    OneSignal.initialize(appId);
    OneSignal.Notifications.requestPermission(true).catch(() => {});
    OneSignal.Notifications.addEventListener('click', (e: unknown) => {
      console.log('[push] clicked', e);
    });
  } catch (err) {
    console.warn('[native] OneSignal init failed', err);
  }
}
