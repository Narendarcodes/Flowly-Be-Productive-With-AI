# Build Instructions for Flow-State AI Assistant

## Prerequisites
- Node.js (v18+)
- pnpm (v8+)

## Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```

## Build
1. Run the build command:
   ```bash
   pnpm build
   ```
   This will generate the extension in the `dist` folder.

## Load into Chrome
1. Open Chrome and navigate to `chrome://extensions`.
2. Enable "Developer mode" in the top right.
3. Click "Load unpacked".
4. Select the `dist` folder in this project directory.

## Usage
- **Popup**: Click the extension icon to see your Flow Score.
- **Analytics**: Click "View Analytics Dashboard" in the popup to open the full dashboard.
- **Flow Detection**: Start typing on any webpage. The extension will track your cadence and errors.
- **AI Agent**: The background script will periodically analyze your metrics (simulated if no API key).
  - **Important**: Open `chrome-extension/src/background/aiAgent.ts` and replace `YOUR_GEMINI_API_KEY` with your actual key.

## Troubleshooting
- If you see type errors during build, try running `pnpm install` again.
- If the extension doesn't load, check the `dist` folder structure. It should contain `manifest.json`.
