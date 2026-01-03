/**
 * 붙박이장 설계 스킬 모듈
 * 다담 캐비넷 에이전트 v32.1
 *
 * 주요 기능:
 * - 모듈 관리 (추가/삭제/이동)
 * - 옷봉/선반 계산
 * - 서랍 배치
 * - Front View SVG 렌더링
 *
 * 서브 스킬:
 * 1. 모듈 관리 - 짧은옷/긴옷/선반형 모듈 관리
 * 2. 옷봉/선반 - 위치 계산 및 배치
 * 3. 서랍 관리 - 내부형/외부형 서랍 배치
 * 4. 도면 렌더링 - Front View SVG 생성
 */

// ============================================================
// 상수 정의
// ============================================================
const WardrobeDesignConstants = {
  // 패널 두께
  PANEL_THICKNESS: 15,        // 천판/지판/선반 두께

  // 옷봉 위치
  ROD_OFFSET: 75,             // 상단에서 -75mm

  // 선반 위치
  LONG_FIRST_SHELF: 315,      // 긴옷 첫 선반: 상단에서 -315mm

  // 서랍 높이
  DRAWER_HEIGHT: 180,         // 서랍 기본 높이

  // 스마트바
  SMARTBAR_WIDTH: 30,         // 스마트바 너비

  // 기본값
  DEFAULT_PEDESTAL_H: 60,     // 좌대 높이
  DEFAULT_MOLDING_H: 15,      // 상몰딩 높이
  DEFAULT_MODULE_WIDTH: 600,  // 기본 모듈 너비
  DEFAULT_DEPTH: 550,         // 기본 깊이

  // 모듈 타입
  MODULE_TYPES: {
    short: { name: '짧은옷', color: '#10b981', bgColor: '#ecfdf5' },
    long: { name: '긴옷', color: '#3b82f6', bgColor: '#eff6ff' },
    shelf: { name: '선반', color: '#f59e0b', bgColor: '#fffbeb' }
  }
};

// ============================================================
// 서브스킬 1: 모듈 관리
// ============================================================
class WardrobeModuleManager {
  constructor(constants = WardrobeDesignConstants) {
    this.constants = constants;
  }

  /**
   * 새 모듈 생성
   */
  createModule(options = {}) {
    const { DEFAULT_MODULE_WIDTH, DEFAULT_DEPTH } = this.constants;

    return {
      id: Date.now() + Math.random(),
      pos: 'wardrobe',
      name: options.name || '모듈',
      w: options.width || DEFAULT_MODULE_WIDTH,
      d: options.depth || DEFAULT_DEPTH,
      h: options.height || null,
      upperH: options.upperH || null,
      lowerH: options.lowerH || null,
      moduleType: options.type || 'short',
      shelfCount: 0,
      shelfCountUpper: 0,
      shelfCountLower: 0,
      drawerCount: 0,
      isExternalDrawer: false,
      hasMirror: false,
      hasSmartbar: false
    };
  }

  /**
   * 모듈 추가
   */
  addModule(item, moduleOptions = {}) {
    if (!item.modules) item.modules = [];

    const newModule = this.createModule(moduleOptions);
    item.modules.push(newModule);

    return newModule;
  }

