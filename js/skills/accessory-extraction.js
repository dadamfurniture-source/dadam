/**
 * 부자재 추출 서브스킬 모듈
 * 다담 캐비넷 에이전트 v32.1
 *
 * 주요 기능:
 * - 모듈 구성 및 옵션에 따른 부자재 추출
 * - 정돈된 표 형식 엑셀 파일 출력
 * - 품목, 제조사, 스펙(크기), 수량 등 표 구성
 * - 데이터베이스화 및 학습 피드백
 *
 * 부자재 카테고리:
 * - 경첩류, 레일류, 손잡이, 다리/받침, 조명, 연결부품, 기타
 */

// ============================================================
// 상수 정의
// ============================================================
const AccessoryConstants = {
  // 부자재 카테고리
  CATEGORIES: {
    HINGE: { id: 'hinge', name: '경첩류' },
    RAIL: { id: 'rail', name: '레일류' },
    HANDLE: { id: 'handle', name: '손잡이' },
    LEG: { id: 'leg', name: '다리/받침' },
    LIGHTING: { id: 'lighting', name: '조명' },
    CONNECTOR: { id: 'connector', name: '연결부품' },
    DAMPER: { id: 'damper', name: '댐퍼' },
    SUPPORT: { id: 'support', name: '지지대' },
    MISC: { id: 'misc', name: '기타' }
  },

  // 제조사
  MANUFACTURERS: {
    BLUM: { id: 'blum', name: 'Blum', country: '오스트리아' },
    HETTICH: { id: 'hettich', name: 'Hettich', country: '독일' },
    HAFELE: { id: 'hafele', name: 'Hafele', country: '독일' },
    GRASS: { id: 'grass', name: 'Grass', country: '오스트리아' },
    SALICE: { id: 'salice', name: 'Salice', country: '이탈리아' },
    DTC: { id: 'dtc', name: 'DTC', country: '중국' },
    KING_SLIDE: { id: 'kingslide', name: 'King Slide', country: '대만' },
    DOMESTIC: { id: 'domestic', name: '국산', country: '한국' }
  }
};

