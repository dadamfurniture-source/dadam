/**
 * 도면 시각화 스킬 모듈
 * 다담 캐비넷 에이전트 v32.1
 *
 * 주요 기능:
 * - 재단 도면: 1220 x 2440 판재에서 최적 재단 배치
 * - 제작 도면: 3D 조립 도면
 * - 설치 도면: 3D 설치 가이드
 * - A4 용지 크기 최적화
 * - 정확한 치수 표시
 *
 * 옵션:
 * - 재단 최소화 / 자재 최소화 선택
 * - 데이터베이스화 및 학습 피드백
 */

// ============================================================
// 상수 정의
// ============================================================
const DrawingConstants = {
  // 표준 판재 규격 (mm)
  STANDARD_BOARD: {
    WIDTH: 1220,
    HEIGHT: 2440
  },

  // A4 용지 규격 (mm, 가로 배치)
  A4_LANDSCAPE: {
    WIDTH: 297,
    HEIGHT: 210
  },

  // A4 용지 규격 (mm, 세로 배치)
  A4_PORTRAIT: {
    WIDTH: 210,
    HEIGHT: 297
  },

  // 도면 여백
  MARGIN: {
    TOP: 15,
    BOTTOM: 25,
    LEFT: 15,
    RIGHT: 15
  },

  // 재단 간격 (톱날 두께)
  CUTTING_GAP: 4,

  // 3D 시점 각도
  VIEW_ANGLES: {
    ISOMETRIC: { x: -30, y: 45, z: 0 },
    FRONT: { x: 0, y: 0, z: 0 },
    TOP: { x: -90, y: 0, z: 0 },
    SIDE: { x: 0, y: 90, z: 0 }
  },

  // 색상 팔레트
  COLORS: {
    PANEL: '#f5f5dc',
    DOOR: '#d4a574',
    DRAWER: '#c19a6b',
    BACK: '#e8e8e8',
    SHELF: '#deb887',
    DIMENSION: '#333333',
    CUT_LINE: '#ff0000',
    GRID: '#cccccc'
  }
};

// ============================================================
// 재단 최적화 클래스 (Bin Packing)
// ============================================================
class CuttingOptimizer {
  constructor(options = {}) {
    this.boardWidth = options.boardWidth || DrawingConstants.STANDARD_BOARD.WIDTH;
    this.boardHeight = options.boardHeight || DrawingConstants.STANDARD_BOARD.HEIGHT;
    this.cuttingGap = options.cuttingGap || DrawingConstants.CUTTING_GAP;
    this.optimizeMode = options.optimizeMode || 'material'; // 'material' or 'cutting'
  }

  /**
   * 재단 최적화 실행
   */
  optimize(parts) {
    // 부재 정렬 (큰 것부터)
    const sortedParts = [...parts].sort((a, b) => {
      const areaA = a.width * a.height * a.quantity;
      const areaB = b.width * b.height * b.quantity;
      return areaB - areaA;
    });

    // 부재 펼치기 (수량만큼)
    const expandedParts = [];
    sortedParts.forEach(part => {
      for (let i = 0; i < part.quantity; i++) {
        expandedParts.push({
          ...part,
          instanceId: `${part.id}_${i}`,
          placed: false,
          x: 0,
          y: 0,
          rotated: false
        });
      }
    });

    const boards = [];

    // First Fit Decreasing Height 알고리즘
    expandedParts.forEach(part => {
      let placed = false;

      // 기존 보드에 배치 시도
      for (let board of boards) {
        placed = this._tryPlaceOnBoard(board, part);
        if (placed) break;
      }

      // 새 보드 생성
      if (!placed) {
        const newBoard = this._createNewBoard(boards.length);
        this._tryPlaceOnBoard(newBoard, part);
        boards.push(newBoard);
      }
    });

    // 효율성 계산
    const stats = this._calculateStats(boards, expandedParts);

    return {
      boards,
      stats,
      parts: expandedParts
    };
  }

  /**
   * 새 보드 생성
   */
  _createNewBoard(index) {
    return {
      id: `BOARD_${index + 1}`,
      index: index,
      width: this.boardWidth,
      height: this.boardHeight,
      parts: [],
      shelves: [{ x: 0, y: 0, width: this.boardWidth, height: this.boardHeight }],
      usedArea: 0
    };
  }

  /**
   * 보드에 부재 배치 시도
   */
  _tryPlaceOnBoard(board, part) {
    const gap = this.cuttingGap;

    // 각 쉘프에 배치 시도
    for (let i = 0; i < board.shelves.length; i++) {
      const shelf = board.shelves[i];

      // 원래 방향으로 시도
      if (part.width + gap <= shelf.width && part.height + gap <= shelf.height) {
        this._placePart(board, part, shelf, i, false);
        return true;
      }

      // 회전해서 시도
      if (part.height + gap <= shelf.width && part.width + gap <= shelf.height) {
        this._placePart(board, part, shelf, i, true);
        return true;
      }
    }

    return false;
  }

