# Flow-State AI Assistant - Testing Guide

## Prerequisites
Before testing, ensure you have:
- ✅ Chrome Browser installed
- ✅ Node.js 18+ and pnpm installed
- ✅ Gemini API key (get from https://makersuite.google.com/app/apikey)

## Step 1: Configure API Key

1. Open `chrome-extension/src/background/aiAgent.ts`
2. Replace the placeholder:
   ```typescript
   const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
   ```
   with your actual key:
   ```typescript
   const GEMINI_API_KEY = 'AIzaSy...your-actual-key-here';
   ```

## Step 2: Build the Extension

### Option A: Full Build (Recommended)
```bash
cd chrome-extension-boilerplate-react-vite
pnpm install
pnpm build
```

### Option B: If bash scripts fail on Windows
```bash
# Clean dist folder
rmdir /s /q dist

# Build individual packages
npx turbo build --filter=chrome-extension
npx turbo build --filter=@extension/content-script
npx turbo build --filter=@extension/content-ui
npx turbo build --filter=@extension/popup
npx turbo build --filter=@extension/analytics
```

### Expected Output
After successful build, you should see a `dist` folder with:
```
dist/
├── manifest.json
├── background.js
├── popup/
│   └── index.html
├── content/
│   └── all.iife.js
├── content-ui/
│   └── all.iife.js
├── analytics/
│   └── index.html
└── icons/
```

## Step 3: Load Extension into Chrome

1. **Open Chrome Extensions Page:**
   - Navigate to `chrome://extensions/`
   - Or click Menu (⋮) → Extensions → Manage Extensions

2. **Enable Developer Mode:**
   - Toggle "Developer mode" switch in top-right corner

3. **Load Unpacked Extension:**
   - Click "Load unpacked" button
   - Navigate to your project folder
   - Select the `dist` folder
   - Click "Select Folder"

4. **Verify Installation:**
   - You should see "Chrome Extension Boilerplate React Vite" (or updated name)
   - Extension icon should appear in Chrome toolbar
   - Status should show "Enabled"

## Step 4: Test Metrics Collection

1. **Open Developer Console:**
   - Right-click on any webpage → Inspect
   - Go to Console tab

2. **Navigate to any website:**
   - Example: https://google.com

3. **Check for initialization:**
   - Look for console message: `"Flow State Metrics Collector Initialized"`
   - If you see this, metrics collection is working ✅

4. **Trigger metrics:**
   - Start typing in any text field
   - Move your mouse around
   - Switch tabs a few times

5. **Verify metrics are being sent:**
   - Every 10 seconds, you should see activity in the console
   - Open Chrome DevTools → Application → Service Workers
   - Click "background.js" to see background script console
   - Look for: `"Updated Flow State: {score: XX, status: 'active', ...}"`

## Step 5: Test Popup UI

1. **Click Extension Icon:**
   - Click the extension icon in Chrome toolbar
   - Popup should open (320x400px)

2. **Verify Popup Elements:**
   - ✅ Circular flow score indicator (0-100)
   - ✅ Status badge (passive/active/flow/distracted)
   - ✅ Session streak timer
   - ✅ "View Analytics Dashboard" button

3. **Check Flow Score Updates:**
   - Keep popup open while typing on a webpage
   - Flow score should update in real-time
   - Status should change based on activity

## Step 6: Test AI Interventions

1. **Open Background Service Worker Console:**
   - Go to `chrome://extensions/`
   - Find your extension
   - Click "service worker" link (under "Inspect views")

2. **Monitor AI Analysis:**
   - Every 60 seconds, you should see:
     ```
     Requesting AI Analysis...
     AI Response: {classification: "active work", action: "continue flow", ...}
     ```

3. **Trigger an Intervention:**
   - Simulate distraction by:
     - Switching tabs rapidly (5+ times in 10 seconds)
     - Stop typing for 30 seconds
     - Make many typing errors (backspace repeatedly)

4. **Verify Overlay Appears:**
   - After AI analysis, an overlay should appear top-right
   - It should show the classification and recommended action
   - It auto-dismisses after 10 seconds

## Step 7: Test Analytics Dashboard

1. **Open Dashboard:**
   - Click extension icon
   - Click "View Analytics Dashboard" button
   - OR navigate to: `chrome-extension://[extension-id]/analytics/index.html`

2. **Verify Dashboard Elements:**
   - ✅ 4 stat cards (Flow Score, Deep Work, Cognitive Load, Interventions)
   - ✅ Weekly trend chart (line/area chart)
   - ✅ Distraction sources bar chart
   - ✅ AI Insights panel

3. **Check Styling:**
   - Dark theme (slate-950 background)
   - Gradient text for title
   - Glassmorphism cards
   - Responsive layout

## Step 8: Test Storage

1. **Open Chrome DevTools:**
   - Right-click → Inspect → Application tab

2. **Check Storage:**
   - Navigate to: Storage → Local Storage → chrome-extension://[id]
   - OR: Storage → Extension Storage → [Your Extension]

3. **Verify Data:**
   - Look for `flowState` key
   - Should contain: `{score, status, streak, sessionStart, lastIntervention}`

## Troubleshooting

### Build Fails
**Issue:** `pnpm build` fails with bash script errors

**Solution:**
- Use Git Bash or WSL on Windows
- OR manually build each package with turbo
- OR use `pnpm dev` for development mode

### Extension Not Loading
**Issue:** "Manifest file is missing or unreadable"

**Solution:**
- Verify `dist/manifest.json` exists
- Check file permissions
- Rebuild with `pnpm build`

### Metrics Not Collecting
**Issue:** No console logs on webpages

**Solution:**
- Check if content script is injected: DevTools → Sources → Content Scripts
- Verify manifest.json has correct content_scripts configuration
- Reload extension and refresh webpage

### AI Not Responding
**Issue:** No AI analysis in background console

**Solution:**
- Verify API key is correct in `aiAgent.ts`
- Check network requests in background console
- Ensure you have API quota remaining
- Check for CORS errors

### Popup Not Opening
**Issue:** Clicking icon does nothing

**Solution:**
- Check for errors in extension console
- Verify `dist/popup/index.html` exists
- Reload extension

### Analytics Page Blank
**Issue:** Dashboard shows blank page

**Solution:**
- Open DevTools console on analytics page
- Check for React/module errors
- Verify all dependencies are installed
- Rebuild analytics package

## Manual Testing Checklist

- [ ] Extension loads without errors
- [ ] Background service worker starts
- [ ] Content script initializes on webpages
- [ ] Metrics collector tracks typing
- [ ] Metrics collector tracks mouse movement
- [ ] Metrics collector tracks tab switches
- [ ] Flow score updates every 10 seconds
- [ ] Popup displays current flow score
- [ ] Popup shows correct status badge
- [ ] AI analysis runs every 60 seconds
- [ ] Intervention overlay appears
- [ ] Overlay auto-dismisses
- [ ] Analytics dashboard opens
- [ ] Charts render correctly
- [ ] Storage persists data
- [ ] Extension works across different websites

## Performance Testing

1. **Memory Usage:**
   - Open Chrome Task Manager (Shift+Esc)
   - Find your extension
   - Memory should be < 50MB

2. **CPU Usage:**
   - Should be minimal when idle
   - Spikes only during metrics collection (every 10s)

3. **Network:**
   - Only Gemini API calls (once per minute)
   - No unnecessary requests

## Expected Behavior Summary

| Component | Expected Behavior | Frequency |
|-----------|------------------|-----------|
| Metrics Collector | Tracks user activity | Continuous |
| Metrics Sender | Sends to background | Every 10s |
| Flow Engine | Calculates score | Every 10s |
| AI Agent | Analyzes metrics | Every 60s |
| Popup | Updates display | Every 1s |
| Overlay | Shows intervention | On AI trigger |
| Storage | Persists state | On every update |

## Next Steps After Testing

1. **Customize Flow Algorithm:**
   - Edit `flowEngine.ts` to adjust scoring weights
   - Test with different activity patterns

2. **Enhance UI:**
   - Modify popup styling in `Popup.tsx`
   - Add more stats to analytics dashboard

3. **Add Features:**
   - Website blocking during flow mode
   - Custom intervention messages
   - Export analytics data

4. **Production Deployment:**
   - Update manifest name and description
   - Create proper icons (128x128, 48x48, 16x16)
   - Test on Chrome Web Store

---

**Need Help?** Check the console logs in:
- Webpage console (for content script)
- Background service worker console (for flow engine & AI)
- Popup DevTools (for popup UI)
- Analytics page DevTools (for dashboard)
