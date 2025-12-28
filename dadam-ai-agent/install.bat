@echo off
title Vibe Cabinet AI Agent - Install

echo.
echo ============================================================
echo          Vibe Cabinet AI Agent - Installation
echo ============================================================
echo.

:: Check Python
echo [1/4] Checking Python...
python --version > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed.
    echo         Please install from https://www.python.org/downloads/
    pause
    exit /b 1
)
echo [OK] Python found

:: Check Node.js
echo [2/4] Checking Node.js...
node --version > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed.
    echo         Please install from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found

:: Install Backend
echo [3/4] Installing backend dependencies...
cd backend
python -m pip install --upgrade pip -q
pip install -r requirements.txt
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
call npm install
if errorlevel 1 (
    echo [ERROR] Frontend install failed
    pause
    exit /b 1
)
cd ..
echo [OK] Frontend installed

echo.
echo ============================================================
echo  Installation Complete!
echo.
echo  To run: double-click run.bat
echo ============================================================
echo.
pause