// ============================================================
// 부자재 데이터베이스 (기본 부자재 정보)
// ============================================================
const ACCESSORY_CATALOG = {
  // 경첩류
  hinges: [
    {
      id: 'blum_clip_top',
      name: 'CLIP top 110도 경첩',
      manufacturer: 'blum',
      category: 'hinge',
      spec: '110도 풀오버레이',
      unit: 'EA',
      defaultQty: 2,
      forTypes: ['upper', 'lower', 'tall'],
      options: { softClose: true }
    },
    {
      id: 'blum_clip_top_155',
      name: 'CLIP top 155도 경첩',
      manufacturer: 'blum',
      category: 'hinge',
      spec: '155도 광각',
      unit: 'EA',
      defaultQty: 2,
      forTypes: ['corner'],
      options: { softClose: true }
    },
    {
      id: 'blum_aventos_hf',
      name: 'AVENTOS HF 리프트업',
      manufacturer: 'blum',
      category: 'hinge',
      spec: '리프트업 시스템',
      unit: 'SET',
      defaultQty: 1,
      forTypes: ['upper'],
      options: { liftUp: true }
    },
    {
      id: 'blum_aventos_hk',
      name: 'AVENTOS HK-XS 리프트업',
      manufacturer: 'blum',
      category: 'hinge',
      spec: '소형 리프트업',
      unit: 'SET',
      defaultQty: 1,
      forTypes: ['upper', 'el'],
      options: { liftUp: true }
    },
    {
      id: 'hettich_sensys',
      name: 'Sensys 110도 경첩',
      manufacturer: 'hettich',
      category: 'hinge',
      spec: '110도 풀오버레이',
      unit: 'EA',
      defaultQty: 2,
      forTypes: ['upper', 'lower', 'tall'],
      options: { softClose: true }
    }
  ],

  // 레일류
  rails: [
    {
      id: 'blum_tandembox',
      name: 'TANDEMBOX antaro 서랍레일',
      manufacturer: 'blum',
      category: 'rail',
      spec: '풀익스텐션 30kg',
      unit: 'SET',
      defaultQty: 1,
      forTypes: ['drawer'],
      options: { softClose: true, fullExtension: true }
    },
    {
      id: 'blum_tandembox_50',
      name: 'TANDEMBOX antaro 50kg',
      manufacturer: 'blum',
      category: 'rail',
      spec: '풀익스텐션 50kg',
      unit: 'SET',
      defaultQty: 1,
      forTypes: ['drawer_heavy'],
      options: { softClose: true, fullExtension: true }
    },
    {
      id: 'blum_legrabox',
      name: 'LEGRABOX 서랍레일',
      manufacturer: 'blum',
      category: 'rail',
      spec: '프리미엄 40kg',
      unit: 'SET',
      defaultQty: 1,
      forTypes: ['drawer'],
      options: { softClose: true, fullExtension: true, premium: true }
    },
    {
      id: 'hettich_actro',
      name: 'Actro 5D 서랍레일',
      manufacturer: 'hettich',
      category: 'rail',
      spec: '풀익스텐션 40kg',
      unit: 'SET',
      defaultQty: 1,
      forTypes: ['drawer'],
      options: { softClose: true, fullExtension: true }
    },
    {
      id: 'kingslide_ball',
      name: 'King Slide 볼베어링 레일',
      manufacturer: 'kingslide',
      category: 'rail',
      spec: '풀익스텐션 35kg',
      unit: 'SET',
      defaultQty: 1,
      forTypes: ['drawer'],
      options: { softClose: false, fullExtension: true }
    },
    {
      id: 'dtc_ball_rail',
      name: 'DTC 볼베어링 레일',
      manufacturer: 'dtc',
      category: 'rail',
      spec: '풀익스텐션 30kg',
      unit: 'SET',
      defaultQty: 1,
      forTypes: ['drawer'],
      options: { softClose: false, fullExtension: true }
    }
  ],

  // 손잡이
  handles: [
    {
      id: 'handle_bar_128',
      name: '바 손잡이 128mm',
      manufacturer: 'domestic',
      category: 'handle',
      spec: 'CC 128mm',
      unit: 'EA',
      defaultQty: 1,
      forTypes: ['door', 'drawer'],
      options: { material: 'aluminum' }
    },
    {
      id: 'handle_bar_160',
      name: '바 손잡이 160mm',
      manufacturer: 'domestic',
      category: 'handle',
      spec: 'CC 160mm',
      unit: 'EA',
      defaultQty: 1,
      forTypes: ['door', 'drawer'],
      options: { material: 'aluminum' }
    },
    {
      id: 'handle_bar_192',
      name: '바 손잡이 192mm',
      manufacturer: 'domestic',
      category: 'handle',
      spec: 'CC 192mm',
      unit: 'EA',
      defaultQty: 1,
      forTypes: ['door', 'drawer'],
      options: { material: 'aluminum' }
    },
    {
      id: 'handle_gola',
      name: '고라 손잡이 (G형)',
      manufacturer: 'hafele',
      category: 'handle',
      spec: 'G형 프로파일',
      unit: 'M',
      defaultQty: 1,
      forTypes: ['upper'],
      options: { integrated: true }
    },
    {
      id: 'handle_j',
      name: 'J형 손잡이',
      manufacturer: 'domestic',
      category: 'handle',
      spec: 'J형 프로파일',
      unit: 'M',
      defaultQty: 1,
      forTypes: ['upper', 'lower'],
      options: { integrated: true }
    },
    {
      id: 'handle_push',
      name: '푸쉬 오픈 손잡이',
      manufacturer: 'blum',
      category: 'handle',
      spec: 'TIP-ON',
      unit: 'EA',
      defaultQty: 1,
      forTypes: ['door', 'drawer'],
      options: { pushOpen: true }
    }
  ],

  // 다리/받침
  legs: [
    {
      id: 'leg_plastic_100',
      name: '플라스틱 다리 100mm',
      manufacturer: 'domestic',
      category: 'leg',
      spec: 'H100mm 조절형',
      unit: 'EA',
      defaultQty: 4,
      forTypes: ['lower', 'tall'],
      options: { adjustable: true }
    },
    {
      id: 'leg_plastic_150',
      name: '플라스틱 다리 150mm',
      manufacturer: 'domestic',
      category: 'leg',
      spec: 'H150mm 조절형',
      unit: 'EA',
      defaultQty: 4,
      forTypes: ['lower', 'tall'],
      options: { adjustable: true }
    },
    {
      id: 'leg_metal_100',
      name: '메탈 다리 100mm',
      manufacturer: 'hafele',
      category: 'leg',
      spec: 'H100mm 스틸',
      unit: 'EA',
      defaultQty: 4,
      forTypes: ['lower', 'tall'],
      options: { adjustable: true, material: 'steel' }
    },
    {
      id: 'pedestal_60',
      name: '좌대 60mm',
      manufacturer: 'domestic',
      category: 'leg',
      spec: 'H60mm',
      unit: 'M',
      defaultQty: 1,
      forTypes: ['tall', 'fridge'],
      options: { type: 'pedestal' }
    }
  ],

  // 조명
  lighting: [
    {
      id: 'led_strip',
      name: 'LED 스트립',
      manufacturer: 'hafele',
      category: 'lighting',
      spec: '12V 4W/m',
      unit: 'M',
      defaultQty: 1,
      forTypes: ['upper', 'display'],
      options: { voltage: 12, wattage: 4 }
    },
    {
      id: 'led_spot',
      name: 'LED 스팟 조명',
      manufacturer: 'hafele',
      category: 'lighting',
      spec: '12V 3W',
      unit: 'EA',
      defaultQty: 1,
      forTypes: ['upper', 'display'],
      options: { voltage: 12, wattage: 3 }
    },
    {
      id: 'led_sensor',
      name: 'LED 센서등',
      manufacturer: 'domestic',
      category: 'lighting',
      spec: '건전지형',
      unit: 'EA',
      defaultQty: 1,
      forTypes: ['wardrobe', 'storage'],
      options: { sensor: true }
    },
    {
      id: 'led_driver',
      name: 'LED 드라이버',
      manufacturer: 'domestic',
      category: 'lighting',
      spec: '12V 30W',
      unit: 'EA',
      defaultQty: 1,
      forTypes: ['all'],
      options: { voltage: 12, wattage: 30 }
    }
  ],

  // 연결부품
  connectors: [
    {
      id: 'cam_lock',
      name: '캠록 볼트',
      manufacturer: 'domestic',
      category: 'connector',
      spec: 'D15mm',
      unit: 'EA',
      defaultQty: 4,
      forTypes: ['all'],
      options: {}
    },
    {
      id: 'dowel_8',
      name: '목심 8mm',
      manufacturer: 'domestic',
      category: 'connector',
      spec: 'D8 x 35mm',
      unit: 'EA',
      defaultQty: 8,
      forTypes: ['all'],
      options: {}
    },
    {
      id: 'shelf_pin',
      name: '선반핀 5mm',
      manufacturer: 'domestic',
      category: 'connector',
      spec: 'D5mm',
      unit: 'EA',
      defaultQty: 4,
      forTypes: ['shelf'],
      options: {}
    },
    {
      id: 'angle_bracket',
      name: '앵글 브라켓',
      manufacturer: 'domestic',
      category: 'connector',
      spec: '40x40mm',
      unit: 'EA',
      defaultQty: 4,
      forTypes: ['wall_mount'],
      options: {}
    },
    {
      id: 'wall_rail',
      name: '벽면 레일',
      manufacturer: 'hafele',
      category: 'connector',
      spec: '상부장 거치용',
      unit: 'M',
      defaultQty: 1,
      forTypes: ['upper'],
      options: { wallMount: true }
    },
    {
      id: 'connector_bolt',
      name: '연결 볼트',
      manufacturer: 'domestic',
      category: 'connector',
      spec: 'M6 x 50mm',
      unit: 'EA',
      defaultQty: 2,
      forTypes: ['connection'],
      options: {}
    }
  ],

  // 댐퍼
  dampers: [
    {
      id: 'soft_close_hinge',
      name: '소프트클로즈 댐퍼 (경첩용)',
      manufacturer: 'blum',
      category: 'damper',
      spec: 'BLUMOTION',
      unit: 'EA',
      defaultQty: 2,
      forTypes: ['door'],
      options: { forHinge: true }
    },
    {
      id: 'soft_close_drawer',
      name: '소프트클로즈 댐퍼 (서랍용)',
      manufacturer: 'blum',
      category: 'damper',
      spec: 'BLUMOTION',
      unit: 'EA',
      defaultQty: 1,
      forTypes: ['drawer'],
      options: { forDrawer: true }
    },
    {
      id: 'door_damper',
      name: '도어 댐퍼',
      manufacturer: 'domestic',
      category: 'damper',
      spec: '범용',
      unit: 'EA',
      defaultQty: 2,
      forTypes: ['door'],
      options: {}
    }
  ],

  // 지지대
  supports: [
    {
      id: 'gas_spring',
      name: '가스 스프링',
      manufacturer: 'domestic',
      category: 'support',
      spec: '80N',
      unit: 'EA',
      defaultQty: 2,
      forTypes: ['liftup'],
      options: { force: 80 }
    },
    {
      id: 'flap_stay',
      name: '플랩 스테이',
      manufacturer: 'hafele',
      category: 'support',
      spec: '다목적 스테이',
      unit: 'EA',
      defaultQty: 2,
      forTypes: ['flap'],
      options: {}
    },
    {
      id: 'shelf_support',
      name: '선반 지지대',
      manufacturer: 'domestic',
      category: 'support',
      spec: 'L형',
      unit: 'EA',
      defaultQty: 4,
      forTypes: ['shelf'],
      options: {}
    },
    {
      id: 'hanging_rail',
      name: '옷걸이 봉',
      manufacturer: 'domestic',
      category: 'support',
      spec: 'D25mm 스틸',
      unit: 'M',
      defaultQty: 1,
      forTypes: ['wardrobe'],
      options: { diameter: 25 }
    },
    {
      id: 'hanging_bracket',
      name: '옷걸이 브라켓',
      manufacturer: 'domestic',
      category: 'support',
      spec: 'D25mm용',
      unit: 'EA',
      defaultQty: 2,
      forTypes: ['wardrobe'],
      options: {}
    }
  ],

  // 기타
  misc: [
    {
      id: 'kick_plate',
      name: '걸레받이',
      manufacturer: 'domestic',
      category: 'misc',
      spec: 'PVC H100mm',
      unit: 'M',
      defaultQty: 1,
      forTypes: ['lower'],
      options: {}
    },
    {
      id: 'end_panel',
      name: '마감패널',
      manufacturer: 'domestic',
      category: 'misc',
      spec: '18T 측면마감',
      unit: 'EA',
      defaultQty: 1,
      forTypes: ['end'],
      options: {}
    },
    {
      id: 'filler_strip',
      name: '필러',
      manufacturer: 'domestic',
      category: 'misc',
      spec: '18T 틈새마감',
      unit: 'EA',
      defaultQty: 1,
      forTypes: ['filler'],
      options: {}
    },
    {
      id: 'countertop_bracket',
      name: '상판 브라켓',
      manufacturer: 'domestic',
      category: 'misc',
      spec: '스틸',
      unit: 'EA',
      defaultQty: 4,
      forTypes: ['countertop'],
      options: {}
    },
    {
      id: 'sealing_strip',
      name: '실링 스트립',
      manufacturer: 'domestic',
      category: 'misc',
      spec: '실리콘',
      unit: 'M',
      defaultQty: 1,
      forTypes: ['sink', 'countertop'],
      options: {}
    }
  ]
};

