'use client';

interface DesignPreviewProps {
  context: any;
}

export default function DesignPreview({ context }: DesignPreviewProps) {
  const { dimensions, category, recommendations, calculation, modules } = context;

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

      {/* 도면 프리뷰 (간단한 SVG) */}
      {dimensions?.width > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            📐 도면 프리뷰
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
            <svg
              viewBox="0 0 300 200"
              className="w-full h-auto max-h-40"
              style={{ background: '#fafafa' }}
            >
              {/* 외곽선 */}
              <rect
                x="20"
                y="20"
                width="260"
                height="160"
                fill="none"
                stroke="#333"
                strokeWidth="2"
              />

              {/* 치수선 - 상단 */}
              <line x1="20" y1="10" x2="280" y2="10" stroke="#666" strokeWidth="1" />
              <text x="150" y="8" textAnchor="middle" fontSize="10" fill="#333">
                {dimensions.width}mm
              </text>

              {/* 치수선 - 좌측 */}
              <line x1="10" y1="20" x2="10" y2="180" stroke="#666" strokeWidth="1" />
              <text
                x="8"
                y="100"
                textAnchor="middle"
                fontSize="10"
                fill="#333"
                transform="rotate(-90, 8, 100)"
              >
                {dimensions.height}mm
              </text>

              {/* 카테고리 아이콘 */}
              <text x="150" y="110" textAnchor="middle" fontSize="40">
                {category === 'fridge'
                  ? '🧊'
                  : category === 'sink'
                  ? '🚰'
                  : category === 'wardrobe'
                  ? '👔'
                  : '📦'}
              </text>
            </svg>
          </div>
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
