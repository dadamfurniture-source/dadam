#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║            Vibe Cabinet AI Agent 실행 중...                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo " 🌐 프론트엔드: http://localhost:3000"
echo " 🔧 백엔드 API: http://localhost:8000/docs"
echo ""
echo " 종료하려면 Ctrl+C를 누르세요."
echo "════════════════════════════════════════════════════════════"
echo ""

# 현재 디렉토리 저장
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

# 백엔드 실행 (백그라운드)
cd "$BASE_DIR/backend"
python3 -m uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
echo "백엔드 시작됨 (PID: $BACKEND_PID)"

# 잠시 대기
sleep 3

# 프론트엔드 실행 (백그라운드)
cd "$BASE_DIR/frontend"
npm run dev &
FRONTEND_PID=$!
echo "프론트엔드 시작됨 (PID: $FRONTEND_PID)"

# 잠시 대기 후 브라우저 열기
sleep 5

# OS에 따라 브라우저 열기
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3000 2>/dev/null || echo "브라우저를 열 수 없습니다. http://localhost:3000 으로 접속하세요."
fi

# 종료 핸들러
cleanup() {
    echo ""
    echo "서버 종료 중..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "종료됨"
    exit 0
}

trap cleanup SIGINT SIGTERM

# 대기
wait
