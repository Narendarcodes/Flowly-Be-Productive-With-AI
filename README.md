# Flowly - Be Productive With AI

Flowly is a Chrome extension that estimates a user's flow state from browser activity and responds with lightweight productivity interventions. It combines content scripts, a background worker, extension UI pages, local storage, and optional Gemini analysis.

The project is experimental. The scoring model is heuristic-first, and AI calls should be treated as an enhancement rather than the core source of truth.

![Version](https://img.shields.io/badge/version-1.0.0-0f766e.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-f59e0b.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg)

## What It Does

- Tracks browser activity signals such as typing cadence, errors, mouse movement, and tab switching
- Converts those signals into a flow score from `0` to `100`
- Classifies the current state as passive, active, flow, distracted, or break
- Uses optional Gemini analysis for flow-state reasoning and URL relevance checks
- Blocks common distraction sites when they conflict with the user's current goal
- Provides extension surfaces for popup, side panel, analytics, options, new tab, and content UI

## Architecture

```text
content scripts
  -> collect interaction metrics
  -> background service worker
  -> flow engine
  -> optional AI agent
  -> storage and UI updates

extension pages
  -> popup
  -> side panel
  -> analytics
  -> options
  -> new tab
```

## Tech Stack

| Area | Tools |
| --- | --- |
| Extension | Chrome Manifest V3 |
| UI | React 19, TypeScript, Tailwind CSS |
| Build | Vite, Turbo, pnpm |
| Storage | Chrome Storage API |
| AI | Gemini API through configurable env value |
| Tests | WebdriverIO E2E structure |

## Repository Layout

```text
chrome-extension/
  manifest.ts
  src/background/
    aiAgent.ts
    flowEngine.ts
    index.ts
pages/
  popup/
  side-panel/
  analytics/
  content/
  content-ui/
  options/
  new-tab/
packages/
  shared/
  storage/
  ui/
  vite-config/
tests/e2e/
```

## Setup

Install dependencies:

```powershell
pnpm install
```

Create a local environment file:

```powershell
Copy-Item .example.env .env
```

Add a Gemini key only if you want AI-backed analysis:

```env
CEB_GEMINI_API_KEY=replace_with_your_gemini_key
```

If `CEB_GEMINI_API_KEY` is not set, the extension falls back to local heuristic checks.

## Build

```powershell
pnpm build
```

For a fast Windows build:

```powershell
.\build-quick.bat
```

Load the built extension:

1. Open `chrome://extensions/`
2. Enable Developer mode
3. Click Load unpacked
4. Select the `dist` folder

## Development

```powershell
pnpm dev
pnpm type-check
pnpm lint
pnpm e2e
```

## Security Notes

- Do not hardcode Gemini or other API keys in extension source.
- Keep `.env` local. It is ignored by git.
- Treat browser activity metrics as sensitive user data.
- Review `host_permissions` before publishing because this extension currently requests broad page access.
- The project should not be published until permissions are narrowed and privacy copy is written.

## Current Status

Working areas:

- Flow score calculation
- Background service worker wiring
- Popup, side panel, analytics, options, and new-tab surfaces
- Heuristic URL relevance checks
- Optional Gemini integration through env configuration

Needs improvement:

- More tests around the flow scoring algorithm
- Safer defaults for permissions and host access
- A real privacy policy before public distribution
- Better user controls for intervention frequency
- Chrome Web Store packaging checklist