// ============================================================
// 부자재 추출기 클래스
// ============================================================
class AccessoryExtractor {
  constructor(catalog = ACCESSORY_CATALOG) {
    this.catalog = catalog;
    this.accessories = [];
    this.extractionHistory = [];
  }

  /**
   * 설계 데이터에서 부자재 추출
   */
  extractFromDesign(designData) {
    this.accessories = [];
    const { modules, specs, category, options } = designData;

    if (!modules || !Array.isArray(modules)) {
      return { success: false, error: '모듈 데이터가 없습니다.' };
    }

    // 각 모듈별 부자재 추출
    modules.forEach((module, idx) => {
      const parts = this._extractModuleAccessories(module, specs, options, idx);
      this.accessories.push(...parts);
    });

    // 공통 부자재 추가
    this._addCommonAccessories(designData);

    // 수량 합산
    this._consolidateAccessories();

    // 추출 이력 저장
    this._saveExtractionHistory(designData);

    return {
      success: true,
      accessories: this.accessories,
      count: this.accessories.length,
      summary: this._generateSummary()
    };
  }

  /**
   * 모듈별 부자재 추출
   */
  _extractModuleAccessories(module, specs, options, moduleIndex) {
    const accessories = [];
    const moduleType = module.type;
    const hasSoftClose = options?.softClose !== false;
    const handleType = options?.handleType || 'bar';

    // 1. 경첩 추출
    accessories.push(...this._extractHinges(module, hasSoftClose, moduleIndex));

    // 2. 서랍레일 추출
    if (module.hasDrawer || moduleType === 'drawer') {
      accessories.push(...this._extractDrawerRails(module, hasSoftClose, moduleIndex));
    }

    // 3. 손잡이 추출
    accessories.push(...this._extractHandles(module, handleType, moduleIndex));

    // 4. 다리/받침 추출
    if (['lower', 'tall', 'fridge'].includes(moduleType)) {
      accessories.push(...this._extractLegs(module, specs, moduleIndex));
    }

    // 5. 특수 부자재 (리프트업, 플랩 등)
    if (module.doorType) {
      accessories.push(...this._extractSpecialAccessories(module, moduleIndex));
    }

    // 6. 연결 부품
    accessories.push(...this._extractConnectors(module, moduleIndex));

    // 7. 조명 (옵션)
    if (module.hasLighting || options?.includeLighting) {
      accessories.push(...this._extractLighting(module, moduleIndex));
    }

    return accessories;
  }

