# 다담 캐비넷 에이전트 (Dadam Cabinet Agent)

AI 기반 맞춤 가구 설계 시스템 v31.0

## 프로젝트 개요

다담 캐비넷은 싱크대, 붙박이장, 냉장고장 등 맞춤 가구의 모듈 설계를 지원하는 웹 애플리케이션입니다.

## 기술 스택

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **렌더링**: SVG (Front View 도면)
- **빌드**: 단일 HTML 파일 (번들링 없음)

## 디렉토리 구조

```
dadam/
├── CLAUDE.md                          # 프로젝트 문서
├── .claude/
│   └── skills/
│       ├── cabinet-design-guide/      # 설계 가이드 스킬
│       ├── code-architecture/         # 코드 아키텍처 스킬
│       └── module-specifications/     # 모듈 스펙 스킬
└── dadam-ai-agent/
    └── backend/
        └── static/
            └── index.html             # 메인 앱 (5000+ lines)
```

## 가구 타입

| 타입 | 설명 | 주요 모듈 |
|------|------|----------|
| 싱크대 | 주방 싱크대 캐비넷 | 상부장, 하부장, 키큰장 |
| 붙박이장 | 옷장/수납장 | 옷장 모듈 (short/long/shelf) |
| 냉장고장 | 냉장고 수납 캐비넷 | 냉장고, 키큰장, 홈카페장 |

## 핵심 규칙

### 도어 규칙
- 기본 분배: `Math.max(1, Math.round(너비 / 450))`
- 냉장고장 상부장: 1개 고정
- 도어 간격: 3mm

### 걸레받이 (싱크대)
- 높이: 다리발 높이 - 5mm
- 너비: 하부장 합계 (최대 2400mm)
- 도어 표시시 자동 생성

### 마감재
| 타입 | 기본 너비 |
|------|----------|
| 휠라 | 60mm |
| 몰딩 | 60mm |
| EP | 20mm |

## AI Agent 인터페이스

```javascript
// 글로벌 접근
window.DadamAgent

// 주요 메서드
DadamAgent.getDesignState()       // 현재 상태 조회
DadamAgent.addItem(category, dim) // 아이템 추가
DadamAgent.addModule(itemId, mod) // 모듈 추가
DadamAgent.runAutoCalc(itemId)    // 자동계산
DadamAgent.updateSpec(id, k, v)   // 스펙 업데이트
DadamAgent.exportDesign()         // 내보내기
DadamAgent.importDesign(data)     // 불러오기
```

## 개발 가이드

### 코드 수정시
1. `/home/user/dadam/dadam-ai-agent/backend/static/index.html` 수정
2. 관련 렌더링 함수 확인 (`renderXXXWorkspace`)
3. 도어 규칙 변경시 `doorCount` 계산식 수정

### 테스트
- 브라우저에서 직접 확인
- 각 가구 타입별 Front View 검증
- 도어 버튼 토글 동작 확인

## 최근 변경사항

- **v31.0**: AI Agent 인터페이스 추가, 코드 최적화
- **걸레받이**: 싱크대 하부장 걸레받이 기능
- **도어 분배**: 냉장고장 너비 기준 도어 분배 규칙

## 관련 스킬

이 프로젝트에서 사용 가능한 Claude 스킬:

1. **cabinet-design-guide**: 캐비넷 설계 규칙
2. **code-architecture**: 코드 구조 및 패턴
3. **module-specifications**: 모듈별 상세 스펙
