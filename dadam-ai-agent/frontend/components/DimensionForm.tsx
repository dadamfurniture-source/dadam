'use client';

import { useState } from 'react';

interface DimensionFormProps {
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  category: string | null;
  doorColor: string;
  onDimensionChange: (dims: any) => void;
  onCategoryChange: (cat: string) => void;
  onDoorColorChange: (color: string) => void;
}

// 도어 색상 옵션
const DOOR_COLORS = [
  { id: 'white', name: '화이트', hex: '#FFFFFF' },
  { id: 'cream', name: '크림', hex: '#FFFDD0' },
  { id: 'gray', name: '그레이', hex: '#808080' },
  { id: 'charcoal', name: '차콜', hex: '#36454F' },
  { id: 'navy', name: '네이비', hex: '#000080' },
  { id: 'beige', name: '베이지', hex: '#F5F5DC' },
  { id: 'walnut', name: '월넛', hex: '#5D432C' },
  { id: 'oak', name: '오크', hex: '#C4A35A' },
];

const CATEGORIES = [
  { id: 'sink', name: '싱크대', icon: '🚰', defaultD: 600 },
  { id: 'island', name: '아일랜드', icon: '🏝️', defaultD: 800 },
  { id: 'wardrobe', name: '붙박이장', icon: '👔', defaultD: 650 },
  { id: 'fridge', name: '냉장고장', icon: '🧊', defaultD: 700 },
  { id: 'shoerack', name: '신발장', icon: '👟', defaultD: 350 },
  { id: 'vanity', name: '화장대', icon: '💄', defaultD: 500 },
  { id: 'storage', name: '수납장', icon: '📦', defaultD: 400 },
  { id: 'warehouse', name: '창고장', icon: '🏭', defaultD: 450 },
];

export default function DimensionForm({
  dimensions,
  category,
  doorColor,
  onDimensionChange,
  onCategoryChange,
  onDoorColorChange,
}: DimensionFormProps) {
  const [localDims, setLocalDims] = useState(dimensions);
  const [finishLeft, setFinishLeft] = useState(60);
  const [finishRight, setFinishRight] = useState(60);

  const selectedCategory = CATEGORIES.find((c) => c.id === category);

  const handleCategorySelect = (catId: string) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    onCategoryChange(catId);
    if (cat) {
      const newDims = { ...localDims, depth: cat.defaultD };
      setLocalDims(newDims);
      onDimensionChange(newDims);
    }
  };

  const handleDimChange = (key: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const newDims = { ...localDims, [key]: numValue };
    setLocalDims(newDims);
    onDimensionChange(newDims);
  };

  const effectiveWidth = localDims.width - finishLeft - finishRight;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* 카테고리 선택 */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          1. 가구 유형 선택
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                category === cat.id
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-gray-100 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div
                className={`text-sm font-medium ${
                  category === cat.id ? 'text-primary' : 'text-gray-600'
                }`}
              >
                {cat.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 치수 입력 */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          2. 치수 입력 (mm)
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              너비 (W)
            </label>
            <input
              type="number"
              value={localDims.width || ''}
              onChange={(e) => handleDimChange('width', e.target.value)}
              placeholder="예: 3000"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              높이 (H)
            </label>
            <input
              type="number"
              value={localDims.height || ''}
              onChange={(e) => handleDimChange('height', e.target.value)}
              placeholder="예: 2300"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              깊이 (D)
            </label>
            <input
              type="number"
              value={localDims.depth || ''}
              onChange={(e) => handleDimChange('depth', e.target.value)}
              placeholder={`예: ${selectedCategory?.defaultD || 600}`}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* 상세 설계 - 도어 색상 */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">3. 도어 색상</h2>
        <div className="grid grid-cols-4 gap-3">
          {DOOR_COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => onDoorColorChange(color.hex)}
              className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                doorColor === color.hex
                  ? 'border-primary shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className="w-8 h-8 rounded-full border border-gray-300 mb-2"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-xs font-medium text-gray-600">
                {color.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 마감 설정 */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">4. 마감 설정</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              좌측 마감 (mm)
            </label>
            <div className="flex gap-2">
              <select className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary">
                <option value="filler">휠라</option>
                <option value="molding">몰딩</option>
                <option value="ep">EP (20mm)</option>
                <option value="none">없음</option>
              </select>
              <input
                type="number"
                value={finishLeft}
                onChange={(e) => setFinishLeft(parseInt(e.target.value) || 0)}
                className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              우측 마감 (mm)
            </label>
            <div className="flex gap-2">
              <select className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary">
                <option value="filler">휠라</option>
                <option value="molding">몰딩</option>
                <option value="ep">EP (20mm)</option>
                <option value="none">없음</option>
              </select>
              <input
                type="number"
                value={finishRight}
                onChange={(e) => setFinishRight(parseInt(e.target.value) || 0)}
                className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 유효 공간 표시 */}
      {localDims.width > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">전체 너비</span>
            <span className="font-bold">{localDims.width} mm</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">마감 (좌+우)</span>
            <span className="text-gray-500">- {finishLeft + finishRight} mm</span>
          </div>
          <div className="border-t border-gray-200 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-primary font-medium">유효 공간</span>
            <span className="text-primary font-bold text-lg">
              {effectiveWidth} mm
            </span>
          </div>
        </div>
      )}

      {/* 자동 계산 버튼 */}
      <button
        disabled={!category || localDims.width <= 0}
        className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        ⚡ AI 자동 설계 시작
      </button>
    </div>
  );
}
