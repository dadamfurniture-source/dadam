"""
냉장고 모델 데이터 및 규칙
"""

# 가구 카테고리
CATEGORIES = [
    {"id": "sink", "name": "싱크대", "default_depth": 600},
    {"id": "island", "name": "아일랜드", "default_depth": 800},
    {"id": "wardrobe", "name": "붙박이장", "default_depth": 650},
    {"id": "fridge", "name": "냉장고장", "default_depth": 700},
    {"id": "shoerack", "name": "신발장", "default_depth": 350},
    {"id": "vanity", "name": "화장대", "default_depth": 500},
    {"id": "storage", "name": "수납장", "default_depth": 400},
    {"id": "warehouse", "name": "창고장", "default_depth": 450},
    {"id": "door", "name": "도어교체", "default_depth": 18},
    {"id": "custom", "name": "비규격장", "default_depth": 0}
]

# 냉장고장 규칙
FRIDGE_RULES = {
    "MAX_UPPER_H": 400,     # 상부장 최대 높이
    "PEDESTAL_H": 60,       # 좌대 높이
    "MODULE_D": 550,        # 모듈 기본 깊이
    "INSTALL_D": 700,       # 설치 필요 깊이
    "TOP_GAP": 15,          # 냉장고 상단 간격
    "MOLDING_H": 50,        # 상몰딩 기본 높이
    "EL_W": 600,            # 키큰장/EL장 기본 폭
    "HOMECAFE_W": 600       # 홈카페장 기본 폭
}

# 냉장고 모델 데이터
FRIDGE_DATA = {
    "LG": {
        "name": "LG",
        "categories": {
            "단독 (Fit&Max)": [
                {"id": "lg_300l", "name": "단독 300L", "w": 595, "h": 1780, "d": 680, "type": "builtin", "line": "fitmax", "side_gap": 4, "between_gap": 8, "units": [{"name": "300L", "w": 595}]},
                {"id": "lg_400l", "name": "단독 400L", "w": 595, "h": 1850, "d": 680, "type": "builtin", "line": "fitmax", "side_gap": 4, "between_gap": 8, "units": [{"name": "400L", "w": 595}]},
                {"id": "lg_500l", "name": "단독 500L", "w": 700, "h": 1850, "d": 730, "type": "builtin", "line": "fitmax", "side_gap": 4, "between_gap": 8, "units": [{"name": "500L", "w": 700}]},
                {"id": "lg_600l", "name": "단독 600L", "w": 700, "h": 1920, "d": 730, "type": "builtin", "line": "fitmax", "side_gap": 4, "between_gap": 8, "units": [{"name": "600L", "w": 700}]}
            ],
            "세트 (Fit&Max)": [
                {"id": "lg_set_1d1d", "name": "1도어+1도어", "w": 1198, "h": 1850, "d": 680, "type": "builtin", "line": "fitmax", "side_gap": 4, "between_gap": 8, "units": [{"name": "1도어", "w": 595}, {"name": "1도어", "w": 595}]},
                {"id": "lg_set_500_300", "name": "500+300", "w": 1303, "h": 1850, "d": 730, "type": "builtin", "line": "fitmax", "side_gap": 4, "between_gap": 8, "units": [{"name": "500L", "w": 700}, {"name": "300L", "w": 595}]},
                {"id": "lg_set_500_400", "name": "500+400", "w": 1303, "h": 1850, "d": 730, "type": "builtin", "line": "fitmax", "side_gap": 4, "between_gap": 8, "units": [{"name": "500L", "w": 700}, {"name": "400L", "w": 595}]},
                {"id": "lg_set_600_300", "name": "600+300", "w": 1303, "h": 1920, "d": 730, "type": "builtin", "line": "fitmax", "side_gap": 4, "between_gap": 8, "units": [{"name": "600L", "w": 700}, {"name": "300L", "w": 595}]},
                {"id": "lg_set_600_400", "name": "600+400", "w": 1303, "h": 1920, "d": 730, "type": "builtin", "line": "fitmax", "side_gap": 4, "between_gap": 8, "units": [{"name": "600L", "w": 700}, {"name": "400L", "w": 595}]}
            ],
            "빌트인": [
                {"id": "lg_builtin_fridge_1d", "name": "냉장고+1도어", "w": 1568, "h": 1860, "d": 698, "type": "builtin", "line": "builtin", "side_gap": 22, "between_gap": 11, "units": [{"name": "냉장고", "w": 897}, {"name": "1도어", "w": 649}]},
                {"id": "lg_builtin_kimchi_1d", "name": "김치+1도어", "w": 1309, "h": 1860, "d": 698, "type": "builtin", "line": "builtin", "side_gap": 22, "between_gap": 11, "units": [{"name": "김치", "w": 649}, {"name": "1도어", "w": 649}]},
                {"id": "lg_builtin_fridge_kimchi", "name": "냉장+김치", "w": 1612, "h": 1860, "d": 698, "type": "builtin", "line": "builtin", "side_gap": 22, "between_gap": 11, "units": [{"name": "냉장", "w": 897}, {"name": "김치", "w": 649}]}
            ],
            "프리스탠딩": [
                {"id": "lg_free_600_side", "name": "냉장고600 양문형", "w": 913, "h": 1790, "d": 738, "type": "freestanding", "line": "freestanding", "side_gap": 50, "between_gap": 0, "units": [{"name": "양문형600", "w": 913}]},
                {"id": "lg_free_800_side", "name": "냉장고800 양문형", "w": 913, "h": 1820, "d": 738, "type": "freestanding", "line": "freestanding", "side_gap": 50, "between_gap": 0, "units": [{"name": "양문형800", "w": 913}]}
            ]
        }
    },
    "Samsung": {
        "name": "삼성",
        "categories": {
            "Bespoke 냉장고": [
                {"id": "ss_bespoke_1d", "name": "1도어 키친핏", "w": 595, "h": 1853, "d": 688, "type": "builtin", "line": "bespoke", "side_gap": 12, "between_gap": 7, "units": [{"name": "1도어", "w": 595}]},
                {"id": "ss_bespoke_2d", "name": "2도어 키친핏", "w": 595, "h": 1853, "d": 688, "type": "builtin", "line": "bespoke", "side_gap": 12, "between_gap": 7, "units": [{"name": "2도어", "w": 595}]},
                {"id": "ss_bespoke_4d", "name": "4도어 키친핏", "w": 912, "h": 1853, "d": 688, "type": "builtin", "line": "bespoke", "side_gap": 12, "between_gap": 7, "units": [{"name": "4도어", "w": 912}]}
            ],
            "Bespoke 김치플러스": [
                {"id": "ss_kimchi_1d", "name": "1도어 키친핏", "w": 595, "h": 1853, "d": 688, "type": "builtin", "line": "bespoke", "side_gap": 12, "between_gap": 7, "units": [{"name": "김치1도어", "w": 595}]},
                {"id": "ss_kimchi_3d", "name": "3도어 키친핏", "w": 695, "h": 1853, "d": 688, "type": "builtin", "line": "bespoke", "side_gap": 12, "between_gap": 7, "units": [{"name": "김치3도어", "w": 695}]},
                {"id": "ss_kimchi_4d", "name": "4도어 키친핏", "w": 912, "h": 1853, "d": 688, "type": "builtin", "line": "bespoke", "side_gap": 12, "between_gap": 7, "units": [{"name": "김치4도어", "w": 912}]}
            ],
            "Bespoke 키친핏 세트": [
                {"id": "ss_kf_2d1d", "name": "2도어+1도어", "w": 1197, "h": 1853, "d": 688, "type": "builtin", "line": "bespoke", "side_gap": 12, "between_gap": 7, "units": [{"name": "2도어", "w": 595}, {"name": "1도어", "w": 595}]},
                {"id": "ss_kf_4d1d", "name": "4도어+1도어", "w": 1514, "h": 1853, "d": 688, "type": "builtin", "line": "bespoke", "side_gap": 12, "between_gap": 7, "units": [{"name": "4도어", "w": 912}, {"name": "1도어", "w": 595}]},
                {"id": "ss_kf_4d3d", "name": "4도어+3도어", "w": 1614, "h": 1853, "d": 688, "type": "builtin", "line": "bespoke", "side_gap": 12, "between_gap": 7, "units": [{"name": "4도어", "w": 912}, {"name": "3도어", "w": 695}]}
            ],
            "Infinite Line": [
                {"id": "ss_inf_1d", "name": "1도어 키친핏", "w": 595, "h": 1855, "d": 688, "type": "builtin", "line": "infinite", "side_gap": 5, "between_gap": 10, "units": [{"name": "1도어", "w": 595}]},
                {"id": "ss_inf_4d", "name": "4도어 키친핏", "w": 912, "h": 1855, "d": 688, "type": "builtin", "line": "infinite", "side_gap": 5, "between_gap": 10, "units": [{"name": "4도어", "w": 912}]},
                {"id": "ss_inf_4d4d", "name": "4도어+4도어", "w": 1834, "h": 1855, "d": 688, "type": "builtin", "line": "infinite", "side_gap": 5, "between_gap": 10, "units": [{"name": "4도어", "w": 912}, {"name": "4도어", "w": 912}]}
            ]
        }
    }
}


