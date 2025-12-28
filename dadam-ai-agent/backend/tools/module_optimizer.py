"""
모듈 최적화 도구
"""
from typing import List, Dict, Any, Optional
from .dimension_calc import DimensionCalculator
from data.constants import DOOR_TARGET_WIDTH, DOOR_MAX_WIDTH, DOOR_MIN_WIDTH


class ModuleOptimizer:
    """모듈 배치 최적화 도구"""

    def __init__(self):
        self.calc = DimensionCalculator()

    def optimize_layout(
        self,
        effective_width: float,
        fixed_modules: List[Dict] = None,
        section: str = "lower"
    ) -> Dict[str, Any]:
        """
        고정 모듈 주변 빈 공간을 최적 모듈로 채움

        Args:
            effective_width: 유효 공간 너비
            fixed_modules: 고정 모듈 리스트 [{"x": 시작위치, "width": 너비, ...}]
            section: "upper" | "lower"
        """
        if not fixed_modules:
            # 고정 모듈 없으면 전체 공간 분배
            result = self.calc.distribute_modules(effective_width)
            modules = []
            x = 0
            for m in result["modules"]:
                modules.append({
                    "type": "storage",
                    "name": f"{'상부' if section == 'upper' else '하부'}장({'2D' if m['is_2d'] else '1D'})",
                    "x": x,
                    "width": m["width"],
                    "is_2d": m["is_2d"]
                })
                x += m["width"]

            return {
                "modules": modules,
                "door_width": result["door_width"],
                "remaining": result["remaining"],
                "is_optimal": result["is_optimal"]
            }

        # 고정 모듈 정렬
        sorted_fixed = sorted(fixed_modules, key=lambda m: m.get("x", 0))

        # 빈 공간(Gap) 계산
        gaps = []
        cursor = 0

        for fixed in sorted_fixed:
            fixed_x = fixed.get("x", 0)
            fixed_w = fixed.get("width", 0)

            if fixed_x > cursor:
                gaps.append({
                    "start": cursor,
                    "end": fixed_x,
                    "width": fixed_x - cursor
                })
            cursor = fixed_x + fixed_w

        # 마지막 공간
        if cursor < effective_width:
            gaps.append({
                "start": cursor,
                "end": effective_width,
                "width": effective_width - cursor
            })

        # 전체 빈 공간의 도어 너비 통일 계산
        total_gap_width = sum(g["width"] for g in gaps if g["width"] >= 100)

        if total_gap_width > 0:
            base_result = self.calc.distribute_modules(total_gap_width)
            unified_door_width = base_result["door_width"]
        else:
            unified_door_width = DOOR_TARGET_WIDTH

        # 각 Gap을 모듈로 채우기
        all_modules = []
        total_remaining = 0

        for gap in gaps:
            if gap["width"] < 100:
                total_remaining += gap["width"]
                continue

            gap_modules = self._fill_gap(
                gap["start"],
                gap["width"],
                unified_door_width,
                section
            )
            all_modules.extend(gap_modules["modules"])
            total_remaining += gap_modules["remaining"]

        # 고정 모듈 추가
        for fixed in sorted_fixed:
            all_modules.append({
                **fixed,
                "is_fixed": True
            })

        # x 위치로 정렬
        all_modules.sort(key=lambda m: m.get("x", 0))

        return {
            "modules": all_modules,
            "door_width": unified_door_width,
            "remaining": total_remaining,
            "is_optimal": 4 <= total_remaining <= 10
        }

    def _fill_gap(
        self,
        start_x: float,
        width: float,
        door_width: float,
        section: str
    ) -> Dict[str, Any]:
        """빈 공간을 모듈로 채우기"""
        door_count = round(width / door_width)
        if door_count < 1:
            door_count = 1

        # 도어 제약 확인
        actual_door_width = door_width
        if door_width < DOOR_MIN_WIDTH:
            door_count = max(1, int(width / DOOR_MIN_WIDTH))
            actual_door_width = width / door_count
        elif door_width > DOOR_MAX_WIDTH:
            door_count = int(width / DOOR_MAX_WIDTH + 0.999)
            actual_door_width = width / door_count

        quotient = door_count // 2
        remainder = door_count % 2

        modules = []
        x = start_x

        # 2D 모듈
        for _ in range(quotient):
            w = door_width * 2
            modules.append({
                "type": "storage",
                "name": f"{'상부' if section == 'upper' else '하부'}장(2D)",
                "x": x,
                "width": w,
                "is_2d": True
            })
            x += w

        # 1D 모듈
        if remainder > 0:
            modules.append({
                "type": "storage",
                "name": f"{'상부' if section == 'upper' else '하부'}장(1D)",
                "x": x,
                "width": door_width,
                "is_2d": False
            })
            x += door_width

        used = door_width * door_count
        remaining = width - used

        return {
            "modules": modules,
            "remaining": remaining
        }

    def suggest_improvements(self, current_layout: Dict) -> List[str]:
        """현재 레이아웃 개선 제안"""
        suggestions = []
        remaining = current_layout.get("remaining", 0)
        door_width = current_layout.get("door_width", DOOR_TARGET_WIDTH)
        modules = current_layout.get("modules", [])

        # 잔여 공간 체크
        if remaining < 0:
            suggestions.append(f"⚠️ 공간이 {abs(remaining):.0f}mm 부족합니다. 모듈 너비를 줄이거나 모듈을 제거해주세요.")
        elif remaining > 10:
            suggestions.append(f"💡 잔여 공간이 {remaining:.0f}mm입니다. 모듈 너비를 늘리면 공간 활용도가 높아집니다.")

        # 도어 너비 체크
        if door_width < 400:
            suggestions.append("💡 도어 너비가 400mm 미만입니다. 사용성을 위해 모듈 수를 줄이는 것을 권장합니다.")
        elif door_width > 550:
            suggestions.append("💡 도어 너비가 550mm를 초과합니다. 모듈을 추가하면 균형 잡힌 디자인이 됩니다.")

        # 불균형 체크
        widths = [m.get("width", 0) for m in modules if not m.get("is_fixed")]
        if widths:
            max_w, min_w = max(widths), min(widths)
            if max_w - min_w > 100:
                suggestions.append("💡 모듈 너비가 불균일합니다. 균등 분배를 권장합니다.")

        if not suggestions:
            suggestions.append("✅ 현재 레이아웃이 최적화되어 있습니다.")

        return suggestions