  /**
   * 부재 배치
   */
  _placePart(board, part, shelf, shelfIndex, rotated) {
    const gap = this.cuttingGap;
    const w = rotated ? part.height : part.width;
    const h = rotated ? part.width : part.height;

    part.x = shelf.x;
    part.y = shelf.y;
    part.rotated = rotated;
    part.placed = true;
    part.boardId = board.id;

    board.parts.push({
      ...part,
      placedWidth: w,
      placedHeight: h
    });

    board.usedArea += w * h;

    // 쉘프 분할
    board.shelves.splice(shelfIndex, 1);

    // 오른쪽 남은 공간
    if (shelf.width - w - gap > 50) {
      board.shelves.push({
        x: shelf.x + w + gap,
        y: shelf.y,
        width: shelf.width - w - gap,
        height: h
      });
    }

    // 위쪽 남은 공간
    if (shelf.height - h - gap > 50) {
      board.shelves.push({
        x: shelf.x,
        y: shelf.y + h + gap,
        width: shelf.width,
        height: shelf.height - h - gap
      });
    }

    // 효율적인 순서로 정렬
    board.shelves.sort((a, b) => {
      if (this.optimizeMode === 'cutting') {
        return a.y - b.y || a.x - b.x;
      }
      return (b.width * b.height) - (a.width * a.height);
    });
  }

  /**
   * 통계 계산
   */
  _calculateStats(boards, parts) {
    const totalBoardArea = boards.length * this.boardWidth * this.boardHeight;
    const usedArea = boards.reduce((sum, b) => sum + b.usedArea, 0);
    const wasteArea = totalBoardArea - usedArea;

    return {
      boardCount: boards.length,
      totalBoardArea: totalBoardArea / 1000000, // m²
      usedArea: usedArea / 1000000,
      wasteArea: wasteArea / 1000000,
      efficiency: ((usedArea / totalBoardArea) * 100).toFixed(1) + '%',
      partCount: parts.length
    };
  }
}

// ============================================================
// 재단 도면 생성기
// ============================================================
class CuttingDrawingGenerator {
  constructor(constants = DrawingConstants) {
    this.constants = constants;
    this.optimizer = new CuttingOptimizer();
  }

  /**
   * 재단 도면 SVG 생성
   */
  generateSVG(optimizationResult, options = {}) {
    const { boards, stats } = optimizationResult;
    const { showDimensions = true, showLabels = true, a4Size = true } = options;

    const svgList = [];

    boards.forEach((board, idx) => {
      const svg = this._generateBoardSVG(board, {
        showDimensions,
        showLabels,
        a4Size,
        boardIndex: idx,
        totalBoards: boards.length
      });
      svgList.push(svg);
    });

    return {
      boards: svgList,
      stats,
      summary: this._generateSummary(stats)
    };
  }

  /**
   * 개별 보드 SVG 생성
   */
  _generateBoardSVG(board, options) {
    const { MARGIN, A4_LANDSCAPE, COLORS } = this.constants;
    const { showDimensions, showLabels, a4Size, boardIndex, totalBoards } = options;

    // A4 크기에 맞춤
    const pageWidth = a4Size ? A4_LANDSCAPE.WIDTH : 400;
    const pageHeight = a4Size ? A4_LANDSCAPE.HEIGHT : 300;

    const contentWidth = pageWidth - MARGIN.LEFT - MARGIN.RIGHT;
    const contentHeight = pageHeight - MARGIN.TOP - MARGIN.BOTTOM;

    // 스케일 계산
    const scale = Math.min(
      contentWidth / board.width,
      contentHeight / board.height
    );

    const drawW = board.width * scale;
    const drawH = board.height * scale;
    const offsetX = MARGIN.LEFT + (contentWidth - drawW) / 2;
    const offsetY = MARGIN.TOP;

    let svg = `<svg width="${pageWidth}mm" height="${pageHeight}mm" viewBox="0 0 ${pageWidth} ${pageHeight}" xmlns="http://www.w3.org/2000/svg">`;

    // 스타일 정의
    svg += `
      <style>
        .title { font: bold 4px sans-serif; }
        .label { font: 2.5px sans-serif; }
        .dim { font: 2px sans-serif; fill: #333; }
        .part-name { font: 1.8px sans-serif; fill: #333; }
      </style>
    `;

    // 제목
    svg += `<text x="${pageWidth / 2}" y="8" text-anchor="middle" class="title">재단 도면 - 판재 ${boardIndex + 1}/${totalBoards}</text>`;

    // 보드 외곽
    svg += `<rect x="${offsetX}" y="${offsetY}" width="${drawW}" height="${drawH}" fill="#f0f0f0" stroke="#333" stroke-width="0.3"/>`;

    // 그리드 (100mm 간격)
    svg += this._drawGrid(offsetX, offsetY, drawW, drawH, scale);

    // 부재 배치
    board.parts.forEach((part, idx) => {
      const x = offsetX + part.x * scale;
      const y = offsetY + part.y * scale;
      const w = part.placedWidth * scale;
      const h = part.placedHeight * scale;

      // 부재 사각형
      const color = this._getPartColor(part.category);
      svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" stroke="#333" stroke-width="0.2"/>`;

      // 부재명
      if (showLabels) {
        const labelY = y + h / 2;
        svg += `<text x="${x + w / 2}" y="${labelY - 1}" text-anchor="middle" class="part-name">${part.partName}</text>`;
        svg += `<text x="${x + w / 2}" y="${labelY + 2}" text-anchor="middle" class="dim">${part.placedWidth} x ${part.placedHeight}</text>`;
      }

      // 치수선
      if (showDimensions) {
        svg += this._drawDimensionLines(x, y, w, h, part.placedWidth, part.placedHeight, scale);
      }
    });

    // 보드 치수
    svg += this._drawBoardDimensions(offsetX, offsetY, drawW, drawH, board.width, board.height);

    // 정보 박스
    svg += this._drawInfoBox(pageWidth, pageHeight, board, boardIndex);

    svg += '</svg>';

    return {
      boardId: board.id,
      svg,
      partCount: board.parts.length,
      efficiency: ((board.usedArea / (board.width * board.height)) * 100).toFixed(1)
    };
  }

