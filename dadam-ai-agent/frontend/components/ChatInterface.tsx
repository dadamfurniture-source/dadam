'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
      content: `안녕하세요! **다담 AI**입니다.

맞춤 가구 설계를 도와드릴게요.
마이크 버튼을 누르고 말씀해주세요!

예시:
- "3000mm 냉장고장 설계해줘"
- "LG 냉장고 추천해줘"
- "2500mm 분배 계산해줘"`,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // 음성 관련 상태
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [transcript, setTranscript] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // 음성 인식 초기화
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {
          setIsListening(true);
          setTranscript('');
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const result = event.results[current];
          const text = result[0].transcript;

          setTranscript(text);

          if (result.isFinal) {
            setInput(text);
            // 자동 전송
            setTimeout(() => {
              sendMessage(text);
            }, 500);
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }

      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 첫 인사 음성 출력
  useEffect(() => {
    if (voiceEnabled && messages.length === 1) {
      setTimeout(() => {
        speak('안녕하세요! 다담 AI입니다. 맞춤 가구 설계를 도와드릴게요. 마이크 버튼을 누르고 말씀해주세요!');
      }, 1000);
    }
  }, []);

  // 음성 출력 함수
  const speak = useCallback((text: string) => {
    if (!synthRef.current || !voiceEnabled) return;

    // 마크다운 및 특수문자 제거
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/[-•]/g, '')
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();

    // 이전 음성 중지
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ko-KR';
    utterance.rate = 1.1;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }, [voiceEnabled]);

  // 음성 중지
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // 음성 인식 시작/중지
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopSpeaking(); // 음성 출력 중지
      recognitionRef.current.start();
    }
  };

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
    setTranscript('');
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

      // 음성으로 응답 출력
      if (voiceEnabled) {
        speak(data.message);
      }

      // 액션 처리
      if (data.actions) {
        processActions(data.actions);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.';
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: errorMsg,
          timestamp: new Date(),
        },
      ]);
      if (voiceEnabled) {
        speak(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const processActions = (actions: any[]) => {
    actions.forEach((action) => {
      if (action.type === 'recommendation' && action.data) {
        onContextUpdate({
          ...context,
          recommendations: action.data,
        });
      } else if (action.type === 'calculation' && action.data) {
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
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl animate-pulse">
          {isSpeaking ? '🔊' : isListening ? '🎤' : '🤖'}
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-lg">다담 음성 AI</h2>
          <p className="text-xs text-white/80">
            {isListening ? '듣고 있어요...' : isSpeaking ? '말하는 중...' : '마이크를 눌러 말씀하세요'}
          </p>
        </div>
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`p-2 rounded-full ${voiceEnabled ? 'bg-white/20' : 'bg-red-500/50'}`}
          title={voiceEnabled ? '음성 켜짐' : '음성 꺼짐'}
        >
          {voiceEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-br-md'
                  : 'bg-white shadow-lg border rounded-bl-md'
              }`}
            >
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-lg">{msg.content}</p>
              )}
              <div className={`text-xs mt-2 flex items-center gap-2 ${
                msg.role === 'user' ? 'text-white/70' : 'text-gray-400'
              }`}>
                {msg.timestamp.toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {msg.role === 'assistant' && voiceEnabled && (
                  <button
                    onClick={() => speak(msg.content)}
                    className="hover:text-purple-500"
                    title="다시 듣기"
                  >
                    🔊
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* 로딩 표시 */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-lg border rounded-2xl rounded-bl-md px-6 py-4">
              <div className="flex gap-2">
                <span className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                <span className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                <span className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
              </div>
            </div>
          </div>
        )}

        {/* 실시간 음성 인식 표시 */}
        {isListening && transcript && (
          <div className="flex justify-end">
            <div className="bg-purple-100 text-purple-700 rounded-2xl px-4 py-3 italic">
              "{transcript}"
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 음성 컨트롤 영역 */}
      <div className="p-6 border-t bg-gradient-to-r from-purple-50 to-indigo-50">
        {/* 마이크 버튼 (중앙 큰 버튼) */}
        <div className="flex justify-center mb-4">
          <button
            onClick={toggleListening}
            disabled={isLoading}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all transform hover:scale-105 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? '⏹️' : '🎤'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mb-4">
          {isListening ? '말씀하세요... (버튼을 눌러 중지)' : '마이크 버튼을 눌러 음성으로 대화하세요'}
        </p>

        {/* 텍스트 입력 (보조) */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="또는 텍스트로 입력..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-purple-400"
            disabled={isLoading || isListening}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim() || isListening}
            className="px-4 py-2 bg-purple-500 text-white rounded-full text-sm hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            전송
          </button>
        </div>

        {/* 음성 출력 중일 때 중지 버튼 */}
        {isSpeaking && (
          <div className="flex justify-center mt-3">
            <button
              onClick={stopSpeaking}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm hover:bg-red-200"
            >
              🔇 음성 중지
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
