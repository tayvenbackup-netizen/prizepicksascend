import type { CapacitorConfig } from '@capacitor/cli';

// Remote-shell config: the iOS app loads your published Lovable site directly,
// so any update you publish is instantly live in the app — no resubmission needed.
const config: CapacitorConfig = {
  appId: 'app.ascend.prizepicks',
  appName: 'PrizePicks',
  webDir: 'dist',
  server: {
    url: 'https://prizepicksascend.lovable.app',
    cleartext: false,
    androidScheme: 'https',
  },
  ios: {
    // 'always' keeps the WebView inset under the status bar so the clock/notch
    // never sits on top of in-app buttons (matched by StatusBar.setOverlaysWebView(false)).
    contentInset: 'always',
    limitsNavigationsToAppBoundDomains: false,
    backgroundColor: '#000000',
    scrollEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 600,
      backgroundColor: '#000000',
      showSpinner: false,
    },
  },
};

export default config;
