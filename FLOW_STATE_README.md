# Flow-State AI Assistant Chrome Extension

A production-ready Chrome Extension built with React, Vite, TailwindCSS, and Gemini AI that helps users achieve and maintain flow state through real-time behavioral analysis and intelligent interventions.

## 🎯 Features

### 1. **Real-Time Flow State Detection**
- Tracks typing cadence, errors, mouse smoothness, and tab switching
- Calculates flow score in real-time (0-100)
- Classifies user state: `passive`, `active`, `flow`, `distracted`, `break`

### 2. **AI-Powered Analysis** (Gemini 3 API)
- Analyzes behavioral metrics every 60 seconds
- Provides classifications: `passive work`, `active work`, `deep flow`, `decreasing focus`, `focus break`
- Recommends actions: `block distraction`, `micro-break`, `subtle nudge`, `continue flow`, `amplify flow`

### 3. **Flow Mode UI**
- **Popup**: Circular flow score indicator, session timer, quick stats
- **Overlay**: Minimal intervention notifications with auto-dismiss
- **Analytics Dashboard**: Full-page analytics with charts, insights, and trends

### 4. **Stamina Building Engine**
- Tracks flow streaks and cognitive load
- Stores user preferences in Chrome Storage
- Provides personalized coaching over time

### 5. **Analytics Dashboard**
- Total flow time and deep work sessions
- Distraction pattern analysis
- Weekly heatmap visualization
- AI-generated optimization suggestions

## 📁 Project Structure

```
chrome-extension-boilerplate-react-vite/
├── chrome-extension/
│   ├── manifest.ts                    # Extension manifest (Manifest V3)
│   └── src/
│       └── background/
│           ├── index.ts               # Main background service worker
│           ├── flowEngine.ts          # Flow score calculation logic
│           └── aiAgent.ts             # Gemini API integration
├── pages/
│   ├── content/                       # Content script (metrics collection)
│   │   └── src/
│   │       ├── metricsCollector.ts    # Behavioral signal tracking
│   │       └── matches/all/index.ts   # Entry point
│   ├── content-ui/                    # Content UI (overlay)
│   │   └── src/matches/all/
│   │       └── App.tsx                # Intervention overlay component
│   ├── popup/                         # Extension popup
│   │   └── src/
│   │       └── Popup.tsx              # Flow score display
│   └── analytics/                     # Analytics dashboard (NEW)
│       ├── index.html
│       ├── vite.config.mts
│       ├── tailwind.config.ts
│       └── src/
│           ├── index.tsx
│           └── Analytics.tsx          # Dashboard with charts
└── BUILD_INSTRUCTIONS.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- Chrome Browser

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd chrome-extension-boilerplate-react-vite
   pnpm install
   ```

2. **Configure Gemini API Key:**
   Open `chrome-extension/src/background/aiAgent.ts` and replace:
   ```typescript
   const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
   ```
   with your actual Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

3. **Build the extension:**
   ```bash
   pnpm build
   ```

4. **Load into Chrome:**
   - Navigate to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## 🧠 Architecture

### Event Flow Pipeline

```
User Activity (typing, mouse, tabs)
    ↓
Content Script (metricsCollector.ts)
    ↓ [chrome.runtime.sendMessage]
Background Service Worker (index.ts)
    ↓
Flow Engine (flowEngine.ts) → Calculate Score
    ↓
AI Agent (aiAgent.ts) → Gemini API Analysis
    ↓ [chrome.tabs.sendMessage]
Content UI Overlay (App.tsx) → Display Intervention
    ↑
Popup (Popup.tsx) ← [chrome.storage.local]
    ↑
Analytics Dashboard (Analytics.tsx)
```

### Metrics Collection

**Tracked Signals:**
- `typingCadence`: Characters per minute
- `errors`: Backspace count (typing mistakes)
- `mouseSmoothness`: Variance in mouse movement
- `switchCount`: Tab/window focus changes
- `lastActive`: Timestamp of last activity

**Collection Interval:** Every 10 seconds

