@echo off
echo ========================================
echo Pushing to GitHub Repository
echo ========================================
echo.

echo [1/5] Checking current branch...
git branch
echo.

echo [2/5] Setting remote URL...
git remote set-url origin https://github.com/Narendarcodes/Flowly-Be-Productive-With-AI.git
git remote -v
echo.

echo [3/5] Adding all files...
git add .
echo.

echo [4/5] Committing changes...
git commit -m "feat: Flow-State AI Assistant - Complete implementation with AI-powered flow detection, analytics dashboard, and custom UI"
echo.

echo [5/5] Pushing to GitHub...
git push -u origin main
echo.

echo ========================================
echo Push Complete!
echo ========================================
echo.
echo Repository: https://github.com/Narendarcodes/Flowly-Be-Productive-With-AI
echo.

pause
