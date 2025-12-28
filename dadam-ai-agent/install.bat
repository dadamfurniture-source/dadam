@echo off
chcp 65001 > nul
title Vibe Cabinet AI Agent - 설치 및 실행

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         Vibe Cabinet AI Agent - 설치 프로그램              ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

:: Python 확인
echo [1/4] Python 확인 중...
python --version > nul 2>&1
if errorlevel 1 (
    echo ❌ Python이 설치되어 있지 않습니다.
    echo    https://www.python.org/downloads/ 에서 설치해주세요.
    pause
    exit /b 1
)
echo ✅ Python 확인 완료

:: Node.js 확인
echo [2/4] Node.js 확인 중...
node --version > nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js가 설치되어 있지 않습니다.
    echo    https://nodejs.org/ 에서 설치해주세요.
    pause
    exit /b 1
)
echo ✅ Node.js 확인 완료

:: 백엔드 설치
echo [3/4] 백엔드 의존성 설치 중...
cd backend
python -m pip install --upgrade pip -q
pip install -r requirements.txt -q
if errorlevel 1 (
    echo ❌ 백엔드 설치 실패
    pause
    exit /b 1
)
cd ..
echo ✅ 백엔드 설치 완료

:: 프론트엔드 설치
echo [4/4] 프론트엔드 의존성 설치 중...
cd frontend
call npm install --silent
if errorlevel 1 (
    echo ❌ 프론트엔드 설치 실패
    pause
    exit /b 1
)
cd ..
echo ✅ 프론트엔드 설치 완료

echo.
echo ════════════════════════════════════════════════════════════
echo  ✅ 설치 완료!
echo.
echo  실행하려면: run.bat 을 더블클릭하세요
echo ════════════════════════════════════════════════════════════
echo.
pause
