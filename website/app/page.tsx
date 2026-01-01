'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight, Instagram } from 'lucide-react'

// Hero slides data
const heroSlides = [
  {
    id: 1,
    title: 'DADAM KITCHEN',
    titleKr: '프리미엄 주방 가구',
    subtitle: '더욱 완벽해진 다담 키친을 만나보세요.',
    description: 'AI가 설계하고 장인이 완성하는',
    image: '/portfolio/kitchen-n1-1.jpg',
    link: '/portfolio',
  },
  {
    id: 2,
    title: 'Premium Collection',
    titleKr: '프리미엄 컬렉션',
    subtitle: '다담과 AI의 공간에 대한 철학을 담아 완성한',
    description: '하이엔드 프리미엄 공간',
    image: '/portfolio/kitchen-n7-1.jpg',
    link: '/portfolio',
  },
  {
    id: 3,
    title: 'Custom Design',
    titleKr: '맞춤형 디자인',
    subtitle: 'AI와 장인 크리에이티브 디렉터가 만나 선보이는',
    description: '새로운 공간 디자인 제안',
    image: '/portfolio/kitchen-n2-1.jpg',
    link: '/ai-design',
  },
]

// Product categories
const productCategories = [
  { id: 1, name: '키친', nameEn: 'Kitchen', image: '/portfolio/kitchen-n1-2.jpg', link: '/products/kitchen' },
  { id: 2, name: '수납장', nameEn: 'Storage', image: '/portfolio/kitchen-n6-1.jpg', link: '/products/storage' },
  { id: 3, name: '붙박이장', nameEn: 'Built-in', image: '/portfolio/kitchen-n3-2.jpg', link: '/products/builtin' },
  { id: 4, name: '가구', nameEn: 'Furniture', image: '/portfolio/funiture-n4-1.jpg', link: '/products/furniture' },
  { id: 5, name: '인테리어', nameEn: 'Interior', image: '/portfolio/kitchen-n7-2.jpg', link: '/products/interior' },
]

