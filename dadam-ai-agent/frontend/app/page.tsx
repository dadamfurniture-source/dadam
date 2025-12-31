'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import DimensionForm from '@/components/DimensionForm';
import DesignPreview from '@/components/DesignPreview';

export default function Home() {
  const [designContext, setDesignContext] = useState<any>({
    category: null,
    dimensions: { width: 0, height: 0, depth: 0 },
    modules: [],
    doorColor: '#FFFFFF', // 기본 도어 색상: 화이트
  });

  const [activeTab, setActiveTab] = useState<'chat' | 'form'>('chat');

  const handleDimensionChange = (dims: any) => {
    setDesignContext((prev: any) => ({
      ...prev,
      dimensions: dims,
    }));
  };

  const handleCategoryChange = (category: string) => {
    setDesignContext((prev: any) => ({
      ...prev,
      category,
    }));
  };

  const handleDoorColorChange = (doorColor: string) => {
    setDesignContext((prev: any) => ({
      ...prev,
      doorColor,
    }));
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Vibe Cabinet AI Agent
              </h1>
              <p className="text-sm text-gray-500">
                AI 기반 가구 설계 솔루션
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'chat'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                💬 AI 상담
              </button>
              <button
                onClick={() => setActiveTab('form')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'form'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📐 직접 입력
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 채팅 또는 폼 */}
          <div className="lg:col-span-2">
            {activeTab === 'chat' ? (
              <ChatInterface
                context={designContext}
                onContextUpdate={setDesignContext}
              />
            ) : (
              <DimensionForm
                dimensions={designContext.dimensions}
                category={designContext.category}
                doorColor={designContext.doorColor}
                onDimensionChange={handleDimensionChange}
                onCategoryChange={handleCategoryChange}
                onDoorColorChange={handleDoorColorChange}
              />
            )}
          </div>

          {/* 오른쪽: 설계 프리뷰 */}
          <div className="lg:col-span-1">
            <DesignPreview context={designContext} />
          </div>
        </div>
      </div>
    </main>
  );
}
