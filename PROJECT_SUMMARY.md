# 🎉 Flowly - Be Productive With AI

**Complete Flow-State AI Assistant Chrome Extension**

---

## 📦 Repository
**GitHub**: https://github.com/Narendarcodes/Flowly-Be-Productive-With-AI

---

## ✨ What's Included

### 🧠 Core Features
1. **Real-Time Flow State Detection**
   - Tracks typing cadence, errors, mouse smoothness, tab switching
   - Calculates flow score (0-100) every 10 seconds
   - Classifies state: passive, active, flow, distracted, break

2. **AI-Powered Analysis (Gemini 3)**
   - Analyzes behavioral metrics every 60 seconds
   - Provides intelligent recommendations
   - Returns actionable interventions

3. **Smart Interventions**
   - Overlay notifications with glassmorphism design
   - Auto-dismiss after 10 seconds
   - Color-coded by intervention type

4. **Analytics Dashboard**
   - Weekly flow trends (Recharts)
   - Deep work session tracking
   - Distraction pattern analysis
   - AI-generated insights

5. **Custom UI Pages**
   - **New Tab**: Time display, flow dashboard, quick stats
   - **Popup**: Circular flow score, session timer
   - **Options**: Settings for appearance, notifications, AI
   - **Side Panel**: Real-time flow monitoring

---

## 🏗️ Architecture

### Tech Stack
- React 18 + TypeScript
- Vite 6 + Turbo (monorepo)
- TailwindCSS
- Recharts (analytics)
- Lucide React (icons)
- Google Gemini API

### Project Structure
```
Flowly-Be-Productive-With-AI/
├── chrome-extension/
│   └── src/background/
│       ├── index.ts          # Orchestrator
│       ├── flowEngine.ts     # Flow score calculation
│       └── aiAgent.ts        # Gemini AI integration
├── pages/
│   ├── content/              # Metrics collection
│   │   └── src/metricsCollector.ts
│   ├── content-ui/           # Intervention overlays
│   │   └── src/matches/all/App.tsx
│   ├── popup/                # Extension popup
│   │   └── src/Popup.tsx
│   ├── new-tab/              # Custom new tab
│   │   └── src/NewTab.tsx
│   ├── options/              # Settings page
│   │   └── src/Options.tsx
│   ├── side-panel/           # Side panel
│   │   └── src/SidePanel.tsx
│   └── analytics/            # Analytics dashboard
│       └── src/Analytics.tsx
└── packages/                 # Shared utilities
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- Chrome Browser
- Gemini API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/Narendarcodes/Flowly-Be-Productive-With-AI.git
cd Flowly-Be-Productive-With-AI

# Install dependencies
pnpm install

# Configure Gemini API
# Edit chrome-extension/src/background/aiAgent.ts
# Replace YOUR_GEMINI_API_KEY with your actual key

# Build the extension
build-quick.bat  # Windows
# OR
pnpm build       # macOS/Linux

# Load into Chrome
# 1. Go to chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the 'dist' folder
```

---

## 📊 Features Breakdown

### Flow Detection Algorithm
```typescript
flowScore = 
  (typingCadence * 0.5) +
  (mouseSmoothness * 0.2) -
  (errors * 2) -
  (switchCount * 5)
```

### State Classification
- **80-100**: Deep Flow
- **50-79**: Active Work
- **30-49**: Passive Work
- **0-29**: Distracted

### AI Integration
- **Model**: Google Gemini Pro
- **Frequency**: Every 60 seconds
- **Input**: Behavioral metrics JSON
- **Output**: Classification + Recommended action

---

## 🎨 UI Screenshots

### New Tab Page
- Large time display
- Flow state dashboard
- Quick stats (streak, quality, sessions)
- Modern gradient background

### Popup
- Circular flow score indicator
- Real-time status badge
- Session streak timer
- Analytics button

### Analytics Dashboard
- 4 stat cards
- Weekly trend chart
- Distraction analysis
- AI insights panel

### Options Page
- Appearance settings
- Notification preferences
- AI analysis configuration

---

## 📝 Documentation

### Build Guides
- `BUILD_INSTRUCTIONS.md` - Quick build guide
- `WINDOWS_BUILD_GUIDE.md` - Windows-specific instructions
- `BUILD_STATUS.md` - Build status and troubleshooting
- `TESTING_GUIDE.md` - Complete testing instructions

### Architecture Docs
- `FLOW_STATE_README.md` - Comprehensive feature documentation
- `FILE_STRUCTURE.md` - Complete file tree
- `REBRANDING_COMPLETE.md` - Rebranding summary

---

## 🔧 Configuration

### Gemini API Setup
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Edit `chrome-extension/src/background/aiAgent.ts`:
   ```typescript
   const GEMINI_API_KEY = 'your-actual-api-key-here';
   ```

### Environment Variables
```env
CEB_EXAMPLE=example_env
CEB_DEV_LOCALE=
CEB_CI=
```

---

## 🛠️ Development

### Build Commands
```bash
pnpm dev          # Development mode with hot reload
pnpm build        # Production build
pnpm type-check   # Type checking
pnpm lint         # Linting
pnpm format       # Format code
```

### Testing
```bash
pnpm test         # Run tests
pnpm e2e          # E2E tests
```

---

## 🎯 Roadmap

- [ ] Website blocking during flow mode
- [ ] Pomodoro timer integration
- [ ] Multi-device sync
- [ ] Custom flow algorithms
- [ ] Desktop notifications
- [ ] Calendar integration
- [ ] Export analytics data
- [ ] Team collaboration features

---

## 📄 License

MIT License - Copyright (c) 2025 Flow-State AI Assistant

---

## 🙏 Acknowledgments

- Built with React, Vite, and TypeScript
- Powered by Google Gemini AI
- Icons by Lucide
- Charts by Recharts

---

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Repository: https://github.com/Narendarcodes/Flowly-Be-Productive-With-AI

---

**Made with ❤️ for productivity enthusiasts**

*Achieve your peak performance with AI-powered flow state detection*
