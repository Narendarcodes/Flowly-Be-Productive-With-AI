# Quick Fix: "Manifest file is missing or unreadable" Error

## Problem
You're seeing this error because the extension hasn't been built yet. The `dist` folder doesn't exist, which is what Chrome needs to load the extension.

## Solution: Build the Extension

### Option 1: Use the Build Script (Easiest)
1. Double-click `build.bat` in the project folder
2. Wait for the build to complete
3. The `dist` folder will be created

### Option 2: Manual Command Line
Open PowerShell or Command Prompt in the project folder and run:

```bash
# Copy environment file
copy .example.env .env

# Install dependencies (first time only)
pnpm install

# Build the extension
pnpm build
```

### Option 3: If pnpm build fails (Windows bash script issues)
Try using Git Bash or WSL:

```bash
# In Git Bash
pnpm build
```

OR build manually with turbo:

```bash
# Clean first
rmdir /s /q dist

# Set environment variables
set CEB_DEV=false

# Build with turbo
npx turbo build
```

## After Building

Once the build completes successfully, you should see:

```
dist/
├── manifest.json          ← This file MUST exist
├── background.js
├── popup/
├── content/
├── content-ui/
└── analytics/
```

## Loading the Extension

1. Go to `chrome://extensions/`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Navigate to your project folder
5. **Select the `dist` folder** (not the root folder!)
6. Click "Select Folder"

## Verification

After loading, you should see:
- ✅ Extension appears in the list
- ✅ No error messages
- ✅ Extension icon in toolbar
- ✅ Status shows "Enabled"

## Common Issues

### "Could not load manifest" persists
- **Cause**: Selected wrong folder
- **Fix**: Make sure you select the `dist` folder, not the root project folder

### dist folder is empty
- **Cause**: Build failed
- **Fix**: Check the terminal output for errors
- Run `pnpm install` first
- Try `pnpm dev` instead for development mode

### Build hangs or fails
- **Cause**: Windows bash script compatibility
- **Fix**: Use Git Bash, WSL, or manual turbo commands

## Need Help?

If the build still fails, share the error message from the terminal and I can help debug it.

---

**Quick Test**: After building, check if `dist/manifest.json` exists. If yes, you're ready to load!
