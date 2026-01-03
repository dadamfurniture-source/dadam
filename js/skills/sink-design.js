/**
 * 싱크대 설계 스킬 모듈
 * 다담 캐비넷 에이전트 v32.1
 *
 * 주요 기능:
 * - 상부장 자동 계산 (runAutoCalcUpper)
 * - 하부장 자동 계산 (runAutoCalcLower)
 * - 도어 너비 최적화 (optimizeDoorWidth)
 * - 균등 분배 알고리즘 (distributeModules)
 *
 * 서브 스킬:
 * 1. 상부장 설계 - 후드장, 기준상부장 배치
 * 2. 하부장 설계 - 개수대, 가스대, LT망장 배치
 * 3. 도어 분배 - 균등 분배 알고리즘
 * 4. 자동 계산 - 최적화 로직
 */

// ============================================================
// 상수 정의
// ============================================================
const SinkDesignConstants = {
  // 도어 너비 규칙
  DOOR_TARGET_WIDTH: 450,  // 목표 도어 너비
  DOOR_MAX_WIDTH: 600,     // 최대 도어 너비
  DOOR_MIN_WIDTH: 350,     // 최소 도어 너비
  MIN_REMAINDER: 4,        // 최소 잔여 공간
  MAX_REMAINDER: 10,       // 최대 잔여 공간

  // 모듈 기본 치수
  SINK_WIDTH: 1000,        // 개수대 기본 너비
  COOK_WIDTH: 600,         // 가스대 기본 너비
  HOOD_WIDTH: 800,         // 후드 기본 너비
  LT_MESH_WIDTH: 200,      // LT망장 기본 너비

  // 허용 오차
  HOOD_TOLERANCE: 50,      // 후드 위치 허용 오차
  BASE_TOLERANCE: 100,     // 기준상부장 위치 허용 오차

  // 기본 깊이
  UPPER_DEPTH: 295,        // 상부장 기본 깊이
  LOWER_DEPTH: 550         // 하부장 기본 깊이
};

// ============================================================
// 서브스킬 1: 도어 너비 최적화
// ============================================================
class DoorWidthOptimizer {
  constructor(constants = SinkDesignConstants) {
    this.constants = constants;
  }

  /**
   * 도어 너비 최적화
   * 우선순위:
   * 1. 4mm ≤ 잔여공간 ≤ 10mm
   * 2. 0mm ≤ 잔여공간 < 4mm
   * 3. 10의 단위 > 짝수
   */
  optimize(totalSpace, doorCount) {
    const { DOOR_MIN_WIDTH, DOOR_MAX_WIDTH, MIN_REMAINDER, MAX_REMAINDER } = this.constants;

    let bestWidth = null;
    let bestRemainder = Infinity;
    let bestPriority = 99;

    // 가능한 모든 도어 너비 탐색
    for (let w = DOOR_MIN_WIDTH; w <= DOOR_MAX_WIDTH; w++) {
      const totalUsed = w * doorCount;
      const remainder = totalSpace - totalUsed;

      if (remainder < 0) continue;

      let priority = 99;

      // 우선순위 1: 4-10mm 잔여
      if (remainder >= MIN_REMAINDER && remainder <= MAX_REMAINDER) {
        priority = 1;
      }
      // 우선순위 2: 0-4mm 잔여
      else if (remainder >= 0 && remainder < MIN_REMAINDER) {
        priority = 2;
      }
      // 우선순위 3: 10의 단위
      else if (w % 10 === 0) {
        priority = 3;
      }
      // 우선순위 4: 짝수
      else if (w % 2 === 0) {
        priority = 4;
      }

      // 더 좋은 우선순위 또는 같은 우선순위에서 더 작은 잔여
      if (priority < bestPriority || (priority === bestPriority && remainder < bestRemainder)) {
        bestWidth = w;
        bestRemainder = remainder;
        bestPriority = priority;
      }
    }

    return {
      doorWidth: bestWidth,
      remainder: bestRemainder,
      priority: bestPriority
    };
  }

