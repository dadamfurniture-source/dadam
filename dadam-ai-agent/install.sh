#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║         Vibe Cabinet AI Agent - 설치 프로그램              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Python 확인
echo "[1/4] Python 확인 중..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python3가 설치되어 있지 않습니다.${NC}"
    echo "   brew install python3 또는 apt install python3"
    exit 1
fi
echo -e "${GREEN}✅ Python 확인 완료${NC}"

# Node.js 확인
echo "[2/4] Node.js 확인 중..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js가 설치되어 있지 않습니다.${NC}"
    echo "   https://nodejs.org/ 에서 설치해주세요."
    exit 1
fi
echo -e "${GREEN}✅ Node.js 확인 완료${NC}"

# 백엔드 설치
echo "[3/4] 백엔드 의존성 설치 중..."
cd backend
python3 -m pip install --upgrade pip -q
pip3 install -r requirements.txt -q
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 백엔드 설치 실패${NC}"
    exit 1
fi
cd ..
echo -e "${GREEN}✅ 백엔드 설치 완료${NC}"

# 프론트엔드 설치
echo "[4/4] 프론트엔드 의존성 설치 중..."
cd frontend
npm install --silent
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 프론트엔드 설치 실패${NC}"
    exit 1
fi
cd ..
echo -e "${GREEN}✅ 프론트엔드 설치 완료${NC}"

echo ""
echo "════════════════════════════════════════════════════════════"
echo " ✅ 설치 완료!"
echo ""
echo " 실행하려면: ./run.sh"
echo "════════════════════════════════════════════════════════════"
echo ""
