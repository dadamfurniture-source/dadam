@echo off
chcp 65001 > nul
title Vibe Cabinet AI Agent - Install

echo.
echo ========================================
echo    Vibe Cabinet AI Agent - INSTALL
echo ========================================
echo.

:: Check Python
echo [1/4] Checking Python...
python --version > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed!
    echo Please install from: https://www.python.org/downloads/
    pause
    exit /b 1
)
echo [OK] Python found

:: Check Node.js
echo [2/4] Checking Node.js...
node --version > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please install from: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found

:: Install Backend
echo [3/4] Installing backend dependencies...
cd backend
python -m pip install --upgrade pip -q
pip install -r requirements.txt -q
if errorlevel 1 (
    echo [ERROR] Backend install failed
    pause
    exit /b 1
)
cd ..
echo [OK] Backend installed

:: Install Frontend
echo [4/4] Installing frontend dependencies...
cd frontend
call npm install --silent
if errorlevel 1 (
    echo [ERROR] Frontend install failed
    pause
    exit /b 1
)
cd ..
echo [OK] Frontend installed

echo.
echo ========================================
echo    INSTALL COMPLETE!
echo.
echo    Run: run.bat
echo ========================================
echo.
pause