  /**
   * 균등 분배 계산
   */
  distributeModules(totalSpace) {
    const { DOOR_TARGET_WIDTH, DOOR_MIN_WIDTH, DOOR_MAX_WIDTH } = this.constants;

    // 목표 도어 개수 계산
    let doorCount = Math.round(totalSpace / DOOR_TARGET_WIDTH);
    if (doorCount < 1) doorCount = 1;

    // 최적 도어 너비 계산
    let doorWidth = Math.floor(totalSpace / doorCount);

    // 제약 조건 확인 및 조정
    if (doorWidth > DOOR_MAX_WIDTH) {
      doorCount++;
      doorWidth = Math.floor(totalSpace / doorCount);
    }
    if (doorWidth < DOOR_MIN_WIDTH && doorCount > 1) {
      doorCount--;
      doorWidth = Math.floor(totalSpace / doorCount);
    }

    const remainder = totalSpace - (doorWidth * doorCount);

    return {
      doorCount,
      doorWidth,
      remainder
    };
  }
}

// ============================================================
// 서브스킬 2: 상부장 자동 계산
// ============================================================
class UpperCabinetCalculator {
  constructor(constants = SinkDesignConstants) {
    this.constants = constants;
    this.doorOptimizer = new DoorWidthOptimizer(constants);
  }

  /**
   * 상부장 자동 계산 실행
   */
  calculate(item, options = {}) {
    const {
      effectiveWidth,
      startBound,
      endBound,
      sinkCenter,
      ventPosition,
      upperBodyHeight
    } = options;

    const { HOOD_WIDTH, HOOD_TOLERANCE, BASE_TOLERANCE, UPPER_DEPTH } = this.constants;

    // 후드 초기 위치 (환풍구 중앙 정렬)
    let hoodXInit = Math.max(startBound, Math.min(ventPosition - HOOD_WIDTH / 2, endBound - HOOD_WIDTH));

    // 후드 제외 공간에서 임시 도어 너비 계산
    const totalSpaceExcludeHood = effectiveWidth - HOOD_WIDTH;
    const tempResult = this.doorOptimizer.distributeModules(totalSpaceExcludeHood);
    const tempDoorWidth = tempResult.doorWidth;

    // 기준 상부장 임시 너비 (2D)
    const tempBaseUpperW = tempDoorWidth * 2;

    // 기준 상부장 초기 위치 (개수대 중앙 정렬)
    let baseUpperXInit = sinkCenter - (tempBaseUpperW / 2);
    baseUpperXInit = Math.max(startBound, Math.min(baseUpperXInit, endBound - tempBaseUpperW));

    // 최적 위치 탐색
    const result = this._findOptimalPositions({
      hoodXInit,
      baseUpperXInit,
      tempDoorWidth,
      tempBaseUpperW,
      totalSpaceExcludeHood,
      startBound,
      endBound,
      sinkCenter
    });

    return {
      hoodX: result.hoodX,
      hoodWidth: HOOD_WIDTH,
      baseUpperX: result.baseUpperX,
      baseUpperWidth: result.doorWidth * 2,
      doorWidth: result.doorWidth,
      remainder: result.remainder,
      modules: this._generateModules(result, upperBodyHeight, UPPER_DEPTH)
    };
  }

