'use client';

interface DesignPreviewProps {
  context: any;
}

// 도어 간격 상수
const DOOR_GAP = 3; // 2도어 사이 간격 (mm)

// 도어가 있는 카테고리 (상부장 포함)
const DOOR_CATEGORIES = ['fridge', 'sink', 'wardrobe'];

export default function DesignPreview({ context }: DesignPreviewProps) {
  const { dimensions, category, recommendations, calculation, modules, doorColor = '#FFFFFF' } = context;

  const getCategoryName = (id: string) => {
    const names: Record<string, string> = {
      sink: '싱크대',
      island: '아일랜드',
      wardrobe: '붙박이장',
      fridge: '냉장고장',
      shoerack: '신발장',
      vanity: '화장대',
      storage: '수납장',
      warehouse: '창고장',
    };
    return names[id] || id;
  };

  return (
    <div className="space-y-4">
      {/* 현재 설계 상태 */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          📋 현재 설계 상태
        </h3>

        {category ? (
          <div className="space-y-3">
            <div className="p-3 bg-primary/5 rounded-lg">
              <div className="text-sm text-gray-500">가구 유형</div>
              <div className="font-semibold text-primary">
                {getCategoryName(category)}
              </div>
            </div>

            {dimensions?.width > 0 && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">치수</div>
                <div className="font-mono text-sm">
                  {dimensions.width} × {dimensions.height} × {dimensions.depth} mm
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">
            가구를 선택하면 설계 정보가 표시됩니다.
          </p>
        )}
      </div>

      {/* 추천 결과 */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            ⭐ AI 추천
          </h3>
          <div className="space-y-2">
            {recommendations.slice(0, 3).map((rec: any, i: number) => (
              <div
                key={i}
                className="p-3 border border-gray-100 rounded-lg hover:border-primary/30 cursor-pointer transition-colors"
              >
                <div className="font-medium text-sm">
                  {rec.brand} {rec.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {rec.w} × {rec.h}mm | 잔여: {rec.remaining_space}mm
                </div>
                {rec.can_add_tall && (
                  <span className="inline-block mt-1 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
                    키큰장 추가 가능
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 계산 결과 */}
      {calculation && (
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            🧮 계산 결과
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">도어 너비</span>
              <span className="font-medium">{calculation.door_width}mm</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">도어 개수</span>
              <span className="font-medium">{calculation.door_count}개</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">잔여 공간</span>
              <span
                className={`font-medium ${
                  calculation.is_optimal ? 'text-green-600' : 'text-orange-500'
                }`}
              >
                {calculation.remaining}mm
                {calculation.is_optimal && ' ✓'}
              </span>
            </div>
            {calculation.modules && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-1">모듈 구성</div>
                <div className="flex flex-wrap gap-1">
                  {calculation.modules.map((m: any, i: number) => (
                    <span
                      key={i}
                      className={`text-xs px-2 py-1 rounded ${
                        m.is_2d
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {m.is_2d ? '2D' : '1D'} ({m.width}mm)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 도면 프리뷰 (도어 렌더링 포함) */}
      {dimensions?.width > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            📐 도면 프리뷰
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
            <svg
              viewBox="0 0 300 240"
              className="w-full h-auto max-h-60"
              style={{ background: '#fafafa' }}
            >
              {/* 치수선 - 상단 */}
              <line x1="30" y1="15" x2="270" y2="15" stroke="#666" strokeWidth="1" />
              <line x1="30" y1="12" x2="30" y2="18" stroke="#666" strokeWidth="1" />
              <line x1="270" y1="12" x2="270" y2="18" stroke="#666" strokeWidth="1" />
              <text x="150" y="10" textAnchor="middle" fontSize="9" fill="#333">
                {dimensions.width}mm
              </text>

              {/* 치수선 - 좌측 */}
              <line x1="15" y1="30" x2="15" y2="210" stroke="#666" strokeWidth="1" />
              <line x1="12" y1="30" x2="18" y2="30" stroke="#666" strokeWidth="1" />
              <line x1="12" y1="210" x2="18" y2="210" stroke="#666" strokeWidth="1" />
              <text
                x="8"
                y="120"
                textAnchor="middle"
                fontSize="9"
                fill="#333"
                transform="rotate(-90, 8, 120)"
              >
                {dimensions.height}mm
              </text>

              {/* 외곽 프레임 */}
              <rect
                x="30"
                y="30"
                width="240"
                height="180"
                fill="none"
                stroke="#333"
                strokeWidth="2"
              />

              {/* 냉장고장, 싱크대, 붙박이장: 상부장 + 하부장 도어 렌더링 */}
              {DOOR_CATEGORIES.includes(category) && (
                <>
                  {/* 상부장 영역 (상단 30%) */}
                  <rect
                    x="32"
                    y="32"
                    width="236"
                    height="50"
                    fill={doorColor}
                    stroke="#666"
                    strokeWidth="1"
                  />
                  {/* 상부장 2도어 분할선 (3mm 간격 표현) */}
                  <line x1="150" y1="32" x2="150" y2="82" stroke="#999" strokeWidth="1" strokeDasharray="2,2" />

                  {/* 하부장 영역 - 냉장고장은 냉장고 공간 */}
                  {category === 'fridge' ? (
                    <>
                      {/* 냉장고 공간 (중앙) */}
                      <rect
                        x="70"
                        y="90"
                        width="160"
                        height="115"
                        fill="#E8F4FF"
                        stroke="#666"
                        strokeWidth="1"
                      />
                      <text x="150" y="150" textAnchor="middle" fontSize="24">🧊</text>
                      <text x="150" y="175" textAnchor="middle" fontSize="8" fill="#666">냉장고</text>

                      {/* 좌우 키큰장/EL장 도어 */}
                      <rect
                        x="32"
                        y="90"
                        width="35"
                        height="115"
                        fill={doorColor}
                        stroke="#666"
                        strokeWidth="1"
                      />
                      <rect
                        x="233"
                        y="90"
                        width="35"
                        height="115"
                        fill={doorColor}
                        stroke="#666"
                        strokeWidth="1"
                      />
                    </>
                  ) : (
                    <>
                      {/* 싱크대/붙박이장: 하부장 도어 (2도어) */}
                      <rect
                        x="32"
                        y="90"
                        width="117"
                        height="115"
                        fill={doorColor}
                        stroke="#666"
                        strokeWidth="1"
                      />
                      {/* 3mm 간격 */}
                      <rect
                        x="152"
                        y="90"
                        width="116"
                        height="115"
                        fill={doorColor}
                        stroke="#666"
                        strokeWidth="1"
                      />
                    </>
                  )}
                </>
              )}

              {/* 기타 카테고리: 기본 도어 렌더링 */}
              {!DOOR_CATEGORIES.includes(category) && category && (
                <>
                  {/* 단일 도어 또는 기본 표시 */}
                  <rect
                    x="32"
                    y="32"
                    width="236"
                    height="176"
                    fill={doorColor}
                    stroke="#666"
                    strokeWidth="1"
                  />
                  <text x="150" y="130" textAnchor="middle" fontSize="28">
                    {category === 'shoerack' ? '👟' :
                     category === 'vanity' ? '💄' :
                     category === 'storage' ? '📦' :
                     category === 'warehouse' ? '🏭' :
                     category === 'island' ? '🏝️' : '📦'}
                  </text>
                </>
              )}

              {/* 도어 색상 표시 */}
              {category && (
                <g>
                  <rect x="250" y="215" width="12" height="12" fill={doorColor} stroke="#666" strokeWidth="1" />
                  <text x="245" y="223" textAnchor="end" fontSize="7" fill="#666">도어색상</text>
                </g>
              )}
            </svg>
          </div>

          {/* 도어 렌더링 규칙 안내 */}
          {DOOR_CATEGORIES.includes(category) && (
            <div className="mt-3 p-2 bg-blue-50 rounded-lg text-xs text-blue-700">
              <p>• 상부장 도어 포함</p>
              <p>• 2도어 간격: 3mm</p>
              <p>• 손잡이 없음 (핸들리스)</p>
            </div>
          )}
        </div>
      )}

      {/* 도움말 */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4">
        <h3 className="font-bold text-primary mb-2">💡 도움말</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• AI 상담에서 자연어로 질문하세요</li>
          <li>• 치수를 입력하면 자동 계산됩니다</li>
          <li>• 잔여 4~10mm가 최적입니다</li>
        </ul>
      </div>
    </div>
  );
}