  /**
   * 모듈 삭제
   */
  removeModule(item, moduleId) {
    if (!item.modules) return false;

    const index = item.modules.findIndex(m => m.id === moduleId);
    if (index !== -1) {
      item.modules.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * 모듈 이동
   */
  moveModule(item, moduleId, direction) {
    if (!item.modules) return false;

    const wardrobeModules = item.modules.filter(m => m.pos === 'wardrobe');
    const currentIndex = wardrobeModules.findIndex(m => m.id === moduleId);

    if (currentIndex === -1) return false;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= wardrobeModules.length) return false;

    // 실제 배열에서의 인덱스 찾기
    const allModulesIndex1 = item.modules.findIndex(m => m.id === wardrobeModules[currentIndex].id);
    const allModulesIndex2 = item.modules.findIndex(m => m.id === wardrobeModules[targetIndex].id);

    // 스왑
    [item.modules[allModulesIndex1], item.modules[allModulesIndex2]] =
      [item.modules[allModulesIndex2], item.modules[allModulesIndex1]];

    return true;
  }

  /**
   * 모듈 타입 변경
   */
  setModuleType(item, moduleId, newType) {
    const mod = item.modules?.find(m => m.id === moduleId);
    if (!mod) return false;

    mod.moduleType = newType;

    // 타입에 따른 초기화
    if (newType === 'long') {
      // 긴옷은 상/하부 구분 없음
      mod.shelfCountUpper = 0;
      mod.shelfCountLower = 0;
    } else {
      // 짧은옷/선반형은 통합 선반 초기화
      mod.shelfCount = 0;
    }

    return true;
  }

  /**
   * 유효 공간 계산
   */
  calculateEffectiveSpace(item) {
    const W = parseFloat(item.w) || 0;
    const specs = item.specs || {};

    const fL = specs.finishLeftType !== 'None' ? (parseFloat(specs.finishLeftWidth) || 0) : 0;
    const fR = specs.finishRightType !== 'None' ? (parseFloat(specs.finishRightWidth) || 0) : 0;

    const autoEffectiveW = W - fL - fR;
    return specs.wardrobeEffectiveW || autoEffectiveW;
  }

  /**
   * 남은 공간 계산
   */
  calculateRemainingSpace(item) {
    const effectiveW = this.calculateEffectiveSpace(item);
    const usedW = (item.modules || [])
      .filter(m => m.pos === 'wardrobe')
      .reduce((sum, m) => sum + (parseFloat(m.w) || 0), 0);

    return effectiveW - usedW;
  }
}

// ============================================================
// 서브스킬 2: 선반/옷봉 계산
// ============================================================
class ShelfCalculator {
  constructor(constants = WardrobeDesignConstants) {
    this.constants = constants;
  }

  /**
   * 일반 선반 위치 계산
   * (모듈높이 - 천판(15) - 지판(15) - 선반갯수*15) / (선반갯수+1)
   */
  calculateShelfPositions(moduleHeight, shelfCount, startY = 0, scale = 1) {
    if (shelfCount <= 0) return [];

    const { PANEL_THICKNESS } = this.constants;
    const usableH = moduleHeight - PANEL_THICKNESS * 2 - shelfCount * PANEL_THICKNESS;
    const spacing = usableH / (shelfCount + 1);
    const positions = [];

    for (let i = 1; i <= shelfCount; i++) {
      const shelfY = startY + PANEL_THICKNESS * scale + (i * spacing + (i - 1) * PANEL_THICKNESS) * scale;
      positions.push(shelfY);
    }

    return positions;
  }

  /**
   * 긴옷용 선반 위치 계산 (첫 선반은 상단에서 -315mm)
   */
  calculateLongShelfPositions(moduleHeight, shelfCount, startY = 0, scale = 1) {
    if (shelfCount <= 0) return [];

    const { LONG_FIRST_SHELF, PANEL_THICKNESS } = this.constants;
    const positions = [];

    // 첫 선반: 상단에서 -315mm
    const firstShelfY = startY + LONG_FIRST_SHELF * scale;
    positions.push(firstShelfY);

    if (shelfCount > 1) {
      // 나머지 선반: 첫 선반 아래 균등 분배
      const remainingH = moduleHeight - LONG_FIRST_SHELF - PANEL_THICKNESS;
      const spacing = remainingH / shelfCount;

      for (let i = 2; i <= shelfCount; i++) {
        const shelfY = firstShelfY + (i - 1) * spacing * scale;
        positions.push(shelfY);
      }
    }

    return positions;
  }

  /**
   * 옷봉 위치 계산
   */
  calculateRodPosition(startY, scale = 1) {
    const { ROD_OFFSET } = this.constants;
    return startY + ROD_OFFSET * scale;
  }
}

// ============================================================
// 서브스킬 3: 서랍 관리
// ============================================================
class DrawerManager {
  constructor(constants = WardrobeDesignConstants) {
    this.constants = constants;
  }

  /**
   * 서랍 추가
   */
  addDrawer(module) {
    module.drawerCount = (module.drawerCount || 0) + 1;
    return module.drawerCount;
  }

  /**
   * 서랍 제거
   */
  removeDrawer(module) {
    if (module.drawerCount > 0) {
      module.drawerCount--;
    }
    return module.drawerCount;
  }

  /**
   * 서랍 타입 토글 (내부형/외부형)
   */
  toggleDrawerType(module, isExternal) {
    module.isExternalDrawer = isExternal;
    return module.isExternalDrawer;
  }

