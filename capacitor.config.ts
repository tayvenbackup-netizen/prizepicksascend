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
    contentInset: 'always',
    limitsNavigationsToAppBoundDomains: false,
    backgroundColor: '#000000',
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