### Flow Score Algorithm

```typescript
flowScore = 
  (typingCadence * 0.5) +
  (mouseSmoothness * 0.2) -
  (errors * 2) -
  (switchCount * 5)
```

Normalized to 0-100 range.

### State Classification

| Score Range | Status | AI Classification |
|-------------|--------|-------------------|
| 80-100 | `flow` | `deep flow` |
| 50-79 | `active` | `active work` |
| 30-49 | `passive` | `passive work` |
| 0-29 | `distracted` | `decreasing focus` |

## 🎨 UI Components

### Popup (320x400px)
- Circular progress indicator for flow score
- Current status badge (flow/active/passive/distracted)
- Session streak timer
- Focus quality metric
- Button to open Analytics Dashboard

### Overlay (Content UI)
- Appears top-right on intervention
- Auto-dismisses after 10 seconds (except for "block distraction")
- Glassmorphism design with backdrop blur
- Color-coded by intervention type

### Analytics Dashboard (Full Page)
- **Stat Cards**: Flow Score, Deep Work Time, Cognitive Load, Interventions
- **Charts**: Weekly flow trends (Recharts AreaChart)
- **Distraction Analysis**: Horizontal bar chart
- **AI Insights**: Personalized recommendations

## 🔧 Configuration

### Permissions (manifest.ts)
```typescript
permissions: [
  'storage',      // Store flow state and preferences
  'scripting',    // Inject content scripts
  'tabs',         // Query active tabs
  'notifications',// Future: Desktop notifications
  'sidePanel',    // Future: Side panel UI
  'activeTab'     // Access active tab
]
```

### Content Scripts
Injected on all URLs (`<all_urls>`) to track behavior across all websites.

## 📊 Data Storage

Uses `chrome.storage.local` for:
- Current flow state
- Session history
- User preferences
- Long-term analytics data

**Storage Schema:**
```typescript
{
  flowState: {
    score: number,
    status: 'passive' | 'active' | 'flow' | 'distracted' | 'break',
    streak: number,
    sessionStart: number,
    lastIntervention: number
  }
}
```

## 🤖 AI Integration

### Gemini Prompt Template

```
Analyze the following user behavior metrics and classify their flow state.

Metrics:
{
  "typingCadence": 45,
  "errors": 2,
  "mouseSmoothness": 85,
  "switchCount": 1
}

Return a JSON object with the following structure:
{
  "classification": "passive work" | "active work" | "deep flow" | "decreasing focus" | "focus break",
  "action": "block distraction" | "micro-break" | "subtle nudge" | "continue flow" | "amplify flow",
  "reasoning": "short explanation"
}
```

### API Endpoint
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

### Rate Limiting
- AI analysis triggered max once per 60 seconds
- Prevents API quota exhaustion
- Fallback response on error

## 🎯 Future Enhancements

- [ ] Desktop notifications for interventions
- [ ] Website blocking during flow mode
- [ ] Pomodoro timer integration
- [ ] Export analytics as CSV/PDF
- [ ] Multi-device sync via Chrome Storage Sync
- [ ] Custom flow score algorithms
- [ ] Integration with calendar for scheduling
- [ ] Ambient sound/music recommendations

## 🐛 Troubleshooting

**Build Errors:**
- Run `pnpm install` to ensure all dependencies are installed
- Check Node.js version (must be 18+)

**Extension Not Loading:**
- Verify `dist` folder contains `manifest.json`
- Check Chrome DevTools console for errors
- Ensure all permissions are granted

**AI Not Working:**
- Verify Gemini API key is valid
- Check network requests in background service worker console
- Ensure API quota is not exceeded

**Metrics Not Tracking:**
- Open browser console on any webpage
- Look for "Flow State Metrics Collector Initialized"
- Check if content script is injected

## 📝 License

MIT License - See LICENSE file for details

## 👥 Contributors

Built on top of [chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)

---

**Note:** This is a production-ready implementation. All components are functional and follow Manifest V3 best practices.
