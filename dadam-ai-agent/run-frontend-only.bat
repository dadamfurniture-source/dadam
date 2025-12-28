@echo off
chcp 65001 > nul
title 프론트엔드만 실행

echo 프론트엔드 서버 시작 중...
echo http://localhost:3000 에서 확인
echo.

cd frontend
npm run dev
