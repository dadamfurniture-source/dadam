"""
냉장고 모델 조회 도구
"""
from typing import List, Dict, Any, Optional
from data.fridge_data import FRIDGE_DATA, FRIDGE_RULES, get_fridge_model, get_recommended_fridge


class FridgeLookup:
    """냉장고 모델 조회 및 추천 도구"""

    def __init__(self):
        self.data = FRIDGE_DATA
        self.rules = FRIDGE_RULES

    def get_brands(self) -> List[str]:
        """브랜드 목록 조회"""
        return list(self.data.keys())

    def get_categories(self, brand: str) -> List[str]:
        """브랜드별 카테고리 조회"""
        if brand not in self.data:
            return []
        return list(self.data[brand]["categories"].keys())

    def get_models(self, brand: str, category: str = None) -> List[Dict]:
        """모델 목록 조회"""
        if brand not in self.data:
            return []

        if category:
            return self.data[brand]["categories"].get(category, [])

        # 전체 모델
        models = []
        for cat_name, cat_models in self.data[brand]["categories"].items():
            for model in cat_models:
                models.append({**model, "category": cat_name})
        return models

    def get_model_by_id(self, model_id: str) -> Optional[Dict]:
        """모델 ID로 조회"""
        for brand in self.data:
            for category, models in self.data[brand]["categories"].items():
                for model in models:
                    if model["id"] == model_id:
                        return {**model, "brand": brand, "category": category}
        return None

    def search_models(
        self,
        query: str = None,
        brand: str = None,
        min_width: float = None,
        max_width: float = None,
        fridge_type: str = None
    ) -> List[Dict]:
        """모델 검색"""
        results = []
        brands = [brand] if brand else self.data.keys()

        for b in brands:
            if b not in self.data:
                continue

            for cat_name, models in self.data[b]["categories"].items():
                for model in models:
                    # 너비 필터
                    if min_width and model["w"] < min_width:
                        continue
                    if max_width and model["w"] > max_width:
                        continue

                    # 타입 필터
                    if fridge_type and model["type"] != fridge_type:
                        continue

                    # 쿼리 검색
                    if query:
                        query_lower = query.lower()
                        if not any([
                            query_lower in model["name"].lower(),
                            query_lower in model["id"].lower(),
                            query_lower in cat_name.lower()
                        ]):
                            continue

                    results.append({
                        **model,
                        "brand": b,
                        "category": cat_name
                    })

        return results

    def recommend_for_space(
        self,
        total_width: float,
        total_height: float = 2300,
        brand: str = None,
        include_tall: bool = False
    ) -> List[Dict]:
        """
        공간에 맞는 냉장고 추천

        Args:
            total_width: 전체 너비 (mm)
            total_height: 전체 높이 (mm)
            brand: 선호 브랜드
            include_tall: 키큰장 포함 여부
        """
        # 마감 공간 (좌우 각 60mm)
        finish_space = 120
        available = total_width - finish_space

        # 키큰장 포함 시 공간 확보
        tall_space = 600 if include_tall else 0
        fridge_space = available - tall_space

        recommendations = []
        brands = [brand] if brand else self.data.keys()

        for b in brands:
            if b not in self.data:
                continue

            for cat_name, models in self.data[b]["categories"].items():
                for model in models:
                    # 냉장고 필요 너비 (측면 여유 포함)
                    needed_width = model["w"] + (model["side_gap"] * 2)

                    # 높이 체크
                    if model["h"] > total_height - 100:  # 상부장 최소 공간
                        continue

                    if needed_width <= fridge_space:
                        remaining = fridge_space - needed_width

                        # 상부장 높이 계산
                        molding_h = self.rules["MOLDING_H"]
                        top_gap = self.rules["TOP_GAP"]
                        upper_h = min(
                            self.rules["MAX_UPPER_H"],
                            total_height - model["h"] - top_gap - molding_h
                        )

                        recommendations.append({
                            **model,
                            "brand": b,
                            "category": cat_name,
                            "needed_width": needed_width,
                            "remaining_space": remaining,
                            "can_add_tall": remaining >= 500 and not include_tall,
                            "recommended_upper_h": upper_h,
                            "score": self._calc_score(remaining, model, total_width)
                        })

        # 점수순 정렬
        recommendations.sort(key=lambda x: x["score"], reverse=True)

        return recommendations[:5]

    def _calc_score(self, remaining: float, model: dict, total_width: float) -> float:
        """추천 점수 계산"""
        score = 100

        # 잔여 공간 점수 (적을수록 좋음, 단 음수면 안됨)
        if remaining < 0:
            return 0

        # 최적 잔여 공간 (4~10mm)
        if 4 <= remaining <= 10:
            score += 30
        elif remaining <= 20:
            score += 20
        elif remaining <= 50:
            score += 10
        else:
            score -= (remaining - 50) / 10

        # 빌트인 선호
        if model["type"] == "builtin":
            score += 15

        # 멀티 유닛 보너스
        if len(model.get("units", [])) >= 2:
            score += 10

        return max(0, score)

    def calculate_fridge_layout(
        self,
        model_id: str,
        total_width: float,
        total_height: float,
        finish_left: float = 60,
        finish_right: float = 60,
        include_tall: bool = False,
        tall_width: float = 600
    ) -> Dict[str, Any]:
        """
        냉장고장 레이아웃 계산

        Returns:
            모듈 배치 및 높이 정보
        """
        model = self.get_model_by_id(model_id)
        if not model:
            return {"error": "모델을 찾을 수 없습니다."}

        # 치수 계산
        effective_width = total_width - finish_left - finish_right
        molding_h = self.rules["MOLDING_H"]
        pedestal_h = self.rules["PEDESTAL_H"]
        top_gap = self.rules["TOP_GAP"]

        # 상부장 높이
        upper_h = min(
            self.rules["MAX_UPPER_H"],
            total_height - model["h"] - top_gap - molding_h
        )

        # 본체 영역 높이
        body_h = total_height - molding_h - upper_h - pedestal_h
        middle_h = round(body_h * 0.55)
        lower_h = body_h - middle_h

        # 냉장고 필요 너비
        side_gap = model["side_gap"]
        between_gap = model.get("between_gap", 0)
        units = model.get("units", [{"name": model["name"], "w": model["w"]}])

        fridge_total_width = side_gap * 2 + sum(u["w"] for u in units)
        if len(units) > 1:
            fridge_total_width += between_gap * (len(units) - 1)

        modules = []

        # 키큰장
        if include_tall:
            modules.append({
                "type": "tall",
                "name": "키큰장",
                "width": tall_width,
                "height": body_h,
                "depth": self.rules["MODULE_D"],
                "is_el": False
            })

        # 냉장고
        modules.append({
            "type": "fridge",
            "name": model["name"],
            "model_id": model["id"],
            "brand": model["brand"],
            "width": model["w"],
            "height": model["h"],
            "depth": model["d"],
            "side_gap": side_gap,
            "between_gap": between_gap,
            "units": units
        })

        # 잔여 공간 계산
        used_width = fridge_total_width + (tall_width if include_tall else 0)
        remaining = effective_width - used_width

        return {
            "model": model,
            "modules": modules,
            "dimensions": {
                "total_width": total_width,
                "effective_width": effective_width,
                "upper_height": upper_h,
                "middle_height": middle_h,
                "lower_height": lower_h,
                "molding_height": molding_h,
                "pedestal_height": pedestal_h
            },
            "used_width": used_width,
            "remaining": remaining,
            "is_valid": remaining >= 0 and remaining <= 50
        }
