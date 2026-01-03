/**
 * 자재 추출 서브스킬 모듈
 * 다담 캐비넷 에이전트 v32.1
 *
 * 주요 기능:
 * - 설계 정보 기반 자재 추출
 * - 엑셀 파일 출력 (정돈된 표 형식)
 * - CNC 재단기용 파일 출력
 * - 데이터베이스화 및 학습 피드백
 *
 * 자재 항목:
 * - 품목, 색상, 엣지 색상, 두께, 가로, 세로, 엣지 구성
 */

// ============================================================
// 상수 정의
// ============================================================
const MaterialConstants = {
  // 표준 판재 규격 (mm)
  STANDARD_BOARD: {
    WIDTH: 1220,
    HEIGHT: 2440
  },

  // 표준 두께 (mm)
  THICKNESS: {
    PANEL_18: 18,
    PANEL_15: 15,
    PANEL_9: 9,
    BACK_PANEL: 4,
    DOOR_18: 18
  },

  // 엣지 종류
  EDGE_TYPES: {
    PVC_0_4: { id: 'pvc_04', name: 'PVC 0.4T', thickness: 0.4 },
    PVC_1: { id: 'pvc_1', name: 'PVC 1T', thickness: 1 },
    PVC_2: { id: 'pvc_2', name: 'PVC 2T', thickness: 2 },
    ABS_1: { id: 'abs_1', name: 'ABS 1T', thickness: 1 },
    ABS_2: { id: 'abs_2', name: 'ABS 2T', thickness: 2 },
    WOOD: { id: 'wood', name: '원목엣지', thickness: 3 },
    NONE: { id: 'none', name: '없음', thickness: 0 }
  },

  // 자재 종류
  MATERIAL_TYPES: {
    MDF: { id: 'mdf', name: 'MDF', density: 750 },
    PB: { id: 'pb', name: '파티클보드', density: 650 },
    PLYWOOD: { id: 'plywood', name: '합판', density: 550 },
    MELAMINE: { id: 'melamine', name: '멜라민', density: 680 },
    HPL: { id: 'hpl', name: 'HPL', density: 1400 },
    ACRYLIC: { id: 'acrylic', name: '아크릴', density: 1180 }
  },

  // CNC 파일 포맷
  CNC_FORMATS: ['csv', 'xml', 'dxf', 'nc']
};

// ============================================================
// 자재 추출기 클래스
// ============================================================
class MaterialExtractor {
  constructor() {
    this.materials = [];
    this.extractionHistory = [];
  }

  /**
   * 설계 데이터에서 자재 추출
   */
  extractFromDesign(designData) {
    this.materials = [];
    const { modules, specs, category } = designData;

    if (!modules || !Array.isArray(modules)) {
      return { success: false, error: '모듈 데이터가 없습니다.' };
    }

    modules.forEach((module, idx) => {
      const parts = this._extractModuleParts(module, specs, idx);
      this.materials.push(...parts);
    });

    // 추출 이력 저장
    this._saveExtractionHistory(designData);

    return {
      success: true,
      materials: this.materials,
      count: this.materials.length,
      summary: this._generateSummary()
    };
  }

  /**
   * 모듈에서 부재 추출
   */
  _extractModuleParts(module, specs, moduleIndex) {
    const parts = [];
    const baseColor = specs?.color || '화이트';
    const edgeColor = specs?.edgeColor || baseColor;
    const depth = module.d || specs?.depth || 550;

    // 모듈 타입에 따른 부재 생성
    switch (module.type) {
      case 'fridge':
        parts.push(...this._extractFridgeParts(module, baseColor, edgeColor, depth, moduleIndex));
        break;
      case 'tall':
        parts.push(...this._extractTallParts(module, baseColor, edgeColor, depth, moduleIndex));
        break;
      case 'homecafe':
        parts.push(...this._extractHomecafeParts(module, baseColor, edgeColor, depth, moduleIndex));
        break;
      case 'upper':
        parts.push(...this._extractUpperParts(module, baseColor, edgeColor, depth, moduleIndex));
        break;
      case 'lower':
        parts.push(...this._extractLowerParts(module, baseColor, edgeColor, depth, moduleIndex));
        break;
      case 'storage':
        parts.push(...this._extractStorageParts(module, baseColor, edgeColor, depth, moduleIndex));
        break;
      default:
        parts.push(...this._extractGenericParts(module, baseColor, edgeColor, depth, moduleIndex));
    }

    return parts;
  }

