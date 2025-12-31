---
title: "모듈 스펙 상세"
slug: module-specifications
description: "각 모듈 타입별 상세 규격과 옵션 정의"
keywords: ["모듈", "스펙", "규격", "옵션", "치수"]
---

# 모듈 스펙 상세

## 싱크대 모듈

### 상부장 모듈
| 필드 | 기본값 | 설명 |
|------|--------|------|
| w | 600 | 너비 (mm) |
| h | upperH - 20 | 높이 (mm) |
| d | 295 | 깊이 (mm) |
| type | 'storage' | 타입 |
| pos | 'upper' | 위치 |

### 하부장 모듈
| 필드 | 기본값 | 설명 |
|------|--------|------|
| w | 600 | 너비 (mm) |
| h | lowerH - legH | 높이 (mm) |
| d | 550 | 깊이 (mm) |
| isDrawer | false | 서랍형 여부 |
| isEL | false | EL장 여부 |
| isFixed | false | 고정장 여부 |

### 키큰장 (Tall)
| 필드 | 기본값 | 설명 |
|------|--------|------|
| w | 600 | 너비 (mm) |
| h | spaceH - moldingH - 60 | 높이 (mm) |
| d | 550 | 깊이 (mm) |
| doorCount | 1 | 도어 개수 |
| elCount | 0 | EL 개수 |

### 싱크대 기본 스펙
```javascript
specs: {
  upperH: 720,           // 상부장 높이
  lowerH: 870,           // 하부장 높이
  sinkLegHeight: 120,    // 다리발 높이 (120 or 150)
  moldingH: 50,          // 상몰딩 높이
  layoutShape: 'I',      // 레이아웃 (I, L, U)
  showDoors: false,      // 도어 표시
  doorColorUpper: '화이트',
  doorColorLower: '화이트',
  dishwasher: 'None'     // 식기세척기 (None, BuiltIn, FreeStanding)
}
```

## 붙박이장 모듈

### 옷장 모듈
| 필드 | 기본값 | 설명 |
|------|--------|------|
| w | 분배값 | 너비 (mm) |
| h | effectiveH | 높이 (mm) |
| d | D | 깊이 (mm) |
| doorCount | 1 or 2 | 도어 개수 (2D/1D) |
| moduleType | 'short' | 타입 (short/long/shelf) |
| isDivided | true | 상하 분할 여부 |

### 모듈 타입 상세
```javascript
// 짧은옷(2단) - short
{ type: 'short', name: '짧은옷(2단)', isDivided: true }

// 긴옷(1단) - long
{ type: 'long', name: '긴옷(1단)', isDivided: false,
  drawerCount: 1, shelfCount: 1 }

// 선반형 - shelf
{ type: 'shelf', name: '선반형', isDivided: true,
  shelfCountUpper: 2, shelfCountLower: 2 }
```

### 붙박이장 기본 스펙
```javascript
specs: {
  wardrobePedestal: 60,      // 좌대 높이
  wardrobeMoldingH: 15,      // 상몰딩 높이
  wardrobeEffectiveW: null,  // 유효공간 (null=자동)
  handleType: 'bar',         // 손잡이 (bar/smartbar)
  showDoors: false           // 도어 표시
}
```

## 냉장고장 모듈

### 상수 정의
```javascript
const FRIDGE_RULES = {
  MOLDING_H: 50,        // 상몰딩 높이
  PEDESTAL_H: 60,       // 좌대 높이
  TOP_GAP: 15,          // 상부 여유
  MODULE_D: 600,        // 모듈 깊이
  fridgeUpperH: 415,    // 상부장 높이
  fridgeLowerH: 870,    // 하부장 높이
  MAX_UPPER_H: 400      // 상부장 최대 높이
};
```

### 냉장고 모듈
| 필드 | 기본값 | 설명 |
|------|--------|------|
| type | 'fridge' | 타입 |
| w | 모델별 | 너비 (mm) |
| h | 모델별 | 높이 (mm) |
| sideGap | 50 | 측면 간격 |
| betweenGap | 0 | 유닛간 간격 |
| units | [...] | 냉장고 유닛 배열 |

### 키큰장 (냉장고장)
| 필드 | 기본값 | 설명 |
|------|--------|------|
| type | 'tall' | 타입 |
| w | 600 | 너비 (mm) |
| isEL | false | EL장 여부 |
| doorType | 'swing' | 도어 타입 |
| doorDivision | 'individual' | 도어 구분 |
| lowerType | 'basic' | 하부장 타입 |
| elModules | [] | EL 모듈 배열 |

### 홈카페장
| 필드 | 기본값 | 설명 |
|------|--------|------|
| type | 'homecafe' | 타입 |
| w | 600 | 너비 (mm) |
| machineType | 'espresso' | 머신 타입 |
| lowerType | 'basic' | 하부장 타입 |

### EL 도어 타입
```javascript
const EL_DOOR_TYPES = [
  { id: 'swing', name: '여닫이' },
  { id: 'lift', name: '리프트업' },
  { id: 'slide', name: '슬라이딩' },
  { id: 'fold', name: '폴딩' }
];
```

### 하부장 모듈 타입
```javascript
const LOWER_MODULE_TYPES = [
  { id: 'basic', name: '기본장', icon: '🗄️' },
  { id: 'robot', name: '로봇청소기', icon: '🤖' },
  { id: 'rice', name: '밥솥장', icon: '🍚' },
  { id: 'foodwaste', name: '음식물수거함', icon: '♻️' }
];
```

## 치수 계산 공식

### 싱크대
```javascript
// 유효공간
effectiveW = W - finishLeft - finishRight

// 하부장 본체 높이
lowerBodyH = lowerH - legH

// 걸레받이 높이
baseboardH = legH - 5
```

### 붙박이장
```javascript
// 유효 높이
effectiveH = H - pedestalH - moldingH

// 상하 분할
halfH = Math.round(effectiveH / 2)

// 스마트바 모드 도어 너비
doorWidth = (effectiveW - smartbarTotal) / totalDoors
```

### 냉장고장
```javascript
// 상부장 높이
upperH = Math.min(MAX_UPPER_H, H - fridgeH - TOP_GAP - MOLDING_H)

// 모듈 본체 높이
moduleBodyH = H - MOLDING_H - upperH - PEDESTAL_H

// 중간장/하부장 분할
middleH = moduleBodyH * 0.55
lowerH = moduleBodyH - middleH
```
