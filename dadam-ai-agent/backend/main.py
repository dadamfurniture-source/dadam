"""
Vibe Cabinet Agent - AI 기반 가구 설계 백엔드 서버 (Flask)
"""
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

# Flask 앱 생성 (static 폴더 설정)
app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

# 에이전트 초기화 (지연 로딩)
_agent = None

def get_agent():
    global _agent
    if _agent is None:
        from agents.design_agent import DesignAgent
        _agent = DesignAgent()
    return _agent


# ============================================================
# 메인 페이지 (index.html 서빙)
# ============================================================

@app.route("/")
def serve_index():
    """메인 페이지 서빙"""
    return send_from_directory('static', 'index.html')


@app.route("/api/health")
def api_health():
    return jsonify({"status": "healthy", "message": "API 정상"})


# ============================================================
# Chat API (AI 어시스턴트)
# ============================================================

@app.route("/api/chat", methods=["POST"])
def chat():
    """AI 채팅 엔드포인트"""
    try:
        data = request.get_json()

        if not data or "message" not in data:
            return jsonify({"error": "message 필드가 필요합니다"}), 400

        agent = get_agent()
        result = agent.chat(
            message=data["message"],
            session_id=data.get("session_id"),
            context=data.get("context")
        )

        return jsonify({
            "message": result["message"],
            "session_id": result["session_id"],
            "suggestions": result.get("suggestions", []),
            "actions": result.get("actions", [])
        })

    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/chat/session/<session_id>", methods=["GET"])
def get_session(session_id):
    """세션 조회"""
    agent = get_agent()
    session = agent.get_session(session_id)

    if not session:
        return jsonify({"error": "세션을 찾을 수 없습니다"}), 404

    return jsonify({
        "session_id": session_id,
        "message_count": len(session.get("messages", [])),
        "context": session.get("context", {})
    })


@app.route("/api/chat/session/<session_id>", methods=["DELETE"])
def clear_session(session_id):
    """세션 초기화"""
    agent = get_agent()
    success = agent.clear_session(session_id)

    if not success:
        return jsonify({"error": "세션을 찾을 수 없습니다"}), 404

    return jsonify({"message": "세션이 초기화되었습니다", "session_id": session_id})


# ============================================================
# Calculate API (계산 도구)
# ============================================================

@app.route("/api/calculate/modules", methods=["POST"])
def calculate_modules():
    """모듈 분배 계산"""
    try:
        data = request.get_json()
        total_space = data.get("total_space")

        if not total_space:
            return jsonify({"error": "total_space 필드가 필요합니다"}), 400

        from tools.dimension_calc import DimensionCalculator
        calculator = DimensionCalculator()
        result = calculator.distribute_modules(float(total_space))

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/calculate/effective-space", methods=["POST"])
def calculate_effective_space():
    """유효 공간 계산"""
    try:
        data = request.get_json()
        total_width = data.get("total_width")

        if not total_width:
            return jsonify({"error": "total_width 필드가 필요합니다"}), 400

        from tools.dimension_calc import DimensionCalculator
        calculator = DimensionCalculator()
        effective = calculator.calc_effective_space(
            total_width=float(total_width),
            finish_left=float(data.get("finish_left", 60)),
            finish_right=float(data.get("finish_right", 60))
        )

        return jsonify({
            "total_width": total_width,
            "effective_width": effective,
            "finish_left": data.get("finish_left", 60),
            "finish_right": data.get("finish_right", 60)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/calculate/upper-section", methods=["POST"])
def calculate_upper_section():
    """상부장 자동 계산"""
    try:
        data = request.get_json()

        from tools.dimension_calc import DimensionCalculator
        calculator = DimensionCalculator()
        result = calculator.calculate_upper_section(
            effective_width=float(data.get("effective_width", 0)),
            distributor_start=float(data.get("distributor_start", 0)),
            vent_position=float(data.get("vent_position", 0)),
            upper_height=float(data.get("upper_height", 720))
        )

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
# Design API (설계 도구)
# ============================================================

@app.route("/api/design/fridge/search", methods=["GET"])
def search_fridge():
    """냉장고 검색"""
    try:
        from tools.fridge_lookup import FridgeLookup
        lookup = FridgeLookup()

        results = lookup.search_models(
            query=request.args.get("query"),
            brand=request.args.get("brand"),
            max_width=float(request.args.get("max_width")) if request.args.get("max_width") else None
        )

        return jsonify({"count": len(results), "models": results})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/design/fridge/recommend", methods=["POST"])
def recommend_fridge():
    """냉장고 추천"""
    try:
        data = request.get_json()
        total_width = data.get("total_width")

        if not total_width:
            return jsonify({"error": "total_width 필드가 필요합니다"}), 400

        from tools.fridge_lookup import FridgeLookup
        lookup = FridgeLookup()

        results = lookup.recommend_for_space(
            total_width=float(total_width),
            total_height=float(data.get("total_height", 2300)),
            brand=data.get("brand"),
            include_tall=data.get("include_tall", False)
        )

        return jsonify({"recommendations": results})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/design/fridge/layout", methods=["POST"])
def calculate_fridge_layout():
    """냉장고장 레이아웃 계산"""
    try:
        data = request.get_json()

        from tools.fridge_lookup import FridgeLookup
        lookup = FridgeLookup()

        result = lookup.calculate_fridge_layout(
            model_id=data.get("model_id"),
            total_width=float(data.get("total_width", 0)),
            total_height=float(data.get("total_height", 2300)),
            include_tall=data.get("include_tall", False)
        )

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
# 서버 실행
# ============================================================

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "true").lower() == "true"

    print(f"")
    print(f"=" * 50)
    print(f"  Vibe Cabinet AI Agent")
    print(f"  http://localhost:{port}")
    print(f"=" * 50)
    print(f"")

    app.run(host="0.0.0.0", port=port, debug=debug)
