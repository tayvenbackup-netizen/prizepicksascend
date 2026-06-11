# PrizePicks → iOS (.ipa) Build Guide

Your Lovable web app is wrapped with **Capacitor** as a remote-shell iOS app.
The native app loads your published site at
`https://prizepicksascend.lovable.app`, so every Lovable publish is instantly
live in the app — no Xcode resubmission needed for content changes.

> ⚠️ The Lovable sandbox is Linux. You can only produce a real `.ipa` on a
> **Mac with Xcode 15+**.

---

## 1 — One-time setup on your Mac

```bash
# clone / pull the project to your Mac, then:
cd <project-folder>
npm install               # or: bun install
npx cap add ios           # creates the ios/ folder (only once)
npx cap sync ios
```

That creates `ios/App/App.xcworkspace`.

## 2 — Open in Xcode

```bash
npx cap open ios
```

In Xcode:

1. Select the **App** target → **Signing & Capabilities**.
2. Sign in with your Apple ID (free tier works for Simulator + your own device).
3. Set a unique **Bundle Identifier** if `app.ascend.prizepicks` is taken.
4. Pick a device or Simulator at the top → ▶︎ Run.

## 3 — Make an `.ipa` (requires paid Apple Developer Account, $99/yr)

1. Xcode → **Product → Archive**.
2. When the archive finishes, the Organizer window opens.
3. Click **Distribute App** → choose **App Store Connect**, **Ad Hoc**, or
   **Development** → follow prompts.
4. Xcode produces the signed `.ipa`.

Without a paid Developer Account you can still **Run** on the Simulator and
on your own iPhone (7-day signing), but you cannot export a distributable
`.ipa`.

---

## 4 — Push notifications (OneSignal)

The app is wired for **OneSignal** native push (not web push). To enable:

### a) Create OneSignal app

1. Create a free account at <https://onesignal.com>.
2. **New App/Website** → name it PrizePicks → choose **Apple iOS (APNs)**.
3. Upload your APNs Auth Key (`.p8`) from
   <https://developer.apple.com/account/resources/authkeys/list> (requires
   paid Developer Account). Or use a `.p12` certificate.
4. Copy your **OneSignal App ID**.

### b) Add the App ID to the project

Add this to `.env` (project root) and re-publish on Lovable:

```
VITE_ONESIGNAL_APP_ID=your-onesignal-app-id-here
```

### c) Xcode capabilities

In Xcode (App target → Signing & Capabilities → **+ Capability**), add:

- **Push Notifications**
- **Background Modes** → check **Remote notifications**

Then follow the OneSignal iOS SDK setup for the **Notification Service
Extension** (one-line add in Xcode):
<https://documentation.onesignal.com/docs/ios-sdk-setup>

### d) Send notifications

From the OneSignal dashboard → **Messages → New Push**, or via their REST API
from any backend. Notifications arrive as real native iOS notifications even
when the app is closed.

---

## 5 — App icon & splash

Replace `public/icon.png` (1024×1024) in the repo, then run:

```bash
npx @capacitor/assets generate --ios
npx cap sync ios
```

(Install the helper once: `npm i -D @capacitor/assets`.)

---

## 6 — After any web change

You only need to repeat this when **Capacitor config / plugins change**:

```bash
npx cap sync ios
```

Pure web/UI changes ship instantly via Lovable Publish — no re-sync, no
re-archive.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| White screen in app | The site isn't published yet. Run Publish in Lovable. |
| Notifications not arriving | Check OneSignal dashboard → Subscriptions tab; verify APNs key is uploaded; confirm Push Notifications capability is enabled in Xcode. |
| "App ID is already taken" | Change `appId` in `capacitor.config.ts`, then `npx cap sync ios`. |
| Deposits/withdrawals not working in app | They run against the published Lovable Cloud backend — make sure you've published the latest changes. |
