/**
 * 냉장고장 설계 스킬 모듈
 * 다담 캐비넷 에이전트 v32.1
 *
 * 주요 기능:
 * - 냉장고 모델 선택 (LG/삼성)
 * - EL장/키큰장/홈카페장 배치
 * - 상부장/중간장/하부장 높이 자동 계산
 * - Front View SVG 렌더링
 *
 * 서브 스킬:
 * 1. 냉장고 모델 관리 - 브랜드별 모델 데이터
 * 2. EL장 설계 - 도어 타입 (리프트업/플랩/포켓 등)
 * 3. 홈카페장 설계 - 커피머신/가전 수납
 * 4. 자동 계산 - 높이/너비 최적화
 */

// ============================================================
// 상수 정의
// ============================================================
const FridgeDesignConstants = {
  // 높이 규칙
  MAX_UPPER_H: 400,        // 상부장 최대 높이
  PEDESTAL_H: 60,          // 좌대 높이
  LEG_H: 60,               // 다리발 높이
  LOWER_BODY_H: 810,       // 하부장 모듈 높이 (다리 제외)
  TOP_GAP: 15,             // 냉장고 상단 간격 (고정)
  MOLDING_H: 50,           // 상몰딩 기본 높이

  // 너비 규칙
  MODULE_D: 550,           // 모듈 기본 깊이
  INSTALL_D: 700,          // 설치 필요 깊이
  EL_W: 600,               // 키큰장/EL장 기본 폭
  HOMECAFE_W: 600,         // 홈카페장 기본 폭

  // 여유공간 기본값
  DEFAULT_GAPS: {
    LG_BUILTIN: { side: 4, between: 8 },
    LG_FREESTANDING: { side: 50, between: 0 },
    SS_BESPOKE: { side: 12, between: 10 },
    SS_INFINITE: { side: 5, between: 10 },
    SS_FREESTANDING: { side: 50, between: 0 }
  }
};

