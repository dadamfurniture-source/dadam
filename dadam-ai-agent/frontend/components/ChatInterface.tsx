'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface ChatInterfaceProps {
  context: any;
  onContextUpdate: (context: any) => void;
}

export default function ChatInterface({ context, onContextUpdate }: ChatInterfaceProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('AI 버튼을 눌러 말씀하세요');

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
          setStatusText('듣고 있어요...');
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const result = event.results[current];
          const text = result[0].transcript;

          setTranscript(text);

          if (result.isFinal) {
            setStatusText('처리 중...');
            setTimeout(() => {
              sendMessage(text);
            }, 300);
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setStatusText('다시 시도해주세요');
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }

      synthRef.current = window.speechSynthesis;
    }

    // 첫 인사
    setTimeout(() => {
      speak('안녕하세요! 다담 AI입니다. 버튼을 누르고 말씀해주세요.');
    }, 1000);
  }, []);

  // 음성 출력 함수
  const speak = useCallback((text: string) => {
    if (!synthRef.current) return;

    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/[-•]/g, '')
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ko-KR';
    utterance.rate = 1.1;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setStatusText('말하는 중...');
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setStatusText('AI 버튼을 눌러 말씀하세요');
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setStatusText('AI 버튼을 눌러 말씀하세요');
    };

    synthRef.current.speak(utterance);
  }, []);

  // 음성 중지
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // AI 버튼 클릭
  const handleAIButtonClick = () => {
    if (!recognitionRef.current) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopSpeaking();
      recognitionRef.current.start();
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    setIsProcessing(true);
    setStatusText('AI가 생각하는 중...');

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

      setLastResponse(data.message);
      speak(data.message);

      if (data.actions) {
        data.actions.forEach((action: any) => {
          if (action.type === 'recommendation' && action.data) {
            onContextUpdate({ ...context, recommendations: action.data });
          } else if (action.type === 'calculation' && action.data) {
            onContextUpdate({ ...context, calculation: action.data });
          }
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = '죄송합니다. 오류가 발생했습니다.';
      setLastResponse(errorMsg);
      speak(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  // 버튼 상태에 따른 색상
  const getButtonStyle = () => {
    if (isListening) {
      return 'from-red-500 to-red-600 shadow-red-500/50 animate-pulse';
    }
    if (isSpeaking) {
      return 'from-green-500 to-emerald-600 shadow-green-500/50';
    }
    if (isProcessing) {
      return 'from-yellow-500 to-orange-500 shadow-yellow-500/50 animate-pulse';
    }
    return 'from-violet-600 via-purple-600 to-indigo-600 shadow-purple-500/40 hover:shadow-purple-500/60';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-8">
      {/* 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* 타이틀 */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            다담 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">AI</span>
          </h1>
          <p className="text-purple-200/60 text-sm">맞춤 가구 설계 음성 어시스턴트</p>
        </div>

        {/* AI 버튼 */}
        <button
          onClick={handleAIButtonClick}
          disabled={isProcessing}
          className={`
            relative w-40 h-40 rounded-full
            bg-gradient-to-br ${getButtonStyle()}
            shadow-2xl
            transition-all duration-300 transform
            hover:scale-105 active:scale-95
            disabled:opacity-70 disabled:cursor-wait
            flex items-center justify-center
            border-4 border-white/20
          `}
        >
          {/* 외곽 링 애니메이션 */}
          {(isListening || isSpeaking) && (
            <>
              <span className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></span>
              <span className="absolute inset-[-8px] rounded-full border-2 border-white/20 animate-pulse"></span>
            </>
          )}

          {/* AI 텍스트 */}
          <span className="text-5xl font-black text-white drop-shadow-lg tracking-tighter">
            AI
          </span>
        </button>

        {/* 상태 텍스트 */}
        <div className="text-center">
          <p className="text-white/90 text-lg font-medium mb-2">
            {statusText}
          </p>

          {/* 실시간 트랜스크립트 */}
          {isListening && transcript && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 max-w-md">
              <p className="text-purple-200 italic">"{transcript}"</p>
            </div>
          )}

          {/* 마지막 응답 미리보기 */}
          {!isListening && lastResponse && (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 max-w-md mt-4">
              <p className="text-white/70 text-sm line-clamp-3">{lastResponse}</p>
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="mt-2 text-xs text-red-300 hover:text-red-200"
                >
                  🔇 음성 중지
                </button>
              )}
            </div>
          )}
        </div>

        {/* 도움말 */}
        <div className="text-center text-white/40 text-xs mt-8 max-w-sm">
          <p className="mb-2">💡 예시 명령어</p>
          <p>"3000mm 냉장고장 설계해줘"</p>
          <p>"LG 냉장고 추천해줘"</p>
          <p>"2500mm 분배 계산해줘"</p>
        </div>
      </div>
    </div>
  );
}