  /**
   * 냉장고장 부재 추출
   */
  _extractFridgeParts(module, color, edgeColor, depth, idx) {
    const parts = [];
    const w = module.w || 600;

    // 상부장 측판
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '상부장 좌측판',
      category: '측판',
      width: depth - 18,
      height: 360,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: false, R: false, B: false },
      quantity: 1
    }));

    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '상부장 우측판',
      category: '측판',
      width: depth - 18,
      height: 360,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: false, S: false, R: true, B: false },
      quantity: 1
    }));

    // 상부장 상/하판
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '상부장 상판',
      category: '가로판',
      width: w - 36,
      height: depth - 18,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: false, R: true, B: false },
      quantity: 1
    }));

    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '상부장 하판',
      category: '가로판',
      width: w - 36,
      height: depth - 18,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: false, R: true, B: false },
      quantity: 1
    }));

    // 뒷판
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '상부장 뒷판',
      category: '뒷판',
      width: w - 8,
      height: 356,
      thickness: 4,
      color,
      edgeColor,
      edge: { L: false, S: false, R: false, B: false },
      quantity: 1
    }));

    return parts;
  }

  /**
   * 키큰장 부재 추출
   */
  _extractTallParts(module, color, edgeColor, depth, idx) {
    const parts = [];
    const w = module.w || 600;
    const h = module.h || 2100;

    // 측판
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '좌측판',
      category: '측판',
      width: depth - 18,
      height: h - 60,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: true, R: false, B: false },
      quantity: 1
    }));

    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '우측판',
      category: '측판',
      width: depth - 18,
      height: h - 60,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: false, S: true, R: true, B: false },
      quantity: 1
    }));

    // 상판
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '상판',
      category: '가로판',
      width: w - 36,
      height: depth - 18,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: false, R: true, B: false },
      quantity: 1
    }));

    // 중간선반 (2개)
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '중간선반',
      category: '선반',
      width: w - 38,
      height: depth - 50,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: false, R: true, B: false },
      quantity: 2
    }));

    // 하부 바닥판
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '하부 바닥판',
      category: '가로판',
      width: w - 36,
      height: depth - 18,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: false, R: true, B: false },
      quantity: 1
    }));

    // 뒷판
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '뒷판',
      category: '뒷판',
      width: w - 8,
      height: h - 68,
      thickness: 4,
      color,
      edgeColor,
      edge: { L: false, S: false, R: false, B: false },
      quantity: 1
    }));

    // 도어
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '도어',
      category: '도어',
      width: w / 2 - 2,
      height: h - 64,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: true, R: true, B: true },
      quantity: 2
    }));

    return parts;
  }

  /**
   * 홈카페장 부재 추출
   */
  _extractHomecafeParts(module, color, edgeColor, depth, idx) {
    const parts = [];
    const w = module.w || 600;
    const h = module.h || 1400;

    // 측판
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '좌측판',
      category: '측판',
      width: depth - 18,
      height: h - 60,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: true, R: false, B: false },
      quantity: 1
    }));

    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '우측판',
      category: '측판',
      width: depth - 18,
      height: h - 60,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: false, S: true, R: true, B: false },
      quantity: 1
    }));

    // 상판
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '상판',
      category: '가로판',
      width: w - 36,
      height: depth - 18,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: false, R: true, B: false },
      quantity: 1
    }));

    // 가전 거치대
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '가전 거치대',
      category: '선반',
      width: w - 38,
      height: depth - 18,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: false, R: true, B: true },
      quantity: 1
    }));

    // 하부 선반
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '하부 선반',
      category: '선반',
      width: w - 38,
      height: depth - 50,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: false, R: true, B: false },
      quantity: 2
    }));

    // 뒷판
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '뒷판',
      category: '뒷판',
      width: w - 8,
      height: h - 68,
      thickness: 4,
      color,
      edgeColor,
      edge: { L: false, S: false, R: false, B: false },
      quantity: 1
    }));

    return parts;
  }

  /**
   * 상부장 부재 추출
   */
  _extractUpperParts(module, color, edgeColor, depth, idx) {
    const parts = [];
    const w = module.w || 600;
    const h = module.h || 720;
    const upperDepth = 350;

    // 측판
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '상부장 좌측판',
      category: '측판',
      width: upperDepth - 18,
      height: h,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: true, R: false, B: true },
      quantity: 1
    }));

    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '상부장 우측판',
      category: '측판',
      width: upperDepth - 18,
      height: h,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: false, S: true, R: true, B: true },
      quantity: 1
    }));

    // 상/하판
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '상부장 상판',
      category: '가로판',
      width: w - 36,
      height: upperDepth - 18,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: false, R: true, B: false },
      quantity: 1
    }));

    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '상부장 하판',
      category: '가로판',
      width: w - 36,
      height: upperDepth - 18,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: false, R: true, B: true },
      quantity: 1
    }));

    // 선반
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '상부장 선반',
      category: '선반',
      width: w - 38,
      height: upperDepth - 50,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: false, R: true, B: false },
      quantity: 1
    }));

    // 뒷판
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '상부장 뒷판',
      category: '뒷판',
      width: w - 8,
      height: h - 4,
      thickness: 4,
      color,
      edgeColor,
      edge: { L: false, S: false, R: false, B: false },
      quantity: 1
    }));

    // 도어
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '상부장 도어',
      category: '도어',
      width: w - 4,
      height: h - 4,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: true, R: true, B: true },
      quantity: 1
    }));

    return parts;
  }

  /**
   * 하부장 부재 추출
   */
  _extractLowerParts(module, color, edgeColor, depth, idx) {
    const parts = [];
    const w = module.w || 600;
    const h = module.h || 810;

    // 측판
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '하부장 좌측판',
      category: '측판',
      width: depth - 18,
      height: h,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: false, R: false, B: false },
      quantity: 1
    }));

    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '하부장 우측판',
      category: '측판',
      width: depth - 18,
      height: h,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: false, S: false, R: true, B: false },
      quantity: 1
    }));

    // 상판
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '하부장 상판',
      category: '가로판',
      width: w - 36,
      height: depth - 18,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: false, R: true, B: false },
      quantity: 1
    }));

    // 바닥판
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '하부장 바닥판',
      category: '가로판',
      width: w - 36,
      height: depth - 60,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: false, S: false, R: false, B: false },
      quantity: 1
    }));

    // 뒷판
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '하부장 뒷판',
      category: '뒷판',
      width: w - 8,
      height: h - 4,
      thickness: 4,
      color,
      edgeColor,
      edge: { L: false, S: false, R: false, B: false },
      quantity: 1
    }));

    // 도어 또는 서랍
    if (module.hasDrawer) {
      parts.push(this._createPart({
        moduleIndex: idx,
        partName: '서랍 전판',
        category: '서랍',
        width: w - 4,
        height: 200,
        thickness: 18,
        color,
        edgeColor,
        edge: { L: true, S: true, R: true, B: true },
        quantity: module.drawerCount || 3
      }));
    } else {
      parts.push(this._createPart({
        moduleIndex: idx,
        partName: '하부장 도어',
        category: '도어',
        width: w - 4,
        height: h - 4,
        thickness: 18,
        color,
        edgeColor,
        edge: { L: true, S: true, R: true, B: true },
        quantity: 1
      }));
    }

    return parts;
  }

  /**
   * 수납장 부재 추출
   */
  _extractStorageParts(module, color, edgeColor, depth, idx) {
    return this._extractTallParts(module, color, edgeColor, depth, idx);
  }

  /**
   * 일반 모듈 부재 추출
   */
  _extractGenericParts(module, color, edgeColor, depth, idx) {
    const parts = [];
    const w = module.w || 600;
    const h = module.h || 720;

    // 측판 2개
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '좌측판',
      category: '측판',
      width: depth - 18,
      height: h,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: true, R: false, B: true },
      quantity: 1
    }));

    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '우측판',
      category: '측판',
      width: depth - 18,
      height: h,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: false, S: true, R: true, B: true },
      quantity: 1
    }));

    // 상하판
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '상판',
      category: '가로판',
      width: w - 36,
      height: depth - 18,
      thickness: 18,
      color,
      edgeColor,
      edge: { L: true, S: false, R: true, B: false },
      quantity: 2
    }));

    // 뒷판
    parts.push(this._createPart({
      moduleIndex: idx,
      partName: '뒷판',
      category: '뒷판',
      width: w - 8,
      height: h - 4,
      thickness: 4,
      color,
      edgeColor,
      edge: { L: false, S: false, R: false, B: false },
      quantity: 1
    }));

    return parts;
  }

  /**
   * 부재 객체 생성
   */
  _createPart(options) {
    const edgeString = this._formatEdge(options.edge);
    return {
      id: `M${options.moduleIndex}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      moduleIndex: options.moduleIndex,
      partName: options.partName,
      category: options.category,
      width: options.width,
      height: options.height,
      thickness: options.thickness,
      color: options.color,
      edgeColor: options.edgeColor,
      edge: options.edge,
      edgeString: edgeString,
      quantity: options.quantity || 1,
      area: (options.width * options.height * options.quantity) / 1000000, // m²
      material: options.material || 'melamine'
    };
  }

  /**
   * 엣지 구성 문자열 생성 (L: 길이방향, S: 짧은방향)
   */
  _formatEdge(edge) {
    const sides = [];
    if (edge.L) sides.push('장');
    if (edge.S) sides.push('단');
    if (edge.R) sides.push('우');
    if (edge.B) sides.push('하');
    return sides.length > 0 ? sides.join('+') : '없음';
  }

  /**
   * 요약 생성
   */
  _generateSummary() {
    const byCategory = {};
    let totalArea = 0;

    this.materials.forEach(mat => {
      if (!byCategory[mat.category]) {
        byCategory[mat.category] = { count: 0, area: 0 };
      }
      byCategory[mat.category].count += mat.quantity;
      byCategory[mat.category].area += mat.area;
      totalArea += mat.area;
    });

    return {
      totalParts: this.materials.reduce((sum, m) => sum + m.quantity, 0),
      totalArea: Math.round(totalArea * 100) / 100,
      byCategory
    };
  }

  /**
   * 추출 이력 저장 (데이터베이스화)
   */
  _saveExtractionHistory(designData) {
    this.extractionHistory.push({
      timestamp: new Date().toISOString(),
      designId: designData.id || 'unknown',
      category: designData.category,
      moduleCount: designData.modules?.length || 0,
      partCount: this.materials.length,
      summary: this._generateSummary()
    });
  }
}

// ============================================================
// 엑셀 출력 클래스
// ============================================================
class MaterialExcelExporter {
  constructor() {
    this.columns = [
      { key: 'no', header: 'No.', width: 5 },
      { key: 'partName', header: '품목', width: 20 },
      { key: 'category', header: '분류', width: 10 },
      { key: 'color', header: '색상', width: 12 },
      { key: 'edgeColor', header: '엣지 색상', width: 12 },
      { key: 'thickness', header: '두께(T)', width: 8 },
      { key: 'width', header: '가로(mm)', width: 10 },
      { key: 'height', header: '세로(mm)', width: 10 },
      { key: 'edgeString', header: '엣지 구성', width: 12 },
      { key: 'quantity', header: '수량', width: 6 },
      { key: 'area', header: '면적(㎡)', width: 10 },
      { key: 'note', header: '비고', width: 15 }
    ];
  }

  /**
   * 엑셀 데이터 생성 (CSV 형식)
   */
  generateExcelData(materials, options = {}) {
    const { includeHeader = true, projectName = '다담 캐비넷' } = options;

    let csv = '';

    // 프로젝트 정보
    if (options.includeProjectInfo) {
      csv += `프로젝트명,${projectName}\n`;
      csv += `생성일시,${new Date().toLocaleString('ko-KR')}\n`;
      csv += `총 부재 수,${materials.length}\n`;
      csv += '\n';
    }

    // 헤더
    if (includeHeader) {
      csv += this.columns.map(col => col.header).join(',') + '\n';
    }

    // 데이터 행
    materials.forEach((mat, idx) => {
      const row = [
        idx + 1,
        mat.partName,
        mat.category,
        mat.color,
        mat.edgeColor,
        mat.thickness,
        mat.width,
        mat.height,
        mat.edgeString,
        mat.quantity,
        mat.area.toFixed(3),
        mat.note || ''
      ];
      csv += row.join(',') + '\n';
    });

    // 요약
    if (options.includeSummary) {
      csv += '\n';
      csv += '=== 요약 ===\n';
      const summary = this._calculateSummary(materials);
      csv += `총 수량,${summary.totalQuantity}\n`;
      csv += `총 면적,${summary.totalArea.toFixed(2)} ㎡\n`;
    }

    return csv;
  }

  /**
   * JSON 형식 출력
   */
  generateJSON(materials) {
    return JSON.stringify({
      generatedAt: new Date().toISOString(),
      columns: this.columns,
      data: materials,
      summary: this._calculateSummary(materials)
    }, null, 2);
  }

  /**
   * 요약 계산
   */
  _calculateSummary(materials) {
    return {
      totalQuantity: materials.reduce((sum, m) => sum + m.quantity, 0),
      totalArea: materials.reduce((sum, m) => sum + m.area, 0),
      partCount: materials.length
    };
  }
}

// ============================================================
// CNC 파일 생성기 클래스
// ============================================================
class CNCFileGenerator {
  constructor() {
    this.supportedFormats = ['csv', 'xml', 'dxf', 'nc'];
  }

  /**
   * CNC 파일 생성
   */
  generate(materials, format = 'csv', options = {}) {
    switch (format.toLowerCase()) {
      case 'csv':
        return this._generateCSV(materials, options);
      case 'xml':
        return this._generateXML(materials, options);
      case 'dxf':
        return this._generateDXF(materials, options);
      case 'nc':
        return this._generateNC(materials, options);
      default:
        throw new Error(`지원하지 않는 형식: ${format}`);
    }
  }

  /**
   * CSV 형식 (재단기 범용)
   */
  _generateCSV(materials, options) {
    const { delimiter = ';', machineType = 'generic' } = options;
    let output = '';

    // 헤더 (재단기 표준)
    output += ['Part', 'Material', 'Thickness', 'Length', 'Width', 'Qty', 'Edge_L1', 'Edge_L2', 'Edge_W1', 'Edge_W2', 'Grain'].join(delimiter) + '\n';

    materials.forEach((mat, idx) => {
      const row = [
        `P${String(idx + 1).padStart(4, '0')}`,
        mat.material || 'MEL',
        mat.thickness,
        Math.max(mat.width, mat.height), // 길이 (긴 쪽)
        Math.min(mat.width, mat.height), // 폭 (짧은 쪽)
        mat.quantity,
        mat.edge.L ? 1 : 0,
        mat.edge.R ? 1 : 0,
        mat.edge.S ? 1 : 0,
        mat.edge.B ? 1 : 0,
        1 // 결방향
      ];
      output += row.join(delimiter) + '\n';
    });

    return {
      format: 'csv',
      content: output,
      filename: `cutting_list_${Date.now()}.csv`,
      machineType
    };
  }

  /**
   * XML 형식 (Homag, SCM 등)
   */
  _generateXML(materials, options) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<CuttingList>\n';
    xml += `  <Generated>${new Date().toISOString()}</Generated>\n`;
    xml += `  <PartCount>${materials.length}</PartCount>\n`;
    xml += '  <Parts>\n';

    materials.forEach((mat, idx) => {
      xml += '    <Part>\n';
      xml += `      <ID>P${String(idx + 1).padStart(4, '0')}</ID>\n`;
      xml += `      <Name>${this._escapeXML(mat.partName)}</Name>\n`;
      xml += `      <Material>${mat.material || 'MEL'}</Material>\n`;
      xml += `      <Thickness>${mat.thickness}</Thickness>\n`;
      xml += `      <Length>${Math.max(mat.width, mat.height)}</Length>\n`;
      xml += `      <Width>${Math.min(mat.width, mat.height)}</Width>\n`;
      xml += `      <Quantity>${mat.quantity}</Quantity>\n`;
      xml += '      <Edgebanding>\n';
      xml += `        <L1>${mat.edge.L ? mat.edgeColor : ''}</L1>\n`;
      xml += `        <L2>${mat.edge.R ? mat.edgeColor : ''}</L2>\n`;
      xml += `        <W1>${mat.edge.S ? mat.edgeColor : ''}</W1>\n`;
      xml += `        <W2>${mat.edge.B ? mat.edgeColor : ''}</W2>\n`;
      xml += '      </Edgebanding>\n';
      xml += '      <GrainDirection>1</GrainDirection>\n';
      xml += '    </Part>\n';
    });

    xml += '  </Parts>\n';
    xml += '</CuttingList>\n';

    return {
      format: 'xml',
      content: xml,
      filename: `cutting_list_${Date.now()}.xml`
    };
  }

  /**
   * DXF 형식 (CAD 호환)
   */
  _generateDXF(materials, options) {
    let dxf = '';

    // DXF 헤더
    dxf += '0\nSECTION\n2\nHEADER\n';
    dxf += '9\n$ACADVER\n1\nAC1015\n';
    dxf += '0\nENDSEC\n';

    // ENTITIES 섹션
    dxf += '0\nSECTION\n2\nENTITIES\n';

    let offsetX = 0;
    let offsetY = 0;
    const spacing = 50;

    materials.forEach((mat, idx) => {
      for (let q = 0; q < mat.quantity; q++) {
        // 사각형 (LWPOLYLINE)
        dxf += '0\nLWPOLYLINE\n';
        dxf += '8\nPARTS\n'; // 레이어
        dxf += '90\n4\n'; // 꼭지점 수
        dxf += '70\n1\n'; // 닫힌 폴리라인

        const w = mat.width;
        const h = mat.height;

        dxf += `10\n${offsetX}\n20\n${offsetY}\n`;
        dxf += `10\n${offsetX + w}\n20\n${offsetY}\n`;
        dxf += `10\n${offsetX + w}\n20\n${offsetY + h}\n`;
        dxf += `10\n${offsetX}\n20\n${offsetY + h}\n`;

        // 텍스트 (부재명)
        dxf += '0\nTEXT\n';
        dxf += '8\nLABELS\n';
        dxf += `10\n${offsetX + 10}\n20\n${offsetY + h / 2}\n`;
        dxf += '40\n20\n'; // 텍스트 높이
        dxf += `1\n${mat.partName}\n`;

        offsetX += w + spacing;
        if (offsetX > 2400) {
          offsetX = 0;
          offsetY += 600;
        }
      }
    });

    dxf += '0\nENDSEC\n0\nEOF\n';

    return {
      format: 'dxf',
      content: dxf,
      filename: `cutting_list_${Date.now()}.dxf`
    };
  }

  /**
   * NC 형식 (G-code)
   */
  _generateNC(materials, options) {
    let nc = '';

    // G-code 헤더
    nc += '; CNC Cutting Program\n';
    nc += `; Generated: ${new Date().toISOString()}\n`;
    nc += `; Parts: ${materials.length}\n`;
    nc += '\n';
    nc += 'G21 ; mm 단위\n';
    nc += 'G90 ; 절대좌표\n';
    nc += 'G00 Z5 ; 안전높이\n';
    nc += '\n';

    materials.forEach((mat, idx) => {
      nc += `; Part ${idx + 1}: ${mat.partName}\n`;
      nc += `; Size: ${mat.width} x ${mat.height} x ${mat.thickness}\n`;
      nc += `; Qty: ${mat.quantity}\n`;
      nc += '\n';
    });

    nc += 'M30 ; 프로그램 종료\n';

    return {
      format: 'nc',
      content: nc,
      filename: `cutting_program_${Date.now()}.nc`
    };
  }

  _escapeXML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

// ============================================================
// 데이터베이스 관리자 클래스
// ============================================================
class MaterialDatabase {
  constructor() {
    this.materials = [];
    this.extractions = [];
    this.feedback = [];
  }

  /**
   * 자재 저장
   */
  saveMaterials(materials, designId) {
    const record = {
      id: `EXT_${Date.now()}`,
      designId,
      timestamp: new Date().toISOString(),
      materials: materials,
      count: materials.length
    };
    this.extractions.push(record);
    return record.id;
  }

  /**
   * 자재 조회
   */
  getMaterials(extractionId) {
    return this.extractions.find(e => e.id === extractionId);
  }

  /**
   * 피드백 저장 (학습용)
   */
  saveFeedback(extractionId, feedback) {
    this.feedback.push({
      id: `FB_${Date.now()}`,
      extractionId,
      timestamp: new Date().toISOString(),
      feedback,
      status: 'pending'
    });
  }

  /**
   * 통계 조회
   */
  getStatistics() {
    return {
      totalExtractions: this.extractions.length,
      totalMaterials: this.extractions.reduce((sum, e) => sum + e.count, 0),
      feedbackCount: this.feedback.length,
      lastExtraction: this.extractions[this.extractions.length - 1]?.timestamp
    };
  }

  /**
   * 학습 데이터 내보내기
   */
  exportForTraining() {
    return {
      extractions: this.extractions,
      feedback: this.feedback,
      exportedAt: new Date().toISOString()
    };
  }
}

// ============================================================
// 메인 클래스: 자재 추출 스킬
// ============================================================
class MaterialExtractionSkill {
  constructor() {
    this.extractor = new MaterialExtractor();
    this.excelExporter = new MaterialExcelExporter();
    this.cncGenerator = new CNCFileGenerator();
    this.database = new MaterialDatabase();
  }

  /**
   * 자재 추출 실행
   */
  extract(designData) {
    return this.extractor.extractFromDesign(designData);
  }

  /**
   * 엑셀 출력
   */
  exportToExcel(materials, options = {}) {
    return this.excelExporter.generateExcelData(materials, options);
  }

  /**
   * CNC 파일 출력
   */
  exportToCNC(materials, format = 'csv', options = {}) {
    return this.cncGenerator.generate(materials, format, options);
  }

  /**
   * 데이터베이스 저장
   */
  saveToDatabase(materials, designId) {
    return this.database.saveMaterials(materials, designId);
  }

  /**
   * 피드백 저장
   */
  addFeedback(extractionId, feedback) {
    this.database.saveFeedback(extractionId, feedback);
  }

  /**
   * 전체 워크플로우 실행
   */
  runFullWorkflow(designData, options = {}) {
    // 1. 자재 추출
    const extraction = this.extract(designData);
    if (!extraction.success) {
      return extraction;
    }

    // 2. 데이터베이스 저장
    const extractionId = this.saveToDatabase(extraction.materials, designData.id);

    // 3. 엑셀 생성
    const excelData = this.exportToExcel(extraction.materials, {
      includeHeader: true,
      includeProjectInfo: true,
      includeSummary: true,
      projectName: designData.projectName || '다담 캐비넷'
    });

    // 4. CNC 파일 생성
    const cncFiles = {};
    const formats = options.cncFormats || ['csv'];
    formats.forEach(format => {
      cncFiles[format] = this.exportToCNC(extraction.materials, format);
    });

    return {
      success: true,
      extractionId,
      materials: extraction.materials,
      summary: extraction.summary,
      excelData,
      cncFiles,
      database: this.database.getStatistics()
    };
  }
}

// ============================================================
// Export
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MaterialExtractionSkill,
    MaterialExtractor,
    MaterialExcelExporter,
    CNCFileGenerator,
    MaterialDatabase,
    MaterialConstants
  };
}

// 전역 노출 (브라우저 환경)
if (typeof window !== 'undefined') {
  window.MaterialExtractionSkill = MaterialExtractionSkill;
  window.MaterialConstants = MaterialConstants;
}
