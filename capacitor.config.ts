import type { CapacitorConfig } from '@capacitor/cli';

// LOCAL-BUNDLE config: the iOS app ships the built web assets from `dist/`
// inside the .ipa, so every screen, route, asset, and JS file is fully
// editable in Xcode (ios/App/App/public/* after `npx cap sync ios`).
//
// To switch back to remote-shell mode (instant updates from Lovable Publish),
// re-add a `server: { url: 'https://<your>.lovable.app' }` block below.
const config: CapacitorConfig = {
  appId: 'app.ascend.prizepicks',
  appName: 'PrizePicks',
  webDir: 'dist',
  ios: {
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
