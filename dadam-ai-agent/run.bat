@echo off
chcp 65001 > nul
title Vibe Cabinet AI Agent

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║            Vibe Cabinet AI Agent 실행 중...                ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo  🌐 프론트엔드: http://localhost:3000
echo  🔧 백엔드 API: http://localhost:8000/docs
echo.
echo  종료하려면 이 창을 닫으세요.
echo ════════════════════════════════════════════════════════════
echo.

:: 백엔드 실행 (새 창)
start "Backend Server" cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"

:: 잠시 대기
timeout /t 3 /nobreak > nul

:: 프론트엔드 실행 (새 창)
start "Frontend Server" cmd /k "cd frontend && npm run dev"

:: 잠시 대기 후 브라우저 열기
timeout /t 5 /nobreak > nul
start http://localhost:3000

echo 서버가 시작되었습니다. 브라우저가 자동으로 열립니다.
echo.
pause
