import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Sparkles,
  MessageSquare,
  Ruler,
  Wrench,
  Shield,
  Award,
  Gem,
  Clock,
  CheckCircle2,
  Star,
  Play
} from 'lucide-react'

// Featured portfolio items with images
const featuredWorks = [
  {
    id: 1,
    title: '모던 빌트인 수납장',
    category: '거실 수납장',
    description: '블랙 프레임과 붉은 포인트 조명이 어우러진 프리미엄 빌트인 책장',
    image: '/portfolio/bookshelf.jpg',
  },
  {
    id: 2,
    title: '프리미엄 키친 아일랜드',
    category: '주방 가구',
    description: '다크 우드와 대리석이 조화를 이루는 고급 주방 시스템',
    image: '/portfolio/kitchen-island.jpg',
  },
  {
    id: 3,
    title: '대리석 싱크대',
    category: '주방 상판',
    description: '천연 대리석 상판과 고급 수전이 돋보이는 싱크 시스템',
    image: '/portfolio/sink-detail.jpg',
  },
  {
    id: 4,
    title: '갤리 키친 시스템',
    category: '주방 전체',
    description: '효율적인 동선과 넉넉한 수납을 갖춘 복도형 주방',
    image: '/portfolio/galley-kitchen.jpg',
  },
  {
    id: 5,
    title: '스마트 수납 시스템',
    category: '빌트인 수납',
    description: 'Blum 서랍 시스템을 적용한 프리미엄 수납 솔루션',
    image: '/portfolio/storage-detail.jpg',
  },
]

// Process steps with AI focus
const processSteps = [
  {
    number: '01',
    title: 'AI 상담',
    description: 'AI Agent와 대화하며 라이프스타일과 공간 요구사항을 분석합니다',
    icon: MessageSquare,
    aiFeature: true,
  },
  {
    number: '02',
    title: 'AI 설계',
    description: 'AI가 최적의 가구 배치와 디자인을 제안합니다',
    icon: Ruler,
    aiFeature: true,
  },
  {
    number: '03',
    title: '장인 제작',
    description: '30년 경력의 장인이 고급 자재로 직접 제작합니다',
    icon: Wrench,
  },
  {
    number: '04',
    title: '설치 & A/S',
    description: '완벽한 설치와 평생 A/S를 약속합니다',
    icon: Shield,
  },
]

// Key features
const features = [
  {
    icon: Sparkles,
    title: 'AI 맞춤 설계',
    description: 'AI Agent가 당신의 라이프스타일을 분석하여 최적의 가구 디자인을 제안합니다.',
    highlight: true,
  },
  {
    icon: Gem,
    title: '프리미엄 자재',
    description: '엄선된 유럽산 원목과 친환경 마감재만을 사용합니다.',
  },
  {
    icon: Award,
    title: '장인정신',
    description: '30년 이상 경력의 숙련된 장인이 한 땀 한 땀 정성껏 제작합니다.',
  },
  {
    icon: Clock,
    title: '최적의 견적',
    description: 'AI 분석을 통해 불필요한 비용 없이 최적의 견적을 제공합니다.',
  },
  {
    icon: Shield,
    title: '평생 A/S',
    description: '제작 후에도 평생 무상 A/S를 통해 최상의 상태를 유지해드립니다.',
  },
  {
    icon: CheckCircle2,
    title: '100% 맞춤 제작',
    description: '밀리미터 단위의 정밀한 맞춤 제작으로 공간 활용을 극대화합니다.',
  },
]

