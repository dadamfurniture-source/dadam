"""
계산 API 라우터
"""
from fastapi import APIRouter, Query
from typing import Optional

from models.schemas import CalculateRequest, CalculateResponse
from tools.dimension_calc import DimensionCalculator
from data.constants import (
    DOOR_TARGET_WIDTH, DOOR_MAX_WIDTH, DOOR_MIN_WIDTH,
    MIN_REMAINDER, MAX_REMAINDER
)

router = APIRouter()
calculator = DimensionCalculator()


@router.get("/constants")
async def get_constants():
    """계산 상수 조회"""
    return {
        "door_target_width": DOOR_TARGET_WIDTH,
        "door_max_width": DOOR_MAX_WIDTH,
        "door_min_width": DOOR_MIN_WIDTH,
        "min_remainder": MIN_REMAINDER,
        "max_remainder": MAX_REMAINDER
    }


@router.get("/distribute")
async def distribute_modules(
    total_space: float = Query(..., description="전체 공간 (mm)"),
    target_width: Optional[float] = Query(None, description="목표 도어 너비")
):
    """
    모듈 균등 분배 계산

    - total_space: 전체 유효 공간 (mm)
    - target_width: 목표 도어 너비 (선택, 기본 450mm)
    """
    result = calculator.distribute_modules(total_space)

    return CalculateResponse(
        door_width=result["door_width"],
        door_count=result["door_count"],
        modules=result["modules"],
        remaining=result["remaining"],
        is_optimal=result["is_optimal"],
        message=f"도어 {result['door_width']}mm × {result['door_count']}개, 잔여 {result['remaining']:.0f}mm"
    )


@router.get("/effective-space")
async def calculate_effective_space(
    total_width: float = Query(..., description="전체 너비 (mm)"),
    finish_left: float = Query(60, description="좌측 마감 너비"),
    finish_right: float = Query(60, description="우측 마감 너비"),
    finish_corner1: float = Query(0, description="코너1 마감 너비"),
    finish_corner2: float = Query(0, description="코너2 마감 너비")
):
    """유효 공간 계산"""
    effective = calculator.calc_effective_space(
        total_width=total_width,
        finish_left=finish_left,
        finish_right=finish_right,
        finish_corner1=finish_corner1,
        finish_corner2=finish_corner2
    )

    return {
        "total_width": total_width,
        "effective_width": effective,
        "finishes": {
            "left": finish_left,
            "right": finish_right,
            "corner1": finish_corner1,
            "corner2": finish_corner2
        }
    }


@router.get("/door-width")
async def find_door_width(
    total_space: float = Query(..., description="전체 공간 (mm)"),
    door_count: int = Query(..., description="도어 개수")
):
    """특정 도어 개수에 대한 최적 도어 너비 계산"""
    width = calculator.find_best_door_width(total_space, door_count)

    if width is None:
        return {
            "success": False,
            "message": f"도어 {door_count}개로는 적절한 너비를 찾을 수 없습니다 (350~600mm 범위 초과)"
        }

    used = width * door_count
    remaining = total_space - used

    return {
        "success": True,
        "door_width": width,
        "door_count": door_count,
        "total_used": used,
        "remaining": remaining,
        "is_optimal": MIN_REMAINDER <= remaining <= MAX_REMAINDER,
        "status": calculator.get_remain_color(remaining)
    }


@router.post("/validate")
async def validate_layout(request: CalculateRequest):
    """레이아웃 유효성 검사"""
    total_space = request.total_space
    fixed_modules = request.fixed_modules or []

    # 고정 모듈 총 너비
    fixed_width = sum(m.get("width", 0) for m in fixed_modules)

    # 남은 공간
    remaining_space = total_space - fixed_width

    # 분배 가능 여부
    can_distribute = remaining_space >= 350  # 최소 1도어

    # 최적 분배 계산
    if can_distribute:
        result = calculator.distribute_modules(remaining_space)
        optimal_door_width = result["door_width"]
        optimal_door_count = result["door_count"]
    else:
        optimal_door_width = 0
        optimal_door_count = 0

    return {
        "total_space": total_space,
        "fixed_width": fixed_width,
        "remaining_space": remaining_space,
        "can_distribute": can_distribute,
        "optimal_door_width": optimal_door_width,
        "optimal_door_count": optimal_door_count,
        "validation": {
            "is_valid": remaining_space >= 0,
            "message": "유효" if remaining_space >= 0 else f"공간 부족 ({abs(remaining_space):.0f}mm)"
        }
    }