  /**
   * 서랍 위치 계산 (하단에서 위로 스택)
   */
  calculateDrawerPositions(bottomY, drawerCount, scale = 1) {
    const { DRAWER_HEIGHT } = this.constants;
    const positions = [];

    for (let i = 0; i < drawerCount; i++) {
      positions.push({
        y: bottomY - (i + 1) * DRAWER_HEIGHT * scale,
        height: DRAWER_HEIGHT * scale
      });
    }

    return positions;
  }
}

// ============================================================
// 서브스킬 4: SVG 렌더링
// ============================================================
class WardrobeSVGRenderer {
  constructor(constants = WardrobeDesignConstants) {
    this.constants = constants;
    this.shelfCalculator = new ShelfCalculator(constants);
    this.drawerManager = new DrawerManager(constants);
  }

  /**
   * Front View SVG 생성
   */
  render(item, options = {}) {
    const {
      svgWidth = 650,
      svgHeight = 450
    } = options;

    const W = parseFloat(item.w) || 0;
    const H = parseFloat(item.h) || 0;
    const specs = item.specs || {};

    // 스케일 계산
    const scale = Math.min((svgWidth - 100) / W, (svgHeight - 100) / H);
    const drawW = W * scale;
    const drawH = H * scale;
    const offsetX = (svgWidth - drawW) / 2;
    const offsetY = 40;

    // 마감 치수
    const fL = specs.finishLeftType !== 'None' ? (parseFloat(specs.finishLeftWidth) || 0) : 0;
    const fR = specs.finishRightType !== 'None' ? (parseFloat(specs.finishRightWidth) || 0) : 0;

    // 높이 계산
    const pedestalH = parseFloat(specs.wardrobePedestal) || this.constants.DEFAULT_PEDESTAL_H;
    const moldingH = parseFloat(specs.wardrobeMoldingH) || this.constants.DEFAULT_MOLDING_H;
    const totalModuleH = H - pedestalH - moldingH;

    const isRefLeft = specs.measurementBase === 'Left';
    const wardrobeModules = (item.modules || []).filter(m => m.pos === 'wardrobe');

    // SVG 생성
    let svg = `<svg width="${svgWidth}" height="${svgHeight}" style="background:#fafafa;border:1px solid #e0e0e0;border-radius:8px;">`;

    // 외곽선
    svg += `<rect x="${offsetX}" y="${offsetY}" width="${drawW}" height="${drawH}" fill="none" stroke="#333" stroke-width="2"/>`;

    // 치수선
    svg += this._renderDimensionLines(offsetX, offsetY, drawW, drawH, W, H);

    // 좌측 마감
    if (fL > 0) {
      svg += `<rect x="${offsetX}" y="${offsetY}" width="${fL * scale}" height="${drawH}" fill="#e0e0e0" stroke="#999" stroke-width="1"/>`;
      svg += `<text x="${offsetX + fL * scale / 2}" y="${offsetY + drawH + 15}" text-anchor="middle" font-size="10" fill="#666">${fL}</text>`;
    }

    // 커튼박스
    const curtainW = parseFloat(specs.curtainBoxW) || 0;
    const curtainH = parseFloat(specs.curtainBoxH) || 0;
    if (curtainW > 0 && curtainH > 0) {
      svg += this._renderCurtainBox(offsetX, offsetY, drawW, fL, fR, curtainW, curtainH, scale, isRefLeft);
    }

    // 모듈 렌더링
    let moduleStartX = offsetX + fL * scale;
    wardrobeModules.forEach(mod => {
      const modSvg = this._renderModule(mod, moduleStartX, offsetY, drawH, totalModuleH, scale);
      svg += modSvg;
      moduleStartX += parseFloat(mod.w) * scale;
    });

    // 우측 마감
    if (fR > 0) {
      svg += `<rect x="${offsetX + drawW - fR * scale}" y="${offsetY}" width="${fR * scale}" height="${drawH}" fill="#e0e0e0" stroke="#999" stroke-width="1"/>`;
      svg += `<text x="${offsetX + drawW - fR * scale / 2}" y="${offsetY + drawH + 15}" text-anchor="middle" font-size="10" fill="#666">${fR}</text>`;
    }

    // 실측 기준 표시
    const refX = isRefLeft ? offsetX + 10 : offsetX + drawW - 10;
    const anchor = isRefLeft ? 'start' : 'end';
    svg += `<text x="${refX}" y="${offsetY + drawH - 10}" text-anchor="${anchor}" font-size="10" fill="#4a7dff" font-weight="bold">▼ 실측기준</text>`;

    svg += '</svg>';
    return svg;
  }