  /**
   * 그리드 그리기
   */
  _drawGrid(offsetX, offsetY, drawW, drawH, scale) {
    let svg = '';
    const gridSize = 100 * scale; // 100mm 간격

    // 세로선
    for (let x = gridSize; x < drawW; x += gridSize) {
      svg += `<line x1="${offsetX + x}" y1="${offsetY}" x2="${offsetX + x}" y2="${offsetY + drawH}" stroke="#ddd" stroke-width="0.1" stroke-dasharray="1,1"/>`;
    }

    // 가로선
    for (let y = gridSize; y < drawH; y += gridSize) {
      svg += `<line x1="${offsetX}" y1="${offsetY + y}" x2="${offsetX + drawW}" y2="${offsetY + y}" stroke="#ddd" stroke-width="0.1" stroke-dasharray="1,1"/>`;
    }

    return svg;
  }

  /**
   * 치수선 그리기
   */
  _drawDimensionLines(x, y, w, h, actualW, actualH, scale) {
    // 간소화된 치수 표시 (부재 내부)
    return '';
  }

  /**
   * 보드 치수 그리기
   */
  _drawBoardDimensions(offsetX, offsetY, drawW, drawH, actualW, actualH) {
    let svg = '';

    // 하단 너비 치수
    svg += `<line x1="${offsetX}" y1="${offsetY + drawH + 5}" x2="${offsetX + drawW}" y2="${offsetY + drawH + 5}" stroke="#333" stroke-width="0.2" marker-start="url(#arrow)" marker-end="url(#arrow)"/>`;
    svg += `<text x="${offsetX + drawW / 2}" y="${offsetY + drawH + 9}" text-anchor="middle" class="dim">${actualW}mm</text>`;

    // 우측 높이 치수
    svg += `<line x1="${offsetX + drawW + 5}" y1="${offsetY}" x2="${offsetX + drawW + 5}" y2="${offsetY + drawH}" stroke="#333" stroke-width="0.2"/>`;
    svg += `<text x="${offsetX + drawW + 8}" y="${offsetY + drawH / 2}" text-anchor="middle" transform="rotate(90 ${offsetX + drawW + 8} ${offsetY + drawH / 2})" class="dim">${actualH}mm</text>`;

    return svg;
  }

  /**
   * 정보 박스 그리기
   */
  _drawInfoBox(pageWidth, pageHeight, board, boardIndex) {
    const boxX = pageWidth - 50;
    const boxY = pageHeight - 25;
    const efficiency = ((board.usedArea / (board.width * board.height)) * 100).toFixed(1);

    let svg = `<rect x="${boxX}" y="${boxY}" width="45" height="20" fill="white" stroke="#333" stroke-width="0.2"/>`;
    svg += `<text x="${boxX + 22.5}" y="${boxY + 6}" text-anchor="middle" class="label">판재 ${boardIndex + 1}</text>`;
    svg += `<text x="${boxX + 22.5}" y="${boxY + 11}" text-anchor="middle" class="dim">부재: ${board.parts.length}개</text>`;
    svg += `<text x="${boxX + 22.5}" y="${boxY + 16}" text-anchor="middle" class="dim">효율: ${efficiency}%</text>`;

    return svg;
  }

  /**
   * 부재 색상 반환
   */
  _getPartColor(category) {
    const colors = {
      '측판': '#ffefd5',
      '가로판': '#ffe4c4',
      '선반': '#ffdab9',
      '뒷판': '#e8e8e8',
      '도어': '#deb887',
      '서랍': '#d2b48c'
    };
    return colors[category] || '#f5f5dc';
  }

