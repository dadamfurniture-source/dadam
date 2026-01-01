'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Send,
  ArrowRight,
  Home,
  Sofa,
  BookOpen,
  ChefHat,
  Bed,
  Shirt,
  Plus,
  Image,
  Mic,
  Lightbulb,
  CheckCircle2
} from 'lucide-react'

// Room types for quick selection
const roomTypes = [
  { id: 'living', label: '거실', icon: Sofa },
  { id: 'kitchen', label: '주방', icon: ChefHat },
  { id: 'bedroom', label: '침실', icon: Bed },
  { id: 'study', label: '서재', icon: BookOpen },
  { id: 'dressing', label: '드레스룸', icon: Shirt },
  { id: 'whole', label: '전체 공간', icon: Home },
]

// Sample conversation for demo
const sampleConversation = [
  {
    type: 'ai',
    content: '안녕하세요! 저는 다담가구 AI 설계사입니다. 당신의 라이프스타일에 맞는 완벽한 맞춤 가구를 설계해 드릴게요. 먼저, 어떤 공간의 가구를 찾고 계신가요?',
  },
]

// AI suggestions
const aiSuggestions = [
  '거실에 맞는 TV장을 찾고 있어요',
  '주방 수납 공간이 부족해요',
  '서재에 책장을 맞추고 싶어요',
  '전체적인 빌트인 가구 상담이 필요해요',
]