// ============================================================
// 냉장고 모델 데이터
// ============================================================
const FRIDGE_MODEL_DATA = {
  LG: {
    name: 'LG',
    categories: {
      '단독 (Fit&Max)': [
        { id: 'lg_300l', name: '단독 300L', w: 595, h: 1780, d: 680, type: 'builtin', line: 'fitmax', sideGap: 4, betweenGap: 8, units: [{ name: '300L', w: 595 }] },
        { id: 'lg_400l', name: '단독 400L', w: 595, h: 1850, d: 680, type: 'builtin', line: 'fitmax', sideGap: 4, betweenGap: 8, units: [{ name: '400L', w: 595 }] },
        { id: 'lg_500l', name: '단독 500L', w: 700, h: 1850, d: 730, type: 'builtin', line: 'fitmax', sideGap: 4, betweenGap: 8, units: [{ name: '500L', w: 700 }] },
        { id: 'lg_600l', name: '단독 600L', w: 700, h: 1920, d: 730, type: 'builtin', line: 'fitmax', sideGap: 4, betweenGap: 8, units: [{ name: '600L', w: 700 }] }
      ],
      '세트 (Fit&Max)': [
        { id: 'lg_set_1d1d', name: '1도어+1도어', w: 1198, h: 1850, d: 680, type: 'builtin', line: 'fitmax', sideGap: 4, betweenGap: 8, units: [{ name: '1도어', w: 595 }, { name: '1도어', w: 595 }] },
        { id: 'lg_set_500_300', name: '500+300', w: 1303, h: 1850, d: 730, type: 'builtin', line: 'fitmax', sideGap: 4, betweenGap: 8, units: [{ name: '500L', w: 700 }, { name: '300L', w: 595 }] },
        { id: 'lg_set_600_300', name: '600+300', w: 1303, h: 1920, d: 730, type: 'builtin', line: 'fitmax', sideGap: 4, betweenGap: 8, units: [{ name: '600L', w: 700 }, { name: '300L', w: 595 }] }
      ],
      '빌트인': [
        { id: 'lg_builtin_fridge_1d', name: '냉장고+1도어', w: 1568, h: 1860, d: 698, type: 'builtin', line: 'builtin', sideGap: 22, betweenGap: 11, units: [{ name: '냉장고', w: 897 }, { name: '1도어', w: 649 }] },
        { id: 'lg_builtin_kimchi_1d', name: '김치+1도어', w: 1309, h: 1860, d: 698, type: 'builtin', line: 'builtin', sideGap: 22, betweenGap: 11, units: [{ name: '김치', w: 649 }, { name: '1도어', w: 649 }] },
        { id: 'lg_builtin_fridge_kimchi', name: '냉장+김치', w: 1612, h: 1860, d: 698, type: 'builtin', line: 'builtin', sideGap: 22, betweenGap: 11, units: [{ name: '냉장', w: 897 }, { name: '김치', w: 649 }] }
      ],
      '프리스탠딩': [
        { id: 'lg_free_600_side', name: '냉장고600 양문형', w: 913, h: 1790, d: 738, type: 'freestanding', line: 'freestanding', sideGap: 50, betweenGap: 0, units: [{ name: '양문형600', w: 913 }] },
        { id: 'lg_free_800_side', name: '냉장고800 양문형', w: 913, h: 1820, d: 738, type: 'freestanding', line: 'freestanding', sideGap: 50, betweenGap: 0, units: [{ name: '양문형800', w: 913 }] }
      ]
    }
  },
  Samsung: {
    name: '삼성',
    categories: {
      'Bespoke 냉장고': [
        { id: 'ss_bespoke_1d', name: '1도어 키친핏', w: 595, h: 1853, d: 688, type: 'builtin', line: 'bespoke', sideGap: 12, betweenGap: 10, units: [{ name: '1도어', w: 595 }] },
        { id: 'ss_bespoke_2d', name: '2도어 키친핏', w: 595, h: 1853, d: 688, type: 'builtin', line: 'bespoke', sideGap: 12, betweenGap: 10, units: [{ name: '2도어', w: 595 }] },
        { id: 'ss_bespoke_4d', name: '4도어 키친핏', w: 912, h: 1853, d: 688, type: 'builtin', line: 'bespoke', sideGap: 12, betweenGap: 10, units: [{ name: '4도어', w: 912 }] }
      ],
      'Bespoke 키친핏 세트': [
        { id: 'ss_kf_2d1d', name: '2도어+1도어', w: 1200, h: 1853, d: 688, type: 'builtin', line: 'bespoke', sideGap: 12, betweenGap: 10, units: [{ name: '2도어', w: 595 }, { name: '1도어', w: 595 }] },
        { id: 'ss_kf_4d1d', name: '4도어+1도어', w: 1517, h: 1853, d: 688, type: 'builtin', line: 'bespoke', sideGap: 12, betweenGap: 10, units: [{ name: '4도어', w: 912 }, { name: '1도어', w: 595 }] },
        { id: 'ss_kf_4d3d', name: '4도어+3도어', w: 1617, h: 1853, d: 688, type: 'builtin', line: 'bespoke', sideGap: 12, betweenGap: 10, units: [{ name: '4도어', w: 912 }, { name: '3도어', w: 695 }] }
      ],
      'Infinite Line': [
        { id: 'ss_inf_1d', name: '1도어 키친핏', w: 595, h: 1855, d: 688, type: 'builtin', line: 'infinite', sideGap: 5, betweenGap: 10, units: [{ name: '1도어', w: 595 }] },
        { id: 'ss_inf_4d', name: '4도어 키친핏', w: 912, h: 1855, d: 688, type: 'builtin', line: 'infinite', sideGap: 5, betweenGap: 10, units: [{ name: '4도어', w: 912 }] },
        { id: 'ss_inf_4d4d', name: '4도어+4도어', w: 1834, h: 1855, d: 688, type: 'builtin', line: 'infinite', sideGap: 5, betweenGap: 10, units: [{ name: '4도어', w: 912 }, { name: '4도어', w: 912 }] }
      ]
    }
  }
};

// ============================================================
// EL장 도어 타입
// ============================================================
const EL_DOOR_TYPES = [
  { id: 'liftup', name: '리프트업' },
  { id: 'flap', name: '플랩도어' },
  { id: 'pocket', name: '포켓도어' },
  { id: 'swing', name: '여닫이' },
  { id: 'sliding', name: '슬라이딩' }
];

// ============================================================
// 하부장 모듈 타입
// ============================================================
const LOWER_MODULE_TYPES = [
  { id: 'default', name: '기본', defaultW: 600, color: '#6b7280', icon: '🗄️' },
  { id: 'robot', name: '로봇청소기', defaultW: 600, color: '#f59e0b', icon: '🤖' },
  { id: 'foodwaste', name: '음식물처리기', defaultW: 450, color: '#22c55e', icon: '♻️' },
  { id: 'rice', name: '밥솥', defaultW: 450, color: '#ef4444', icon: '🍚' }
];

