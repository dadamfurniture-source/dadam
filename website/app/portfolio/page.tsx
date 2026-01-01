'use client'

import { useState } from 'react'
import Link from 'next/link'

const categories = [
  { id: 'all', label: '전체' },
  { id: 'kitchen', label: '주방' },
  { id: 'dressroom', label: '드레스룸' },
  { id: 'living', label: '거실' },
  { id: 'study', label: '서재' },
  { id: 'bedroom', label: '침실' },
  { id: 'builtin', label: '빌트인' },
]

const portfolioItems = [
  {
    id: 1,
    title: '청담동 펜트하우스',
    category: 'kitchen',
    categoryLabel: '주방',
    location: '서울 청담동',
    size: '42평',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    description: '미니멀한 화이트 톤의 아일랜드 키친',
  },
  {
    id: 2,
    title: '한남동 타운하우스',
    category: 'study',
    categoryLabel: '서재',
    location: '서울 한남동',
    size: '35평',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80',
    description: '월넛 원목 서재 시스템',
  },
  {
    id: 3,
    title: '성수동 복층 오피스텔',
    category: 'living',
    categoryLabel: '거실',
    location: '서울 성수동',
    size: '28평',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    description: '복층 구조에 맞춘 맞춤형 거실장',
  },
  {
    id: 4,
    title: '분당 단독주택',
    category: 'builtin',
    categoryLabel: '빌트인',
    location: '경기 분당',
    size: '65평',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80',
    description: '전체 공간 빌트인 시스템',
  },
  {
    id: 5,
    title: '판교 아파트',
    category: 'dressroom',
    categoryLabel: '드레스룸',
    location: '경기 판교',
    size: '38평',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&q=80',
    description: '워크인 드레스룸 시스템',
  },
  {
    id: 6,
    title: '용산 오피스텔',
    category: 'bedroom',
    categoryLabel: '침실',
    location: '서울 용산',
    size: '25평',
    image: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=600&q=80',
    description: '침대 헤드보드 및 수납 시스템',
  },
  {
    id: 7,
    title: '강남 아파트',
    category: 'kitchen',
    categoryLabel: '주방',
    location: '서울 강남',
    size: '45평',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    description: '그레이 톤 모던 주방',
  },
  {
    id: 8,
    title: '서초 빌라',
    category: 'living',
    categoryLabel: '거실',
    location: '서울 서초',
    size: '32평',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    description: '벽면 전체 수납장',
  },
  {
    id: 9,
    title: '일산 주상복합',
    category: 'dressroom',
    categoryLabel: '드레스룸',
    location: '경기 일산',
    size: '50평',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&q=80',
    description: '파우더룸 연결 드레스룸',
  },
]

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredItems = activeCategory === 'all'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeCategory)

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary-navy mb-4">
            Portfolio
          </p>
          <div className="section-divider mb-6"></div>
          <h1 className="font-serif text-5xl md:text-6xl text-neutral-800">
            포트폴리오
          </h1>
          <p className="mt-6 text-neutral-500 max-w-2xl">
            다담가구가 완성한 공간들을 만나보세요. 각각의 프로젝트는
            고객의 라이프스타일을 반영한 맞춤형 설계로 탄생했습니다.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b border-neutral-200 sticky top-[80px] z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-wrap gap-2 md:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-sm transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-primary-navy text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <Link
                key={item.id}
                href={`/portfolio/${item.id}`}
                className="group block"
              >
                <div className="gallery-item">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full aspect-[4/5] object-cover"
                  />
                  <div className="overlay"></div>
                  <div className="content text-white">
                    <span className="text-xs tracking-widest uppercase text-primary-sky">
                      {item.categoryLabel}
                    </span>
                    <h3 className="text-xl font-serif mt-2">{item.title}</h3>
                    <p className="text-white/70 text-sm mt-1">{item.description}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-4">
                  <p className="text-xs text-primary-navy tracking-wider uppercase">
                    {item.categoryLabel}
                  </p>
                  <h3 className="font-serif text-xl text-neutral-800 mt-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-2">
                    {item.description}
                  </p>
                  <div className="flex gap-4 mt-3 text-xs text-neutral-400">
                    <span>{item.location}</span>
                    <span>•</span>
                    <span>{item.size}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load more */}
          <div className="text-center mt-16">
            <button className="btn-dark-outline">
              더 많은 프로젝트 보기
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-neutral-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-neutral-800">
            나만의 공간을 계획하고 계신가요?
          </h2>
          <p className="mt-4 text-neutral-500">
            다담가구와 함께 당신만의 특별한 공간을 완성해보세요.
          </p>
          <Link href="/contact" className="inline-block mt-8 btn-dark">
            무료 상담 신청하기
          </Link>
        </div>
      </section>
    </>
  )
}