  _findOptimalPositions(params) {
    const { HOOD_WIDTH, HOOD_TOLERANCE, BASE_TOLERANCE, MAX_REMAINDER } = this.constants;
    const { hoodXInit, baseUpperXInit, tempDoorWidth, tempBaseUpperW, totalSpaceExcludeHood, startBound, endBound, sinkCenter } = params;

    let bestResult = {
      hoodX: hoodXInit,
      baseUpperX: baseUpperXInit,
      doorWidth: tempDoorWidth,
      remainder: Infinity
    };

    // 이중 루프로 최적 위치 탐색
    for (let hoodOffset = -HOOD_TOLERANCE; hoodOffset <= HOOD_TOLERANCE; hoodOffset++) {
      const testHoodX = hoodXInit + hoodOffset;
      if (testHoodX < startBound || testHoodX + HOOD_WIDTH > endBound) continue;

      for (let baseOffset = -BASE_TOLERANCE; baseOffset <= BASE_TOLERANCE; baseOffset++) {
        const testBaseX = baseUpperXInit + baseOffset;
        if (testBaseX < startBound || testBaseX + tempBaseUpperW > endBound) continue;

        // 겹침 체크
        if (testBaseX < testHoodX + HOOD_WIDTH && testBaseX + tempBaseUpperW > testHoodX) continue;

        // 도어 개수 및 잔여 계산
        const doorCount = this._calculateDoorCount(testHoodX, testBaseX, tempBaseUpperW, HOOD_WIDTH, startBound, endBound, tempDoorWidth);
        if (doorCount < 2) continue;

        const testDoorWidth = Math.floor(totalSpaceExcludeHood / doorCount);
        if (testDoorWidth < this.constants.DOOR_MIN_WIDTH || testDoorWidth > this.constants.DOOR_MAX_WIDTH) continue;

        const remainder = totalSpaceExcludeHood - (testDoorWidth * doorCount);

        if (remainder >= 0 && remainder <= MAX_REMAINDER && remainder < bestResult.remainder) {
          bestResult = {
            hoodX: testHoodX,
            baseUpperX: sinkCenter - (testDoorWidth * 2 / 2) + baseOffset,
            doorWidth: testDoorWidth,
            remainder
          };
        }
      }
    }

    return bestResult;
  }

  _calculateDoorCount(hoodX, baseX, baseW, hoodW, startBound, endBound, tempDoorWidth) {
    const fixedModules = [
      { x: hoodX, endX: hoodX + hoodW },
      { x: baseX, endX: baseX + baseW }
    ].sort((a, b) => a.x - b.x);

    let doorCount = 2; // 기준상부장 = 2D

    // 시작 공간
    if (fixedModules[0].x > startBound + 50) {
      doorCount += Math.max(1, Math.round((fixedModules[0].x - startBound) / tempDoorWidth));
    }
    // 중간 공간
    if (fixedModules[1].x > fixedModules[0].endX + 50) {
      doorCount += Math.max(1, Math.round((fixedModules[1].x - fixedModules[0].endX) / tempDoorWidth));
    }
    // 끝 공간
    if (endBound > fixedModules[1].endX + 50) {
      doorCount += Math.max(1, Math.round((endBound - fixedModules[1].endX) / tempDoorWidth));
    }

    return doorCount;
  }

  _generateModules(result, height, depth) {
    return [
      {
        type: 'hood',
        name: '후드장',
        x: result.hoodX,
        w: this.constants.HOOD_WIDTH,
        h: height - 40,
        d: depth,
        isFixed: true
      },
      {
        type: 'storage',
        name: '기준상부장(2D)',
        x: result.baseUpperX,
        w: result.doorWidth * 2,
        h: height,
        d: depth,
        isFixed: true,
        isBase: true
      }
    ];
  }
}

// ============================================================
// 서브스킬 3: 하부장 자동 계산
// ============================================================
class LowerCabinetCalculator {
  constructor(constants = SinkDesignConstants) {
    this.constants = constants;
    this.doorOptimizer = new DoorWidthOptimizer(constants);
  }

