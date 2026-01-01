import Link from 'next/link'
import {
  ArrowRight,
  Sparkles,
  MessageSquare,
  Ruler,
  Palette,
  Wrench,
  Shield,
  Award,
  Gem,
  Clock,
  CheckCircle2,
  Star
} from 'lucide-react'

// Featured portfolio items
const featuredWorks = [
  {
    id: 1,
    title: '청담동 펜트하우스',
    category: '주방 & 드레스룸',
    description: 'AI 설계를 통한 최적의 수납 공간 구현',
    color: 'bg-gradient-to-br from-[#D4C5B5] to-[#C4B5A5]',
  },
  {
    id: 2,
    title: '한남동 타운하우스',
    category: '서재 & 수납장',
    description: '맞춤형 서재 시스템과 스마트 수납',
    color: 'bg-gradient-to-br from-[#B8C4C8] to-[#A8B4B8]',
  },
  {
    id: 3,
    title: '성수동 복층 오피스텔',
    category: '거실장 & 침실',
    description: '공간 효율을 극대화한 빌트인 설계',
    color: 'bg-gradient-to-br from-[#C8C0B8] to-[#B8B0A8]',
  },
  {
    id: 4,
    title: '분당 단독주택',
    category: '전체 빌트인',
    description: '집 전체를 아우르는 통합 가구 시스템',
    color: 'bg-gradient-to-br from-[#BCC4C0] to-[#ACB4B0]',
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
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Elegant Static Background */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-dadam-cream via-dadam-white to-dadam-cream" />

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(rgba(184, 149, 108, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(184, 149, 108, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px'
            }}
          />

          {/* Soft ambient gradients */}
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-dadam-ai-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-dadam-ai-secondary/5 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-dadam-gold/3 rounded-full blur-[150px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-32 text-center">
          <div className="animate-fade-in">
            {/* AI Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-dadam-ai-primary/10 to-dadam-ai-secondary/10 border border-dadam-ai-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-dadam-ai-primary animate-pulse" />
              <span className="text-sm font-medium gradient-text">AI Agent 기반 설계 시스템</span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-dadam-charcoal leading-tight">
              AI가 설계하는
              <br />
              <span className="gradient-text">프리미엄 맞춤 가구</span>
            </h1>

            <p className="mt-8 text-lg md:text-xl text-dadam-gray max-w-2xl mx-auto leading-relaxed">
              AI Agent가 당신의 라이프스타일을 분석하고,
              <br className="hidden md:block" />
              장인의 손끝에서 완성되는 특별한 가구를 경험하세요.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ai-design" className="btn-primary group">
                <Sparkles className="w-5 h-5 mr-2" />
                AI 설계 상담 시작
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/portfolio" className="btn-outline">
                포트폴리오 보기
              </Link>
            </div>

            {/* Quick stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { label: 'AI 상담 완료', value: '1,200+' },
                { label: '제작 프로젝트', value: '850+' },
                { label: '고객 만족도', value: '99.2%' },
                { label: 'A/S 보증', value: '평생' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-serif gradient-text">{stat.value}</p>
                  <p className="text-sm text-dadam-gray mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-xs tracking-widest uppercase text-dadam-gray">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-dadam-ai-primary to-transparent" />
          </div>
        </div>
      </section>

      {/* AI Chat Preview Section */}
      <section className="section-padding bg-dadam-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dadam-ai-primary/10 border border-dadam-ai-primary/20 mb-4">
                <Sparkles className="w-4 h-4 text-dadam-ai-primary" />
                <span className="text-xs text-dadam-ai-primary font-medium">AI 설계 시스템</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-dadam-charcoal leading-tight">
                AI와 대화하며
                <br />
                <span className="gradient-text">완벽한 가구를 설계</span>하세요
              </h2>
              <div className="mt-8 space-y-6 text-dadam-gray">
                <p>
                  다담가구의 AI Agent는 단순한 챗봇이 아닙니다.
                  당신의 라이프스타일, 공간의 특성, 취향을 깊이 이해하고
                  최적의 가구 디자인을 제안하는 전문 설계 시스템입니다.
                </p>
                <ul className="space-y-3">
                  {[
                    '공간 크기와 형태에 맞는 최적의 배치 제안',
                    '라이프스타일 분석 기반 맞춤 수납 설계',
                    '예산에 맞는 자재 및 마감 추천',
                    '실시간 3D 시뮬레이션 연동',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-dadam-ai-primary mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/ai-design"
                className="inline-flex items-center gap-2 mt-8 btn-primary"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI 상담 시작하기</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* AI Chat Demo */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-dadam-ai-primary/20 to-dadam-ai-secondary/20 rounded-3xl blur-2xl" />
              <div className="relative bg-dadam-white rounded-2xl shadow-2xl border border-dadam-warm overflow-hidden">
                {/* Chat header */}
                <div className="bg-gradient-to-r from-dadam-ai-primary to-dadam-ai-secondary p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">다담 AI 설계사</p>
                    <p className="text-white/70 text-xs">온라인</p>
                  </div>
                </div>
                {/* Chat messages */}
                <div className="p-6 space-y-4 bg-dadam-cream/50">
                  <div className="chat-bubble chat-bubble-ai max-w-[80%]">
                    <p className="text-sm text-dadam-charcoal">
                      안녕하세요! 다담가구 AI 설계사입니다.
                      어떤 공간의 가구를 설계해 드릴까요?
                    </p>
                  </div>
                  <div className="chat-bubble chat-bubble-user max-w-[80%] ml-auto">
                    <p className="text-sm">
                      거실에 맞는 TV장과 수납장을 찾고 있어요.
                    </p>
                  </div>
                  <div className="chat-bubble chat-bubble-ai max-w-[80%]">
                    <p className="text-sm text-dadam-charcoal">
                      좋습니다! 거실 크기와 현재 배치를 알려주시면,
                      최적의 디자인을 제안해 드릴게요.
                      혹시 TV 크기도 알려주실 수 있으신가요?
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-dadam-gray">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="text-xs">AI가 응답을 준비 중...</span>
                  </div>
                </div>
                {/* Chat input */}
                <div className="p-4 bg-white border-t border-dadam-warm">
                  <div className="flex items-center gap-3 bg-dadam-cream rounded-xl px-4 py-3">
                    <input
                      type="text"
                      placeholder="메시지를 입력하세요..."
                      className="flex-1 bg-transparent text-sm outline-none"
                      disabled
                    />
                    <button className="w-8 h-8 rounded-lg bg-gradient-to-r from-dadam-ai-primary to-dadam-ai-secondary flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-dadam-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-dadam-charcoal">
              다담가구만의 <span className="gradient-text">특별함</span>
            </h2>
            <p className="mt-6 text-dadam-gray max-w-2xl mx-auto">
              AI 기술과 장인정신이 만나 탄생하는 프리미엄 맞춤 가구
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`feature-card ${
                  feature.highlight ? 'lg:col-span-2 lg:row-span-1' : ''
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                  feature.highlight
                    ? 'bg-gradient-to-br from-dadam-ai-primary to-dadam-ai-secondary'
                    : 'bg-dadam-warm'
                }`}>
                  <feature.icon className={`w-7 h-7 ${feature.highlight ? 'text-white' : 'text-dadam-charcoal'}`} />
                </div>
                <h3 className="font-serif text-2xl text-dadam-charcoal mb-3">
                  {feature.title}
                </h3>
                <p className="text-dadam-gray leading-relaxed">
                  {feature.description}
                </p>
                {feature.highlight && (
                  <Link
                    href="/ai-design"
                    className="inline-flex items-center gap-2 mt-6 text-dadam-ai-primary font-medium elegant-underline"
                  >
                    <span>AI 상담 시작하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Works Section */}
      <section className="section-padding bg-dadam-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dadam-gold/10 border border-dadam-gold/20 mb-4">
                <span className="text-xs text-dadam-gold font-medium">Portfolio</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-dadam-charcoal">
                AI가 설계한 <span className="text-dadam-gold">작품</span>들
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="mt-6 md:mt-0 inline-flex items-center gap-2 text-dadam-charcoal elegant-underline"
            >
              <span>전체 포트폴리오 보기</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredWorks.map((work, index) => (
              <Link
                key={work.id}
                href={`/portfolio/${work.id}`}
                className={`group relative overflow-hidden rounded-2xl ${
                  index === 0 ? 'md:row-span-2' : ''
                }`}
              >
                <div className={`aspect-[4/5] ${work.color} overflow-hidden`}>
                  <div className="w-full h-full flex items-center justify-center text-dadam-charcoal/50 group-hover:scale-105 transition-transform duration-700">
                    <div className="text-center p-8">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/30 mb-4">
                        <Sparkles className="w-3 h-3" />
                        <span className="text-xs">AI 설계</span>
                      </div>
                      <p className="font-serif text-xl">{work.title}</p>
                      <p className="text-sm mt-2">{work.category}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dadam-black/70 to-transparent text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-xs tracking-widest uppercase mb-2">{work.category}</p>
                  <h3 className="font-serif text-xl">{work.title}</h3>
                  <p className="text-sm text-white/70 mt-2">{work.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-dadam-charcoal text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dadam-ai-primary/20 border border-dadam-ai-primary/30 mb-4">
              <Sparkles className="w-4 h-4 text-dadam-ai-glow" />
              <span className="text-xs text-dadam-ai-glow">Process</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl">
              AI와 장인이 함께하는
              <br />
              <span className="gradient-text">완벽한 프로세스</span>
            </h2>
            <p className="mt-6 text-dadam-gray max-w-2xl mx-auto">
              AI 상담부터 장인의 손끝에서 완성되는 설치까지,
              <br className="hidden md:block" />
              모든 과정을 투명하게 관리합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => (
              <div key={step.number} className="group">
                <div className="relative p-8 bg-white/5 rounded-2xl border border-white/10 transition-all duration-300 group-hover:bg-white/10 group-hover:border-dadam-ai-primary/30">
                  {/* Step number */}
                  <span className={`absolute top-4 right-4 font-serif text-5xl ${
                    step.aiFeature ? 'gradient-text' : 'text-white/10'
                  }`}>
                    {step.number}
                  </span>

                  {/* AI Badge */}
                  {step.aiFeature && (
                    <div className="absolute top-4 left-4 px-2 py-1 rounded bg-dadam-ai-primary/20 border border-dadam-ai-primary/30">
                      <span className="text-[10px] text-dadam-ai-glow font-medium">AI</span>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-6 mt-4 ${
                    step.aiFeature
                      ? 'bg-gradient-to-br from-dadam-ai-primary to-dadam-ai-secondary'
                      : 'bg-dadam-gold/20'
                  }`}>
                    <step.icon size={24} className={step.aiFeature ? 'text-white' : 'text-dadam-gold'} />
                  </div>

                  <h3 className="font-serif text-2xl text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-dadam-gray leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/service" className="btn-outline border-white/30 text-white hover:bg-white hover:text-dadam-charcoal">
              서비스 자세히 알아보기
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-dadam-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-dadam-charcoal">
              고객님들의 <span className="text-dadam-gold">이야기</span>
            </h2>
            <p className="mt-6 text-dadam-gray">
              다담가구와 함께한 고객님들의 솔직한 후기
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-dadam-warm card-hover"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-dadam-gold text-dadam-gold" />
                  ))}
                </div>
                <p className="text-dadam-charcoal leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>
                <div className="pt-4 border-t border-dadam-warm">
                  <p className="font-medium text-dadam-charcoal">{testimonial.name}</p>
                  <p className="text-sm text-dadam-gray">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote CTA Section */}
      <section className="section-padding bg-dadam-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dadam-gold/10 border border-dadam-gold/20 mb-6">
            <span className="text-sm text-dadam-gold font-medium">무료 견적</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-dadam-charcoal">
            지금 바로
            <br />
            <span className="gradient-text">최적의 견적</span>을 받아보세요
          </h2>
          <p className="mt-6 text-dadam-gray max-w-xl mx-auto">
            AI 분석을 통해 불필요한 비용 없이 투명한 견적을 제공합니다.
            무료 상담으로 프리미엄 맞춤 가구를 시작하세요.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote" className="btn-gold">
              무료 견적 받기
            </Link>
            <Link href="/ai-design" className="btn-primary">
              <Sparkles className="w-4 h-4 mr-2" />
              AI 상담 먼저 받기
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
