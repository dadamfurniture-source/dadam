@echo off
title Dadam AI Agent

echo.
echo ============================================================
echo            Dadam AI Agent - Starting...
echo ============================================================
echo.
echo  Main App: http://localhost:8000
echo.
echo  Close this window to stop the server.
echo ============================================================
echo.

cd backend

:: Check if virtual environment exists
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
)

:: Start server
python main.py

pause