  /**
   * 요약 생성
   */
  _generateSummary(stats) {
    return `총 ${stats.boardCount}장의 판재 사용, 효율 ${stats.efficiency}, 부재 ${stats.partCount}개`;
  }
}

// ============================================================
// 3D 도면 생성기 (제작/설치 도면)
// ============================================================
class Drawing3DGenerator {
  constructor(constants = DrawingConstants) {
    this.constants = constants;
  }

  /**
   * 제작 도면 생성 (3D 조립 뷰)
   */
  generateManufacturingDrawing(designData, options = {}) {
    const { modules, specs } = designData;
    const { viewAngle = 'ISOMETRIC', showDimensions = true, showPartLabels = true, a4Size = true } = options;

    const angle = this.constants.VIEW_ANGLES[viewAngle] || this.constants.VIEW_ANGLES.ISOMETRIC;

    const drawings = [];

    modules.forEach((module, idx) => {
      const svg = this._generate3DModuleSVG(module, {
        angle,
        showDimensions,
        showPartLabels,
        a4Size,
        moduleIndex: idx,
        drawingType: 'manufacturing'
      });
      drawings.push(svg);
    });

    return {
      drawings,
      viewAngle,
      type: 'manufacturing'
    };
  }

  /**
   * 설치 도면 생성 (3D 설치 가이드)
   */
  generateInstallationDrawing(designData, options = {}) {
    const { modules, specs } = designData;
    const { viewAngle = 'ISOMETRIC', showDimensions = true, showInstallGuides = true, a4Size = true } = options;

    const angle = this.constants.VIEW_ANGLES[viewAngle] || this.constants.VIEW_ANGLES.ISOMETRIC;

    // 전체 배치도 생성
    const overviewSVG = this._generateOverviewSVG(modules, specs, {
      angle,
      showDimensions,
      a4Size
    });

    // 개별 모듈 설치 가이드
    const moduleGuides = modules.map((module, idx) => {
      return this._generate3DModuleSVG(module, {
        angle,
        showDimensions,
        showInstallGuides,
        a4Size,
        moduleIndex: idx,
        drawingType: 'installation'
      });
    });

    return {
      overview: overviewSVG,
      moduleGuides,
      viewAngle,
      type: 'installation'
    };
  }

  /**
   * 3D 모듈 SVG 생성
   */
  _generate3DModuleSVG(module, options) {
    const { MARGIN, A4_PORTRAIT, COLORS } = this.constants;
    const { angle, showDimensions, showPartLabels, showInstallGuides, a4Size, moduleIndex, drawingType } = options;

    const pageWidth = a4Size ? A4_PORTRAIT.WIDTH : 297;
    const pageHeight = a4Size ? A4_PORTRAIT.HEIGHT : 420;

    const contentWidth = pageWidth - MARGIN.LEFT - MARGIN.RIGHT;
    const contentHeight = pageHeight - MARGIN.TOP - MARGIN.BOTTOM - 30; // 제목 공간

    const w = module.w || 600;
    const h = module.h || 720;
    const d = module.d || 550;

    // 3D 투영 스케일
    const maxDim = Math.max(w, h, d);
    const scale = Math.min(contentWidth, contentHeight) / (maxDim * 1.5);

    const centerX = pageWidth / 2;
    const centerY = MARGIN.TOP + 20 + contentHeight / 2;

    let svg = `<svg width="${pageWidth}mm" height="${pageHeight}mm" viewBox="0 0 ${pageWidth} ${pageHeight}" xmlns="http://www.w3.org/2000/svg">`;

    // 스타일
    svg += `
      <style>
        .title { font: bold 5px sans-serif; }
        .subtitle { font: 3.5px sans-serif; fill: #666; }
        .dim { font: 2.5px sans-serif; fill: #333; }
        .label { font: 2px sans-serif; fill: #666; }
        .part-label { font: 2px sans-serif; fill: #0066cc; }
        .install-note { font: 2px sans-serif; fill: #cc0000; }
      </style>
    `;

    // 제목
    const titleText = drawingType === 'manufacturing' ? '제작 도면' : '설치 도면';
    svg += `<text x="${pageWidth / 2}" y="10" text-anchor="middle" class="title">${titleText} - ${module.name || module.type}</text>`;
    svg += `<text x="${pageWidth / 2}" y="16" text-anchor="middle" class="subtitle">${w} x ${h} x ${d} mm</text>`;

    // 3D 박스 렌더링
    svg += this._draw3DBox(centerX, centerY, w, h, d, scale, angle, module, options);

    // 치수선
    if (showDimensions) {
      svg += this._draw3DDimensions(centerX, centerY, w, h, d, scale, angle);
    }

    // 부품 라벨
    if (showPartLabels && drawingType === 'manufacturing') {
      svg += this._drawPartLabels(centerX, centerY, w, h, d, scale, angle, module);
    }

    // 설치 가이드
    if (showInstallGuides && drawingType === 'installation') {
      svg += this._drawInstallGuides(centerX, centerY, w, h, d, scale, angle, module);
    }

    // 정보 박스
    svg += this._draw3DInfoBox(pageWidth, pageHeight, module, moduleIndex, drawingType);

    svg += '</svg>';

    return {
      moduleId: module.id,
      moduleName: module.name || module.type,
      svg,
      dimensions: { w, h, d }
    };
  }