// ============================================================
// 서브스킬 1: 냉장고 모델 관리
// ============================================================
class FridgeModelManager {
  constructor(modelData = FRIDGE_MODEL_DATA) {
    this.modelData = modelData;
  }

  /**
   * 브랜드 목록 조회
   */
  getBrands() {
    return Object.keys(this.modelData);
  }

  /**
   * 브랜드별 카테고리 조회
   */
  getCategories(brand) {
    return this.modelData[brand]?.categories || {};
  }

  /**
   * 모델 ID로 모델 데이터 조회
   */
  getModelById(modelId) {
    for (const brand of Object.values(this.modelData)) {
      for (const models of Object.values(brand.categories)) {
        const model = models.find(m => m.id === modelId);
        if (model) return model;
      }
    }
    return null;
  }

  /**
   * 냉장고 모듈 생성
   */
  createFridgeModule(modelId) {
    const model = this.getModelById(modelId);
    if (!model) return null;

    return {
      id: Date.now() + Math.random(),
      type: 'fridge',
      modelId: model.id,
      name: model.name,
      w: model.w,
      h: model.h,
      d: model.d,
      sideGap: model.sideGap,
      betweenGap: model.betweenGap,
      units: model.units.map(u => ({ ...u })),
      order: 0
    };
  }

  /**
   * 총 너비 계산 (측면 간격 + 유닛 너비 + 사이 간격)
   */
  calculateTotalWidth(module) {
    if (module.type !== 'fridge') return module.w || 0;

    const sideGap = module.sideGap || 50;
    const betweenGap = module.betweenGap || 0;
    const units = module.units || [{ w: module.w }];

    let total = sideGap * 2;
    units.forEach((u, idx) => {
      total += u.w;
      if (idx < units.length - 1) total += betweenGap;
    });

    return total;
  }
}

// ============================================================
// 서브스킬 2: 사이드 모듈 (EL장/홈카페장) 관리
// ============================================================
class SideModuleManager {
  constructor(constants = FridgeDesignConstants) {
    this.constants = constants;
  }

  /**
   * 키큰장(EL장) 생성
   */
  createTallModule(options = {}) {
    return {
      id: Date.now() + Math.random(),
      type: 'tall',
      name: options.name || '키큰장',
      w: options.width || this.constants.EL_W,
      d: options.depth || this.constants.MODULE_D,
      isEL: options.isEL || false,
      doorType: options.doorType || 'swing',
      lowerType: options.lowerType || 'default',
      isFixed: options.isFixed || false,
      order: options.order || 0
    };
  }

  /**
   * 홈카페장 생성
   */
  createHomecafeModule(options = {}) {
    return {
      id: Date.now() + Math.random(),
      type: 'homecafe',
      name: options.name || '홈카페장',
      w: options.width || this.constants.HOMECAFE_W,
      d: options.depth || this.constants.MODULE_D,
      isEL: options.isEL || false,
      doorType: options.doorType || 'liftup',
      isFixed: options.isFixed || false,
      order: options.order || 0
    };
  }

  /**
   * 도어 타입 변경
   */
  setDoorType(module, doorType) {
    if (EL_DOOR_TYPES.find(t => t.id === doorType)) {
      module.doorType = doorType;
      return true;
    }
    return false;
  }

  /**
   * 하부장 타입 변경 (키큰장 전용)
   */
  setLowerType(module, lowerType) {
    if (module.type !== 'tall') return false;

    if (LOWER_MODULE_TYPES.find(t => t.id === lowerType)) {
      module.lowerType = lowerType;
      return true;
    }
    return false;
  }

  /**
   * EL장 토글
   */
  toggleEL(module) {
    module.isEL = !module.isEL;
    return module.isEL;
  }

  /**
   * 고정 토글
   */
  toggleFixed(module) {
    module.isFixed = !module.isFixed;
    return module.isFixed;
  }
}

// ============================================================
// 서브스킬 3: 높이 자동 계산
// ============================================================
class FridgeHeightCalculator {
  constructor(constants = FridgeDesignConstants) {
    this.constants = constants;
  }