// Testimonials
const testimonials = [
  {
    name: '김OO 고객님',
    location: '청담동',
    content: 'AI 상담이 정말 놀라웠어요. 제가 미처 생각하지 못한 부분까지 세심하게 제안해주셨습니다.',
    rating: 5,
  },
  {
    name: '박OO 고객님',
    location: '한남동',
    content: '견적부터 설치까지 투명하고 전문적이었습니다. 완성된 가구 품질에 매우 만족합니다.',
    rating: 5,
  },
  {
    name: '이OO 고객님',
    location: '분당',
    content: '장인분들의 섬세한 손길이 느껴지는 가구입니다. A/S도 빠르고 친절해요.',
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Full Image Background */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/portfolio/kitchen-island.jpg"
            alt="프리미엄 맞춤 가구"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-32">
          <div className="max-w-2xl">
            {/* AI Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-dadam-gold" />
              <span className="text-sm font-medium text-white">AI Agent 기반 설계 시스템</span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-tight">
              AI가 설계하는
              <br />
              <span className="text-dadam-gold">프리미엄 맞춤 가구</span>
            </h1>

            <p className="mt-8 text-lg md:text-xl text-white/80 leading-relaxed">
              AI Agent가 당신의 라이프스타일을 분석하고,
              <br className="hidden md:block" />
              장인의 손끝에서 완성되는 특별한 가구를 경험하세요.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <Link href="/ai-design" className="btn-gold group">
                <Sparkles className="w-5 h-5 mr-2" />
                AI 설계 상담 시작
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/portfolio" className="btn-outline border-white/30 text-white hover:bg-white hover:text-dadam-charcoal">
                포트폴리오 보기
              </Link>
            </div>

            {/* Quick stats */}
            <div className="mt-16 flex flex-wrap gap-8 md:gap-12">
              {[
                { label: 'AI 상담 완료', value: '1,200+' },
                { label: '제작 프로젝트', value: '850+' },
                { label: '고객 만족도', value: '99.2%' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl md:text-4xl font-serif text-dadam-gold">{stat.value}</p>
                  <p className="text-sm text-white/60 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-xs tracking-widest uppercase text-white/50">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-dadam-gold to-transparent" />
          </div>
        </div>
      </section>

      {/* Featured Project Showcase */}
      <section className="py-0">
        <div className="grid md:grid-cols-2">
          {/* Left - Large Image */}
          <div className="relative aspect-square md:aspect-auto md:h-[80vh]">
            <Image
              src="/portfolio/bookshelf.jpg"
              alt="빌트인 수납장"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <p className="text-sm tracking-widest uppercase text-dadam-gold mb-2">Featured Project</p>
              <h3 className="font-serif text-3xl mb-2">모던 빌트인 수납장</h3>
              <p className="text-white/70">블랙 프레임과 붉은 포인트 조명의 조화</p>
            </div>
          </div>

          {/* Right - Content + Small Image */}
          <div className="flex flex-col">
            <div className="flex-1 bg-dadam-charcoal p-12 md:p-16 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dadam-gold/10 border border-dadam-gold/30 mb-6 w-fit">
                <Sparkles className="w-4 h-4 text-dadam-gold" />
                <span className="text-xs text-dadam-gold font-medium">AI 설계</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-white leading-tight mb-6">
                당신만을 위한
                <br />
                <span className="text-dadam-gold">맞춤 가구 설계</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-8">
                다담가구의 AI Agent는 단순한 챗봇이 아닙니다.
                당신의 라이프스타일, 공간의 특성, 취향을 깊이 이해하고
                최적의 가구 디자인을 제안하는 전문 설계 시스템입니다.
              </p>
              <Link
                href="/ai-design"
                className="inline-flex items-center gap-2 text-dadam-gold group"
              >
                <span className="border-b border-dadam-gold/30 group-hover:border-dadam-gold transition-colors">AI 상담 시작하기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative h-64 md:h-auto md:flex-1">
              <Image
                src="/portfolio/sink-detail.jpg"
                alt="대리석 싱크대"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="section-padding bg-dadam-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <p className="text-sm tracking-widest uppercase text-dadam-gold mb-4">Portfolio</p>
              <h2 className="font-serif text-4xl md:text-5xl text-dadam-charcoal">
                최근 프로젝트
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="mt-6 md:mt-0 inline-flex items-center gap-2 text-dadam-charcoal group"
            >
              <span className="border-b border-dadam-charcoal/30 group-hover:border-dadam-charcoal transition-colors">전체 보기</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {featuredWorks.slice(0, 3).map((work) => (
              <Link
                key={work.id}
                href={`/portfolio/${work.id}`}
                className="group relative aspect-[4/5] overflow-hidden"
              >
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-xs tracking-widest uppercase text-dadam-gold mb-2">{work.category}</p>
                  <h3 className="font-serif text-xl">{work.title}</h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Second row - 2 images */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {featuredWorks.slice(3, 5).map((work) => (
              <Link
                key={work.id}
                href={`/portfolio/${work.id}`}
                className="group relative aspect-[16/9] overflow-hidden"
              >
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-xs tracking-widest uppercase text-dadam-gold mb-2">{work.category}</p>
                  <h3 className="font-serif text-xl">{work.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-dadam-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest uppercase text-dadam-gold mb-4">Why Dadam</p>
            <h2 className="font-serif text-4xl md:text-5xl text-dadam-charcoal">
              다담가구의 약속
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`p-8 bg-white rounded-sm border border-dadam-warm/50 hover:border-dadam-gold/30 transition-colors ${
                  feature.highlight ? 'lg:col-span-2' : ''
                }`}
              >
                <div className={`w-14 h-14 rounded-sm flex items-center justify-center mb-6 ${
                  feature.highlight
                    ? 'bg-dadam-charcoal'
                    : 'bg-dadam-cream'
                }`}>
                  <feature.icon className={`w-7 h-7 ${feature.highlight ? 'text-dadam-gold' : 'text-dadam-charcoal'}`} />
                </div>
                <h3 className="font-serif text-2xl text-dadam-charcoal mb-3">
                  {feature.title}
                </h3>
                <p className="text-dadam-gray leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-dadam-charcoal text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest uppercase text-dadam-gold mb-4">Process</p>
            <h2 className="font-serif text-4xl md:text-5xl">
              AI와 장인이 함께하는
              <br />
              <span className="text-dadam-gold">완벽한 프로세스</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => (
              <div key={step.number} className="group">
                <div className="relative p-8 border border-white/10 hover:border-dadam-gold/30 transition-colors">
                  {/* Step number */}
                  <span className={`absolute top-4 right-4 font-serif text-5xl ${
                    step.aiFeature ? 'text-dadam-gold/30' : 'text-white/10'
                  }`}>
                    {step.number}
                  </span>

                  {/* AI Badge */}
                  {step.aiFeature && (
                    <div className="absolute top-4 left-4 px-2 py-1 bg-dadam-gold/10 border border-dadam-gold/30">
                      <span className="text-[10px] text-dadam-gold font-medium">AI</span>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-12 h-12 flex items-center justify-center mb-6 mt-4 ${
                    step.aiFeature
                      ? 'bg-dadam-gold/10'
                      : 'bg-white/5'
                  }`}>
                    <step.icon size={24} className={step.aiFeature ? 'text-dadam-gold' : 'text-white/70'} />
                  </div>

                  <h3 className="font-serif text-2xl text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-dadam-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest uppercase text-dadam-gold mb-4">Reviews</p>
            <h2 className="font-serif text-4xl md:text-5xl text-dadam-charcoal">
              고객 후기
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 border border-dadam-warm/50"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-dadam-gold text-dadam-gold" />
                  ))}
                </div>
                <p className="text-dadam-charcoal leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>
                <div className="pt-6 border-t border-dadam-warm/50">
                  <p className="font-medium text-dadam-charcoal">{testimonial.name}</p>
                  <p className="text-sm text-dadam-gray">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32">
        <div className="absolute inset-0">
          <Image
            src="/portfolio/galley-kitchen.jpg"
            alt="프리미엄 주방"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <p className="text-sm tracking-widest uppercase text-dadam-gold mb-4">Get Started</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
            지금 바로
            <br />
            무료 상담을 시작하세요
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-10">
            AI 분석을 통해 불필요한 비용 없이 투명한 견적을 제공합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote" className="btn-gold">
              무료 견적 받기
            </Link>
            <Link href="/ai-design" className="btn-outline border-white/30 text-white hover:bg-white hover:text-dadam-charcoal">
              <Sparkles className="w-4 h-4 mr-2" />
              AI 상담 시작
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
