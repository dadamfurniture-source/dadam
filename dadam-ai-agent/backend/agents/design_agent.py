"""
AI 설계 에이전트 - Claude 기반 가구 설계 어시스턴트
"""
import os
import json
import uuid
import re

from tools.dimension_calc import DimensionCalculator
from tools.fridge_lookup import FridgeLookup
from tools.module_optimizer import ModuleOptimizer
from data.fridge_data import CATEGORIES

# Python 3.14 호환성: anthropic 라이브러리 로딩 시도
try:
    from anthropic import Anthropic
    ANTHROPIC_AVAILABLE = True
except Exception:
    ANTHROPIC_AVAILABLE = False
    Anthropic = None


class DesignAgent:
    """AI 기반 가구 설계 에이전트"""

    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")

        # Python 3.14 호환성: API 클라이언트 초기화
        self.client = None
        if ANTHROPIC_AVAILABLE and self.api_key:
            try:
                self.client = Anthropic(api_key=self.api_key)
            except Exception as e:
                print(f"Anthropic client init failed: {e}")
                self.client = None

        # 도구 초기화
        self.calculator = DimensionCalculator()
        self.fridge_lookup = FridgeLookup()
        self.optimizer = ModuleOptimizer()

        # 세션 저장소
        self.sessions = {}

        # 시스템 프롬프트
        self.system_prompt = """당신은 '다담 AI'입니다. 한국의 맞춤 가구 설계 전문 AI 어시스턴트입니다.

## 역할
- 고객의 요구사항을 이해하고 최적의 가구 설계를 제안합니다
- 싱크대, 냉장고장, 붙박이장 등 다양한 가구 유형을 다룹니다
- 치수 계산, 모듈 배치, 자재 선택을 도와줍니다

## 전문 지식
1. **싱크대 설계**: 상부장/하부장 분리, 후드장, 개수대, 가스대 배치
2. **냉장고장 설계**: LG/삼성 모델 호환, 키큰장, 홈카페장 조합
3. **붙박이장 설계**: 옷봉, 선반, 서랍 구성
4. **도어 규격**: 최소 350mm ~ 최대 600mm, 목표 450mm
5. **마감 처리**: 휠라, 몰딩, EP 등

## 설계 규칙
- 잔여 공간: 4~10mm가 최적 (시공 여유)
- 모듈 분배: 도어수/2 = 2D모듈 + 나머지 1D모듈
- 기준상부장: 개수대 중앙 정렬 (2D)
- 후드장: 환풍구 중앙 정렬

## 응답 형식
1. 사용자 요청을 명확히 이해했는지 확인
2. 계산 결과를 구체적 수치로 제시
3. 여러 옵션이 있으면 장단점 비교
4. 추가 정보가 필요하면 질문

항상 친절하고 전문적으로 응답하세요. 한국어로 대화합니다."""

        # 도구 정의
        self.tools = [
            {
                "name": "calculate_modules",
                "description": "주어진 공간에 최적의 모듈 분배를 계산합니다. 도어 너비, 모듈 개수, 잔여 공간을 반환합니다.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "total_space": {
                            "type": "number",
                            "description": "전체 유효 공간 (mm)"
                        }
                    },
                    "required": ["total_space"]
                }
            },
            {
                "name": "search_fridge",
                "description": "조건에 맞는 냉장고 모델을 검색합니다.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "brand": {
                            "type": "string",
                            "description": "브랜드 (LG 또는 Samsung)",
                            "enum": ["LG", "Samsung"]
                        },
                        "query": {
                            "type": "string",
                            "description": "검색어 (모델명, 카테고리 등)"
                        },
                        "max_width": {
                            "type": "number",
                            "description": "최대 너비 (mm)"
                        }
                    }
                }
            },
            {
                "name": "recommend_fridge",
                "description": "주어진 공간에 맞는 냉장고를 추천합니다.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "total_width": {
                            "type": "number",
                            "description": "전체 너비 (mm)"
                        },
                        "total_height": {
                            "type": "number",
                            "description": "전체 높이 (mm)"
                        },
                        "brand": {
                            "type": "string",
                            "description": "선호 브랜드",
                            "enum": ["LG", "Samsung"]
                        },
                        "include_tall": {
                            "type": "boolean",
                            "description": "키큰장 포함 여부"
                        }
                    },
                    "required": ["total_width"]
                }
            },
            {
                "name": "calculate_fridge_layout",
                "description": "특정 냉장고 모델로 레이아웃을 계산합니다.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "model_id": {
                            "type": "string",
                            "description": "냉장고 모델 ID"
                        },
                        "total_width": {
                            "type": "number",
                            "description": "전체 너비 (mm)"
                        },
                        "total_height": {
                            "type": "number",
                            "description": "전체 높이 (mm)"
                        },
                        "include_tall": {
                            "type": "boolean",
                            "description": "키큰장 포함 여부"
                        }
                    },
                    "required": ["model_id", "total_width", "total_height"]
                }
            },
            {
                "name": "get_effective_space",
                "description": "마감을 고려한 유효 공간을 계산합니다.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "total_width": {
                            "type": "number",
                            "description": "전체 너비 (mm)"
                        },
                        "finish_left": {
                            "type": "number",
                            "description": "좌측 마감 너비 (mm)",
                            "default": 60
                        },
                        "finish_right": {
                            "type": "number",
                            "description": "우측 마감 너비 (mm)",
                            "default": 60
                        }
                    },
                    "required": ["total_width"]
                }
            }
        ]

    def _execute_tool(self, tool_name, tool_input):
        """도구 실행"""
        if tool_name == "calculate_modules":
            result = self.calculator.distribute_modules(tool_input["total_space"])
            return {
                "door_width": result["door_width"],
                "door_count": result["door_count"],
                "modules": [
                    f"{'2D' if m['is_2d'] else '1D'} ({m['width']}mm)"
                    for m in result["modules"]
                ],
                "remaining": result["remaining"],
                "is_optimal": result["is_optimal"],
                "message": f"도어 너비 {result['door_width']}mm로 {result['door_count']}개 도어, 잔여 {result['remaining']:.0f}mm"
            }

        elif tool_name == "search_fridge":
            results = self.fridge_lookup.search_models(
                query=tool_input.get("query"),
                brand=tool_input.get("brand"),
                max_width=tool_input.get("max_width")
            )
            return {
                "count": len(results),
                "models": [
                    {
                        "id": m["id"],
                        "name": m["name"],
                        "brand": m["brand"],
                        "size": f"{m['w']}×{m['h']}mm",
                        "type": m["type"]
                    }
                    for m in results[:10]
                ]
            }

        elif tool_name == "recommend_fridge":
            results = self.fridge_lookup.recommend_for_space(
                total_width=tool_input["total_width"],
                total_height=tool_input.get("total_height", 2300),
                brand=tool_input.get("brand"),
                include_tall=tool_input.get("include_tall", False)
            )
            return {
                "recommendations": [
                    {
                        "id": m["id"],
                        "name": m["name"],
                        "brand": m["brand"],
                        "size": f"{m['w']}×{m['h']}mm",
                        "remaining": f"{m['remaining_space']:.0f}mm",
                        "can_add_tall": m["can_add_tall"],
                        "upper_height": m["recommended_upper_h"]
                    }
                    for m in results
                ]
            }

        elif tool_name == "calculate_fridge_layout":
            result = self.fridge_lookup.calculate_fridge_layout(
                model_id=tool_input["model_id"],
                total_width=tool_input["total_width"],
                total_height=tool_input["total_height"],
                include_tall=tool_input.get("include_tall", False)
            )
            return result

        elif tool_name == "get_effective_space":
            effective = self.calculator.calc_effective_space(
                total_width=tool_input["total_width"],
                finish_left=tool_input.get("finish_left", 60),
                finish_right=tool_input.get("finish_right", 60)
            )
            return {
                "total_width": tool_input["total_width"],
                "effective_width": effective,
                "message": f"유효 공간: {effective}mm"
            }

        return {"error": f"알 수 없는 도구: {tool_name}"}

    def chat(self, message, session_id=None, context=None):
        """
        사용자 메시지 처리

        Args:
            message: 사용자 메시지
            session_id: 세션 ID (없으면 생성)
            context: 현재 설계 상태 (치수, 모듈 등)

        Returns:
            AI 응답 및 액션
        """
        # 세션 관리
        if not session_id:
            session_id = str(uuid.uuid4())

        if session_id not in self.sessions:
            self.sessions[session_id] = {
                "messages": [],
                "context": context or {}
            }

        session = self.sessions[session_id]

        # 컨텍스트 업데이트
        if context:
            session["context"].update(context)

        # 컨텍스트가 있으면 메시지에 추가
        user_message = message
        if session["context"]:
            ctx_info = self._format_context(session["context"])
            if ctx_info:
                user_message = f"[현재 설계 상태]\n{ctx_info}\n\n[사용자 질문]\n{message}"

        # 메시지 히스토리에 추가
        session["messages"].append({
            "role": "user",
            "content": user_message
        })

        # API 키가 없으면 시뮬레이션 모드
        if not self.client:
            return self._simulate_response(message, session_id, context)

        # Claude API 호출 (도구 사용)
        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=4096,
                system=self.system_prompt,
                tools=self.tools,
                messages=session["messages"]
            )

            # 도구 호출 처리
            assistant_message = ""
            actions = []
            tool_results = []

            for block in response.content:
                if block.type == "text":
                    assistant_message += block.text
                elif block.type == "tool_use":
                    # 도구 실행
                    tool_result = self._execute_tool(block.name, block.input)
                    tool_results.append({
                        "tool": block.name,
                        "input": block.input,
                        "result": tool_result
                    })
                    actions.append({
                        "type": "tool_result",
                        "tool": block.name,
                        "data": tool_result
                    })

            # 도구 결과가 있으면 후속 호출
            if tool_results and response.stop_reason == "tool_use":
                # 도구 결과를 포함하여 재호출
                tool_result_messages = []
                for i, block in enumerate(response.content):
                    if block.type == "tool_use":
                        tool_result_messages.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": json.dumps(tool_results[i]["result"], ensure_ascii=False)
                        })

                session["messages"].append({
                    "role": "assistant",
                    "content": response.content
                })
                session["messages"].append({
                    "role": "user",
                    "content": tool_result_messages
                })

                # 최종 응답 생성
                final_response = self.client.messages.create(
                    model="claude-sonnet-4-20250514",
                    max_tokens=4096,
                    system=self.system_prompt,
                    messages=session["messages"]
                )

                for block in final_response.content:
                    if block.type == "text":
                        assistant_message = block.text

            # 응답 저장
            session["messages"].append({
                "role": "assistant",
                "content": assistant_message
            })

            return {
                "message": assistant_message,
                "session_id": session_id,
                "actions": actions,
                "suggestions": self._extract_suggestions(assistant_message)
            }

        except Exception as e:
            return {
                "message": f"오류가 발생했습니다: {str(e)}",
                "session_id": session_id,
                "error": str(e)
            }

    def _format_context(self, context):
        """컨텍스트를 문자열로 포맷"""
        parts = []

        if "category" in context:
            cat_name = next(
                (c["name"] for c in CATEGORIES if c["id"] == context["category"]),
                context["category"]
            )
            parts.append(f"- 가구 유형: {cat_name}")

        if "dimensions" in context:
            dims = context["dimensions"]
            parts.append(f"- 치수: {dims.get('width', '?')} × {dims.get('height', '?')} × {dims.get('depth', '?')} mm")

        if "brand" in context:
            parts.append(f"- 브랜드: {context['brand']}")

        if "modules" in context:
            parts.append(f"- 현재 모듈 수: {len(context['modules'])}개")

        return "\n".join(parts) if parts else ""

    def _extract_suggestions(self, message):
        """응답에서 제안사항 추출"""
        suggestions = []

        # 간단한 패턴 매칭 (실제로는 더 정교하게)
        if "추천" in message or "제안" in message:
            suggestions.append({
                "type": "recommendation",
                "text": "AI 추천 사항이 있습니다"
            })

        if "선택" in message or "옵션" in message:
            suggestions.append({
                "type": "options",
                "text": "선택 가능한 옵션이 있습니다"
            })

        return suggestions

    def _simulate_response(self, message, session_id, context=None):
        """API 키 없이 시뮬레이션 응답 생성"""
        message_lower = message.lower()
        actions = []

        # 키워드 기반 응답
        if "냉장고" in message:
            if any(word in message for word in ["3000", "3m", "삼천"]):
                # 3000mm 냉장고장 추천
                recommendations = self.fridge_lookup.recommend_for_space(
                    total_width=3000,
                    total_height=2300,
                    brand="LG" if "lg" in message_lower else None
                )
                actions.append({
                    "type": "recommendation",
                    "data": recommendations
                })
                response_text = f"""3000mm 공간에 적합한 냉장고를 찾았습니다!

**추천 모델 TOP 3:**
"""
                for i, rec in enumerate(recommendations[:3], 1):
                    response_text += f"""
{i}. **{rec['brand']} {rec['name']}**
   - 크기: {rec['w']} × {rec['h']}mm
   - 잔여 공간: {rec['remaining_space']:.0f}mm
   - 키큰장 추가: {'가능' if rec['can_add_tall'] else '불가'}
"""

                response_text += "\n어떤 모델로 진행하시겠어요?"

            else:
                response_text = """냉장고장 설계를 도와드릴게요!

다음 정보를 알려주세요:
1. **전체 너비** (예: 3000mm)
2. **전체 높이** (예: 2300mm)
3. **선호 브랜드** (LG / 삼성)
4. **키큰장 필요 여부**

예시: "3000mm에 LG 냉장고로 키큰장 포함해서 설계해줘"
"""

        elif "싱크대" in message:
            response_text = """싱크대 설계를 도와드릴게요!

다음 정보가 필요합니다:
1. **전체 너비** (mm)
2. **분배기 시작 위치** (좌측 기준)
3. **환풍구 위치**

입력해주시면 상부장/하부장 자동 배치를 계산해드릴게요!
"""

        elif "계산" in message or "분배" in message:
            # 숫자 추출 시도
            numbers = re.findall(r'\d+', message)
            if numbers:
                space = float(numbers[0])
                result = self.calculator.distribute_modules(space)
                actions.append({"type": "calculation", "data": result})

                response_text = f"""**{space}mm 공간 분배 결과:**

- 도어 너비: **{result['door_width']}mm**
- 도어 개수: **{result['door_count']}개**
- 모듈 구성: {', '.join([f"{'2D' if m['is_2d'] else '1D'}({m['width']}mm)" for m in result['modules']])}
- 잔여 공간: **{result['remaining']:.0f}mm** {'✅ 최적' if result['is_optimal'] else '⚠️ 조정 필요'}

{'잔여 공간이 4~10mm 사이로 최적입니다!' if result['is_optimal'] else '잔여 공간을 조정하시겠어요?'}
"""
            else:
                response_text = "계산할 공간 크기(mm)를 알려주세요. 예: '2500mm 분배해줘'"

        else:
            response_text = """안녕하세요! 다담 AI입니다. 🏠

맞춤 가구 설계를 도와드릴게요. 무엇을 설계하시겠어요?

- **싱크대** - 상부장/하부장 자동 배치
- **냉장고장** - LG/삼성 모델 기반 설계
- **붙박이장** - 옷봉/선반/서랍 구성
- **기타 가구** - 신발장, 화장대, 수납장 등

또는 치수를 입력하시면 바로 계산해드릴게요!
예: "3000mm 냉장고장 LG로 설계해줘"
"""

        return {
            "message": response_text,
            "session_id": session_id,
            "actions": actions,
            "suggestions": []
        }

    def get_session(self, session_id):
        """세션 조회"""
        return self.sessions.get(session_id)

    def clear_session(self, session_id):
        """세션 초기화"""
        if session_id in self.sessions:
            del self.sessions[session_id]
            return True
        return False
