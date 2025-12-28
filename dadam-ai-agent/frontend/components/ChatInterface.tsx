'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: any[];
}

interface ChatInterfaceProps {
  context: any;
  onContextUpdate: (context: any) => void;
}

export default function ChatInterface({ context, onContextUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `안녕하세요! **다담 AI**입니다. 🏠

맞춤 가구 설계를 도와드릴게요. 무엇을 설계하시겠어요?

- **싱크대** - 상부장/하부장 자동 배치
- **냉장고장** - LG/삼성 모델 기반 설계
- **붙박이장** - 옷봉/선반/서랍 구성
- **기타 가구** - 신발장, 화장대, 수납장 등

치수를 알려주시면 바로 계산해드릴게요!
예: "3000mm 냉장고장 LG로 설계해줘"`,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 빠른 질문 버튼
  const quickQuestions = [
    '3000mm 냉장고장 설계해줘',
    'LG 냉장고 추천해줘',
    '2500mm 분배 계산해줘',
    '싱크대 상부장 배치',
  ];

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          session_id: sessionId,
          context,
        }),
      });

      const data = await response.json();

      if (data.session_id) {
        setSessionId(data.session_id);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        actions: data.actions,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // 액션 처리
      if (data.actions) {
        processActions(data.actions);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const processActions = (actions: any[]) => {
    actions.forEach((action) => {
      if (action.type === 'recommendation' && action.data) {
        // 추천 결과를 컨텍스트에 저장
        onContextUpdate({
          ...context,
          recommendations: action.data,
        });
      } else if (action.type === 'calculation' && action.data) {
        // 계산 결과를 컨텍스트에 저장
        onContextUpdate({
          ...context,
          calculation: action.data,
        });
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
      {/* 채팅 헤더 */}
      <div className="bg-primary text-white px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
          🤖
        </div>
        <div>
          <h2 className="font-semibold">다담 AI</h2>
          <p className="text-xs text-white/80">가구 설계 어시스턴트</p>
        </div>
        {sessionId && (
          <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded">
            세션 활성
          </span>
        )}
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-container bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} message-enter`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-md'
                  : 'bg-white shadow-md rounded-bl-md'
              }`}
            >
              {msg.role === 'assistant' ? (
                <div className="markdown-content prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
              <div
                className={`text-xs mt-2 ${
                  msg.role === 'user' ? 'text-white/70' : 'text-gray-400'
                }`}
              >
                {msg.timestamp.toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}

        {/* 로딩 표시 */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-md rounded-2xl rounded-bl-md px-4 py-3">
              <div className="typing-indicator flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 빠른 질문 */}
      <div className="px-4 py-2 border-t bg-gray-50 flex gap-2 overflow-x-auto">
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => sendMessage(q)}
            className="flex-shrink-0 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full hover:border-primary hover:text-primary transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* 입력 영역 */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