  /**
   * 3D 박스 그리기 (등각 투영)
   */
  _draw3DBox(cx, cy, w, h, d, scale, angle, module, options) {
    let svg = '';

    // 등각 투영 변환 (30도 각도)
    const cos30 = Math.cos(Math.PI / 6);
    const sin30 = Math.sin(Math.PI / 6);

    const ws = w * scale;
    const hs = h * scale;
    const ds = d * scale;

    // 투영된 좌표 계산
    const x1 = cx - ws * cos30 / 2;
    const y1 = cy + hs / 2;

    // 앞면 (정면)
    const frontPath = `M ${x1} ${y1}
                       L ${x1 + ws * cos30} ${y1 - ws * sin30}
                       L ${x1 + ws * cos30} ${y1 - ws * sin30 - hs}
                       L ${x1} ${y1 - hs}
                       Z`;
    svg += `<path d="${frontPath}" fill="${this.constants.COLORS.PANEL}" stroke="#333" stroke-width="0.3"/>`;

    // 윗면
    const topPath = `M ${x1} ${y1 - hs}
                     L ${x1 + ws * cos30} ${y1 - ws * sin30 - hs}
                     L ${x1 + ws * cos30 + ds * cos30} ${y1 - ws * sin30 - hs - ds * sin30}
                     L ${x1 + ds * cos30} ${y1 - hs - ds * sin30}
                     Z`;
    svg += `<path d="${topPath}" fill="#e8e8e8" stroke="#333" stroke-width="0.3"/>`;

    // 옆면 (오른쪽)
    const sidePath = `M ${x1 + ws * cos30} ${y1 - ws * sin30}
                      L ${x1 + ws * cos30 + ds * cos30} ${y1 - ws * sin30 - ds * sin30}
                      L ${x1 + ws * cos30 + ds * cos30} ${y1 - ws * sin30 - hs - ds * sin30}
                      L ${x1 + ws * cos30} ${y1 - ws * sin30 - hs}
                      Z`;
    svg += `<path d="${sidePath}" fill="#d0d0d0" stroke="#333" stroke-width="0.3"/>`;

    // 도어 표시 (있는 경우)
    if (module.doorCount || module.type === 'tall' || module.type === 'upper' || module.type === 'lower') {
      svg += this._drawDoor3D(x1, y1, ws, hs, ds, cos30, sin30, module);
    }

    // 서랍 표시 (있는 경우)
    if (module.hasDrawer || module.drawerCount) {
      svg += this._drawDrawer3D(x1, y1, ws, hs, ds, cos30, sin30, module);
    }

    return svg;
  }

  /**
   * 3D 도어 그리기
   */
  _drawDoor3D(x1, y1, ws, hs, ds, cos30, sin30, module) {
    let svg = '';
    const doorCount = module.doorCount || (module.is2D ? 2 : 1);
    const doorW = ws / doorCount;
    const doorGap = 1;

    for (let i = 0; i < doorCount; i++) {
      const dx = x1 + i * doorW * cos30;
      const dy = y1 - i * doorW * sin30;

      const doorPath = `M ${dx + doorGap} ${dy - doorGap}
                        L ${dx + (doorW - doorGap) * cos30} ${dy - (doorW - doorGap) * sin30 - doorGap}
                        L ${dx + (doorW - doorGap) * cos30} ${dy - (doorW - doorGap) * sin30 - hs + doorGap * 2}
                        L ${dx + doorGap} ${dy - hs + doorGap * 2}
                        Z`;
      svg += `<path d="${doorPath}" fill="${this.constants.COLORS.DOOR}" stroke="#8b7355" stroke-width="0.2"/>`;

      // 손잡이
      const handleX = dx + (doorW - doorGap) * cos30 * 0.85;
      const handleY = dy - (doorW - doorGap) * sin30 - hs / 2;
      svg += `<circle cx="${handleX}" cy="${handleY}" r="1" fill="#666"/>`;
    }

    return svg;
  }