  /**
   * 하부장 자동 계산 실행
   */
  calculate(item, options = {}) {
    const {
      effectiveWidth,
      startBound,
      endBound,
      distributorStart,
      distributorEnd,
      ventPosition,
      lowerBodyHeight,
      isRefLeft
    } = options;

    const { SINK_WIDTH, COOK_WIDTH, LT_MESH_WIDTH, LOWER_DEPTH } = this.constants;

    // 개수대 위치 계산
    let sinkX = this._calculateSinkPosition(distributorStart, distributorEnd, SINK_WIDTH);

    // 가스대 위치 (환풍구 중앙 정렬)
    const cookX = ventPosition - COOK_WIDTH / 2;

    // LT망장 위치
    let ltX = null;
    if (item.specs?.accessories?.some(a => a.type === 'LTMesh')) {
      ltX = isRefLeft ? cookX + COOK_WIDTH : cookX - LT_MESH_WIDTH;
    }

    // 고정 모듈 배열
    const fixedModules = this._buildFixedModules({
      sinkX,
      sinkWidth: SINK_WIDTH,
      cookX,
      cookWidth: COOK_WIDTH,
      ltX,
      ltWidth: LT_MESH_WIDTH,
      height: lowerBodyHeight,
      depth: LOWER_DEPTH
    });

    // 나머지 공간 균등 분배
    const gaps = this._calculateGaps(fixedModules, startBound, endBound);
    const fillerModules = this._fillGaps(gaps, lowerBodyHeight, LOWER_DEPTH);

    return {
      fixedModules,
      fillerModules,
      allModules: [...fixedModules, ...fillerModules].sort((a, b) => a.x - b.x)
    };
  }

  _calculateSinkPosition(distStart, distEnd, sinkWidth) {
    // 기본 위치: 분배기 시작 - 100
    let sinkX = distStart - 100;

    // 조건 검증
    // 조건1: 개수대시작 < 분배기시작
    if (sinkX >= distStart) {
      sinkX = distStart - 100;
    }
    // 조건2: 개수대끝 > 분배기끝
    if (sinkX + sinkWidth <= distEnd) {
      sinkX = distEnd - sinkWidth + 100;
    }

    return sinkX;
  }

  _buildFixedModules(params) {
    const modules = [];

    // 개수대
    modules.push({
      type: 'sink',
      name: '개수대(싱크볼)',
      x: params.sinkX,
      w: params.sinkWidth,
      h: params.height,
      d: params.depth,
      isFixed: true
    });

    // 가스대
    modules.push({
      type: 'cook',
      name: '가스대(쿡탑)',
      x: params.cookX,
      w: params.cookWidth,
      h: params.height,
      d: params.depth,
      isFixed: true
    });

    // LT망장
    if (params.ltX !== null) {
      modules.push({
        type: 'ltmesh',
        name: 'LT망장',
        x: params.ltX,
        w: params.ltWidth,
        h: params.height,
        d: params.depth,
        isFixed: true
      });
    }

    return modules.sort((a, b) => a.x - b.x);
  }

  _calculateGaps(fixedModules, startBound, endBound) {
    const gaps = [];
    let currentX = startBound;

    fixedModules.forEach(mod => {
      if (mod.x > currentX) {
        gaps.push({ start: currentX, end: mod.x, width: mod.x - currentX });
      }
      currentX = mod.x + mod.w;
    });

    if (currentX < endBound) {
      gaps.push({ start: currentX, end: endBound, width: endBound - currentX });
    }

    return gaps;
  }

  _fillGaps(gaps, height, depth) {
    const modules = [];

    gaps.forEach(gap => {
      if (gap.width < 50) return; // 너무 작은 공간은 무시

      const result = this.doorOptimizer.distributeModules(gap.width);
      let currentX = gap.start;

      for (let i = 0; i < result.doorCount; i++) {
        modules.push({
          type: 'storage',
          name: `하부장`,
          x: currentX,
          w: result.doorWidth,
          h: height,
          d: depth,
          isFixed: false
        });
        currentX += result.doorWidth;
      }
    });

    return modules;
  }
}

// ============================================================
// 메인 클래스: 싱크대 설계 스킬
// ============================================================
class SinkDesignSkill {
  constructor() {
    this.constants = SinkDesignConstants;
    this.doorOptimizer = new DoorWidthOptimizer();
    this.upperCalculator = new UpperCabinetCalculator();
    this.lowerCalculator = new LowerCabinetCalculator();
  }