  _renderDimensionLines(offsetX, offsetY, drawW, drawH, W, H) {
    let svg = '';

    // 상단 치수선
    svg += `<line x1="${offsetX}" y1="${offsetY - 15}" x2="${offsetX + drawW}" y2="${offsetY - 15}" stroke="#666" stroke-width="1"/>`;
    svg += `<line x1="${offsetX}" y1="${offsetY - 20}" x2="${offsetX}" y2="${offsetY - 10}" stroke="#666" stroke-width="1"/>`;
    svg += `<line x1="${offsetX + drawW}" y1="${offsetY - 20}" x2="${offsetX + drawW}" y2="${offsetY - 10}" stroke="#666" stroke-width="1"/>`;
    svg += `<text x="${offsetX + drawW / 2}" y="${offsetY - 22}" text-anchor="middle" font-size="12" fill="#333" font-weight="bold">${W}mm</text>`;

    // 좌측 치수선
    svg += `<line x1="${offsetX - 15}" y1="${offsetY}" x2="${offsetX - 15}" y2="${offsetY + drawH}" stroke="#666" stroke-width="1"/>`;
    svg += `<line x1="${offsetX - 20}" y1="${offsetY}" x2="${offsetX - 10}" y2="${offsetY}" stroke="#666" stroke-width="1"/>`;
    svg += `<line x1="${offsetX - 20}" y1="${offsetY + drawH}" x2="${offsetX - 10}" y2="${offsetY + drawH}" stroke="#666" stroke-width="1"/>`;
    svg += `<text x="${offsetX - 25}" y="${offsetY + drawH / 2}" text-anchor="middle" font-size="12" fill="#333" font-weight="bold" transform="rotate(-90 ${offsetX - 25} ${offsetY + drawH / 2})">${H}mm</text>`;

    return svg;
  }

  _renderCurtainBox(offsetX, offsetY, drawW, fL, fR, curtainW, curtainH, scale, isRefLeft) {
    const cbX = isRefLeft ? offsetX + fL * scale : offsetX + drawW - fR * scale - curtainW * scale;
    return `
      <rect x="${cbX}" y="${offsetY}" width="${curtainW * scale}" height="${curtainH * scale}"
        fill="#ffe4b5" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4"/>
      <text x="${cbX + curtainW * scale / 2}" y="${offsetY + curtainH * scale / 2 + 4}"
        text-anchor="middle" font-size="10" fill="#b45309">커튼박스</text>
    `;
  }