  /**
   * 상부장 높이 자동 계산
   * 냉장고는 바닥에서 시작 (좌대 무관)
   */
  calculateUpperHeight(totalHeight, fridgeHeight, moldingH = null) {
    const { MAX_UPPER_H, TOP_GAP, MOLDING_H } = this.constants;
    const molding = moldingH !== null ? moldingH : MOLDING_H;

    const upperH = Math.max(0, Math.min(MAX_UPPER_H, totalHeight - fridgeHeight - TOP_GAP - molding));
    return upperH;
  }

  /**
   * 중간장/하부장 높이 계산
   */
  calculateBodyHeights(totalHeight, upperH, moldingH = null, pedestalH = null) {
    const { MOLDING_H, PEDESTAL_H } = this.constants;
    const molding = moldingH !== null ? moldingH : MOLDING_H;
    const pedestal = pedestalH !== null ? pedestalH : PEDESTAL_H;

    const moduleBodyH = totalHeight - molding - upperH - pedestal;
    const middleH = Math.round(moduleBodyH * 0.55);
    const lowerH = Math.round(moduleBodyH - middleH);

    return { middleH, lowerH, moduleBodyH };
  }

  /**
   * 전체 높이 재계산
   */
  recalculateHeights(item) {
    const H = parseFloat(item.h) || 0;
    const specs = item.specs || {};
    const modules = item.modules || [];

    const moldingH = parseFloat(specs.fridgeMoldingH) || this.constants.MOLDING_H;
    const pedestalH = parseFloat(specs.fridgePedestal) || this.constants.PEDESTAL_H;

    // 냉장고 모듈 찾기
    const fridgeMod = modules.find(m => m.type === 'fridge');
    const fridgeH = fridgeMod ? fridgeMod.h : 0;

    // 상부장 높이 계산
    const upperH = this.calculateUpperHeight(H, fridgeH, moldingH);

    // 중간장/하부장 높이 계산
    const { middleH, lowerH } = this.calculateBodyHeights(H, upperH, moldingH, pedestalH);

    return {
      upperH,
      middleH,
      lowerH,
      moldingH,
      pedestalH
    };
  }
}

// ============================================================
// 서브스킬 4: SVG 렌더링
// ============================================================
class FridgeSVGRenderer {
  constructor(constants = FridgeDesignConstants) {
    this.constants = constants;
    this.heightCalculator = new FridgeHeightCalculator(constants);
  }

