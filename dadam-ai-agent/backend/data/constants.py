"""
가구 설계 상수 정의
"""

# 도어 규격 상수
DOOR_TARGET_WIDTH = 450   # 목표 도어 너비
DOOR_MAX_WIDTH = 600      # 최대 도어 너비
DOOR_MIN_WIDTH = 350      # 최소 도어 너비
MIN_REMAINDER = 4         # 최소 잔여 공간
MAX_REMAINDER = 10        # 최대 잔여 공간

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
