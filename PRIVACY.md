# Flowly privacy

Flowly is designed so that your browsing stays on your device.

## What Flowly reads

| Data | When | Why |
| --- | --- | --- |
| **Counts** of key presses, pointer movements and scroll events on web pages | Only while the page is visible and focused; can be turned off in *Options → Privacy* | Estimate how actively you're working. Flowly never records *which* keys you press or any page text. |
| The active tab's **URL and title** | Only during a focus session | Check whether the page fits your goal; enforce your blocklist. |
| Idle state (`chrome.idle`: active / idle / locked) | During a focus session | Don't count time away as focus. |

Flowly does **not** read page content, form fields, passwords, cookies or history.

## What Flowly stores

Everything is in `chrome.storage` in your browser profile (not synced):

- Settings: goal, session length, block/allow lists, privacy toggles, optional AI provider and API key.
- The active session and a history of past sessions (time, goal, focused minutes, score timeline).
- Your "Were you focused?" answers with the session's average feature numbers, and the small
  personal model trained from them.

*Options → Your data → Reset all data* deletes all of it.

## What leaves your device

By default: **nothing about you.**

- **Model download (optional, on by default):** the on-device relevance model
  (`Xenova/all-MiniLM-L6-v2`, ~23 MB) is downloaded once from the Hugging Face Hub and cached by
  the browser. This is a plain file download; no goal, URL or title is sent. Turn off *On-device
  relevance model* to use keyword matching and skip the download.
- **Gemini API (opt-in):** only if you choose *Gemini API* and enter your own key. Then, for tabs
  the on-device check can't decide, Flowly sends your **goal, the site's hostname and the tab
  title** to Google's Gemini API (`gemini-2.5-flash-lite`) — at most once every 20 seconds, cached
  per page. Never page content, keystrokes or full URLs. Google's API terms apply to those
  requests. The key is stored only in `chrome.storage.local` and sent in a request header.
- **Chrome built-in AI (opt-in):** Gemini Nano runs inside Chrome on your device.

No analytics, telemetry or tracking of any kind is included. No API key is bundled with the
extension.

## Permissions

| Permission | Used for |
| --- | --- |
| `storage` | Local settings, sessions, model. |
| `tabs` | Read the active tab's URL/title during a session. |
| `alarms` | 30-second scoring tick and snooze expiry. |
| `idle` | Active/idle signal. |
| `declarativeNetRequest` | Redirect blocked sites to the blocked page. |
| `offscreen` | Run the embedding model / Chrome built-in AI off the service worker. |
| `notifications` | Session end, focus check-in, gentle nudges (can be turned off). |
| `sidePanel` | The side panel UI. |
| Host access `http://*/*`, `https://*/*` | Lets redirect rules and the activity-count content script apply to web pages, and allows the optional Gemini request. No `file://` or other schemes. |