  /**
   * Front View SVG 생성
   */
  render(item, options = {}) {
    const {
      svgWidth = 720,
      svgHeight = 560
    } = options;

    const W = parseFloat(item.w) || 0;
    const H = parseFloat(item.h) || 0;
    const specs = item.specs || {};
    const modules = (item.modules || []).sort((a, b) => (a.order || 0) - (b.order || 0));

    // 높이 계산
    const heights = this.heightCalculator.recalculateHeights(item);
    const { moldingH, upperH, middleH, lowerH, pedestalH } = {
      moldingH: parseFloat(specs.fridgeMoldingH) || this.constants.MOLDING_H,
      upperH: specs.fridgeUpperH !== undefined ? parseFloat(specs.fridgeUpperH) : heights.upperH,
      middleH: specs.fridgeMiddleH !== undefined ? parseFloat(specs.fridgeMiddleH) : heights.middleH,
      lowerH: specs.fridgeLowerH !== undefined ? parseFloat(specs.fridgeLowerH) : heights.lowerH,
      pedestalH: parseFloat(specs.fridgePedestal) || this.constants.PEDESTAL_H
    };

    // 마감 계산
    const fL = specs.finishLeftType !== 'none' ? (specs.finishLeftType === 'ep' ? 20 : parseFloat(specs.finishLeftWidth) || 60) : 0;
    const fR = specs.finishRightType !== 'none' ? (specs.finishRightType === 'ep' ? 20 : parseFloat(specs.finishRightWidth) || 60) : 0;

    // 스케일 계산
    const scale = Math.min((svgWidth - 100) / W, (svgHeight - 160) / H);
    const drawW = W * scale;
    const drawH = H * scale;
    const offsetX = (svgWidth - drawW) / 2;
    const offsetY = 50;

    let svg = `<svg width="${svgWidth}" height="${svgHeight}" style="background:#fafafa;border:1px solid #e0e0e0;border-radius:8px;">`;

    // 화살표 마커 정의
    svg += `
      <defs>
        <marker id="arrowL" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto">
          <path d="M6,0 L6,6 L0,3 Z" fill="#333"/>
        </marker>
        <marker id="arrowR" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#333"/>
        </marker>
      </defs>
    `;

    // 상몰딩
    svg += `<rect x="${offsetX}" y="${offsetY}" width="${drawW}" height="${moldingH * scale}" fill="#d4a574" stroke="#a67c52" stroke-width="1"/>`;
    svg += `<text x="${offsetX + drawW / 2}" y="${offsetY + moldingH * scale / 2 + 4}" text-anchor="middle" font-size="9" fill="#fff">상몰딩 ${moldingH}</text>`;

    // 좌측 마감
    if (fL > 0) {
      svg += `<rect x="${offsetX}" y="${offsetY + moldingH * scale}" width="${fL * scale}" height="${drawH - moldingH * scale}" fill="#e0e0e0" stroke="#999" stroke-width="1"/>`;
      svg += `<text x="${offsetX + fL * scale / 2}" y="${offsetY + drawH + 15}" text-anchor="middle" font-size="9" fill="#666">${fL}</text>`;
    }

    // 우측 마감
    if (fR > 0) {
      svg += `<rect x="${offsetX + drawW - fR * scale}" y="${offsetY + moldingH * scale}" width="${fR * scale}" height="${drawH - moldingH * scale}" fill="#e0e0e0" stroke="#999" stroke-width="1"/>`;
      svg += `<text x="${offsetX + drawW - fR * scale / 2}" y="${offsetY + drawH + 15}" text-anchor="middle" font-size="9" fill="#666">${fR}</text>`;
    }

    // 상부장 영역
    const contentStartY = offsetY + moldingH * scale;
    const upperH_scaled = upperH * scale;
    let upperX = offsetX + fL * scale;

    // 상부장 렌더링
    modules.forEach(mod => {
      if (mod.type === 'fridge') {
        const units = mod.units || [{ name: mod.name, w: mod.w }];
        const sideGap = mod.sideGap || 50;
        const betweenGap = mod.betweenGap || 0;

        units.forEach((unit, idx) => {
          let upperW = unit.w;
          if (idx === 0) upperW += sideGap;
          if (idx < units.length - 1) upperW += betweenGap / 2;
          if (idx === units.length - 1) upperW += sideGap;
          if (idx > 0) upperW += betweenGap / 2;

          const cabW = upperW * scale;
          svg += `<rect x="${upperX}" y="${contentStartY}" width="${cabW}" height="${upperH_scaled}" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="2"/>`;
          svg += `<text x="${upperX + cabW / 2}" y="${contentStartY + upperH_scaled / 2 - 2}" text-anchor="middle" font-size="8" fill="#1d4ed8">상부장</text>`;
          svg += `<text x="${upperX + cabW / 2}" y="${contentStartY + upperH_scaled / 2 + 10}" text-anchor="middle" font-size="7" fill="#666">${Math.round(upperW)}mm</text>`;
          upperX += cabW;
        });
      } else {
        const cabW = mod.w * scale;
        svg += `<rect x="${upperX}" y="${contentStartY}" width="${cabW}" height="${upperH_scaled}" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="2"/>`;
        svg += `<text x="${upperX + cabW / 2}" y="${contentStartY + upperH_scaled / 2 - 2}" text-anchor="middle" font-size="8" fill="#1d4ed8">상부장</text>`;
        svg += `<text x="${upperX + cabW / 2}" y="${contentStartY + upperH_scaled / 2 + 10}" text-anchor="middle" font-size="7" fill="#666">${Math.round(mod.w)}mm</text>`;
        upperX += cabW;
      }
    });

    // 본체 영역 렌더링
    let currentX = offsetX + fL * scale;
    const bodyStartY = contentStartY + upperH_scaled;
    const middleH_scaled = middleH * scale;
    const lowerH_scaled = lowerH * scale;
    const pedestalH_scaled = pedestalH * scale;

    modules.forEach(mod => {
      if (mod.type === 'fridge') {
        svg += this._renderFridgeBody(mod, currentX, bodyStartY, drawH - moldingH * scale - upperH_scaled, scale);
        currentX += this._calculateFridgeWidth(mod) * scale;
      } else if (mod.type === 'tall') {
        svg += this._renderTallModule(mod, currentX, bodyStartY, middleH_scaled, lowerH_scaled, pedestalH_scaled, scale);
        currentX += mod.w * scale;
      } else if (mod.type === 'homecafe') {
        svg += this._renderHomecafeModule(mod, currentX, bodyStartY, middleH_scaled + lowerH_scaled, pedestalH_scaled, scale);
        currentX += mod.w * scale;
      }
    });

    // 총 너비 치수선
    svg += `<line x1="${offsetX}" y1="${offsetY + drawH + 35}" x2="${offsetX + drawW}" y2="${offsetY + drawH + 35}" stroke="#333" stroke-width="1" marker-start="url(#arrowL)" marker-end="url(#arrowR)"/>`;
    svg += `<text x="${offsetX + drawW / 2}" y="${offsetY + drawH + 50}" text-anchor="middle" font-size="12" fill="#333" font-weight="bold">${W}mm</text>`;

    svg += '</svg>';
    return svg;
  }