  /**
   * 경첩 추출
   */
  _extractHinges(module, hasSoftClose, moduleIndex) {
    const accessories = [];
    const doorCount = module.doorCount || (module.is2D ? 2 : 1);
    const height = module.h || 720;

    // 높이에 따른 경첩 수 결정
    let hingesPerDoor = 2;
    if (height > 1200) hingesPerDoor = 3;
    if (height > 1800) hingesPerDoor = 4;

    if (['upper', 'lower', 'tall', 'storage'].includes(module.type)) {
      const hingeItem = this.catalog.hinges.find(h => h.id === 'blum_clip_top');
      if (hingeItem) {
        accessories.push(this._createAccessoryItem(hingeItem, {
          quantity: doorCount * hingesPerDoor,
          moduleIndex,
          note: `도어 ${doorCount}개 x ${hingesPerDoor}개`
        }));
      }

      // 소프트클로즈 댐퍼 (별도인 경우)
      if (hasSoftClose && !hingeItem?.options?.softClose) {
        const damper = this.catalog.dampers.find(d => d.id === 'soft_close_hinge');
        if (damper) {
          accessories.push(this._createAccessoryItem(damper, {
            quantity: doorCount * hingesPerDoor,
            moduleIndex
          }));
        }
      }
    }

    return accessories;
  }