  /**
   * 전체 싱크대 설계 실행
   */
  design(item) {
    const results = {
      upper: null,
      lower: null,
      summary: {}
    };

    // 상부장 계산
    if (item.specs?.upperH) {
      results.upper = this.calculateUpper(item);
    }

    // 하부장 계산
    if (item.specs?.lowerH) {
      results.lower = this.calculateLower(item);
    }

    // 요약 생성
    results.summary = this._generateSummary(results);

    return results;
  }

  calculateUpper(item) {
    const W = parseFloat(item.w) || 0;
    const specs = item.specs || {};

    return this.upperCalculator.calculate(item, {
      effectiveWidth: this._getEffectiveSpace(item, 'upper'),
      startBound: this._getStartBound(specs, 'upper'),
      endBound: this._getEndBound(item, 'upper'),
      sinkCenter: this._getSinkCenter(item),
      ventPosition: this._getVentPosition(item),
      upperBodyHeight: (parseFloat(specs.upperH) || 720) - 20
    });
  }

  calculateLower(item) {
    const specs = item.specs || {};

    return this.lowerCalculator.calculate(item, {
      effectiveWidth: this._getEffectiveSpace(item, 'lower'),
      startBound: this._getStartBound(specs, 'lower'),
      endBound: this._getEndBound(item, 'lower'),
      distributorStart: parseFloat(specs.distributorStart) || 0,
      distributorEnd: parseFloat(specs.distributorEnd) || 0,
      ventPosition: this._getVentPosition(item),
      lowerBodyHeight: (parseFloat(specs.lowerH) || 870) - (parseFloat(specs.sinkLegHeight) || 150),
      isRefLeft: specs.measurementBase === 'Left'
    });
  }

  _getEffectiveSpace(item, section) {
    const W = parseFloat(item.w) || 0;
    const specs = item.specs || {};
    const fL = specs.finishLeftType !== 'None' ? (parseFloat(specs.finishLeftWidth) || 0) : 0;
    const fR = specs.finishRightType !== 'None' ? (parseFloat(specs.finishRightWidth) || 0) : 0;
    return W - fL - fR;
  }

  _getStartBound(specs, section) {
    return specs.finishLeftType !== 'None' ? (parseFloat(specs.finishLeftWidth) || 0) : 0;
  }

  _getEndBound(item, section) {
    return this._getStartBound(item.specs, section) + this._getEffectiveSpace(item, section);
  }

  _getSinkCenter(item) {
    const W = parseFloat(item.w) || 0;
    const specs = item.specs || {};
    const isRefLeft = specs.measurementBase === 'Left';
    const distStart = isRefLeft ? (parseFloat(specs.distributorStart) || 0) : W - (parseFloat(specs.distributorStart) || 0);
    return distStart - 100 + 500; // 개수대 시작 + 개수대 너비/2
  }

  _getVentPosition(item) {
    const W = parseFloat(item.w) || 0;
    const specs = item.specs || {};
    const isRefLeft = specs.measurementBase === 'Left';
    return isRefLeft ? (parseFloat(specs.ventStart) || 0) : W - (parseFloat(specs.ventStart) || 0);
  }

  _generateSummary(results) {
    return {
      upperModuleCount: results.upper?.modules?.length || 0,
      lowerModuleCount: results.lower?.allModules?.length || 0,
      doorWidth: results.upper?.doorWidth || results.lower?.fillerModules?.[0]?.w || 0,
      totalRemainder: (results.upper?.remainder || 0) + (results.lower?.remainder || 0)
    };
  }
}

// ============================================================
// Export
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SinkDesignSkill,
    SinkDesignConstants,
    DoorWidthOptimizer,
    UpperCabinetCalculator,
    LowerCabinetCalculator
  };
}

// 전역 노출 (브라우저 환경)
if (typeof window !== 'undefined') {
  window.SinkDesignSkill = SinkDesignSkill;
  window.SinkDesignConstants = SinkDesignConstants;
}
