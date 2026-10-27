import { readFileSync } from 'node:fs';
import type { ManifestType } from '@extension/shared';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

/**
 * Permissions are kept to what Flowly actually uses:
 * - storage: settings, model weights, session history (all local)
 * - tabs: read the active tab's URL/title for the goal-relevance check (during a session only)
 * - alarms: periodic scoring tick that survives service-worker sleep
 * - idle: active/idle signal for the focus score
 * - declarativeNetRequest: redirect blocked sites to the blocked page
 * - offscreen: run the on-device embedding model / Chrome built-in AI
 * - notifications, sidePanel: UI
 * host_permissions are http(s) only (no file://, no <all_urls>); they let the redirect rules and the
 * activity-count content script apply, and allow the optional Gemini call with the user's own key.
 */
const manifest = {
  manifest_version: 3,
  default_locale: 'en',
  name: '__MSG_extensionName__',
  version: packageJson.version,
  description: '__MSG_extensionDescription__',
  minimum_chrome_version: '116',
  host_permissions: ['http://*/*', 'https://*/*'],
  permissions: [
    'storage',
    'tabs',
    'alarms',
    'idle',
    'declarativeNetRequest',
    'offscreen',
    'notifications',
    'sidePanel',
  ],
  options_page: 'options/index.html',
  background: {
    service_worker: 'background.js',
    type: 'module',
  },
  action: {
    default_popup: 'popup/index.html',
    default_icon: 'icon-34.png',
    default_title: 'Flowly',
  },
  icons: {
    '34': 'icon-34.png',
    '128': 'icon-128.png',
  },
  content_scripts: [
    {
      // Counts key presses and pointer/scroll events (numbers only) — see PRIVACY.md.
      matches: ['http://*/*', 'https://*/*'],
      js: ['content/all.iife.js'],
      run_at: 'document_idle',
    },
  ],
  // ONNX Runtime needs WebAssembly compilation in extension pages (offscreen document).
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
  },
  web_accessible_resources: [
    {
      // Required so declarativeNetRequest can redirect top-level navigations to the blocked page.
      resources: ['blocked/index.html', 'blocked/assets/*'],
      matches: ['http://*/*', 'https://*/*'],
    },
  ],
  side_panel: {
    default_path: 'side-panel/index.html',
  },
} satisfies ManifestType;

export default manifest;