  /**
   * 3D 서랍 그리기
   */
  _drawDrawer3D(x1, y1, ws, hs, ds, cos30, sin30, module) {
    let svg = '';
    const drawerCount = module.drawerCount || 3;
    const drawerH = hs / drawerCount;
    const drawerGap = 0.5;

    for (let i = 0; i < drawerCount; i++) {
      const dy = y1 - hs + (drawerCount - i) * drawerH;

      const drawerPath = `M ${x1 + drawerGap} ${dy - drawerGap}
                          L ${x1 + (ws - drawerGap) * cos30} ${dy - (ws - drawerGap) * sin30 - drawerGap}
                          L ${x1 + (ws - drawerGap) * cos30} ${dy - (ws - drawerGap) * sin30 - drawerH + drawerGap * 2}
                          L ${x1 + drawerGap} ${dy - drawerH + drawerGap * 2}
                          Z`;
      svg += `<path d="${drawerPath}" fill="${this.constants.COLORS.DRAWER}" stroke="#8b7355" stroke-width="0.2"/>`;

      // 손잡이
      const handleX = x1 + ws * cos30 / 2;
      const handleY = dy - ws * sin30 / 2 - drawerH / 2;
      svg += `<line x1="${handleX - 3}" y1="${handleY}" x2="${handleX + 3}" y2="${handleY - 1}" stroke="#666" stroke-width="0.3"/>`;
    }

    return svg;
  }

  /**
   * 3D 치수선 그리기
   */
  _draw3DDimensions(cx, cy, w, h, d, scale, angle) {
    let svg = '';
    const cos30 = Math.cos(Math.PI / 6);
    const sin30 = Math.sin(Math.PI / 6);

    const ws = w * scale;
    const hs = h * scale;
    const ds = d * scale;

    const x1 = cx - ws * cos30 / 2;
    const y1 = cy + hs / 2;

    // 너비 치수 (하단)
    svg += `<line x1="${x1}" y1="${y1 + 5}" x2="${x1 + ws * cos30}" y2="${y1 - ws * sin30 + 5}" stroke="#333" stroke-width="0.15"/>`;
    svg += `<text x="${x1 + ws * cos30 / 2}" y="${y1 - ws * sin30 / 2 + 9}" text-anchor="middle" class="dim">${w}</text>`;

    // 높이 치수 (좌측)
    svg += `<line x1="${x1 - 5}" y1="${y1}" x2="${x1 - 5}" y2="${y1 - hs}" stroke="#333" stroke-width="0.15"/>`;
    svg += `<text x="${x1 - 8}" y="${y1 - hs / 2}" text-anchor="middle" transform="rotate(-90 ${x1 - 8} ${y1 - hs / 2})" class="dim">${h}</text>`;

    // 깊이 치수 (상단)
    svg += `<line x1="${x1}" y1="${y1 - hs - 3}" x2="${x1 + ds * cos30}" y2="${y1 - hs - ds * sin30 - 3}" stroke="#333" stroke-width="0.15"/>`;
    svg += `<text x="${x1 + ds * cos30 / 2}" y="${y1 - hs - ds * sin30 / 2 - 5}" text-anchor="middle" class="dim">${d}</text>`;

    return svg;
  }

  /**
   * 부품 라벨 그리기
   */
  _drawPartLabels(cx, cy, w, h, d, scale, angle, module) {
    let svg = '';
    const labels = [
      { text: '좌측판', x: -20, y: 0 },
      { text: '우측판', x: 20, y: -10 },
      { text: '상판', x: 0, y: -45 },
      { text: '하판', x: 0, y: 35 },
      { text: '뒷판', x: 15, y: -20 }
    ];

    labels.forEach(label => {
      svg += `<text x="${cx + label.x}" y="${cy + label.y}" text-anchor="middle" class="part-label">${label.text}</text>`;
    });

    return svg;
  }

  /**
   * 설치 가이드 그리기
   */
  _drawInstallGuides(cx, cy, w, h, d, scale, angle, module) {
    let svg = '';

    // 설치 순서 표시
    const guides = [
      { num: 1, text: '벽면 고정', x: -30, y: -30 },
      { num: 2, text: '수평 확인', x: 30, y: 20 },
      { num: 3, text: '도어 조절', x: 0, y: 40 }
    ];

    guides.forEach(guide => {
      svg += `<circle cx="${cx + guide.x}" cy="${cy + guide.y}" r="3" fill="#cc0000"/>`;
      svg += `<text x="${cx + guide.x}" y="${cy + guide.y + 1}" text-anchor="middle" fill="white" font-size="2">${guide.num}</text>`;
      svg += `<text x="${cx + guide.x + 5}" y="${cy + guide.y}" class="install-note">${guide.text}</text>`;
    });

    return svg;
  }

