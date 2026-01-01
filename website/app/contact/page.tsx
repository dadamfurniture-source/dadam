'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from 'lucide-react'

const consultTypes = [
  { id: 'new', label: '신규 상담' },
  { id: 'partner', label: '파트너 등록' },
  { id: 'as', label: 'A/S 문의' },
  { id: 'other', label: '기타 문의' },
]

const furnitureTypes = [
  { id: 'kitchen', label: '주방' },
  { id: 'dressroom', label: '드레스룸' },
  { id: 'living', label: '거실장' },
  { id: 'study', label: '서재' },
  { id: 'bedroom', label: '침실' },
  { id: 'builtin', label: '빌트인 전체' },
  { id: 'other', label: '기타' },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    consultType: 'new',
    name: '',
    phone: '',
    email: '',
    address: '',
    size: '',
    furnitureTypes: [] as string[],
    budget: '',
    timeline: '',
    message: '',
    privacy: false,
  })

  const handleFurnitureTypeToggle = (typeId: string) => {
    setFormData(prev => ({
      ...prev,
      furnitureTypes: prev.furnitureTypes.includes(typeId)
        ? prev.furnitureTypes.filter(t => t !== typeId)
        : [...prev.furnitureTypes, typeId]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('상담 신청이 완료되었습니다. 곧 연락드리겠습니다.')
  }

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary-navy mb-4">
            Contact Us
          </p>
          <div className="section-divider mb-6"></div>
          <h1 className="font-serif text-5xl md:text-6xl text-neutral-800">
            상담 문의
          </h1>
          <p className="mt-6 text-neutral-500 max-w-2xl">
            다담가구와 함께 당신만의 특별한 공간을 설계해보세요.
            무료 상담을 통해 시작하실 수 있습니다.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Phone,
                title: '전화 상담',
                content: '02-1234-5678',
                sub: '평일 09:00 - 18:00',
              },
              {
                icon: MessageSquare,
                title: '카카오톡',
                content: '@다담가구',
                sub: '실시간 상담 가능',
              },
              {
                icon: Mail,
                title: '이메일',
                content: 'contact@dadam.co.kr',
                sub: '24시간 접수',
              },
              {
                icon: MapPin,
                title: '쇼룸',
                content: '서울시 강남구 논현동 123-45',
                sub: '방문 상담 예약제',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 bg-neutral-50 rounded-sm text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center mb-4">
                  <item.icon size={20} className="text-primary-navy" />
                </div>
                <h3 className="font-medium text-neutral-800">
                  {item.title}
                </h3>
                <p className="text-neutral-700 mt-2">
                  {item.content}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-neutral-100">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 md:p-12 rounded-sm">
            <h2 className="font-serif text-2xl md:text-3xl text-neutral-800 text-center mb-8">
              상담 신청서
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Consult Type */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  문의 유형 *
                </label>
                <div className="flex flex-wrap gap-2">
                  {consultTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, consultType: type.id }))}
                      className={`px-4 py-2 text-sm transition-all ${
                        formData.consultType === type.id
                          ? 'bg-primary-navy text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    이름 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-sm focus:outline-none focus:border-primary-navy transition-colors"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    연락처 *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-sm focus:outline-none focus:border-primary-navy transition-colors"
                    placeholder="010-1234-5678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-sm focus:outline-none focus:border-primary-navy transition-colors"
                  placeholder="email@example.com"
                />
              </div>

              {formData.consultType === 'new' && (
                <>
                  {/* Address & Size */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        주소 (시공 예정 장소)
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-sm focus:outline-none focus:border-primary-navy transition-colors"
                        placeholder="서울시 강남구..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        평형
                      </label>
                      <input
                        type="text"
                        value={formData.size}
                        onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-sm focus:outline-none focus:border-primary-navy transition-colors"
                        placeholder="32평"
                      />
                    </div>
                  </div>

                  {/* Furniture Types */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      관심 품목 (복수 선택 가능)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {furnitureTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => handleFurnitureTypeToggle(type.id)}
                          className={`px-4 py-2 text-sm transition-all ${
                            formData.furnitureTypes.includes(type.id)
                              ? 'bg-primary-navy text-white'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget & Timeline */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        예산 범위
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-sm focus:outline-none focus:border-primary-navy transition-colors bg-white"
                      >
                        <option value="">선택해주세요</option>
                        <option value="under-500">500만원 미만</option>
                        <option value="500-1000">500만원 ~ 1,000만원</option>
                        <option value="1000-2000">1,000만원 ~ 2,000만원</option>
                        <option value="2000-3000">2,000만원 ~ 3,000만원</option>
                        <option value="over-3000">3,000만원 이상</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        희망 설치 시기
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-sm focus:outline-none focus:border-primary-navy transition-colors bg-white"
                      >
                        <option value="">선택해주세요</option>
                        <option value="asap">가능한 빨리</option>
                        <option value="1month">1개월 이내</option>
                        <option value="3months">3개월 이내</option>
                        <option value="6months">6개월 이내</option>
                        <option value="undecided">미정</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  상담 내용
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-sm focus:outline-none focus:border-primary-navy transition-colors resize-none"
                  placeholder="문의하실 내용을 자유롭게 작성해주세요."
                />
              </div>

              {/* Privacy Consent */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="privacy"
                  required
                  checked={formData.privacy}
                  onChange={(e) => setFormData(prev => ({ ...prev, privacy: e.target.checked }))}
                  className="mt-1"
                />
                <label htmlFor="privacy" className="text-sm text-neutral-500">
                  [필수] 개인정보 수집 및 이용에 동의합니다.
                  수집된 정보는 상담 목적으로만 사용되며, 상담 완료 후 3개월간 보관 후 파기됩니다.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-primary-navy text-white text-sm tracking-widest uppercase transition-all hover:bg-primary-dark flex items-center justify-center gap-2"
              >
                <Send size={16} />
                상담 신청하기
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Showroom Info */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-primary-navy mb-4">
                Showroom
              </p>
              <div className="section-divider mb-8"></div>
              <h2 className="font-serif text-3xl md:text-4xl text-neutral-800">
                쇼룸 방문 안내
              </h2>
              <p className="mt-6 text-neutral-500">
                다담가구 쇼룸에서 실제 자재와 완성된 가구를 직접 확인하실 수 있습니다.
                방문 상담은 사전 예약제로 운영됩니다.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin size={20} className="text-primary-sky flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-neutral-800">주소</p>
                    <p className="text-neutral-500">서울시 강남구 논현동 123-45 다담빌딩</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock size={20} className="text-primary-sky flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-neutral-800">운영 시간</p>
                    <p className="text-neutral-500">평일 10:00 - 19:00 (점심 12:00 - 13:00)</p>
                    <p className="text-neutral-500">토요일 10:00 - 17:00 (예약제)</p>
                    <p className="text-neutral-500">일요일/공휴일 휴무</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone size={20} className="text-primary-sky flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-neutral-800">예약 문의</p>
                    <p className="text-neutral-500">02-1234-5678</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {/* Map placeholder */}
              <div className="aspect-[4/3] bg-neutral-100 rounded-sm flex items-center justify-center">
                <div className="text-center text-neutral-400">
                  <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                  <p>지도 영역</p>
                  <p className="text-sm mt-1">서울시 강남구 논현동 123-45</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
