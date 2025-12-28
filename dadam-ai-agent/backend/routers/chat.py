"""
채팅 API 라우터
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from typing import Optional
import json

from models.schemas import ChatRequest, ChatResponse
from agents.design_agent import DesignAgent

router = APIRouter()

# 에이전트 싱글톤
_agent: Optional[DesignAgent] = None


def get_agent() -> DesignAgent:
    global _agent
    if _agent is None:
        _agent = DesignAgent()
    return _agent


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    AI 채팅 엔드포인트

    - message: 사용자 메시지
    - session_id: 세션 ID (선택)
    - context: 현재 설계 상태 (선택)
    """
    agent = get_agent()

    result = agent.chat(
        message=request.message,
        session_id=request.session_id,
        context=request.context
    )

    return ChatResponse(
        message=result["message"],
        session_id=result["session_id"],
        suggestions=result.get("suggestions"),
        actions=result.get("actions")
    )


@router.post("/stream")
async def chat_stream(request: ChatRequest):
    """
    스트리밍 채팅 엔드포인트 (향후 구현)
    """
    # TODO: 스트리밍 응답 구현
    agent = get_agent()
    result = agent.chat(
        message=request.message,
        session_id=request.session_id,
        context=request.context
    )

    async def generate():
        # 현재는 단순 응답, 향후 토큰별 스트리밍
        yield f"data: {json.dumps(result, ensure_ascii=False)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream"
    )


@router.delete("/session/{session_id}")
async def clear_session(session_id: str):
    """세션 초기화"""
    agent = get_agent()
    success = agent.clear_session(session_id)

    if not success:
        raise HTTPException(status_code=404, detail="세션을 찾을 수 없습니다")

    return {"message": "세션이 초기화되었습니다", "session_id": session_id}


@router.get("/session/{session_id}")
async def get_session(session_id: str):
    """세션 조회"""
    agent = get_agent()
    session = agent.get_session(session_id)

    if not session:
        raise HTTPException(status_code=404, detail="세션을 찾을 수 없습니다")

    return {
        "session_id": session_id,
        "message_count": len(session.get("messages", [])),
        "context": session.get("context", {})
    }