export default function AIDesignPage() {
  const [messages, setMessages] = useState(sampleConversation)
  const [input, setInput] = useState('')
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: input }])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        type: 'ai',
        content: '좋은 선택이에요! 해당 공간에 대해 더 자세히 알려주시면, 최적의 가구 디자인을 제안해 드릴게요. 공간의 크기(가로 x 세로)와 현재 가구 배치 상태를 말씀해 주시겠어요?'
      }])
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId)
    const room = roomTypes.find(r => r.id === roomId)
    if (room) {
      setMessages(prev => [...prev, { type: 'user', content: `${room.label} 가구를 알아보고 싶어요.` }])
      setIsTyping(true
      )
      setTimeout(() => {
        setIsTyping(false)
        setMessages(prev => [...prev, {
          type: 'ai',
          content: `${room.label} 가구 설계를 도와드릴게요! 먼저 몇 가지 질문을 드릴게요.\n\n1. ${room.label}의 크기는 어떻게 되나요? (예: 가로 4m x 세로 5m)\n2. 현재 어떤 가구가 있으시고, 어떤 부분이 불편하신가요?\n3. 특별히 원하시는 스타일이나 자재가 있으신가요?`
        }])
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen bg-dadam-cream">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-dadam-ai-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-dadam-ai-secondary/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-dadam-ai-primary/10 to-dadam-ai-secondary/10 border border-dadam-ai-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-dadam-ai-primary animate-pulse" />
            <span className="text-sm font-medium gradient-text">AI 기반 설계 시스템</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-dadam-charcoal">
            AI와 함께하는
            <br />
            <span className="gradient-text">맞춤 가구 설계</span>
          </h1>
          <p className="mt-6 text-lg text-dadam-gray max-w-2xl mx-auto">
            다담가구의 AI Agent와 대화하며 당신의 라이프스타일에 맞는
            완벽한 가구 디자인을 경험하세요.
          </p>
        </div>
      </section>

      {/* Main Chat Section */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          {/* Room Selection */}
          <div className="mb-8">
            <p className="text-sm text-dadam-gray mb-4 text-center">어떤 공간의 가구를 설계할까요?</p>
            <div className="flex flex-wrap justify-center gap-3">
              {roomTypes.map((room) => (
                <button
                  key={room.id}
                  onClick={() => handleRoomSelect(room.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
                    selectedRoom === room.id
                      ? 'bg-gradient-to-r from-dadam-ai-primary to-dadam-ai-secondary text-white border-transparent'
                      : 'bg-white border-dadam-warm hover:border-dadam-ai-primary/50 text-dadam-charcoal'
                  }`}
                >
                  <room.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{room.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Container */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-dadam-ai-primary/10 to-dadam-ai-secondary/10 rounded-3xl blur-2xl" />
            <div className="relative bg-white rounded-2xl shadow-xl border border-dadam-warm overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-dadam-ai-primary to-dadam-ai-secondary p-6 flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">다담 AI 설계사</p>
                  <p className="text-white/70 text-sm">실시간 상담 가능</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-white/20 text-white text-xs">
                    AI 응답 평균 3초
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-dadam-cream/30">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'ai' && (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dadam-ai-primary to-dadam-ai-secondary flex items-center justify-center mr-3 flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] p-4 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-dadam-charcoal text-white rounded-br-md'
                          : 'bg-white border border-dadam-warm rounded-bl-md shadow-sm'
                      }`}
                    >
                      <p className={`text-sm leading-relaxed whitespace-pre-line ${
                        message.type === 'ai' ? 'text-dadam-charcoal' : ''
                      }`}>
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dadam-ai-primary to-dadam-ai-secondary flex items-center justify-center mr-3">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white border border-dadam-warm rounded-2xl rounded-bl-md p-4 shadow-sm">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Suggestions */}
              {messages.length <= 2 && (
                <div className="px-6 py-4 bg-dadam-cream/50 border-t border-dadam-warm">
                  <p className="text-xs text-dadam-gray mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    이런 것들을 물어보실 수 있어요
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-2 bg-white border border-dadam-warm rounded-xl text-sm text-dadam-charcoal hover:border-dadam-ai-primary/50 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-dadam-warm">
                <div className="flex items-center gap-3">
                  <button className="p-3 rounded-xl bg-dadam-cream hover:bg-dadam-warm transition-colors">
                    <Plus className="w-5 h-5 text-dadam-gray" />
                  </button>
                  <button className="p-3 rounded-xl bg-dadam-cream hover:bg-dadam-warm transition-colors">
                    <Image className="w-5 h-5 text-dadam-gray" />
                  </button>
                  <div className="flex-1 flex items-center gap-3 bg-dadam-cream rounded-xl px-4 py-3">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="메시지를 입력하세요..."
                      className="flex-1 bg-transparent text-sm outline-none text-dadam-charcoal placeholder:text-dadam-gray"
                    />
                    <button className="p-2 rounded-lg hover:bg-dadam-warm transition-colors">
                      <Mic className="w-5 h-5 text-dadam-gray" />
                    </button>
                  </div>
                  <button
                    onClick={handleSend}
                    className="p-3 rounded-xl bg-gradient-to-r from-dadam-ai-primary to-dadam-ai-secondary hover:shadow-lg hover:shadow-dadam-ai-primary/30 transition-all"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Features Below Chat */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: '스마트 분석',
                description: 'AI가 라이프스타일과 공간을 분석하여 최적의 가구 배치를 제안합니다.',
              },
              {
                icon: Image,
                title: '이미지 업로드',
                description: '공간 사진을 업로드하면 AI가 정확한 설계를 도와드립니다.',
              },
              {
                icon: CheckCircle2,
                title: '실시간 견적',
                description: '상담 중 실시간으로 예상 견적을 확인하실 수 있습니다.',
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-white p-6 rounded-2xl border border-dadam-warm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-dadam-ai-primary/10 to-dadam-ai-secondary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-dadam-ai-primary" />
                </div>
                <h3 className="font-serif text-lg text-dadam-charcoal mb-2">{feature.title}</h3>
                <p className="text-sm text-dadam-gray">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-dadam-charcoal text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl">
            AI 상담이 끝나면
            <br />
            <span className="gradient-text">전문 설계사가 연락</span>드려요
          </h2>
          <p className="mt-6 text-dadam-gray">
            AI 상담 후 담당 설계사가 직접 연락드려 상세 상담을 진행합니다.
            <br />
            방문 실측부터 3D 시뮬레이션까지 모든 과정을 함께합니다.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote" className="btn-gold">
              무료 견적 받기
            </Link>
            <Link href="/portfolio" className="btn-outline border-white/30 text-white hover:bg-white hover:text-dadam-charcoal">
              포트폴리오 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
