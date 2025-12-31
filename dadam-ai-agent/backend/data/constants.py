"""
가구 설계 상수 정의
"""

# 도어 규격 상수
DOOR_TARGET_WIDTH = 450   # 목표 도어 너비
DOOR_MAX_WIDTH = 600      # 최대 도어 너비
DOOR_MIN_WIDTH = 350      # 최소 도어 너비
MIN_REMAINDER = 4         # 최소 잔여 공간
MAX_REMAINDER = 10        # 최대 잔여 공간

# 도어 간격 (2도어 사이 공간)
DOOR_GAP = 3              # 2도어 사이 간격 (mm)

# 도어 렌더링 규칙
DOOR_RENDER_RULES = {
    "show_handle": False,      # 도어 손잡이 표시 여부
    "gap_between_doors": 3,    # 도어 사이 간격 (mm)
    "upper_cabinet_door": True # 상부장 도어 표시 여부
}

# 카테고리별 도어 규칙 (냉장고장, 싱크대, 붙박이장 공통)
CATEGORY_DOOR_RULES = {
    "fridge": {
        "upper_has_door": True,    # 상부장 도어 있음
        "door_gap": 3,             # 2도어 사이 간격
        "show_handle": False,      # 손잡이 표시 안함
        "upper_single_door_per_module": True  # 상부장: 모듈당 1도어만 생성 (가로너비 분배규칙 미적용)
    },
    "sink": {
        "upper_has_door": True,
        "door_gap": 3,
        "show_handle": False
    },
    "wardrobe": {
        "upper_has_door": True,
        "door_gap": 3,
        "show_handle": False
    }
}

# 기본 치수
DEFAULT_UPPER_HEIGHT = 720
DEFAULT_LOWER_HEIGHT = 870
DEFAULT_MOLDING_HEIGHT = 60
DEFAULT_LEG_HEIGHT = 150

# 마감 타입
FINISH_TYPES = {
    "molding": {"name": "몰딩", "default_width": 60, "editable": True},
    "filler": {"name": "휠라", "default_width": 60, "editable": True},
    "ep": {"name": "EP", "default_width": 20, "editable": False},
    "none": {"name": "없음", "default_width": 0, "editable": False}
}

# 하부장 모듈 타입
LOWER_MODULE_TYPES = {
    "drawer": {"name": "서랍장", "default_width": 600, "icon": "🗄️"},
    "el": {"name": "EL장", "default_width": 600, "icon": "⚡"},
    "robot": {"name": "로봇청소기장", "default_width": 600, "icon": "🤖"},
    "rice": {"name": "밥솥장", "default_width": 450, "icon": "🍚"}
}

# EL장 도어 타입
EL_DOOR_TYPES = {
    "pocket": "포켓레일",
    "liftup": "리프트업",
    "swing": "여닫이"
}
