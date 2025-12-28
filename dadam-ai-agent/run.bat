@echo off
title Vibe Cabinet AI Agent

echo.
echo ========================================
echo    Vibe Cabinet AI Agent - RUNNING
echo ========================================
echo.
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8000/docs
echo.
echo    Close this window to stop.
echo ========================================
echo.

:: Start Backend (new window)
start "Backend" cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"

:: Wait
timeout /t 3 /nobreak > nul

:: Start Frontend (new window)
start "Frontend" cmd /k "cd frontend && npm run dev"

:: Wait and open browser
timeout /t 5 /nobreak > nul
start http://localhost:3000

echo Servers started. Browser opening...
echo.
pause
