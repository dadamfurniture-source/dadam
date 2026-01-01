'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Calculator,
  CheckCircle2,
  ArrowRight,
  Home,
  Sofa,
  ChefHat,
  Bed,
  BookOpen,
  Shirt,
  Shield,
  Clock,
  FileText,
  Phone
} from 'lucide-react'

// Room types
const roomTypes = [
  { id: 'living', label: '거실', icon: Sofa, basePrice: '150만원~' },
  { id: 'kitchen', label: '주방', icon: ChefHat, basePrice: '200만원~' },
  { id: 'bedroom', label: '침실', icon: Bed, basePrice: '120만원~' },
  { id: 'study', label: '서재', icon: BookOpen, basePrice: '180만원~' },
  { id: 'dressing', label: '드레스룸', icon: Shirt, basePrice: '250만원~' },
  { id: 'whole', label: '전체 빌트인', icon: Home, basePrice: '상담 필요' },
]

// Form steps
const steps = ['공간 선택', '상세 정보', '연락처', '완료']

export default function QuotePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])
  const [formData, setFormData] = useState({
    size: '',
    budget: '',
    timeline: '',
    description: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    contactTime: '',
  })

  const handleRoomToggle = (roomId: string) => {
    setSelectedRooms(prev =>
      prev.includes(roomId)
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    )
  }

  const handleSubmit = () => {
    // Handle form submission
    setCurrentStep(3)
  }

  return (
    <div className="min-h-screen bg-dadam-cream">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-dadam-gold/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dadam-gold/10 border border-dadam-gold/20 mb-6">
            <Calculator className="w-4 h-4 text-dadam-gold" />
            <span className="text-sm font-medium text-dadam-gold">무료 견적</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-dadam-charcoal">
            투명한 <span className="gradient-text">최적의 견적</span>을
            <br />
            받아보세요
          </h1>
          <p className="mt-6 text-lg text-dadam-gray max-w-2xl mx-auto">
            AI 분석을 통해 불필요한 비용 없이 정확한 견적을 제공합니다.
            간단한 정보만 입력하시면 담당자가 빠르게 연락드립니다.
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between mb-12">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center gap-3 ${index <= currentStep ? 'text-dadam-ai-primary' : 'text-dadam-gray'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStep
                    ? 'bg-dadam-ai-primary text-white'
                    : index === currentStep
                    ? 'bg-gradient-to-r from-dadam-ai-primary to-dadam-ai-secondary text-white'
                    : 'bg-dadam-warm text-dadam-gray'
                }`}>
                  {index < currentStep ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                </div>
                <span className="hidden sm:block text-sm font-medium">{step}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`hidden sm:block w-20 h-px mx-4 ${
                  index < currentStep ? 'bg-dadam-ai-primary' : 'bg-dadam-warm'
                }`} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 pb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-dadam-warm overflow-hidden">
          {/* Step 1: Room Selection */}
          {currentStep === 0 && (
            <div className="p-8 md:p-12">
              <h2 className="font-serif text-2xl text-dadam-charcoal mb-2">
                어떤 공간의 가구가 필요하신가요?
              </h2>
              <p className="text-dadam-gray mb-8">복수 선택 가능합니다.</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {roomTypes.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => handleRoomToggle(room.id)}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      selectedRooms.includes(room.id)
                        ? 'border-dadam-ai-primary bg-dadam-ai-primary/5'
                        : 'border-dadam-warm hover:border-dadam-ai-primary/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      selectedRooms.includes(room.id)
                        ? 'bg-gradient-to-br from-dadam-ai-primary to-dadam-ai-secondary'
                        : 'bg-dadam-cream'
                    }`}>
                      <room.icon className={`w-6 h-6 ${
                        selectedRooms.includes(room.id) ? 'text-white' : 'text-dadam-charcoal'
                      }`} />
                    </div>
                    <p className="font-medium text-dadam-charcoal">{room.label}</p>
                    <p className="text-sm text-dadam-gray mt-1">{room.basePrice}</p>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setCurrentStep(1)}
                  disabled={selectedRooms.length === 0}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음 단계
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 1 && (
            <div className="p-8 md:p-12">
              <h2 className="font-serif text-2xl text-dadam-charcoal mb-2">
                상세 정보를 알려주세요
              </h2>
              <p className="text-dadam-gray mb-8">정확한 견적 산출을 위해 필요한 정보입니다.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-dadam-charcoal mb-2">
                    공간 크기 (평수)
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    placeholder="예: 32평"
                    className="w-full px-4 py-3 rounded-xl border border-dadam-warm focus:border-dadam-ai-primary focus:ring-2 focus:ring-dadam-ai-primary/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dadam-charcoal mb-2">
                    예상 예산
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-dadam-warm focus:border-dadam-ai-primary focus:ring-2 focus:ring-dadam-ai-primary/20 outline-none transition-all"
                  >
                    <option value="">선택해주세요</option>
                    <option value="under-300">300만원 미만</option>
                    <option value="300-500">300만원 ~ 500만원</option>
                    <option value="500-1000">500만원 ~ 1,000만원</option>
                    <option value="1000-2000">1,000만원 ~ 2,000만원</option>
                    <option value="over-2000">2,000만원 이상</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dadam-charcoal mb-2">
                    희망 완료 시기
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-dadam-warm focus:border-dadam-ai-primary focus:ring-2 focus:ring-dadam-ai-primary/20 outline-none transition-all"
                  >
                    <option value="">선택해주세요</option>
                    <option value="1month">1개월 이내</option>
                    <option value="2month">2개월 이내</option>
                    <option value="3month">3개월 이내</option>
                    <option value="flexible">유연함</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dadam-charcoal mb-2">
                    요청 사항 (선택)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="원하시는 스타일, 자재, 특별한 요청사항을 적어주세요."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-dadam-warm focus:border-dadam-ai-primary focus:ring-2 focus:ring-dadam-ai-primary/20 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="btn-outline"
                >
                  이전
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="btn-primary"
                >
                  다음 단계
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact */}
          {currentStep === 2 && (
            <div className="p-8 md:p-12">
              <h2 className="font-serif text-2xl text-dadam-charcoal mb-2">
                연락처를 알려주세요
              </h2>
              <p className="text-dadam-gray mb-8">담당자가 빠르게 연락드리겠습니다.</p>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dadam-charcoal mb-2">
                      이름 *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="홍길동"
                      className="w-full px-4 py-3 rounded-xl border border-dadam-warm focus:border-dadam-ai-primary focus:ring-2 focus:ring-dadam-ai-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dadam-charcoal mb-2">
                      연락처 *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="010-1234-5678"
                      className="w-full px-4 py-3 rounded-xl border border-dadam-warm focus:border-dadam-ai-primary focus:ring-2 focus:ring-dadam-ai-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dadam-charcoal mb-2">
                    이메일 (선택)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-dadam-warm focus:border-dadam-ai-primary focus:ring-2 focus:ring-dadam-ai-primary/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dadam-charcoal mb-2">
                    주소 (선택)
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="서울시 강남구..."
                    className="w-full px-4 py-3 rounded-xl border border-dadam-warm focus:border-dadam-ai-primary focus:ring-2 focus:ring-dadam-ai-primary/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dadam-charcoal mb-2">
                    연락 가능 시간
                  </label>
                  <select
                    value={formData.contactTime}
                    onChange={(e) => setFormData({...formData, contactTime: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-dadam-warm focus:border-dadam-ai-primary focus:ring-2 focus:ring-dadam-ai-primary/20 outline-none transition-all"
                  >
                    <option value="">선택해주세요</option>
                    <option value="morning">오전 (9:00 - 12:00)</option>
                    <option value="afternoon">오후 (12:00 - 18:00)</option>
                    <option value="evening">저녁 (18:00 - 21:00)</option>
                    <option value="anytime">언제든 가능</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="btn-outline"
                >
                  이전
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn-primary"
                >
                  견적 요청하기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 3 && (
            <div className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-dadam-ai-primary to-dadam-ai-secondary flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-serif text-3xl text-dadam-charcoal mb-4">
                견적 요청이 완료되었습니다!
              </h2>
              <p className="text-dadam-gray mb-8 max-w-md mx-auto">
                담당자가 영업일 기준 1-2일 내에 연락드리겠습니다.
                빠른 상담을 원하시면 AI 상담을 이용해보세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/ai-design" className="btn-primary">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI 상담 받기
                </Link>
                <Link href="/" className="btn-outline">
                  홈으로 돌아가기
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-dadam-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl text-dadam-charcoal">
              다담가구 견적의 <span className="gradient-text">특별함</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Calculator, title: '투명한 견적', description: 'AI 분석으로 정확하고 투명한 견적을 제공합니다' },
              { icon: Clock, title: '빠른 응답', description: '영업일 기준 1-2일 내 담당자가 연락드립니다' },
              { icon: FileText, title: '상세 견적서', description: '항목별 상세 견적서를 제공합니다' },
              { icon: Shield, title: '가격 보장', description: '견적 확정 후 추가 비용 없음을 보장합니다' },
            ].map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-dadam-cream flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-dadam-ai-primary" />
                </div>
                <h3 className="font-medium text-dadam-charcoal mb-2">{benefit.title}</h3>
                <p className="text-sm text-dadam-gray">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-dadam-charcoal text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="font-serif text-3xl mb-4">
            빠른 상담이 필요하신가요?
          </h2>
          <p className="text-dadam-gray mb-8">
            전화 상담으로 바로 연결해드립니다.
          </p>
          <a
            href="tel:02-1234-5678"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-dadam-charcoal rounded-xl hover:bg-dadam-cream transition-colors"
          >
            <Phone className="w-5 h-5" />
            <span className="font-medium">02-1234-5678</span>
          </a>
          <p className="text-sm text-dadam-gray mt-4">
            평일 09:00 - 18:00 (주말 및 공휴일 휴무)
          </p>
        </div>
      </section>
    </div>
  )
}
