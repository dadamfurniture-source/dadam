"""
Vibe Cabinet Agent - AI 기반 가구 설계 백엔드 서버
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from routers import chat, design, calculate
from models.schemas import HealthCheck


@asynccontextmanager
async def lifespan(app: FastAPI):
    """앱 시작/종료 시 실행"""
    print("🚀 Vibe Cabinet AI Agent 서버 시작...")
    yield
    print("👋 서버 종료")


app = FastAPI(
    title="Vibe Cabinet AI Agent",
    description="AI 기반 가구 설계 및 자동 자재 산출 API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 특정 도메인만 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(design.router, prefix="/api/design", tags=["Design"])
app.include_router(calculate.router, prefix="/api/calculate", tags=["Calculate"])


@app.get("/", response_model=HealthCheck)
async def health_check():
    """서버 상태 확인"""
    return HealthCheck(
        status="healthy",
        message="Vibe Cabinet AI Agent 서버가 정상 작동 중입니다."
    )


@app.get("/api/health", response_model=HealthCheck)
async def api_health():
    """API 상태 확인"""
    return HealthCheck(status="healthy", message="API 정상")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