  /**
   * 전체 배치도 생성
   */
  _generateOverviewSVG(modules, specs, options) {
    const { MARGIN, A4_LANDSCAPE } = this.constants;
    const { showDimensions, a4Size } = options;

    const pageWidth = a4Size ? A4_LANDSCAPE.WIDTH : 420;
    const pageHeight = a4Size ? A4_LANDSCAPE.HEIGHT : 297;

    const contentWidth = pageWidth - MARGIN.LEFT - MARGIN.RIGHT;
    const contentHeight = pageHeight - MARGIN.TOP - MARGIN.BOTTOM - 20;

    // 전체 너비/높이 계산
    const totalW = modules.reduce((sum, m) => sum + (m.w || 600), 0);
    const maxH = Math.max(...modules.map(m => m.h || 720));

    const scale = Math.min(
      contentWidth / (totalW * 1.2),
      contentHeight / (maxH * 1.5)
    );

    let svg = `<svg width="${pageWidth}mm" height="${pageHeight}mm" viewBox="0 0 ${pageWidth} ${pageHeight}" xmlns="http://www.w3.org/2000/svg">`;

    svg += `
      <style>
        .title { font: bold 5px sans-serif; }
        .dim { font: 2.5px sans-serif; fill: #333; }
      </style>
    `;

    svg += `<text x="${pageWidth / 2}" y="10" text-anchor="middle" class="title">설치 배치도 (전체)</text>`;

    // 모듈 배치
    let currentX = MARGIN.LEFT + 10;
    const baseY = MARGIN.TOP + 20 + contentHeight;

    modules.forEach((module, idx) => {
      const w = (module.w || 600) * scale;
      const h = (module.h || 720) * scale;
      const d = (module.d || 550) * scale * 0.3;

      // 간단한 3D 표현
      const cos30 = 0.866;
      const sin30 = 0.5;

      // 앞면
      svg += `<rect x="${currentX}" y="${baseY - h}" width="${w}" height="${h}" fill="#f5f5dc" stroke="#333" stroke-width="0.3"/>`;

      // 윗면
      const topPath = `M ${currentX} ${baseY - h}
                       L ${currentX + d * cos30} ${baseY - h - d * sin30}
                       L ${currentX + w + d * cos30} ${baseY - h - d * sin30}
                       L ${currentX + w} ${baseY - h}
                       Z`;
      svg += `<path d="${topPath}" fill="#e8e8e8" stroke="#333" stroke-width="0.3"/>`;

      // 옆면
      const sidePath = `M ${currentX + w} ${baseY - h}
                        L ${currentX + w + d * cos30} ${baseY - h - d * sin30}
                        L ${currentX + w + d * cos30} ${baseY - d * sin30}
                        L ${currentX + w} ${baseY}
                        Z`;
      svg += `<path d="${sidePath}" fill="#d0d0d0" stroke="#333" stroke-width="0.3"/>`;

      // 모듈명
      svg += `<text x="${currentX + w / 2}" y="${baseY - h / 2}" text-anchor="middle" class="dim">${module.name || module.type}</text>`;

      // 치수
      if (showDimensions) {
        svg += `<text x="${currentX + w / 2}" y="${baseY + 5}" text-anchor="middle" class="dim">${module.w || 600}</text>`;
      }

      currentX += w + 5;
    });

    // 총 너비 치수
    svg += `<line x1="${MARGIN.LEFT + 10}" y1="${baseY + 10}" x2="${currentX - 5}" y2="${baseY + 10}" stroke="#333" stroke-width="0.2"/>`;
    svg += `<text x="${(MARGIN.LEFT + 10 + currentX - 5) / 2}" y="${baseY + 15}" text-anchor="middle" class="dim">총 ${totalW}mm</text>`;

    svg += '</svg>';

    return {
      svg,
      totalWidth: totalW,
      moduleCount: modules.length
    };
  }

  /**
   * 정보 박스 그리기
   */
  _draw3DInfoBox(pageWidth, pageHeight, module, moduleIndex, drawingType) {
    const boxWidth = 50;
    const boxHeight = 25;
    const boxX = pageWidth - boxWidth - 5;
    const boxY = pageHeight - boxHeight - 5;

    let svg = `<rect x="${boxX}" y="${boxY}" width="${boxWidth}" height="${boxHeight}" fill="white" stroke="#333" stroke-width="0.2"/>`;

    svg += `<text x="${boxX + 3}" y="${boxY + 5}" class="label">모듈: ${module.name || module.type}</text>`;
    svg += `<text x="${boxX + 3}" y="${boxY + 10}" class="label">번호: ${moduleIndex + 1}</text>`;
    svg += `<text x="${boxX + 3}" y="${boxY + 15}" class="label">타입: ${drawingType === 'manufacturing' ? '제작' : '설치'}</text>`;
    svg += `<text x="${boxX + 3}" y="${boxY + 20}" class="label">날짜: ${new Date().toLocaleDateString('ko-KR')}</text>`;

    return svg;
  }
}

// ============================================================
// 데이터베이스 관리자 클래스
// ============================================================
class DrawingDatabase {
  constructor() {
    this.drawings = [];
    this.feedback = [];
  }

