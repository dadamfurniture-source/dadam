@echo off
chcp 65001 > nul
title 백엔드만 실행

echo 백엔드 서버 시작 중...
echo http://localhost:8000/docs 에서 API 문서 확인
echo.

cd backend
python -m uvicorn main:app --reload --port 8000
