# ERROR FIX: "No package.json found"

## Problem
You ran `pnpm install` from the wrong directory:
```
C:\Users\NARENDAR\Documents\Hackathons\NITSHACK
```

But you need to be in:
```
C:\Users\NARENDAR\Documents\Hackathons\NITSHACK\chrome-extension-boilerplate-react-vite
```

## Solution

### Option 1: Navigate to the correct folder first
```bash
cd chrome-extension-boilerplate-react-vite
pnpm install
pnpm build
```

### Option 2: Use the full path
```bash
cd C:\Users\NARENDAR\Documents\Hackathons\NITSHACK\chrome-extension-boilerplate-react-vite
pnpm install
pnpm build
```

### Option 3: Use the build.bat file
1. Open File Explorer
2. Navigate to: `C:\Users\NARENDAR\Documents\Hackathons\NITSHACK\chrome-extension-boilerplate-react-vite`
3. Double-click `build.bat`

## Complete Build Steps

```bash
# Step 1: Navigate to project folder
cd C:\Users\NARENDAR\Documents\Hackathons\NITSHACK\chrome-extension-boilerplate-react-vite

# Step 2: Install dependencies
pnpm install

# Step 3: Build extension
pnpm build

# Step 4: Verify dist folder was created
dir dist
```

## After Building

You should see output like:
```
✓ Built chrome-extension
✓ Built content-script
✓ Built content-ui
✓ Built popup
✓ Built analytics
```

And a `dist` folder will be created with `manifest.json` inside.

## Then Load in Chrome

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select: `C:\Users\NARENDAR\Documents\Hackathons\NITSHACK\chrome-extension-boilerplate-react-vite\dist`
5. Done! ✅