  _calculateFridgeWidth(mod) {
    const sideGap = mod.sideGap || 50;
    const betweenGap = mod.betweenGap || 0;
    const units = mod.units || [{ w: mod.w }];

    let total = sideGap * 2;
    units.forEach((u, idx) => {
      total += u.w;
      if (idx < units.length - 1) total += betweenGap;
    });

    return total;
  }

  _renderFridgeBody(mod, currentX, bodyStartY, fridgeContentH, scale) {
    let svg = '';
    const sideGap = mod.sideGap || 50;
    const betweenGap = mod.betweenGap || 0;
    const units = mod.units || [{ name: mod.name, w: mod.w }];
    const fridgeDrawH = mod.h * scale;
    const gapW = sideGap * scale;

    // 좌측 측면공간
    svg += `<rect x="${currentX}" y="${bodyStartY}" width="${gapW}" height="${fridgeContentH}" fill="#fef3c7" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3"/>`;
    svg += `<text x="${currentX + gapW / 2}" y="${bodyStartY + 12}" text-anchor="middle" font-size="7" fill="#b45309">${sideGap}</text>`;
    currentX += gapW;

    // 냉장고 유닛들
    units.forEach((unit, unitIdx) => {
      const unitW = unit.w * scale;
      svg += `<rect x="${currentX}" y="${bodyStartY}" width="${unitW}" height="${fridgeDrawH}" fill="#e0f2fe" stroke="#0ea5e9" stroke-width="2" rx="3"/>`;
      svg += `<text x="${currentX + unitW / 2}" y="${bodyStartY + fridgeDrawH / 2 - 6}" text-anchor="middle" font-size="10" fill="#0369a1" font-weight="bold">🧊 ${unit.name}</text>`;
      svg += `<text x="${currentX + unitW / 2}" y="${bodyStartY + fridgeDrawH / 2 + 10}" text-anchor="middle" font-size="8" fill="#666">${unit.w}×${mod.h}</text>`;
      currentX += unitW;

      if (unitIdx < units.length - 1 && betweenGap > 0) {
        const bGapW = betweenGap * scale;
        svg += `<rect x="${currentX}" y="${bodyStartY}" width="${bGapW}" height="${fridgeContentH}" fill="#fed7aa" stroke="#ea580c" stroke-width="1" stroke-dasharray="2"/>`;
        currentX += bGapW;
      }
    });

    // 우측 측면공간
    svg += `<rect x="${currentX}" y="${bodyStartY}" width="${gapW}" height="${fridgeContentH}" fill="#fef3c7" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3"/>`;
    svg += `<text x="${currentX + gapW / 2}" y="${bodyStartY + 12}" text-anchor="middle" font-size="7" fill="#b45309">${sideGap}</text>`;

    return svg;
  }

  _renderTallModule(mod, x, bodyStartY, middleH_scaled, lowerH_scaled, pedestalH_scaled, scale) {
    let svg = '';
    const modW = mod.w * scale;
    const isEL = mod.isEL;

    // 중간장
    const midColor = isEL ? '#dcfce7' : '#dcfce7';
    const midLabel = isEL ? '⚡ EL장' : '🗄️ 중간장';
    svg += `<rect x="${x}" y="${bodyStartY}" width="${modW}" height="${middleH_scaled}" fill="${midColor}" stroke="#10b981" stroke-width="2" rx="2"/>`;
    svg += `<text x="${x + modW / 2}" y="${bodyStartY + middleH_scaled / 2 - 4}" text-anchor="middle" font-size="10" fill="#065f46" font-weight="bold">${midLabel}</text>`;

    // 하부장
    const lowerType = LOWER_MODULE_TYPES.find(t => t.id === mod.lowerType) || LOWER_MODULE_TYPES[0];
    svg += `<rect x="${x}" y="${bodyStartY + middleH_scaled}" width="${modW}" height="${lowerH_scaled}" fill="#f3f4f6" stroke="#6b7280" stroke-width="2" rx="2"/>`;
    svg += `<text x="${x + modW / 2}" y="${bodyStartY + middleH_scaled + lowerH_scaled / 2}" text-anchor="middle" font-size="9" fill="#6b7280">${lowerType.icon} 하부장</text>`;

    // 좌대
    svg += `<rect x="${x}" y="${bodyStartY + middleH_scaled + lowerH_scaled}" width="${modW}" height="${pedestalH_scaled}" fill="#d1d5db" stroke="#9ca3af" stroke-width="1"/>`;

    return svg;
  }

