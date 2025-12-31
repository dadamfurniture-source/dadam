@echo off
chcp 949 > nul
title Vibe Cabinet AI Agent - Install

echo.
echo ========================================
echo   Vibe Cabinet AI Agent - Install
echo ========================================
echo.

:: Python check
echo [1/4] Python check...
python --version > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed.
    echo         https://www.python.org/downloads/
    pause
    exit /b 1
)
echo [OK] Python found

:: Node.js check
echo [2/4] Node.js check...
node --version > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed.
    echo         https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found

:: Backend install
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

:: Frontend install
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
echo ========================================
echo   Install Complete!
echo.
echo   To run: double-click run.bat
echo ========================================
echo.
pause