  /**
   * 서랍레일 추출
   */
  _extractDrawerRails(module, hasSoftClose, moduleIndex) {
    const accessories = [];
    const drawerCount = module.drawerCount || 3;
    const depth = module.d || 500;

    // 레일 길이 결정 (300, 350, 400, 450, 500, 550)
    const railLength = Math.min(550, Math.floor((depth - 50) / 50) * 50);

    const railItem = hasSoftClose
      ? this.catalog.rails.find(r => r.id === 'blum_tandembox')
      : this.catalog.rails.find(r => r.id === 'kingslide_ball');

    if (railItem) {
      accessories.push(this._createAccessoryItem(railItem, {
        quantity: drawerCount,
        moduleIndex,
        spec: `${railItem.spec} ${railLength}mm`,
        note: `서랍 ${drawerCount}단`
      }));
    }

    return accessories;
  }

  /**
   * 손잡이 추출
   */
  _extractHandles(module, handleType, moduleIndex) {
    const accessories = [];
    const doorCount = module.doorCount || 1;
    const drawerCount = module.drawerCount || 0;

    if (handleType === 'push') {
      // 푸쉬오픈
      const pushHandle = this.catalog.handles.find(h => h.id === 'handle_push');
      if (pushHandle) {
        accessories.push(this._createAccessoryItem(pushHandle, {
          quantity: doorCount + drawerCount,
          moduleIndex
        }));
      }
    } else if (handleType === 'gola' || handleType === 'j') {
      // 일체형 손잡이
      const integratedHandle = this.catalog.handles.find(h =>
        h.id === (handleType === 'gola' ? 'handle_gola' : 'handle_j')
      );
      if (integratedHandle) {
        const width = (module.w || 600) / 1000; // 미터로 변환
        accessories.push(this._createAccessoryItem(integratedHandle, {
          quantity: Math.ceil(width * doorCount * 10) / 10,
          moduleIndex,
          note: `${(module.w || 600)}mm x ${doorCount}개`
        }));
      }
    } else {
      // 바 손잡이
      const barHandle = this.catalog.handles.find(h => h.id === 'handle_bar_128');
      if (barHandle) {
        accessories.push(this._createAccessoryItem(barHandle, {
          quantity: doorCount + drawerCount,
          moduleIndex
        }));
      }
    }

    return accessories;
  }

  /**
   * 다리/받침 추출
   */
  _extractLegs(module, specs, moduleIndex) {
    const accessories = [];
    const width = module.w || 600;
    const pedestalHeight = specs?.pedestalHeight || 60;

    if (pedestalHeight >= 100) {
      // 다리 사용
      const legCount = Math.max(4, Math.ceil(width / 400) * 2);
      const legItem = this.catalog.legs.find(l => l.id === 'leg_plastic_100');
      if (legItem) {
        accessories.push(this._createAccessoryItem(legItem, {
          quantity: legCount,
          moduleIndex
        }));
      }
    } else if (pedestalHeight > 0) {
      // 좌대 사용
      const pedestalItem = this.catalog.legs.find(l => l.id === 'pedestal_60');
      if (pedestalItem) {
        accessories.push(this._createAccessoryItem(pedestalItem, {
          quantity: Math.ceil(width / 1000 * 10) / 10,
          moduleIndex,
          note: `${width}mm`
        }));
      }
    }

    return accessories;
  }