  /**
   * 도면 저장
   */
  saveDrawing(drawing, designId, type) {
    const record = {
      id: `DRW_${Date.now()}`,
      designId,
      type, // 'cutting', 'manufacturing', 'installation'
      timestamp: new Date().toISOString(),
      data: drawing
    };
    this.drawings.push(record);
    return record.id;
  }

  /**
   * 도면 조회
   */
  getDrawing(drawingId) {
    return this.drawings.find(d => d.id === drawingId);
  }

  /**
   * 피드백 저장
   */
  saveFeedback(drawingId, feedback) {
    this.feedback.push({
      id: `FB_${Date.now()}`,
      drawingId,
      timestamp: new Date().toISOString(),
      feedback,
      status: 'pending'
    });
  }

  /**
   * 통계 조회
   */
  getStatistics() {
    const byType = {
      cutting: this.drawings.filter(d => d.type === 'cutting').length,
      manufacturing: this.drawings.filter(d => d.type === 'manufacturing').length,
      installation: this.drawings.filter(d => d.type === 'installation').length
    };

    return {
      totalDrawings: this.drawings.length,
      byType,
      feedbackCount: this.feedback.length,
      lastDrawing: this.drawings[this.drawings.length - 1]?.timestamp
    };
  }

  /**
   * 학습 데이터 내보내기
   */
  exportForTraining() {
    return {
      drawings: this.drawings,
      feedback: this.feedback,
      exportedAt: new Date().toISOString()
    };
  }
}

// ============================================================
// 메인 클래스: 도면 시각화 스킬
// ============================================================
class DrawingVisualizationSkill {
  constructor() {
    this.cuttingOptimizer = new CuttingOptimizer();
    this.cuttingDrawingGen = new CuttingDrawingGenerator();
    this.drawing3DGen = new Drawing3DGenerator();
    this.database = new DrawingDatabase();
  }

  /**
   * 재단 도면 생성
   * @param {Array} parts - 자재 리스트 (MaterialExtractionSkill에서 추출된)
   * @param {Object} options - { optimizeMode: 'material' | 'cutting', showDimensions, a4Size }
   */
  generateCuttingDrawing(parts, options = {}) {
    // 최적화 모드 설정
    this.cuttingOptimizer.optimizeMode = options.optimizeMode || 'material';

    // 재단 최적화
    const optimizationResult = this.cuttingOptimizer.optimize(parts);

    // 도면 생성
    const drawing = this.cuttingDrawingGen.generateSVG(optimizationResult, {
      showDimensions: options.showDimensions !== false,
      showLabels: options.showLabels !== false,
      a4Size: options.a4Size !== false
    });

    return {
      type: 'cutting',
      optimizeMode: options.optimizeMode || 'material',
      ...drawing
    };
  }

  /**
   * 제작 도면 생성 (3D)
   */
  generateManufacturingDrawing(designData, options = {}) {
    const drawing = this.drawing3DGen.generateManufacturingDrawing(designData, options);
    return {
      type: 'manufacturing',
      ...drawing
    };
  }

  /**
   * 설치 도면 생성 (3D)
   */
  generateInstallationDrawing(designData, options = {}) {
    const drawing = this.drawing3DGen.generateInstallationDrawing(designData, options);
    return {
      type: 'installation',
      ...drawing
    };
  }

  /**
   * 모든 도면 생성
   */
  generateAllDrawings(designData, parts, options = {}) {
    const cuttingDrawing = this.generateCuttingDrawing(parts, options.cutting || {});
    const manufacturingDrawing = this.generateManufacturingDrawing(designData, options.manufacturing || {});
    const installationDrawing = this.generateInstallationDrawing(designData, options.installation || {});

    // 데이터베이스 저장
    const cuttingId = this.database.saveDrawing(cuttingDrawing, designData.id, 'cutting');
    const manufacturingId = this.database.saveDrawing(manufacturingDrawing, designData.id, 'manufacturing');
    const installationId = this.database.saveDrawing(installationDrawing, designData.id, 'installation');

    return {
      cutting: { id: cuttingId, ...cuttingDrawing },
      manufacturing: { id: manufacturingId, ...manufacturingDrawing },
      installation: { id: installationId, ...installationDrawing },
      database: this.database.getStatistics()
    };
  }

  /**
   * 피드백 저장
   */
  addFeedback(drawingId, feedback) {
    this.database.saveFeedback(drawingId, feedback);
  }

  /**
   * 학습 데이터 내보내기
   */
  exportForTraining() {
    return this.database.exportForTraining();
  }
}

// ============================================================
// Export
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DrawingVisualizationSkill,
    CuttingOptimizer,
    CuttingDrawingGenerator,
    Drawing3DGenerator,
    DrawingDatabase,
    DrawingConstants
  };
}

// 전역 노출 (브라우저 환경)
if (typeof window !== 'undefined') {
  window.DrawingVisualizationSkill = DrawingVisualizationSkill;
  window.DrawingConstants = DrawingConstants;
}
