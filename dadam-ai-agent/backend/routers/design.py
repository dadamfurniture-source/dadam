"""
설계 API 라우터
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List

from models.schemas import (
    FridgeDesignRequest, FridgeDesignResult,
    DesignSpecs, DesignResult
)
from tools.fridge_lookup import FridgeLookup
from tools.dimension_calc import DimensionCalculator
from tools.module_optimizer import ModuleOptimizer
from data.fridge_data import FRIDGE_DATA, CATEGORIES

router = APIRouter()

# 도구 인스턴스
fridge_lookup = FridgeLookup()
calculator = DimensionCalculator()
optimizer = ModuleOptimizer()


@router.get("/categories")
async def get_categories():
    """가구 카테고리 목록"""
    return {"categories": CATEGORIES}


@router.get("/fridge/brands")
async def get_fridge_brands():
    """냉장고 브랜드 목록"""
    return {
        "brands": [
            {"id": "LG", "name": "LG"},
            {"id": "Samsung", "name": "삼성"}
        ]
    }


@router.get("/fridge/models")
async def get_fridge_models(
    brand: Optional[str] = Query(None, description="브랜드 필터"),
    category: Optional[str] = Query(None, description="카테고리 필터"),
    max_width: Optional[float] = Query(None, description="최대 너비")
):
    """냉장고 모델 목록"""
    if brand and brand not in FRIDGE_DATA:
        raise HTTPException(status_code=400, detail="잘못된 브랜드입니다")

    models = fridge_lookup.search_models(
        brand=brand,
        max_width=max_width
    )

    # 카테고리 필터
    if category:
        models = [m for m in models if m.get("category") == category]

    return {"models": models, "count": len(models)}


@router.get("/fridge/model/{model_id}")
async def get_fridge_model(model_id: str):
    """특정 냉장고 모델 조회"""
    model = fridge_lookup.get_model_by_id(model_id)

    if not model:
        raise HTTPException(status_code=404, detail="모델을 찾을 수 없습니다")

    return {"model": model}


@router.post("/fridge/recommend")
async def recommend_fridge(request: FridgeDesignRequest):
    """공간에 맞는 냉장고 추천"""
    recommendations = fridge_lookup.recommend_for_space(
        total_width=request.total_width,
        total_height=request.total_height or 2300,
        brand=request.brand,
        include_tall=request.include_tall
    )

    return {
        "recommendations": recommendations,
        "count": len(recommendations)
    }


@router.post("/fridge/layout")
async def calculate_fridge_layout(request: FridgeDesignRequest):
    """냉장고장 레이아웃 계산"""
    if not request.model_id:
        raise HTTPException(status_code=400, detail="model_id가 필요합니다")

    result = fridge_lookup.calculate_fridge_layout(
        model_id=request.model_id,
        total_width=request.total_width,
        total_height=request.total_height or 2300,
        include_tall=request.include_tall,
        tall_width=600 if request.include_tall else 0
    )

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result


@router.post("/sink/upper")
async def calculate_sink_upper(
    effective_width: float,
    distributor_start: float,
    vent_position: float,
    upper_height: float = 720
):
    """싱크대 상부장 자동 계산"""
    result = calculator.calculate_upper_section(
        effective_width=effective_width,
        distributor_start=distributor_start,
        vent_position=vent_position,
        upper_height=upper_height
    )

    return result


@router.post("/optimize")
async def optimize_layout(
    effective_width: float,
    fixed_modules: List[dict] = None,
    section: str = "lower"
):
    """모듈 레이아웃 최적화"""
    result = optimizer.optimize_layout(
        effective_width=effective_width,
        fixed_modules=fixed_modules,
        section=section
    )

    suggestions = optimizer.suggest_improvements(result)

    return {
        **result,
        "suggestions": suggestions
    }
