@echo off
echo Building Flow-State AI Assistant Extension...
echo.

echo Step 1: Copying environment file...
copy .example.env .env

echo.
echo Step 2: Installing dependencies (if needed)...
call pnpm install

echo.
echo Step 3: Building extension...
call pnpm build

echo.
echo Build complete! Check the dist folder.
echo.
echo To load the extension:
echo 1. Open Chrome and go to chrome://extensions/
echo 2. Enable "Developer mode"
echo 3. Click "Load unpacked"
echo 4. Select the "dist" folder from this directory
echo.
pause
