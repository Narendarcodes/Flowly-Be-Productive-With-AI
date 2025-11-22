# Flow-State AI Assistant

> AI-powered Chrome extension that detects and enhances your flow state through real-time behavioral analysis and intelligent interventions.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-orange.svg)

## 🎯 Overview

Flow-State AI Assistant is an intelligent Chrome extension that helps you achieve and maintain peak productivity by:

- **Real-time Flow Detection**: Tracks typing patterns, mouse movements, and focus to calculate your flow state
- **AI-Powered Analysis**: Uses Gemini AI to analyze your work patterns and provide intelligent recommendations
- **Smart Interventions**: Delivers timely nudges, break reminders, and distraction blocking
- **Analytics Dashboard**: Visualizes your productivity patterns with beautiful charts and insights
- **Personalized Coaching**: Learns your work habits and adapts to optimize your flow state

## ✨ Features

### 🧠 Flow State Detection
- Tracks typing cadence, errors, mouse smoothness, and tab switching
- Calculates real-time flow score (0-100)
- Classifies work state: passive, active, flow, distracted, or break

### 🤖 AI Integration
- Powered by Google Gemini AI
- Analyzes behavioral metrics every 60 seconds
- Provides actionable recommendations
- Learns from your patterns over time

### 📊 Analytics Dashboard
- Weekly flow trends visualization
- Deep work session tracking
- Distraction pattern analysis
- AI-generated insights and optimization tips

### 💡 Smart Interventions
- Subtle nudges when focus decreases
- Micro-break suggestions to prevent burnout
- Distraction blocking during deep work
- Motivational messages to maintain flow

### 🎨 Beautiful UI
- Modern, minimal design
- Dark/light theme support
- Glassmorphism effects
- Smooth animations
- Responsive layout

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- Chrome Browser
- Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/flow-state-ai-assistant.git
   cd flow-state-ai-assistant
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Gemini API**
   - Open `chrome-extension/src/background/aiAgent.ts`
   - Replace `YOUR_GEMINI_API_KEY` with your actual API key

4. **Build the extension**
   ```bash
   # Windows
   build-quick.bat
   
   # macOS/Linux
   pnpm build
   ```

5. **Load into Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## 📖 Usage

### Getting Started
1. Click the extension icon to view your current flow score
2. Start working on any website - metrics are tracked automatically
3. Receive AI-powered interventions when needed
4. View detailed analytics by clicking "View Analytics Dashboard"

### Understanding Flow Scores
- **80-100**: Deep Flow - Peak productivity state
- **50-79**: Active Work - Engaged and productive
- **30-49**: Passive Work - Light engagement
- **0-29**: Distracted - Low focus, needs intervention

### Customization
- Toggle dark/light theme in popup or new tab page
- Adjust intervention frequency (coming soon)
- Customize flow score algorithm weights (coming soon)

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18, TypeScript, TailwindCSS
- **Build Tool**: Vite 6, Turbo
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: Google Gemini API
- **Storage**: Chrome Storage API

### Project Structure
```
flow-state-ai-assistant/
├── chrome-extension/          # Core extension (manifest, background)
│   └── src/background/
│       ├── index.ts          # Main orchestrator
│       ├── flowEngine.ts     # Flow score calculation
│       └── aiAgent.ts        # Gemini AI integration
├── pages/
│   ├── content/              # Metrics collection
│   ├── content-ui/           # Intervention overlays
│   ├── popup/                # Extension popup
│   ├── new-tab/              # Custom new tab page
│   └── analytics/            # Analytics dashboard
└── packages/                 # Shared utilities
```

### Event Flow
```
User Activity → Content Script → Background Worker → AI Agent → UI Update
```

## 🛠️ Development

### Build Commands
```bash
# Development mode with hot reload
pnpm dev

# Production build
pnpm build

# Type checking
pnpm type-check

# Linting
pnpm lint

# Format code
pnpm format
```

### Testing
```bash
# Run tests
pnpm test

# E2E tests
pnpm e2e
```

## 📝 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
CEB_EXAMPLE=example_env
CEB_DEV_LOCALE=
CEB_CI=
```

### Gemini API Setup
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update `chrome-extension/src/background/aiAgent.ts`:
   ```typescript
   const GEMINI_API_KEY = 'your-actual-api-key-here';
   ```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React, Vite, and TypeScript
- Powered by Google Gemini AI
- Icons by Lucide
- Charts by Recharts

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@flowstateai.com (placeholder)

## 🗺️ Roadmap

- [ ] Website blocking during flow mode
- [ ] Pomodoro timer integration
- [ ] Multi-device sync
- [ ] Custom flow algorithms
- [ ] Desktop notifications
- [ ] Calendar integration
- [ ] Export analytics data
- [ ] Team collaboration features

---

**Made with ❤️ for productivity enthusiasts**

*Achieve your peak performance with AI-powered flow state detection*