// Portfolio items for grid
const portfolioItems = [
  { id: 1, image: '/portfolio/kitchen-n1-3.jpg' },
  { id: 2, image: '/portfolio/kitchen-n1-4.jpg' },
  { id: 3, image: '/portfolio/kitchen-n6-2.jpg' },
  { id: 4, image: '/portfolio/kitchen-n6-3.jpg' },
  { id: 5, image: '/portfolio/kitchen-n7-3.jpg' },
  { id: 6, image: '/portfolio/kitchen-n7-4.jpg' },
  { id: 7, image: '/portfolio/kitchen-n3-3.jpg' },
  { id: 8, image: '/portfolio/kitchen-n4-1.jpg' },
]

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        nextSlide()
      }
    }, 6000)
    return () => clearInterval(timer)
  }, [currentSlide, isAnimating])

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setTimeout(() => setIsAnimating(false), 1000)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setTimeout(() => setIsAnimating(false), 1000)
  }

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 1000)
  }

  return (
    <>
      {/* Hero Slider Section */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-[1800px] mx-auto px-6 lg:px-12 w-full">
                <div className="max-w-2xl">
                  <h1
                    className={`font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-tight transition-all duration-1000 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}
                    style={{ transitionDelay: '200ms' }}
                  >
                    {slide.title}
                  </h1>
                  <p
                    className={`mt-4 text-lg md:text-xl text-white/80 transition-all duration-1000 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}
                    style={{ transitionDelay: '400ms' }}
                  >
                    {slide.subtitle}
                  </p>
                  <p
                    className={`mt-2 text-white/60 transition-all duration-1000 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}
                    style={{ transitionDelay: '500ms' }}
                  >
                    {slide.description}
                  </p>
                  <Link
                    href={slide.link}
                    className={`inline-flex items-center gap-2 mt-8 px-8 py-4 border border-white/50 text-white text-sm tracking-widest uppercase hover:bg-white hover:text-dadam-charcoal transition-all duration-500 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}
                    style={{ transitionDelay: '600ms' }}
                  >
                    See more
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <div className="absolute bottom-12 left-6 lg:left-12 z-20 flex items-center gap-4">
          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="group relative h-1 w-12 bg-white/30 overflow-hidden"
              >
                <div
                  className={`absolute inset-y-0 left-0 bg-white transition-all ${
                    index === currentSlide ? 'animate-progress' : 'w-0'
                  }`}
                  style={{
                    width: index === currentSlide ? '100%' : index < currentSlide ? '100%' : '0%',
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute bottom-12 right-6 lg:right-12 z-20 flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="w-12 h-12 flex items-center justify-center border border-white/30 text-white hover:bg-white hover:text-dadam-charcoal transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12 flex items-center justify-center border border-white/30 text-white hover:bg-white hover:text-dadam-charcoal transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Slide Counter */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-white/60 text-sm tracking-widest">
          <span className="text-white">{String(currentSlide + 1).padStart(2, '0')}</span>
          <span className="mx-2">/</span>
          <span>{String(heroSlides.length).padStart(2, '0')}</span>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <h2 className="text-center font-serif text-3xl md:text-4xl text-dadam-charcoal mb-12">
            Our products
          </h2>

          {/* Horizontal Scroll Categories */}
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {productCategories.map((category) => (
                <Link
                  key={category.id}
                  href={category.link}
                  className="group relative flex-shrink-0 w-72 md:w-80 aspect-[4/3] overflow-hidden"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-xs tracking-widest uppercase text-white/70">{category.nameEn}</p>
                    <h3 className="font-serif text-2xl mt-1">{category.name}</h3>
                    <div className="flex items-center gap-2 mt-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>더보기</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dadam in Home Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/portfolio/kitchen-n7-1.jpg"
            alt="다담 인테리어"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
            DADAM in home
          </h2>
          <p className="text-white/70 mb-12">인테리어 트렌드 with 다담</p>

          <div className="grid md:grid-cols-3 gap-8 md:gap-16 max-w-4xl">
            <Link href="/portfolio" className="group text-center">
              <h3 className="font-serif text-2xl text-white mb-4">시공사례</h3>
              <div className="flex items-center justify-center gap-4 text-white/50 group-hover:text-white transition-colors">
                <span className="w-8 h-px bg-current" />
                <span className="text-sm tracking-widest uppercase">open</span>
                <span className="w-8 h-px bg-current" />
              </div>
              <p className="mt-4 text-sm text-white/50">
                고객이 선택한 다담!
                <br />
                직접 확인해보세요
              </p>
            </Link>

            <Link href="/ai-design" className="group text-center">
              <h3 className="font-serif text-2xl text-white mb-4">AI 설계</h3>
              <div className="flex items-center justify-center gap-4 text-white/50 group-hover:text-white transition-colors">
                <span className="w-8 h-px bg-current" />
                <span className="text-sm tracking-widest uppercase">open</span>
                <span className="w-8 h-px bg-current" />
              </div>
              <p className="mt-4 text-sm text-white/50">
                AI와 함께하는
                <br />
                스마트한 인테리어
              </p>
            </Link>

            <Link href="/showroom" className="group text-center">
              <h3 className="font-serif text-2xl text-white mb-4">쇼룸</h3>
              <div className="flex items-center justify-center gap-4 text-white/50 group-hover:text-white transition-colors">
                <span className="w-8 h-px bg-current" />
                <span className="text-sm tracking-widest uppercase">open</span>
                <span className="w-8 h-px bg-current" />
              </div>
              <p className="mt-4 text-sm text-white/50">
                다담 쇼룸에서
                <br />
                직접 만나보세요
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story Banner */}
      <section className="py-20 bg-dadam-cream">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/portfolio/kitchen-n4-1.jpg"
                alt="다담 스토리"
                fill
                className="object-cover"
              />
            </div>
            <div className="py-8">
              <p className="text-sm tracking-widest uppercase text-dadam-gold mb-4">Brand Story</p>
              <h2 className="font-serif text-4xl md:text-5xl text-dadam-charcoal leading-tight">
                스마트 디자인
              </h2>
              <p className="text-dadam-gray mt-2 mb-8">다담 x AI 인테리어</p>
              <p className="text-dadam-gray leading-relaxed mb-8">
                다담가구는 AI 기술과 30년 장인정신을 결합하여
                고객 맞춤형 프리미엄 가구를 제작합니다.
                최고급 자재와 정교한 시공으로 완벽한 공간을 만들어 드립니다.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 bg-dadam-charcoal text-white text-sm tracking-widest uppercase hover:bg-dadam-gold transition-colors"
              >
                See more
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Grid Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <Instagram size={24} className="text-dadam-charcoal" />
              <span className="text-lg text-dadam-charcoal">@dadam_furniture</span>
            </div>
            <Link
              href="https://instagram.com"
              target="_blank"
              className="text-sm text-dadam-gray hover:text-dadam-charcoal transition-colors"
            >
              팔로우하기 →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {portfolioItems.map((item) => (
              <Link
                key={item.id}
                href="/portfolio"
                className="group relative aspect-square overflow-hidden"
              >
                <Image
                  src={item.image}
                  alt={`Portfolio ${item.id}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <Instagram
                    size={32}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-dadam-charcoal">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
            무료 상담 신청
          </h2>
          <p className="text-white/60 mb-10">
            AI 설계 시스템으로 최적의 맞춤 가구를 만나보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quote"
              className="px-10 py-4 bg-white text-dadam-charcoal text-sm tracking-widest uppercase hover:bg-dadam-gold hover:text-white transition-colors"
            >
              견적 문의
            </Link>
            <Link
              href="/ai-design"
              className="px-10 py-4 border border-white/30 text-white text-sm tracking-widest uppercase hover:bg-white hover:text-dadam-charcoal transition-colors"
            >
              AI 설계 시작
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
