/**
 * 서브스킬 테스트 스크립트
 * 실행: node js/skills/test-skills.js
 */

const { MaterialExtractionSkill } = require('./material-extraction.js');
const { AccessoryExtractionSkill } = require('./accessory-extraction.js');
const { DrawingVisualizationSkill } = require('./drawing-visualization.js');

// 테스트용 설계 데이터
const testDesignData = {
  id: 'TEST_001',
  projectName: '테스트 냉장고장',
  category: 'fridge',
  w: 2400,
  h: 2400,
  specs: {
    color: '화이트',
    edgeColor: '화이트',
    depth: 550,
    pedestalHeight: 60
  },
  modules: [
    {
      id: 'mod_1',
      type: 'tall',
      name: '키큰장',
      w: 600,
      h: 2100,
      d: 550,
      doorCount: 2,
      is2D: true,
      shelfCount: 2
    },
    {
      id: 'mod_2',
      type: 'fridge',
      name: '냉장고',
      w: 912,
      h: 1853,
      d: 688,
      units: [{ name: '4도어', w: 912 }]
    },
    {
      id: 'mod_3',
      type: 'homecafe',
      name: '홈카페장',
      w: 600,
      h: 1400,
      d: 550,
      doorType: 'liftup'
    }
  ],
  options: {
    softClose: true,
    handleType: 'bar',
    includeLighting: true
  }
};

console.log('=' .repeat(60));
console.log('🔧 다담 캐비넷 서브스킬 테스트');
console.log('=' .repeat(60));

// ============================================================
// 1. 자재 추출 테스트
// ============================================================
console.log('\n📦 1. 자재 추출 스킬 테스트\n');

const materialSkill = new MaterialExtractionSkill();
const materialResult = materialSkill.runFullWorkflow(testDesignData, {
  cncFormats: ['csv', 'xml']
});

if (materialResult.success) {
  console.log('✅ 자재 추출 성공!');
  console.log(`   - 추출 ID: ${materialResult.extractionId}`);
  console.log(`   - 총 부재 수: ${materialResult.materials.length}개`);
  console.log(`   - 총 수량: ${materialResult.summary.totalParts}개`);
  console.log(`   - 총 면적: ${materialResult.summary.totalArea}㎡`);

  console.log('\n   [추출된 자재 샘플 (상위 5개)]');
  materialResult.materials.slice(0, 5).forEach((mat, idx) => {
    console.log(`   ${idx + 1}. ${mat.partName} | ${mat.width}x${mat.height}x${mat.thickness} | ${mat.color} | 엣지: ${mat.edgeString}`);
  });

  console.log('\n   [엑셀 데이터 미리보기]');
  const excelLines = materialResult.excelData.split('\n').slice(0, 8);
  excelLines.forEach(line => console.log(`   ${line}`));

  console.log('\n   [CNC 파일 생성됨]');
  Object.keys(materialResult.cncFiles).forEach(format => {
    console.log(`   - ${format.toUpperCase()}: ${materialResult.cncFiles[format].filename}`);
  });
} else {
  console.log('❌ 자재 추출 실패:', materialResult.error);
}

// ============================================================
// 2. 부자재 추출 테스트
// ============================================================
console.log('\n' + '=' .repeat(60));
console.log('\n🔩 2. 부자재 추출 스킬 테스트\n');

const accessorySkill = new AccessoryExtractionSkill();
const accessoryResult = accessorySkill.runFullWorkflow(testDesignData);

if (accessoryResult.success) {
  console.log('✅ 부자재 추출 성공!');
  console.log(`   - 추출 ID: ${accessoryResult.extractionId}`);
  console.log(`   - 고유 품목 수: ${accessoryResult.summary.uniqueItems}개`);
  console.log(`   - 총 수량: ${accessoryResult.summary.totalItems}개`);

  console.log('\n   [카테고리별 요약]');
  Object.entries(accessoryResult.summary.byCategory).forEach(([cat, data]) => {
    console.log(`   - ${cat}: ${data.count}개`);
  });

  console.log('\n   [추출된 부자재 샘플 (상위 5개)]');
  accessoryResult.accessories.slice(0, 5).forEach((acc, idx) => {
    console.log(`   ${idx + 1}. ${acc.name} | ${acc.manufacturer} | ${acc.spec} | ${acc.quantity}${acc.unit}`);
  });

  console.log('\n   [엑셀 데이터 미리보기]');
  const excelLines = accessoryResult.excelData.split('\n').slice(0, 8);
  excelLines.forEach(line => console.log(`   ${line}`));
} else {
  console.log('❌ 부자재 추출 실패:', accessoryResult.error);
}

// ============================================================
// 3. 도면 시각화 테스트
// ============================================================
console.log('\n' + '=' .repeat(60));
console.log('\n📐 3. 도면 시각화 스킬 테스트\n');

