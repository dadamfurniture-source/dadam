"""
Pydantic 모델 정의
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Literal
from enum import Enum


# ============================================================
# 기본 모델
# ============================================================

class HealthCheck(BaseModel):
    status: str
    message: str


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None  # 현재 설계 상태


class ChatResponse(BaseModel):
    message: str
    suggestions: Optional[List[Dict[str, Any]]] = None
    actions: Optional[List[Dict[str, Any]]] = None  # UI 업데이트 액션
    session_id: str


# ============================================================
# 가구 카테고리
# ============================================================

class FurnitureCategory(str, Enum):
    SINK = "sink"           # 싱크대
    ISLAND = "island"       # 아일랜드
    WARDROBE = "wardrobe"   # 붙박이장
    FRIDGE = "fridge"       # 냉장고장
    SHOERACK = "shoerack"   # 신발장
    VANITY = "vanity"       # 화장대
    STORAGE = "storage"     # 수납장
    WAREHOUSE = "warehouse" # 창고장
    DOOR = "door"           # 도어교체
    CUSTOM = "custom"       # 비규격장


# ============================================================
# 치수 관련 모델
# ============================================================

class Dimensions(BaseModel):
    width: float = Field(..., description="너비 (mm)")
    height: float = Field(..., description="높이 (mm)")
    depth: float = Field(..., description="깊이 (mm)")


class FinishSettings(BaseModel):
    left_type: Literal["filler", "molding", "ep", "none"] = "filler"
    left_width: float = 60
    right_type: Literal["filler", "molding", "ep", "none"] = "filler"
    right_width: float = 60


class DesignSpecs(BaseModel):
    dimensions: Dimensions
    category: FurnitureCategory
    finish: FinishSettings = FinishSettings()
    upper_height: Optional[float] = 720
    lower_height: Optional[float] = 870
    molding_height: Optional[float] = 60
    pedestal_height: Optional[float] = 60
    measurement_base: Literal["Left", "Right"] = "Left"


# ============================================================
# 모듈 관련 모델
# ============================================================

class ModuleType(str, Enum):
    STORAGE = "storage"
    HOOD = "hood"
    SINK = "sink"
    COOKTOP = "cooktop"
    TALL = "tall"
    FRIDGE = "fridge"
    DRAWER = "drawer"
    EL = "el"


class Module(BaseModel):
    id: str
    type: ModuleType
    name: str
    position: Literal["upper", "lower", "tall"]
    width: float
    height: float
    depth: float
    is_2d: bool = False  # 2도어 여부
    is_fixed: bool = False
    is_base: bool = False


class DesignResult(BaseModel):
    modules: List[Module]
    total_width: float
    effective_width: float
    remaining: float
    door_width: float
    door_count: int
    summary: str


# ============================================================
# 냉장고 모델
# ============================================================

class FridgeUnit(BaseModel):
    name: str
    width: float


class FridgeModel(BaseModel):
    id: str
    name: str
    brand: Literal["LG", "Samsung"]
    category: str
    width: float
    height: float
    depth: float
    type: Literal["builtin", "freestanding"]
    line: str
    side_gap: float
    between_gap: float
    units: List[FridgeUnit]


class FridgeDesignRequest(BaseModel):
    total_width: float
    total_height: float
    brand: Optional[Literal["LG", "Samsung"]] = None
    model_id: Optional[str] = None
    include_tall: bool = False
    include_homecafe: bool = False


class FridgeDesignResult(BaseModel):
    fridge_model: Optional[FridgeModel] = None
    modules: List[Dict[str, Any]]
    upper_height: float
    middle_height: float
    lower_height: float
    effective_width: float
    remaining: float
    summary: str


# ============================================================
# 계산 요청/응답
# ============================================================

class CalculateRequest(BaseModel):
    total_space: float
    fixed_modules: Optional[List[Dict[str, Any]]] = None
    constraints: Optional[Dict[str, Any]] = None


class CalculateResponse(BaseModel):
    door_width: float
    door_count: int
    modules: List[Dict[str, Any]]
    remaining: float
    is_optimal: bool
    message: str
