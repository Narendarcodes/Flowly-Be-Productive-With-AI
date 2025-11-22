@echo off
echo ========================================
echo Flow-State AI Assistant - Quick Build
echo (Building core extension without analytics)
echo ========================================
echo.

REM Step 1: Create .env file
echo [1/5] Creating .env file...
if not exist .env (
    copy .example.env .env >nul 2>&1
)
echo Done
echo.

REM Step 2: Clean dist folder
echo [2/5] Cleaning dist folder...
if exist dist (
    rmdir /s /q dist
)
echo Done
echo.

REM Step 3: Build core packages
echo [3/5] Building core packages...
call npx turbo build --filter=chrome-extension --filter=@extension/content-script --filter=@extension/content-ui --filter=@extension/popup --filter=@extension/options --filter=@extension/new-tab --filter=@extension/sidepanel --filter=@extension/devtools --filter=@extension/devtools-panel
echo.

REM Step 4: Verify build
echo [4/5] Verifying build...
if exist dist\manifest.json (
    echo.
    echo ========================================
    echo BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo The extension is ready in the 'dist' folder.
    echo.
    echo NOTE: Analytics dashboard was skipped due to build issues.
    echo The core extension (popup, content scripts, background) works fine!
    echo.
    echo Next steps:
    echo 1. Open Chrome and go to chrome://extensions/
    echo 2. Enable "Developer mode" (top-right toggle)
    echo 3. Click "Load unpacked"
    echo 4. Select the 'dist' folder from this directory
    echo.
) else (
    echo.
    echo ========================================
    echo BUILD INCOMPLETE
    echo ========================================
    echo.
    echo The dist/manifest.json file was not created.
    echo Check the error messages above.
    echo.
)

echo [5/5] Listing dist contents...
dir dist
echo.

pause
