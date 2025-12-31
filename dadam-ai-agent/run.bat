@echo off
chcp 949 > nul
title Vibe Cabinet AI Agent

echo.
echo ========================================
echo   Vibe Cabinet AI Agent - Starting...
echo ========================================
echo.

:: Current directory
echo [INFO] Current path: %CD%
echo.

:: Python check
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python not found in PATH
    echo         https://www.python.org/downloads/
    pause
    exit /b 1
)
echo [OK] Python found

:: Node.js check
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found in PATH
    echo         https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found

:: backend folder check
if not exist "backend" (
    echo [ERROR] backend folder not found
    echo         Run from dadam-ai-agent folder
    pause
    exit /b 1
)
echo [OK] backend folder found

:: frontend folder check
if not exist "frontend" (
    echo [ERROR] frontend folder not found
    echo         Run from dadam-ai-agent folder
    pause
    exit /b 1
)
echo [OK] frontend folder found

echo.
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000/docs
echo.
echo   Close this window to stop servers
echo ========================================
echo.

:: Start backend (new window)
start "Backend Server" cmd /k "cd /d %CD%\backend && python -m uvicorn main:app --reload --port 8000"

:: Wait
timeout /t 3 /nobreak > nul

:: Start frontend (new window)
start "Frontend Server" cmd /k "cd /d %CD%\frontend && npm run dev"

:: Wait and open browser
timeout /t 5 /nobreak > nul
start http://localhost:3000

echo Servers started. Browser will open automatically.
echo.
pause