  /**
   * 특수 부자재 추출 (리프트업, 플랩 등)
   */
  _extractSpecialAccessories(module, moduleIndex) {
    const accessories = [];
    const doorType = module.doorType;

    switch (doorType) {
      case 'liftup':
        const liftup = this.catalog.hinges.find(h => h.id === 'blum_aventos_hf');
        if (liftup) {
          accessories.push(this._createAccessoryItem(liftup, {
            quantity: 1,
            moduleIndex
          }));
        }
        break;

      case 'flap':
        const gasSpring = this.catalog.supports.find(s => s.id === 'gas_spring');
        if (gasSpring) {
          accessories.push(this._createAccessoryItem(gasSpring, {
            quantity: 2,
            moduleIndex
          }));
        }
        break;

      case 'pocket':
        const flapStay = this.catalog.supports.find(s => s.id === 'flap_stay');
        if (flapStay) {
          accessories.push(this._createAccessoryItem(flapStay, {
            quantity: 2,
            moduleIndex
          }));
        }
        break;
    }

    return accessories;
  }

  /**
   * 연결부품 추출
   */
  _extractConnectors(module, moduleIndex) {
    const accessories = [];
    const width = module.w || 600;
    const height = module.h || 720;

    // 캠록 볼트
    const camLock = this.catalog.connectors.find(c => c.id === 'cam_lock');
    if (camLock) {
      const qty = Math.ceil((width + height) / 400) * 2;
      accessories.push(this._createAccessoryItem(camLock, {
        quantity: qty,
        moduleIndex
      }));
    }

    // 목심
    const dowel = this.catalog.connectors.find(c => c.id === 'dowel_8');
    if (dowel) {
      const qty = Math.ceil((width + height) / 200) * 2;
      accessories.push(this._createAccessoryItem(dowel, {
        quantity: qty,
        moduleIndex
      }));
    }

    // 선반핀 (선반 있는 경우)
    if (module.shelfCount > 0) {
      const shelfPin = this.catalog.connectors.find(c => c.id === 'shelf_pin');
      if (shelfPin) {
        accessories.push(this._createAccessoryItem(shelfPin, {
          quantity: (module.shelfCount || 1) * 4,
          moduleIndex
        }));
      }
    }

    return accessories;
  }

  /**
   * 조명 추출
   */
  _extractLighting(module, moduleIndex) {
    const accessories = [];
    const width = module.w || 600;

    // LED 스트립
    const ledStrip = this.catalog.lighting.find(l => l.id === 'led_strip');
    if (ledStrip) {
      accessories.push(this._createAccessoryItem(ledStrip, {
        quantity: Math.ceil(width / 1000 * 10) / 10,
        moduleIndex,
        note: `${width}mm`
      }));
    }

    return accessories;
  }

  /**
   * 공통 부자재 추가
   */
  _addCommonAccessories(designData) {
    const modules = designData.modules || [];
    const totalWidth = modules.reduce((sum, m) => sum + (m.w || 0), 0);

    // LED 드라이버 (조명 있는 경우)
    if (designData.options?.includeLighting) {
      const ledDriver = this.catalog.lighting.find(l => l.id === 'led_driver');
      if (ledDriver) {
        this.accessories.push(this._createAccessoryItem(ledDriver, {
          quantity: 1,
          moduleIndex: -1,
          note: '공통'
        }));
      }
    }

    // 벽면 레일 (상부장 있는 경우)
    const hasUpper = modules.some(m => m.type === 'upper');
    if (hasUpper) {
      const wallRail = this.catalog.connectors.find(c => c.id === 'wall_rail');
      if (wallRail) {
        this.accessories.push(this._createAccessoryItem(wallRail, {
          quantity: Math.ceil(totalWidth / 1000 * 10) / 10,
          moduleIndex: -1,
          note: '상부장 거치용'
        }));
      }
    }

    // 걸레받이 (하부장 있는 경우)
    const hasLower = modules.some(m => ['lower', 'tall', 'fridge'].includes(m.type));
    if (hasLower) {
      const kickPlate = this.catalog.misc.find(m => m.id === 'kick_plate');
      if (kickPlate) {
        this.accessories.push(this._createAccessoryItem(kickPlate, {
          quantity: Math.ceil(totalWidth / 1000 * 10) / 10,
          moduleIndex: -1,
          note: '하부 전면'
        }));
      }
    }
  }

