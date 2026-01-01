'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Globe, Star, ArrowRight } from 'lucide-react'

const regions = [
  { id: 'all', label: '전체' },
  { id: 'seoul', label: '서울' },
  { id: 'gyeonggi', label: '경기' },
  { id: 'incheon', label: '인천' },
  { id: 'busan', label: '부산' },
  { id: 'other', label: '기타 지역' },
]

const partners = [
  {
    id: 1,
    name: '스튜디오 루미',
    region: 'seoul',
    address: '서울 강남구 논현동 123-45',
    phone: '02-1234-5678',
    website: 'www.studiolumi.kr',
    specialty: ['모던', '미니멀', '북유럽'],
    rating: 4.9,
    projects: 128,
    description: '공간의 본질을 추구하는 미니멀 디자인 전문 스튜디오입니다.',
    initial: 'L',
  },
  {
    id: 2,
    name: '디자인 오피스 온',
    region: 'seoul',
    address: '서울 서초구 서초동 456-78',
    phone: '02-2345-6789',
    website: 'www.designofficeon.com',
    specialty: ['럭셔리', '클래식', '호텔식'],
    rating: 4.8,
    projects: 95,
    description: '럭셔리 주거 공간 전문 인테리어 디자인 오피스입니다.',
    initial: 'O',
  },
  {
    id: 3,
    name: '홈앤리빙 디자인',
    region: 'gyeonggi',
    address: '경기 성남시 분당구 정자동 789',
    phone: '031-345-6789',
    website: 'www.homeliving.co.kr',
    specialty: ['가족형', '실용적', '수납특화'],
    rating: 4.7,
    projects: 210,
    description: '가족의 라이프스타일을 고려한 실용적인 공간 설계 전문입니다.',
    initial: 'H',
  },
  {
    id: 4,
    name: '아뜰리에 모노',
    region: 'seoul',
    address: '서울 마포구 연남동 234-56',
    phone: '02-3456-7890',
    website: 'www.ateliermono.kr',
    specialty: ['빈티지', '인더스트리얼', '카페'],
    rating: 4.9,
    projects: 76,
    description: '빈티지와 모던의 조화로운 공간을 만듭니다.',
    initial: 'M',
  },
  {
    id: 5,
    name: '리빙스케이프',
    region: 'incheon',
    address: '인천 연수구 송도동 567-89',
    phone: '032-456-7890',
    website: 'www.livingscape.kr',
    specialty: ['모던', '스마트홈', '신축'],
    rating: 4.6,
    projects: 145,
    description: '스마트홈 통합 인테리어 솔루션을 제공합니다.',
    initial: 'S',
  },
  {
    id: 6,
    name: '플레이스 디자인',
    region: 'busan',
    address: '부산 해운대구 우동 890-12',
    phone: '051-567-8901',
    website: 'www.placedesign.co.kr',
    specialty: ['오션뷰', '리조트', '모던'],
    rating: 4.8,
    projects: 88,
    description: '해안가 주거 공간 특화 인테리어 전문입니다.',
    initial: 'P',
  },
]

export default function PartnersPage() {
  const [activeRegion, setActiveRegion] = useState('all')

  const filteredPartners = activeRegion === 'all'
    ? partners
    : partners.filter(p => p.region === activeRegion)

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary-navy mb-4">
            Interior Partners
          </p>
          <div className="section-divider mb-6"></div>
          <h1 className="font-serif text-5xl md:text-6xl text-neutral-800">
            인테리어 파트너
          </h1>
          <p className="mt-6 text-neutral-500 max-w-2xl">
            다담가구와 함께하는 검증된 인테리어 디자인 업체들입니다.
            전문가의 손길로 완성되는 특별한 공간을 경험하세요.
          </p>
        </div>
      </section>

      {/* Region Filter */}
      <section className="py-8 bg-white border-b border-neutral-200 sticky top-[80px] z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-wrap gap-2 md:gap-4">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => setActiveRegion(region.id)}
                className={`px-4 py-2 text-sm transition-all duration-300 ${
                  activeRegion === region.id
                    ? 'bg-primary-navy text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {region.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPartners.map((partner) => (
              <div
                key={partner.id}
                className="card-lift bg-neutral-50 rounded-sm overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 bg-neutral-100 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                    <span className="text-xl font-serif text-primary-navy">{partner.initial}</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-neutral-800">
                      {partner.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span>{partner.rating}</span>
                      <span>•</span>
                      <span>프로젝트 {partner.projects}건</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-sm text-neutral-600">
                    {partner.description}
                  </p>

                  {/* Specialty Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {partner.specialty.map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-1 text-xs bg-white text-neutral-600 border border-neutral-200"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Contact Info */}
                  <div className="mt-6 pt-4 border-t border-neutral-200 space-y-2 text-sm text-neutral-500">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-primary-navy" />
                      <span>{partner.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-primary-navy" />
                      <span>{partner.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-primary-navy" />
                      <span>{partner.website}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button className="w-full mt-6 py-3 border border-primary-navy text-primary-navy text-sm tracking-widest uppercase transition-all duration-300 hover:bg-primary-navy hover:text-white">
                    업체 상세 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Registration CTA */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-primary-navy text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl">
            인테리어 업체 파트너십
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            다담가구와 함께 성장할 인테리어 디자인 업체를 찾고 있습니다.
            검증된 파트너로 등록하여 더 많은 고객을 만나보세요.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?type=partner"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-navy text-sm tracking-widest uppercase transition-all hover:bg-primary-sky"
            >
              파트너 등록 문의
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-neutral-800">
              파트너 혜택
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: '고객 연결',
                description: '다담가구를 통해 인테리어를 문의하는 고객을 직접 연결해 드립니다.',
              },
              {
                title: '가구 할인',
                description: '파트너 전용 특별 할인가로 다담가구 제품을 제공받으실 수 있습니다.',
              },
              {
                title: '공동 마케팅',
                description: '웹사이트, SNS 등을 통한 공동 홍보 및 마케팅을 지원합니다.',
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center p-8 bg-white rounded-sm">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
                  <span className="font-serif text-2xl text-primary-navy">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-neutral-800 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm text-neutral-500">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