def get_fridge_model(brand: str, model_id: str) -> dict | None:
    """냉장고 모델 조회"""
    if brand not in FRIDGE_DATA:
        return None

    for category in FRIDGE_DATA[brand]["categories"].values():
        for model in category:
            if model["id"] == model_id:
                return model
    return None


def search_fridge_models(brand: str = None, min_width: float = None, max_width: float = None) -> list:
    """냉장고 모델 검색"""
    results = []
    brands = [brand] if brand else FRIDGE_DATA.keys()

    for b in brands:
        if b not in FRIDGE_DATA:
            continue
        for category_name, models in FRIDGE_DATA[b]["categories"].items():
            for model in models:
                if min_width and model["w"] < min_width:
                    continue
                if max_width and model["w"] > max_width:
                    continue
                results.append({
                    **model,
                    "brand": b,
                    "category": category_name
                })

    return results


def get_recommended_fridge(total_width: float, brand: str = None) -> list:
    """공간에 맞는 추천 냉장고 목록"""
    # 최소 마감 공간 (좌우 각 60mm)
    available_for_fridge = total_width - 120

    # 키큰장 포함 시 추가 여유 (-600mm)
    available_with_tall = available_for_fridge - 600

    results = []
    brands = [brand] if brand else FRIDGE_DATA.keys()

    for b in brands:
        if b not in FRIDGE_DATA:
            continue
        for category_name, models in FRIDGE_DATA[b]["categories"].items():
            for model in models:
                # 냉장고 총 필요 너비 (측면 여유 포함)
                total_fridge_width = model["w"] + (model["side_gap"] * 2)

                if total_fridge_width <= available_for_fridge:
                    remaining = available_for_fridge - total_fridge_width
                    results.append({
                        **model,
                        "brand": b,
                        "category": category_name,
                        "total_width_needed": total_fridge_width,
                        "remaining_space": remaining,
                        "can_add_tall": remaining >= 500
                    })

    # 잔여 공간이 적은 순으로 정렬 (공간 활용 최적화)
    results.sort(key=lambda x: x["remaining_space"])

    return results[:5]  # 상위 5개 추천
