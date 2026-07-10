@echo off
title Hexagon Cafe & Restaurant - Git Update Helper
color 0B

echo ===================================================
echo       HEXAGON CAFE - GIT UPDATE AUTOMATION
echo ===================================================
echo.

:: Check if Git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Git is not installed or not found in your system PATH.
    echo Please install Git from https://git-scm.com/ and try again.
    echo.
    pause
    exit /b
)

:: Show current repository status
echo [1] Checking repository status...
git status -s
echo.

:: Ask for custom commit message
echo [2] Enter your commit message:
set /p commit_msg="> "

:: If user pressed enter without message, set default
if "%commit_msg%"=="" (
    set commit_msg=Update Hexagon Cafe website
)

echo.
echo [3] Staging all changes...
git add -A

echo.
echo [4] Committing changes...
git commit -m "%commit_msg%"

echo.
echo [5] Pushing changes to GitHub (main branch)...
git push origin main

if %errorlevel% eq 0 (
    color 0A
    echo.
    echo ===================================================
    echo       SUCCESS: REPOSITORY UPDATED SUCCESSFULLY!
    echo ===================================================
) else (
    color 0C
    echo.
    echo ===================================================
    echo       ERROR: FAILED TO PUSH CHANGES TO GITHUB
    echo ===================================================
    echo Please check your internet connection or Git credentials.
)

echo.
pause