  _renderModule(mod, startX, offsetY, drawH, totalModuleH, scale) {
    const { MODULE_TYPES, ROD_OFFSET } = this.constants;
    const mW = parseFloat(mod.w) * scale;
    const moduleType = mod.moduleType || 'short';
    const typeInfo = MODULE_TYPES[moduleType] || MODULE_TYPES.short;
    const isDivided = moduleType === 'short' || moduleType === 'shelf';

    let svg = '';

    if (isDivided) {
      // 상부장/하부장 분리형
      const halfH = Math.round(totalModuleH / 2);
      const upperH = parseFloat(mod.upperH) || halfH;
      const lowerH = parseFloat(mod.lowerH) || halfH;
      const upperHScaled = upperH * scale;
      const lowerHScaled = lowerH * scale;

      // 하부장
      const lowerY = offsetY + drawH - lowerHScaled;
      svg += `<rect x="${startX}" y="${lowerY}" width="${mW}" height="${lowerHScaled}" fill="${typeInfo.bgColor}" stroke="${typeInfo.color}" stroke-width="2"/>`;

      // 하부장 옷봉 (선반형 제외)
      if (moduleType !== 'shelf') {
        svg += this._renderRod(startX, lowerY, mW, scale);
      }

      // 하부장 선반
      const lowerShelfPositions = this.shelfCalculator.calculateShelfPositions(lowerH, mod.shelfCountLower || 0, lowerY, scale);
      lowerShelfPositions.forEach(sy => {
        svg += `<line x1="${startX + 3}" y1="${sy}" x2="${startX + mW - 3}" y2="${sy}" stroke="#999" stroke-width="2"/>`;
      });

      // 하부장 서랍
      svg += this._renderDrawers(startX, lowerY + lowerHScaled, mW, mod.drawerCount || 0, mod.isExternalDrawer, scale);

      // 하부장 텍스트
      svg += `<text x="${startX + mW / 2}" y="${lowerY + lowerHScaled / 2 + 15}" text-anchor="middle" font-size="8" fill="#666">${mod.w}×${lowerH}</text>`;

      // 상부장
      const upperY = lowerY - upperHScaled;
      const upperBgColor = moduleType === 'shelf' ? '#fef3c7' : '#ecfdf5';
      const upperStroke = moduleType === 'shelf' ? '#f59e0b' : '#10b981';
      svg += `<rect x="${startX}" y="${upperY}" width="${mW}" height="${upperHScaled}" fill="${upperBgColor}" stroke="${upperStroke}" stroke-width="2"/>`;

      // 상부장 옷봉 (선반형 제외)
      if (moduleType !== 'shelf') {
        svg += this._renderRod(startX, upperY, mW, scale);
      }

      // 상부장 선반
      const upperShelfPositions = this.shelfCalculator.calculateShelfPositions(upperH, mod.shelfCountUpper || 0, upperY, scale);
      upperShelfPositions.forEach(sy => {
        svg += `<line x1="${startX + 3}" y1="${sy}" x2="${startX + mW - 3}" y2="${sy}" stroke="#999" stroke-width="2"/>`;
      });

      // 상부장 텍스트
      svg += `<text x="${startX + mW / 2}" y="${upperY + upperHScaled / 2 + 15}" text-anchor="middle" font-size="8" fill="#666">${mod.w}×${upperH}</text>`;
    } else {
      // 긴옷 단일형
      const mH = parseFloat(mod.h) || totalModuleH;
      const mHScaled = mH * scale;
      const mY = offsetY + drawH - mHScaled;

      svg += `<rect x="${startX}" y="${mY}" width="${mW}" height="${mHScaled}" fill="#f0f7ff" stroke="#4a7dff" stroke-width="2"/>`;

      // 옷봉
      svg += this._renderRod(startX, mY, mW, scale);

      // 선반
      const shelfPositions = this.shelfCalculator.calculateLongShelfPositions(mH, mod.shelfCount || 0, mY, scale);
      shelfPositions.forEach(sy => {
        svg += `<line x1="${startX + 3}" y1="${sy}" x2="${startX + mW - 3}" y2="${sy}" stroke="#999" stroke-width="2"/>`;
      });

      // 서랍
      svg += this._renderDrawers(startX, mY + mHScaled, mW, mod.drawerCount || 0, mod.isExternalDrawer, scale);

      // 텍스트
      svg += `<text x="${startX + mW / 2}" y="${mY + mHScaled / 2 + 5}" text-anchor="middle" font-size="9" fill="#666">${mod.w}×${mH}</text>`;
    }

    // 하단 너비 치수
    svg += `<text x="${startX + mW / 2}" y="${offsetY + drawH + 15}" text-anchor="middle" font-size="10" fill="#4a7dff">${mod.w}</text>`;

    return svg;
  }

  _renderRod(startX, startY, mW, scale) {
    const rodY = startY + this.constants.ROD_OFFSET * scale;
    return `
      <line x1="${startX + 10}" y1="${rodY}" x2="${startX + mW - 10}" y2="${rodY}" stroke="#666" stroke-width="3" stroke-linecap="round"/>
      <circle cx="${startX + 15}" cy="${rodY}" r="4" fill="#888"/>
      <circle cx="${startX + mW - 15}" cy="${rodY}" r="4" fill="#888"/>
    `;
  }

  _renderDrawers(x, bottomY, w, drawerCount, isExternal, scale) {
    if (drawerCount <= 0) return '';

    const { DRAWER_HEIGHT } = this.constants;
    let svg = '';
    const drawerH = DRAWER_HEIGHT * scale;
    const padding = isExternal ? 0 : 5;

    for (let i = 0; i < drawerCount; i++) {
      const drawerY = bottomY - (i + 1) * drawerH;
      const dx = x + padding;
      const dw = w - padding * 2;

      // 서랍 박스
      svg += `<rect x="${dx}" y="${drawerY}" width="${dw}" height="${drawerH - 2}" fill="#f5f5f5" stroke="#888" stroke-width="1.5"/>`;

      // 서랍 손잡이
      const handleY = drawerY + drawerH / 2 - 3;
      const handleW = 30;
      svg += `<rect x="${dx + dw / 2 - handleW / 2}" y="${handleY}" width="${handleW}" height="6" rx="2" fill="#666"/>`;
    }

    return svg;
  }
}

// ============================================================
// 메인 클래스: 붙박이장 설계 스킬
// ============================================================
class WardrobeDesignSkill {
  constructor() {
    this.constants = WardrobeDesignConstants;
    this.moduleManager = new WardrobeModuleManager();
    this.shelfCalculator = new ShelfCalculator();
    this.drawerManager = new DrawerManager();
    this.svgRenderer = new WardrobeSVGRenderer();
  }