  _renderHomecafeModule(mod, x, bodyStartY, bodyH_scaled, pedestalH_scaled, scale) {
    let svg = '';
    const modW = mod.w * scale;
    const isEL = mod.isEL;

    const midColor = isEL ? '#dcfce7' : '#f3e8ff';
    const midStroke = isEL ? '#10b981' : '#8b5cf6';
    const midLabel = isEL ? '⚡ EL장' : '☕ 홈카페';

    svg += `<rect x="${x}" y="${bodyStartY}" width="${modW}" height="${bodyH_scaled}" fill="${midColor}" stroke="${midStroke}" stroke-width="2" rx="2"/>`;
    svg += `<text x="${x + modW / 2}" y="${bodyStartY + bodyH_scaled / 2}" text-anchor="middle" font-size="10" fill="${isEL ? '#065f46' : '#6b21a8'}" font-weight="bold">${midLabel}</text>`;

    // 좌대
    svg += `<rect x="${x}" y="${bodyStartY + bodyH_scaled}" width="${modW}" height="${pedestalH_scaled}" fill="#d1d5db" stroke="#9ca3af" stroke-width="1"/>`;

    return svg;
  }
}

// ============================================================
// 메인 클래스: 냉장고장 설계 스킬
// ============================================================
class FridgeDesignSkill {
  constructor() {
    this.constants = FridgeDesignConstants;
    this.modelManager = new FridgeModelManager();
    this.sideModuleManager = new SideModuleManager();
    this.heightCalculator = new FridgeHeightCalculator();
    this.svgRenderer = new FridgeSVGRenderer();
  }

  /**
   * 냉장고 모델 선택
   */
  selectFridgeModel(item, modelId) {
    const fridgeModule = this.modelManager.createFridgeModule(modelId);
    if (!fridgeModule) return null;

    // 기존 냉장고 모듈 제거
    if (!item.modules) item.modules = [];
    item.modules = item.modules.filter(m => m.type !== 'fridge');

    // 새 냉장고 모듈 추가
    item.modules.push(fridgeModule);

    // 높이 재계산
    this.recalculateHeights(item);

    return fridgeModule;
  }

  /**
   * 키큰장 추가
   */
  addTallModule(item, options = {}) {
    const module = this.sideModuleManager.createTallModule({
      ...options,
      order: (item.modules?.length || 0)
    });

    if (!item.modules) item.modules = [];
    item.modules.push(module);

    return module;
  }

  /**
   * 홈카페장 추가
   */
  addHomecafeModule(item, options = {}) {
    const module = this.sideModuleManager.createHomecafeModule({
      ...options,
      order: (item.modules?.length || 0)
    });

    if (!item.modules) item.modules = [];
    item.modules.push(module);

    return module;
  }

  /**
   * 모듈 삭제
   */
  removeModule(item, moduleId) {
    if (!item.modules) return false;

    const index = item.modules.findIndex(m => m.id === moduleId);
    if (index !== -1) {
      item.modules.splice(index, 1);
      this._reorderModules(item);
      return true;
    }
    return false;
  }

  /**
   * 모듈 순서 변경
   */
  moveModule(item, moduleId, direction) {
    if (!item.modules) return false;

    const sortedModules = [...item.modules].sort((a, b) => (a.order || 0) - (b.order || 0));
    const currentIndex = sortedModules.findIndex(m => m.id === moduleId);

    if (currentIndex === -1) return false;

    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= sortedModules.length) return false;

    // order 스왑
    const currentOrder = sortedModules[currentIndex].order;
    sortedModules[currentIndex].order = sortedModules[targetIndex].order;
    sortedModules[targetIndex].order = currentOrder;

