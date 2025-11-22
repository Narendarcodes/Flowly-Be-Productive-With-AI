@echo off
echo ========================================
echo Flow-State AI Assistant - Windows Build
echo ========================================
echo.

REM Step 1: Create .env file
echo [1/4] Creating .env file...
if not exist .env (
    copy .example.env .env >nul 2>&1
    echo .env file created
) else (
    echo .env file already exists
)
echo.

REM Step 2: Clean dist folder
echo [2/4] Cleaning dist folder...
if exist dist (
    rmdir /s /q dist
    echo dist folder cleaned
) else (
    echo No dist folder to clean
)
echo.

REM Step 3: Build with turbo (bypassing bash scripts)
echo [3/4] Building extension with turbo...
echo This may take 1-2 minutes...
call npx turbo build
echo.

REM Step 4: Verify build
echo [4/4] Verifying build...
if exist dist\manifest.json (
    echo.
    echo ========================================
    echo BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo The extension is ready in the 'dist' folder.
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
    echo BUILD FAILED!
    echo ========================================
    echo.
    echo The dist/manifest.json file was not created.
    echo Check the error messages above.
    echo.
)

pause
