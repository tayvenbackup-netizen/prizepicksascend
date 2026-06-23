# PrizePicks → iOS (.ipa) Build Guide — Fully Editable in Xcode

This project is wrapped with **Capacitor** in **local-bundle mode**. The iOS
app ships the built web assets (`dist/`) inside the `.ipa`, so **every file is
100% editable in Xcode** — HTML, JS, CSS, images, native code, Info.plist,
entitlements, capabilities, app icon, splash, everything.

> ⚠️ The Lovable sandbox is Linux. You can only produce a real `.ipa` on a
> **Mac with Xcode 15+**.

---

## 1 — One-time setup on your Mac

```bash
# clone / pull the project to your Mac, then:
cd <project-folder>
npm install               # or: bun install
npm run build             # produces dist/ (the web bundle that ships in the app)
npx cap add ios           # creates the ios/ folder (only once)
npx cap sync ios          # copies dist/ → ios/App/App/public/
```

That creates `ios/App/App.xcworkspace`.

## 2 — Open in Xcode

```bash
npx cap open ios
```

Everything you can edit:

- **Web layer** — `ios/App/App/public/` (copied from `dist/` on every `cap sync`)
- **Native Swift/Obj-C** — `ios/App/App/AppDelegate.swift`, etc.
- **Info.plist** — permissions strings, URL schemes, ATS, etc.
- **Capabilities** — Push Notifications, Background Modes, Sign in with Apple, ...
- **App icon & launch screen** — `ios/App/App/Assets.xcassets/`
- **Signing & bundle ID** — App target → Signing & Capabilities
- **Build settings** — minimum iOS version, architectures, etc.

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

---

## 4 — After any web/UI change

Because the app ships the bundled `dist/`, **every web change requires a
rebuild** (this is the trade-off for full local editability):

```bash
npm run build
npx cap sync ios
# then re-archive in Xcode
```

If you instead want web changes to ship instantly without re-archiving,
re-add a remote-shell `server.url` in `capacitor.config.ts`.

---

## 5 — Push notifications (OneSignal)

### a) Create OneSignal app

1. Create a free account at <https://onesignal.com>.
2. **New App/Website** → name it PrizePicks → choose **Apple iOS (APNs)**.
3. Upload your APNs Auth Key (`.p8`) from
   <https://developer.apple.com/account/resources/authkeys/list>.
4. Copy your **OneSignal App ID**.

### b) Add the App ID to `.env` and rebuild

```
VITE_ONESIGNAL_APP_ID=your-onesignal-app-id-here
```

Then `npm run build && npx cap sync ios`.

### c) Xcode capabilities

App target → Signing & Capabilities → **+ Capability**:

- **Push Notifications**
- **Background Modes** → check **Remote notifications**

Follow OneSignal's **Notification Service Extension** setup:
<https://documentation.onesignal.com/docs/ios-sdk-setup>

---

## 6 — App icon & splash

Replace `public/icon.png` (1024×1024), then:

```bash
npm i -D @capacitor/assets   # once
npx @capacitor/assets generate --ios
npx cap sync ios
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| White screen in app | Run `npm run build && npx cap sync ios` — `dist/` was empty. |
| Web changes not showing | Rebuild and re-sync (see step 4). |
| Notifications not arriving | Check OneSignal Subscriptions tab; verify APNs key and Push Notifications capability. |
| "App ID is already taken" | Change `appId` in `capacitor.config.ts`, then `npx cap sync ios`. |