  /**
   * 부자재 항목 생성
   */
  _createAccessoryItem(catalogItem, options = {}) {
    const manufacturer = AccessoryConstants.MANUFACTURERS[catalogItem.manufacturer.toUpperCase()] ||
      AccessoryConstants.MANUFACTURERS.DOMESTIC;

    return {
      id: `ACC_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      catalogId: catalogItem.id,
      name: catalogItem.name,
      manufacturer: manufacturer.name,
      category: catalogItem.category,
      spec: options.spec || catalogItem.spec,
      unit: catalogItem.unit,
      quantity: options.quantity || catalogItem.defaultQty,
      moduleIndex: options.moduleIndex,
      note: options.note || '',
      options: catalogItem.options || {}
    };
  }

  /**
   * 동일 부자재 합산
   */
  _consolidateAccessories() {
    const consolidated = {};

    this.accessories.forEach(acc => {
      const key = `${acc.catalogId}_${acc.spec}`;
      if (consolidated[key]) {
        consolidated[key].quantity += acc.quantity;
        if (acc.note && !consolidated[key].note.includes(acc.note)) {
          consolidated[key].note += ', ' + acc.note;
        }
      } else {
        consolidated[key] = { ...acc };
      }
    });

    this.accessories = Object.values(consolidated);
  }

  /**
   * 요약 생성
   */
  _generateSummary() {
    const byCategory = {};

    this.accessories.forEach(acc => {
      if (!byCategory[acc.category]) {
        byCategory[acc.category] = { count: 0, items: [] };
      }
      byCategory[acc.category].count += acc.quantity;
      byCategory[acc.category].items.push(acc.name);
    });

    return {
      totalItems: this.accessories.reduce((sum, a) => sum + a.quantity, 0),
      uniqueItems: this.accessories.length,
      byCategory
    };
  }

  /**
   * 추출 이력 저장
   */
  _saveExtractionHistory(designData) {
    this.extractionHistory.push({
      timestamp: new Date().toISOString(),
      designId: designData.id || 'unknown',
      category: designData.category,
      moduleCount: designData.modules?.length || 0,
      accessoryCount: this.accessories.length,
      summary: this._generateSummary()
    });
  }
}

// ============================================================
// 엑셀 출력 클래스
// ============================================================
class AccessoryExcelExporter {
  constructor() {
    this.columns = [
      { key: 'no', header: 'No.', width: 5 },
      { key: 'category', header: '분류', width: 10 },
      { key: 'name', header: '품목', width: 25 },
      { key: 'manufacturer', header: '제조사', width: 12 },
      { key: 'spec', header: '스펙(규격)', width: 20 },
      { key: 'unit', header: '단위', width: 6 },
      { key: 'quantity', header: '수량', width: 8 },
      { key: 'note', header: '비고', width: 20 }
    ];
  }

  /**
   * 엑셀 데이터 생성 (CSV 형식)
   */
  generateExcelData(accessories, options = {}) {
    const { includeHeader = true, projectName = '다담 캐비넷' } = options;

    let csv = '';

    // 프로젝트 정보
    if (options.includeProjectInfo) {
      csv += `프로젝트명,${projectName}\n`;
      csv += `생성일시,${new Date().toLocaleString('ko-KR')}\n`;
      csv += `총 부자재 항목,${accessories.length}\n`;
      csv += '\n';
    }

    // 헤더
    if (includeHeader) {
      csv += this.columns.map(col => col.header).join(',') + '\n';
    }

    // 카테고리별 그룹화
    const categoryOrder = ['hinge', 'rail', 'handle', 'leg', 'damper', 'support', 'connector', 'lighting', 'misc'];
    const sortedAccessories = [...accessories].sort((a, b) => {
      return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    });

    // 데이터 행
    sortedAccessories.forEach((acc, idx) => {
      const categoryName = AccessoryConstants.CATEGORIES[acc.category.toUpperCase()]?.name || acc.category;
      const row = [
        idx + 1,
        categoryName,
        acc.name,
        acc.manufacturer,
        acc.spec,
        acc.unit,
        acc.quantity,
        acc.note || ''
      ];
      csv += row.join(',') + '\n';
    });

    // 요약
    if (options.includeSummary) {
      csv += '\n';
      csv += '=== 카테고리별 요약 ===\n';
      const summary = this._calculateCategorySummary(accessories);
      Object.entries(summary).forEach(([cat, data]) => {
        const categoryName = AccessoryConstants.CATEGORIES[cat.toUpperCase()]?.name || cat;
        csv += `${categoryName},${data.count}개\n`;
      });
    }

    return csv;
  }

  /**
   * JSON 형식 출력
   */
  generateJSON(accessories) {
    return JSON.stringify({
      generatedAt: new Date().toISOString(),
      columns: this.columns,
      data: accessories,
      summary: this._calculateCategorySummary(accessories)
    }, null, 2);
  }

  /**
   * 카테고리별 요약
   */
  _calculateCategorySummary(accessories) {
    const summary = {};
    accessories.forEach(acc => {
      if (!summary[acc.category]) {
        summary[acc.category] = { count: 0, items: [] };
      }
      summary[acc.category].count += acc.quantity;
      summary[acc.category].items.push(acc.name);
    });
    return summary;
  }
}

// ============================================================
// 데이터베이스 관리자 클래스
// ============================================================
class AccessoryDatabase {
  constructor() {
    this.accessories = [];
    this.extractions = [];
    this.feedback = [];
  }

  /**
   * 부자재 저장
   */
  saveAccessories(accessories, designId) {
    const record = {
      id: `ACC_EXT_${Date.now()}`,
      designId,
      timestamp: new Date().toISOString(),
      accessories: accessories,
      count: accessories.length
    };
    this.extractions.push(record);
    return record.id;
  }

  /**
   * 부자재 조회
   */
  getAccessories(extractionId) {
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
      totalAccessories: this.extractions.reduce((sum, e) => sum + e.count, 0),
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
      catalog: ACCESSORY_CATALOG,
      exportedAt: new Date().toISOString()
    };
  }
}

// ============================================================
// 메인 클래스: 부자재 추출 스킬
// ============================================================
class AccessoryExtractionSkill {
  constructor() {
    this.extractor = new AccessoryExtractor();
    this.excelExporter = new AccessoryExcelExporter();
    this.database = new AccessoryDatabase();
  }

  /**
   * 부자재 추출 실행
   */
  extract(designData) {
    return this.extractor.extractFromDesign(designData);
  }

  /**
   * 엑셀 출력
   */
  exportToExcel(accessories, options = {}) {
    return this.excelExporter.generateExcelData(accessories, options);
  }

  /**
   * JSON 출력
   */
  exportToJSON(accessories) {
    return this.excelExporter.generateJSON(accessories);
  }

  /**
   * 데이터베이스 저장
   */
  saveToDatabase(accessories, designId) {
    return this.database.saveAccessories(accessories, designId);
  }

  /**
   * 피드백 저장
   */
  addFeedback(extractionId, feedback) {
    this.database.saveFeedback(extractionId, feedback);
  }

  /**
   * 부자재 카탈로그 조회
   */
  getCatalog() {
    return ACCESSORY_CATALOG;
  }

  /**
   * 제조사 목록 조회
   */
  getManufacturers() {
    return AccessoryConstants.MANUFACTURERS;
  }

  /**
   * 전체 워크플로우 실행
   */
  runFullWorkflow(designData, options = {}) {
    // 1. 부자재 추출
    const extraction = this.extract(designData);
    if (!extraction.success) {
      return extraction;
    }

    // 2. 데이터베이스 저장
    const extractionId = this.saveToDatabase(extraction.accessories, designData.id);

    // 3. 엑셀 생성
    const excelData = this.exportToExcel(extraction.accessories, {
      includeHeader: true,
      includeProjectInfo: true,
      includeSummary: true,
      projectName: designData.projectName || '다담 캐비넷'
    });

    // 4. JSON 생성
    const jsonData = this.exportToJSON(extraction.accessories);

    return {
      success: true,
      extractionId,
      accessories: extraction.accessories,
      summary: extraction.summary,
      excelData,
      jsonData,
      database: this.database.getStatistics()
    };
  }
}

// ============================================================
// Export
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AccessoryExtractionSkill,
    AccessoryExtractor,
    AccessoryExcelExporter,
    AccessoryDatabase,
    AccessoryConstants,
    ACCESSORY_CATALOG
  };
}

// 전역 노출 (브라우저 환경)
if (typeof window !== 'undefined') {
  window.AccessoryExtractionSkill = AccessoryExtractionSkill;
  window.AccessoryConstants = AccessoryConstants;
  window.ACCESSORY_CATALOG = ACCESSORY_CATALOG;
}
