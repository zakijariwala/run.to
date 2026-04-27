# `run.to` Mobile Handover Document

## 1. Project Mission & Current State
The `run.to` project is currently a highly optimized **zero-build, zero-server, Vanilla HTML/JS/CSS monolithic web application**. It successfully generates closed-loop running routes using a geometric projection algorithm that snaps to real-world pedestrian paths via the public OSRM API.

**Key Achievements:**
- **Zero-Build Architecture:** Runs directly in the browser; no Node.js backend or bundlers required.
- **Mobile-First UI:** "Performance Engine" dark mode UI with a responsive glassmorphism bottom-sheet layout overlaying a full-screen Leaflet map.
- **Fuzzy Logic Engine:** Iterative radius-scaling algorithm for precise target distance matching, including automatic pruning of massive detours.
- **Utility Features:** GPX Export functionality and deep-linking to the Google Maps native app for turn-by-turn walking directions between major stops.

## 2. The Mobile Strategy: Vanilla Monolith + Capacitor
To bring `run.to` to iOS and Android, we will strictly maintain the current architecture. We will **not** port the code to React Native, Flutter, or Swift. Instead, we will use **Capacitor**.

Capacitor will wrap our Vanilla JS web monolith into a native WebView shell. This provides:
1. **Speed of Vanilla Code:** No heavy JS framework overhead (React/Vue/etc.), ensuring fast load times and battery efficiency.
2. **Previewability of the Web:** You can continue testing UI changes instantly by simply opening `index.html` in a desktop browser.
3. **Native Hardware Access:** Access to native GPS, Status Bar, and File System via lightweight Capacitor Plugins.

## 3. Initialization Steps
We will add a minimal `package.json` strictly to manage Capacitor dependencies. No bundlers (Webpack/Vite) will be introduced.

### Step 1: Prepare the Directory
For cleanliness, it is recommended to move all web assets (`index.html`, `/js`, `/css`) into a `www/` or `public/` directory so the root directory remains clean for Capacitor configs.

### Step 2: Install Capacitor CLI
Run the following in the project root:
```bash
npm init -y
npm install @capacitor/cli @capacitor/core
```

### Step 3: Initialize Capacitor
```bash
npx cap init
```
- **App Name:** `run.to`
- **App Package ID:** `com.runto.app`
- **Web Asset Directory:** `www` (or whichever folder you placed `index.html` into).

### Step 4: Add Platforms
```bash
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

## 4. Native Integrations & Upgrades
To make the app feel perfectly native, the mobile dev team should swap out standard web APIs for native Capacitor Plugins in `js/app.js`:

- **Geolocation (`@capacitor/geolocation`):** Replace standard HTML5 `navigator.geolocation`. The native plugin provides more reliable background tracking, faster GPS locks, and handles native OS permission prompts seamlessly.
- **Status Bar (`@capacitor/status-bar`):** Set the mobile OS status bar to match the `#0f172a` dark theme background so the app looks completely immersive without a white bar at the top.
- **File System (`@capacitor/filesystem`):** Modify the GPX export function. Instead of creating a browser Blob and a hidden `<a>` download tag, use Capacitor to save the `.gpx` file directly to the user's mobile device documents folder.
- **App Intents (`@capacitor/app`):** Ensure the "Open in Google Maps" button triggers native intent protocols cleanly.

## 5. Development Workflow
To test on a physical device or emulator:
1. Make your code changes to `www/index.html` or `www/js/app.js`.
2. Run `npx cap sync` to copy the updated web assets into the native Android/iOS project folders.
3. Run `npx cap open ios` or `npx cap open android` to launch Xcode or Android Studio for compilation.

## 6. Action Items for Mobile Dev Team
- [ ] Reorganize root files into a `www/` folder.
- [ ] Implement the Capacitor init steps and install iOS/Android targets.
- [ ] Implement the `@capacitor/geolocation` plugin and add appropriate OS permissions in `AndroidManifest.xml` and `Info.plist`.
- [ ] Generate native App Icons and Splash Screens using `@capacitor/assets`.
- [ ] Test the OSRM fetch requests on native devices to ensure there are no CORS or cleartext traffic blocks imposed by iOS/Android webviews.
