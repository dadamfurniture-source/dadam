"""
치수 계산 도구 - 기존 JavaScript 로직을 Python으로 마이그레이션
"""
from typing import List, Dict, Any, Optional, Tuple
from data.constants import (
    DOOR_TARGET_WIDTH, DOOR_MAX_WIDTH, DOOR_MIN_WIDTH,
    MIN_REMAINDER, MAX_REMAINDER, CATEGORY_DOOR_RULES
)


class DimensionCalculator:
    """가구 치수 계산 도구"""

    def __init__(self):
        self.door_target = DOOR_TARGET_WIDTH
        self.door_max = DOOR_MAX_WIDTH
        self.door_min = DOOR_MIN_WIDTH
        self.min_remainder = MIN_REMAINDER
        self.max_remainder = MAX_REMAINDER

    def find_best_door_width(self, total_space: float, door_count: int) -> Optional[float]:
        """
        최적 도어 너비 계산
        - 최우선: 4mm ≤ 잔여공간 ≤ 10mm
        - 차선: 0mm ≤ 잔여공간 < 4mm
        - 제약: 350mm ≤ 도어 너비 ≤ 600mm
        """
        raw_width = total_space / door_count

        # 도어 최소/최대 너비 제약 확인
        if raw_width > self.door_max or raw_width < self.door_min:
            return None

        primary_candidates = []   # 4~10mm 조건 만족
        secondary_candidates = [] # 0~3mm (차선)

        # 10의 단위 후보 (내림, 올림)
        ten_floor = (raw_width // 10) * 10
        ten_ceil = ((raw_width + 9) // 10) * 10

        # 짝수 후보 (내림, 올림)
        even_floor = (raw_width // 2) * 2
        even_ceil = ((raw_width + 1) // 2) * 2

        # 후보들과 우선순위 (priority 낮을수록 우선)
        all_candidates = [
            {"width": ten_floor, "priority": 1},
            {"width": ten_ceil, "priority": 1},
            {"width": even_floor, "priority": 2},
            {"width": even_ceil, "priority": 2},
        ]

        # 후보 분류
        for cand in all_candidates:
            width = cand["width"]
            if width < self.door_min or width > self.door_max:
                continue

            used = width * door_count
            gap = total_space - used

            if gap < 0:
                continue

            if self.min_remainder <= gap <= self.max_remainder:
                # 우선: 4~10mm 조건 만족
                primary_candidates.append({**cand, "gap": gap})
            elif 0 <= gap < self.min_remainder:
                # 차선: 0~3mm
                secondary_candidates.append({**cand, "gap": gap})

        # 정렬 함수
        def sort_candidates(arr):
            return sorted(arr, key=lambda x: (x["priority"], x["gap"]))

        # 우선 후보 선택
        if primary_candidates:
            sorted_cands = sort_candidates(primary_candidates)
            return sorted_cands[0]["width"]

        # 차선 후보 선택
        if secondary_candidates:
            sorted_cands = sort_candidates(secondary_candidates)
            return sorted_cands[0]["width"]

        return None

    def distribute_modules(self, total_space: float) -> Dict[str, Any]:
        """
        모듈 균등 분배
        - 도어개수/2 → 몫*2D, 나머지*1D
        """
        if total_space < 100:
            return {"modules": [], "door_width": 0, "door_count": 0, "remaining": 0}

        # 도어 개수 범위 설정
        min_count = max(1, int(total_space / self.door_max + 0.999))
        max_door_count = int(total_space / self.door_min)
        base_count = round(total_space / self.door_target)
        max_count = min(max_door_count, max(base_count + 3, min_count + 5))

        all_results = []

        for count in range(min_count, max_count + 1):
            width = self.find_best_door_width(total_space, count)
            if width is not None:
                gap = total_space - (width * count)
                target_diff = abs(width - self.door_target)
                is_primary = self.min_remainder <= gap <= self.max_remainder

                all_results.append({
                    "door_count": count,
                    "door_width": width,
                    "gap": gap,
                    "target_diff": target_diff,
                    "is_primary": is_primary
                })

        # 정렬: is_primary 우선 → target_diff 작은 순 → gap 작은 순
        all_results.sort(key=lambda x: (not x["is_primary"], x["target_diff"], x["gap"]))

        if all_results:
            best = all_results[0]
        else:
            # 강제 계산
            ideal_count = round(total_space / self.door_target)
            count = max(min_count, min(max_door_count, ideal_count))
            width = int(total_space / count / 2) * 2
            width = max(self.door_min, min(self.door_max, width))
            best = {
                "door_count": count,
                "door_width": width,
                "gap": total_space - (width * count)
            }

        door_count = best["door_count"]
        door_width = best["door_width"]
        quotient = door_count // 2
        remainder = door_count % 2

        modules = []

        # 2D 모듈 (몫 개)
        for i in range(quotient):
            modules.append({
                "width": door_width * 2,
                "is_2d": True,
                "door_count": 2
            })

        # 1D 모듈 (나머지 개)
        if remainder > 0:
            modules.append({
                "width": door_width,
                "is_2d": False,
                "door_count": 1
            })

        return {
            "modules": modules,
            "door_width": door_width,
            "door_count": door_count,
            "remaining": total_space - (door_width * door_count),
            "is_optimal": best.get("is_primary", False)
        }

    def distribute_modules_single_door(self, total_space: float) -> Dict[str, Any]:
        """
        냉장고장 상부장 전용 모듈 분배
        - 가로너비 분배규칙 미적용
        - 모듈 하나에 도어 하나만 생성 (모두 1D)
        """
        if total_space < 100:
            return {"modules": [], "door_width": 0, "door_count": 0, "remaining": 0}

        # 도어 개수 범위 설정
        min_count = max(1, int(total_space / self.door_max + 0.999))
        max_door_count = int(total_space / self.door_min)
        base_count = round(total_space / self.door_target)
        max_count = min(max_door_count, max(base_count + 3, min_count + 5))

        all_results = []

        for count in range(min_count, max_count + 1):
            width = self.find_best_door_width(total_space, count)
            if width is not None:
                gap = total_space - (width * count)
                target_diff = abs(width - self.door_target)
                is_primary = self.min_remainder <= gap <= self.max_remainder

                all_results.append({
                    "door_count": count,
                    "door_width": width,
                    "gap": gap,
                    "target_diff": target_diff,
                    "is_primary": is_primary
                })

        # 정렬: is_primary 우선 → target_diff 작은 순 → gap 작은 순
        all_results.sort(key=lambda x: (not x["is_primary"], x["target_diff"], x["gap"]))

        if all_results:
            best = all_results[0]
        else:
            # 강제 계산
            ideal_count = round(total_space / self.door_target)
            count = max(min_count, min(max_door_count, ideal_count))
            width = int(total_space / count / 2) * 2
            width = max(self.door_min, min(self.door_max, width))
            best = {
                "door_count": count,
                "door_width": width,
                "gap": total_space - (width * count)
            }

        door_count = best["door_count"]
        door_width = best["door_width"]

        # 냉장고장 상부장: 모든 모듈을 1D로 생성
        modules = []
        for i in range(door_count):
            modules.append({
                "width": door_width,
                "is_2d": False,
                "door_count": 1
            })

        return {
            "modules": modules,
            "door_width": door_width,
            "door_count": door_count,
            "remaining": total_space - (door_width * door_count),
            "is_optimal": best.get("is_primary", False),
            "is_single_door_mode": True  # 단일 도어 모드 표시
        }

    def distribute_modules_for_category(
        self,
        total_space: float,
        category: str = None,
        is_upper: bool = False
    ) -> Dict[str, Any]:
        """
        카테고리별 모듈 분배
        - 냉장고장 상부장: 모듈당 1도어만 생성
        - 그 외: 일반 분배규칙 적용
        """
        # 냉장고장 상부장 특별 규칙 확인
        if category == "fridge" and is_upper:
            fridge_rules = CATEGORY_DOOR_RULES.get("fridge", {})
            if fridge_rules.get("upper_single_door_per_module", False):
                return self.distribute_modules_single_door(total_space)

        # 일반 분배규칙 적용
        return self.distribute_modules(total_space)

    def calc_effective_space(
        self,
        total_width: float,
        finish_left: float = 60,
        finish_right: float = 60,
        finish_corner1: float = 0,
        finish_corner2: float = 0
    ) -> float:
        """유효 공간 계산"""
        return total_width - finish_left - finish_right - finish_corner1 - finish_corner2

    def get_remain_color(self, remaining: float) -> str:
        """잔여 공간 상태 색상"""
        if remaining < 0 or remaining > self.max_remainder + 5:
            return "danger"  # 음수 또는 15mm 초과
        if 0 <= remaining <= self.max_remainder:
            return "success"  # 0~10mm
        return "info"  # 11~15mm

    def calculate_upper_section(
        self,
        effective_width: float,
        distributor_start: float,
        vent_position: float,
        upper_height: float = 720
    ) -> Dict[str, Any]:
        """
        상부장 자동 계산
        - 후드장: 환풍구 중앙 정렬
        - 기준상부장: 개수대 중앙 정렬 (2D)
        """
        hood_width = 800
        sink_width = 1000

        # 개수대 중앙
        sink_start = distributor_start - 100
        sink_center = sink_start + (sink_width / 2)

        # 후드 위치
        hood_x = max(0, min(vent_position - hood_width / 2, effective_width - hood_width))

        # 후드 제외 공간에서 도어 계산
        space_exclude_hood = effective_width - hood_width
        result = self.distribute_modules(space_exclude_hood)

        base_width = result["door_width"] * 2
        base_x = sink_center - (base_width / 2)
        base_x = max(0, min(base_x, effective_width - base_width))

        modules = []

        # 좌측 공간
        left_space = min(hood_x, base_x)
        if left_space > 100:
            left_modules = self.distribute_modules(left_space)
            for m in left_modules["modules"]:
                modules.append({
                    **m,
                    "type": "storage",
                    "name": f"상부장({'2D' if m['is_2d'] else '1D'})",
                    "height": upper_height - 20,
                    "depth": 295
                })

        # 후드 또는 기준상부장 (왼쪽에 있는 것 먼저)
        if hood_x < base_x:
            modules.append({
                "type": "hood",
                "name": "후드장",
                "width": hood_width,
                "height": upper_height - 60,
                "depth": 295,
                "is_fixed": True
            })
            # 중간 공간
            middle_start = hood_x + hood_width
            middle_space = base_x - middle_start
            if middle_space > 100:
                middle_modules = self.distribute_modules(middle_space)
                for m in middle_modules["modules"]:
                    modules.append({
                        **m,
                        "type": "storage",
                        "name": f"상부장({'2D' if m['is_2d'] else '1D'})",
                        "height": upper_height - 20,
                        "depth": 295
                    })

            modules.append({
                "type": "storage",
                "name": "기준상부장(2D)",
                "width": base_width,
                "height": upper_height - 20,
                "depth": 295,
                "is_2d": True,
                "is_base": True,
                "is_fixed": True
            })
        else:
            modules.append({
                "type": "storage",
                "name": "기준상부장(2D)",
                "width": base_width,
                "height": upper_height - 20,
                "depth": 295,
                "is_2d": True,
                "is_base": True,
                "is_fixed": True
            })
            # 중간 공간
            middle_start = base_x + base_width
            middle_space = hood_x - middle_start
            if middle_space > 100:
                middle_modules = self.distribute_modules(middle_space)
                for m in middle_modules["modules"]:
                    modules.append({
                        **m,
                        "type": "storage",
                        "name": f"상부장({'2D' if m['is_2d'] else '1D'})",
                        "height": upper_height - 20,
                        "depth": 295
                    })

            modules.append({
                "type": "hood",
                "name": "후드장",
                "width": hood_width,
                "height": upper_height - 60,
                "depth": 295,
                "is_fixed": True
            })

        # 우측 공간
        right_start = max(hood_x + hood_width, base_x + base_width)
        right_space = effective_width - right_start
        if right_space > 100:
            right_modules = self.distribute_modules(right_space)
            for m in right_modules["modules"]:
                modules.append({
                    **m,
                    "type": "storage",
                    "name": f"상부장({'2D' if m['is_2d'] else '1D'})",
                    "height": upper_height - 20,
                    "depth": 295
                })

        total_used = sum(m.get("width", 0) for m in modules)

        return {
            "modules": modules,
            "door_width": result["door_width"],
            "total_used": total_used,
            "remaining": effective_width - total_used
        }