const drawingSkill = new DrawingVisualizationSkill();

// 자재 데이터를 도면 생성에 사용
const allDrawings = drawingSkill.generateAllDrawings(
  testDesignData,
  materialResult.materials,
  {
    cutting: { optimizeMode: 'material', showDimensions: true },
    manufacturing: { viewAngle: 'ISOMETRIC', showDimensions: true },
    installation: { viewAngle: 'ISOMETRIC', showInstallGuides: true }
  }
);

console.log('✅ 도면 생성 성공!');

// 재단 도면
console.log('\n   [재단 도면]');
console.log(`   - 도면 ID: ${allDrawings.cutting.id}`);
console.log(`   - 최적화 모드: ${allDrawings.cutting.optimizeMode === 'material' ? '자재 최소화' : '재단 최소화'}`);
console.log(`   - 판재 수: ${allDrawings.cutting.stats.boardCount}장`);
console.log(`   - 효율: ${allDrawings.cutting.stats.efficiency}`);
console.log(`   - 사용 면적: ${allDrawings.cutting.stats.usedArea.toFixed(2)}㎡`);
console.log(`   - 폐기 면적: ${allDrawings.cutting.stats.wasteArea.toFixed(2)}㎡`);

allDrawings.cutting.boards.forEach((board, idx) => {
  console.log(`   - 판재 ${idx + 1}: 부재 ${board.partCount}개, 효율 ${board.efficiency}%`);
});

// 제작 도면
console.log('\n   [제작 도면 (3D)]');
console.log(`   - 도면 ID: ${allDrawings.manufacturing.id}`);
console.log(`   - 시점: ${allDrawings.manufacturing.viewAngle}`);
console.log(`   - 생성된 도면: ${allDrawings.manufacturing.drawings.length}개`);
allDrawings.manufacturing.drawings.forEach((drw, idx) => {
  console.log(`   - ${idx + 1}. ${drw.moduleName} (${drw.dimensions.w}x${drw.dimensions.h}x${drw.dimensions.d})`);
});

// 설치 도면
console.log('\n   [설치 도면 (3D)]');
console.log(`   - 도면 ID: ${allDrawings.installation.id}`);
console.log(`   - 전체 배치도: ${allDrawings.installation.overview.moduleCount}개 모듈`);
console.log(`   - 총 너비: ${allDrawings.installation.overview.totalWidth}mm`);
console.log(`   - 모듈별 가이드: ${allDrawings.installation.moduleGuides.length}개`);

// 데이터베이스 통계
console.log('\n   [데이터베이스 통계]');
console.log(`   - 총 도면 수: ${allDrawings.database.totalDrawings}`);
console.log(`   - 재단 도면: ${allDrawings.database.byType.cutting}개`);
console.log(`   - 제작 도면: ${allDrawings.database.byType.manufacturing}개`);
console.log(`   - 설치 도면: ${allDrawings.database.byType.installation}개`);

// ============================================================
// SVG 파일 저장 (선택)
// ============================================================
console.log('\n' + '=' .repeat(60));
console.log('\n💾 SVG 파일 저장\n');

const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 재단 도면 저장
allDrawings.cutting.boards.forEach((board, idx) => {
  const filename = path.join(outputDir, `cutting_board_${idx + 1}.svg`);
  fs.writeFileSync(filename, board.svg);
  console.log(`   ✅ ${filename}`);
});

// 제작 도면 저장
allDrawings.manufacturing.drawings.forEach((drw, idx) => {
  const filename = path.join(outputDir, `manufacturing_${drw.moduleName}_${idx + 1}.svg`);
  fs.writeFileSync(filename, drw.svg);
  console.log(`   ✅ ${filename}`);
});

// 설치 도면 저장
const overviewFilename = path.join(outputDir, 'installation_overview.svg');
fs.writeFileSync(overviewFilename, allDrawings.installation.overview.svg);
console.log(`   ✅ ${overviewFilename}`);

allDrawings.installation.moduleGuides.forEach((guide, idx) => {
  const filename = path.join(outputDir, `installation_${guide.moduleName}_${idx + 1}.svg`);
  fs.writeFileSync(filename, guide.svg);
  console.log(`   ✅ ${filename}`);
});

// 엑셀 파일 저장
const materialExcelPath = path.join(outputDir, 'material_list.csv');
fs.writeFileSync(materialExcelPath, materialResult.excelData);
console.log(`   ✅ ${materialExcelPath}`);

const accessoryExcelPath = path.join(outputDir, 'accessory_list.csv');
fs.writeFileSync(accessoryExcelPath, accessoryResult.excelData);
console.log(`   ✅ ${accessoryExcelPath}`);

console.log('\n' + '=' .repeat(60));
console.log('🎉 모든 테스트 완료!');
console.log(`   출력 폴더: ${outputDir}`);
console.log('=' .repeat(60));
