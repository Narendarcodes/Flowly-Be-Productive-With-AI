@echo off
echo ========================================
echo Reinitializing Git Repository
echo ========================================
echo.

echo [1/6] Backing up .git folder (just in case)...
if exist .git (
    if exist .git.backup (
        rmdir /s /q .git.backup
    )
    xcopy .git .git.backup /E /I /H /Y >nul 2>&1
    echo Backup created: .git.backup
) else (
    echo No .git folder found
)
echo.

echo [2/6] Removing old .git folder...
if exist .git (
    rmdir /s /q .git
    echo Old .git folder removed
)
echo.

echo [3/6] Initializing new Git repository...
git init
git branch -M main
echo New repository initialized
echo.

echo [4/6] Adding all files...
git add .
echo Files added
echo.

echo [5/6] Creating initial commit...
git commit -m "feat: Flow-State AI Assistant - Complete implementation with AI-powered flow detection, analytics dashboard, and custom UI"
echo Commit created
echo.

echo [6/6] Adding remote and pushing...
git remote add origin https://github.com/Narendarcodes/Flowly-Be-Productive-With-AI.git
git push -u origin main
echo.

echo ========================================
echo Repository Setup Complete!
echo ========================================
echo.
echo Repository: https://github.com/Narendarcodes/Flowly-Be-Productive-With-AI
echo.
echo If push failed due to authentication:
echo 1. You'll need a GitHub Personal Access Token
echo 2. Go to GitHub.com - Settings - Developer settings - Personal access tokens
echo 3. Generate new token (classic) with 'repo' scope
echo 4. Use the token as your password when prompted
echo.

pause
