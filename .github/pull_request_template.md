## What & why

## How to test
- [ ] `pnpm type-check && pnpm lint && pnpm test`
- [ ] `pnpm build`, then load `dist/` unpacked in Chrome
- [ ] `pnpm -F @extension/e2e e2e` (after `pnpm build`)

## Privacy check
- [ ] No API keys, secrets or personal data added to the repo or the bundle
- [ ] Nothing new leaves the device (or PRIVACY.md is updated)
