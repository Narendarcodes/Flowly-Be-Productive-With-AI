# WINDOWS BUILD FIX - Step by Step

## ✅ Good News
The packages installed successfully! (992 packages)
The error was just the postinstall script trying to use bash (which you don't have).

## 🚀 How to Build (Choose ONE method)

### METHOD 1: Use the Windows Build Script (EASIEST)
1. Open File Explorer
2. Navigate to: `C:\Users\NARENDAR\Documents\Hackathons\NITSHACK\chrome-extension-boilerplate-react-vite`
3. **Double-click `build-windows.bat`**
4. Wait for it to complete (1-2 minutes)
5. Done! The `dist` folder will be created

### METHOD 2: Manual Commands
Open Command Prompt in the project folder and run these commands **one by one**:

```cmd
cd C:\Users\NARENDAR\Documents\Hackathons\NITSHACK\chrome-extension-boilerplate-react-vite

REM Create .env file
copy .example.env .env

REM Clean dist folder (if it exists)
rmdir /s /q dist

REM Build the extension
npx turbo build
```

### METHOD 3: PowerShell Alternative
```powershell
cd C:\Users\NARENDAR\Documents\Hackathons\NITSHACK\chrome-extension-boilerplate-react-vite

# Create .env file
Copy-Item .example.env .env

# Clean dist folder
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# Build
npx turbo build
```

## 📋 What Each Command Does

1. **`copy .example.env .env`** - Creates environment file (replaces the bash script)
2. **`rmdir /s /q dist`** - Cleans old build files
3. **`npx turbo build`** - Builds all extension components

## ✅ Verify Build Success

After running the build, check:

```cmd
dir dist
```

You should see:
```
dist/
├── manifest.json          ← MUST exist!
├── background.js
├── popup/
├── content/
├── content-ui/
└── analytics/
```

## 🎯 Load Extension in Chrome

1. Open Chrome
2. Go to: `chrome://extensions/`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked"
5. Navigate to: `C:\Users\NARENDAR\Documents\Hackathons\NITSHACK\chrome-extension-boilerplate-react-vite\dist`
6. Click "Select Folder"
7. Done! ✅

## 🐛 If Build Fails

### Error: "turbo: command not found"
```cmd
npm install -g turbo
```

### Error: "Cannot find module"
```cmd
pnpm install --force
```

### Still having issues?
Try development mode instead:
```cmd
npx turbo ready
npx turbo watch dev
```

This will create the dist folder in watch mode.

## 📝 Summary

The bash script error is **not a problem**. The packages installed fine.
Just run **`build-windows.bat`** or the manual commands above to build the extension.

---

**Quick Check**: After building, run `dir dist\manifest.json` - if you see the file, you're ready to load in Chrome!
