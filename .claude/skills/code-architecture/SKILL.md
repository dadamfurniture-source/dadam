---
title: "다담 코드 아키텍처"
slug: code-architecture
description: "다담 캐비넷 시스템의 코드 구조, 함수, 렌더링 패턴 가이드"
keywords: ["코드", "아키텍처", "함수", "렌더링", "SVG", "JavaScript"]
---

# 다담 코드 아키텍처

## 파일 구조

```
dadam-ai-agent/
└── backend/
    └── static/
        └── index.html    # 메인 앱 (5000+ lines)
```

## 핵심 함수

### 공통 유틸리티

```javascript
// 아이템 조회
function getItem(itemUniqueId)

// 모듈 조회
function getModule(itemUniqueId, modId)

// 아이템 스펙 업데이트
function updateItemSpec(itemUniqueId, field, value, shouldRender = true)

// 모듈 필드 업데이트
function updateModuleField(itemUniqueId, modId, field, value, shouldRender = true)
```

### 렌더링 함수

| 함수 | 설명 |
|------|------|
| `renderWorkspaceContent(item)` | 메인 워크스페이스 렌더링 |
| `renderSinkWorkspace(item)` | 싱크대 전용 렌더링 |
| `renderWardrobeWorkspace(item)` | 붙박이장 전용 렌더링 |
| `renderFridgeWorkspace(item)` | 냉장고장 전용 렌더링 |

### 자동계산 함수

| 함수 | 설명 |
|------|------|
| `runAutoCalcSection(itemId, section)` | 섹션별 자동계산 |
| `runWardrobeAutoCalc(itemId)` | 붙박이장 자동배치 |
| `distributeModules(effectiveW)` | 모듈 분배 알고리즘 |

### 토글 함수

```javascript
toggleSinkDoors(itemUniqueId)      // 싱크대 도어 표시
toggleWardrobeDoors(itemUniqueId)  // 붙박이장 도어 표시
toggleFridgeDoors(itemUniqueId)    // 냉장고장 도어 표시
```

## SVG 렌더링 패턴

### Front View 구조
```javascript
const svgWidth = 600;
const svgHeight = 380;
const scale = Math.min((svgWidth - 100) / W, (svgHeight - 100) / H);

// 오프셋 계산
const offsetX = (svgWidth - drawW) / 2;
const offsetY = 50;
```

### 도어 렌더링
```javascript
if (showDoors) {
  const doorCount = Math.max(1, Math.round(mod.w / 450));
  const doorGap = 3 * scale;
  const dW = modW / doorCount;

  for (let d = 0; d < doorCount; d++) {
    const dX = startX + d * dW + doorGap/2;
    svg += `<rect x="${dX}" ... fill="${doorColor}" />`;
  }
}
```

### 색상 시스템
```javascript
const DOOR_COLOR_MAP = {
  '화이트': '#f8fafc',
  '그레이': '#94a3b8',
  '베이지': '#d4c4a8',
  '네이비': '#1e3a5f',
  '블랙': '#1f2937'
};

function getDoorColor(colorName) {
  return DOOR_COLOR_MAP[colorName] || DOOR_COLOR_MAP['화이트'];
}
```

## 데이터 구조

### Item 객체
```javascript
{
  uniqueId: number,
  category: 'sink' | 'wardrobe' | 'fridge',
  labelName: string,
  w: number, h: number, d: number,
  specs: { ... },
  modules: [ ... ]
}
```

### Module 객체
```javascript
{
  id: number,
  type: string,      // 'storage', 'sink', 'cook', 'tall', etc.
  pos: string,       // 'upper', 'lower', 'wardrobe'
  w: number, h: number, d: number,
  isFixed: boolean,
  isDrawer: boolean,
  isEL: boolean
}
```

## CSS 변수

```css
:root {
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --border-radius: 8px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
}
```

## 코드 수정 가이드

### 도어 규칙 변경시
1. `renderXXXWorkspace()` 함수에서 `doorCount` 계산식 수정
2. `showDoors` 조건부 렌더링 블록 확인
3. `doorGap` 값 확인 (기본 3mm)

### 새 모듈 타입 추가시
1. 타입 상수 배열에 추가
2. 렌더링 함수에 색상/아이콘 매핑 추가
3. 자동계산 로직에 반영

### 스펙 필드 추가시
1. 기본값 설정 (`item.specs.newField = defaultValue`)
2. UI 입력 필드 추가
3. `updateSpec()` 또는 전용 핸들러 연결