  /**
   * 모듈 추가
   */
  addModule(item, options = {}) {
    return this.moduleManager.addModule(item, options);
  }

  /**
   * 모듈 삭제
   */
  removeModule(item, moduleId) {
    return this.moduleManager.removeModule(item, moduleId);
  }

  /**
   * 모듈 이동
   */
  moveModule(item, moduleId, direction) {
    return this.moduleManager.moveModule(item, moduleId, direction);
  }

  /**
   * 모듈 타입 변경
   */
  setModuleType(item, moduleId, type) {
    return this.moduleManager.setModuleType(item, moduleId, type);
  }

  /**
   * 선반 추가/제거
   */
  adjustShelf(module, section, delta) {
    if (section === 'upper') {
      module.shelfCountUpper = Math.max(0, (module.shelfCountUpper || 0) + delta);
      return module.shelfCountUpper;
    } else if (section === 'lower') {
      module.shelfCountLower = Math.max(0, (module.shelfCountLower || 0) + delta);
      return module.shelfCountLower;
    } else {
      module.shelfCount = Math.max(0, (module.shelfCount || 0) + delta);
      return module.shelfCount;
    }
  }

  /**
   * 서랍 추가/제거
   */
  adjustDrawer(module, delta) {
    module.drawerCount = Math.max(0, (module.drawerCount || 0) + delta);
    return module.drawerCount;
  }

  /**
   * 서랍 타입 토글
   */
  toggleDrawerType(module, isExternal) {
    return this.drawerManager.toggleDrawerType(module, isExternal);
  }

  /**
   * 유효 공간 계산
   */
  calculateEffectiveSpace(item) {
    return this.moduleManager.calculateEffectiveSpace(item);
  }

  /**
   * 남은 공간 계산
   */
  calculateRemainingSpace(item) {
    return this.moduleManager.calculateRemainingSpace(item);
  }

  /**
   * Front View SVG 렌더링
   */
  renderFrontView(item, options = {}) {
    return this.svgRenderer.render(item, options);
  }

  /**
   * 자동 모듈 배치 (남은 공간 균등 분배)
   */
  autoDistribute(item) {
    const effectiveW = this.calculateEffectiveSpace(item);
    const targetWidth = 600; // 기본 모듈 너비

    const moduleCount = Math.max(1, Math.round(effectiveW / targetWidth));
    const actualWidth = Math.floor(effectiveW / moduleCount);

    // 기존 모듈 초기화
    item.modules = item.modules?.filter(m => m.pos !== 'wardrobe') || [];

    // 새 모듈 추가
    for (let i = 0; i < moduleCount; i++) {
      this.addModule(item, {
        name: `모듈 ${i + 1}`,
        width: actualWidth,
        type: 'short'
      });
    }

    return {
      moduleCount,
      moduleWidth: actualWidth,
      remainder: effectiveW - (actualWidth * moduleCount)
    };
  }

  /**
   * 설계 요약 생성
   */
  getSummary(item) {
    const modules = (item.modules || []).filter(m => m.pos === 'wardrobe');
    const totalDrawers = modules.reduce((sum, m) => sum + (m.drawerCount || 0), 0);
    const totalShelves = modules.reduce((sum, m) => {
      return sum + (m.shelfCount || 0) + (m.shelfCountUpper || 0) + (m.shelfCountLower || 0);
    }, 0);

    return {
      moduleCount: modules.length,
      effectiveSpace: this.calculateEffectiveSpace(item),
      remainingSpace: this.calculateRemainingSpace(item),
      totalDrawers,
      totalShelves,
      moduleTypes: {
        short: modules.filter(m => m.moduleType === 'short').length,
        long: modules.filter(m => m.moduleType === 'long').length,
        shelf: modules.filter(m => m.moduleType === 'shelf').length
      }
    };
  }
}

// ============================================================
// Export
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WardrobeDesignSkill,
    WardrobeDesignConstants,
    WardrobeModuleManager,
    ShelfCalculator,
    DrawerManager,
    WardrobeSVGRenderer
  };
}

// 전역 노출 (브라우저 환경)
if (typeof window !== 'undefined') {
  window.WardrobeDesignSkill = WardrobeDesignSkill;
  window.WardrobeDesignConstants = WardrobeDesignConstants;
}