    return true;
  }

  /**
   * 높이 재계산
   */
  recalculateHeights(item) {
    const heights = this.heightCalculator.recalculateHeights(item);

    if (!item.specs) item.specs = {};
    item.specs.fridgeUpperH = heights.upperH;
    item.specs.fridgeMiddleH = heights.middleH;
    item.specs.fridgeLowerH = heights.lowerH;

    return heights;
  }

  /**
   * 유효 공간 계산
   */
  calculateEffectiveSpace(item) {
    const W = parseFloat(item.w) || 0;
    const specs = item.specs || {};

    const fL = specs.finishLeftType !== 'none' ? (specs.finishLeftType === 'ep' ? 20 : parseFloat(specs.finishLeftWidth) || 60) : 0;
    const fR = specs.finishRightType !== 'none' ? (specs.finishRightType === 'ep' ? 20 : parseFloat(specs.finishRightWidth) || 60) : 0;

    return W - fL - fR;
  }

  /**
   * 사용된 너비 계산
   */
  calculateUsedWidth(item) {
    const modules = item.modules || [];
    let total = 0;

    modules.forEach(mod => {
      if (mod.type === 'fridge') {
        total += this.modelManager.calculateTotalWidth(mod);
      } else {
        total += parseFloat(mod.w) || 0;
      }
    });

    return total;
  }

  /**
   * 남은 공간 계산
   */
  calculateRemainingSpace(item) {
    return this.calculateEffectiveSpace(item) - this.calculateUsedWidth(item);
  }

  /**
   * 자동 계산 (균등 분배)
   */
  autoCalculate(item) {
    const modules = item.modules || [];
    const fridgeMod = modules.find(m => m.type === 'fridge');

    if (!fridgeMod) {
      return { success: false, error: 'No fridge module found' };
    }

    const effectiveW = this.calculateEffectiveSpace(item);
    const fridgeTotalW = this.modelManager.calculateTotalWidth(fridgeMod);
    const remainingForSides = effectiveW - fridgeTotalW;

    // 사이드 모듈들의 너비 균등 조정
    const sideModules = modules.filter(m => m.type !== 'fridge');
    if (sideModules.length > 0) {
      const widthPerModule = Math.floor(remainingForSides / sideModules.length);

      sideModules.forEach(mod => {
        mod.w = Math.max(450, Math.min(800, widthPerModule));
      });
    }

    // 높이 재계산
    this.recalculateHeights(item);

    return {
      success: true,
      effectiveWidth: effectiveW,
      fridgeWidth: fridgeTotalW,
      remainingWidth: this.calculateRemainingSpace(item)
    };
  }

  /**
   * Front View SVG 렌더링
   */
  renderFrontView(item, options = {}) {
    return this.svgRenderer.render(item, options);
  }

  /**
   * 설계 요약 생성
   */
  getSummary(item) {
    const modules = item.modules || [];
    const fridgeMod = modules.find(m => m.type === 'fridge');

    return {
      hasFridge: !!fridgeMod,
      fridgeModel: fridgeMod?.name || null,
      fridgeWidth: fridgeMod ? this.modelManager.calculateTotalWidth(fridgeMod) : 0,
      moduleCount: modules.length,
      tallCount: modules.filter(m => m.type === 'tall').length,
      homecafeCount: modules.filter(m => m.type === 'homecafe').length,
      effectiveSpace: this.calculateEffectiveSpace(item),
      usedSpace: this.calculateUsedWidth(item),
      remainingSpace: this.calculateRemainingSpace(item),
      heights: this.heightCalculator.recalculateHeights(item)
    };
  }

  _reorderModules(item) {
    const modules = item.modules || [];
    modules.sort((a, b) => (a.order || 0) - (b.order || 0));
    modules.forEach((m, idx) => { m.order = idx; });
  }
}

// ============================================================
// Export
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FridgeDesignSkill,
    FridgeDesignConstants,
    FridgeModelManager,
    SideModuleManager,
    FridgeHeightCalculator,
    FridgeSVGRenderer,
    FRIDGE_MODEL_DATA,
    EL_DOOR_TYPES,
    LOWER_MODULE_TYPES
  };
}

// 전역 노출 (브라우저 환경)
if (typeof window !== 'undefined') {
  window.FridgeDesignSkill = FridgeDesignSkill;
  window.FridgeDesignConstants = FridgeDesignConstants;
  window.FRIDGE_MODEL_DATA = FRIDGE_MODEL_DATA;
}
