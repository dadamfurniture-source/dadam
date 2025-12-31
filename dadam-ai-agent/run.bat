@echo off
chcp 65001 > nul
title Vibe Cabinet AI Agent

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║            Vibe Cabinet AI Agent 실행 중...                ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

:: 현재 디렉토리 확인
echo [1] 현재 위치: %CD%
echo.

:: Python 확인
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [오류] Python이 설치되지 않았거나 PATH에 없습니다.
    echo        https://www.python.org/downloads/ 에서 설치하세요.
    pause
    exit /b 1
)
echo [OK] Python 확인됨

:: Node.js 확인
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [오류] Node.js가 설치되지 않았거나 PATH에 없습니다.
    echo        https://nodejs.org/ 에서 설치하세요.
    pause
    exit /b 1
)
echo [OK] Node.js 확인됨

:: backend 폴더 확인
if not exist "backend" (
    echo [오류] backend 폴더를 찾을 수 없습니다.
    echo        dadam-ai-agent 폴더에서 실행하세요.
    pause
    exit /b 1
)
echo [OK] backend 폴더 확인됨

:: frontend 폴더 확인
if not exist "frontend" (
    echo [오류] frontend 폴더를 찾을 수 없습니다.
    echo        dadam-ai-agent 폴더에서 실행하세요.
    pause
    exit /b 1
)
echo [OK] frontend 폴더 확인됨

echo.
echo  🌐 프론트엔드: http://localhost:3000
echo  🔧 백엔드 API: http://localhost:8000/docs
echo.
echo  종료하려면 이 창을 닫으세요.
echo ════════════════════════════════════════════════════════════
echo.

:: 백엔드 실행 (새 창)
start "Backend Server" cmd /k "cd /d %CD%\backend && python -m uvicorn main:app --reload --port 8000"

:: 잠시 대기
timeout /t 3 /nobreak > nul

:: 프론트엔드 실행 (새 창)
start "Frontend Server" cmd /k "cd /d %CD%\frontend && npm run dev"

:: 잠시 대기 후 브라우저 열기
timeout /t 5 /nobreak > nul
start http://localhost:3000

echo 서버가 시작되었습니다. 브라우저가 자동으로 열립니다.
echo.
pause
