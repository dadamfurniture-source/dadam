import Link from 'next/link'
import { ArrowRight, Ruler, Palette, Wrench, Shield } from 'lucide-react'

// Sample portfolio data
const featuredWorks = [
  {
    id: 1,
    title: '청담동 펜트하우스',
    category: '주방 & 드레스룸',
    image: '/images/portfolio/work-1.jpg',
    color: 'bg-[#D4C5B5]',
  },
  {
    id: 2,
    title: '한남동 타운하우스',
    category: '서재 & 수납장',
    image: '/images/portfolio/work-2.jpg',
    color: 'bg-[#B8C4C8]',
  },
  {
    id: 3,
    title: '성수동 복층 오피스텔',
    category: '거실장 & 침실',
    image: '/images/portfolio/work-3.jpg',
    color: 'bg-[#C8C0B8]',
  },
  {
    id: 4,
    title: '분당 단독주택',
    category: '전체 빌트인',
    image: '/images/portfolio/work-4.jpg',
    color: 'bg-[#BCC4C0]',
  },
]

const processSteps = [
  {
    number: '01',
    title: '상담',
    description: '고객의 라이프스타일과 공간을 깊이 이해합니다',
    icon: Ruler,
  },
  {
    number: '02',
    title: '설계',
    description: '밀리미터 단위의 정밀한 맞춤 설계를 진행합니다',
    icon: Palette,
  },
  {
    number: '03',
    title: '제작',
    description: '숙련된 장인이 직접 정성껏 제작합니다',
    icon: Wrench,
  },
  {
    number: '04',
    title: '설치 & A/S',
    description: '완벽한 설치와 지속적인 사후 관리를 약속합니다',
    icon: Shield,
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Gallery Style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gallery-cream">
          <div className="absolute inset-0 bg-gradient-to-br from-gallery-cream via-gallery-warm/50 to-gallery-cream" />
          {/* Decorative lines */}
          <div className="absolute top-1/4 left-0 w-full h-px bg-gallery-warm/50" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gallery-warm/50" />
          <div className="absolute left-1/4 top-0 h-full w-px bg-gallery-warm/50" />
          <div className="absolute right-1/4 top-0 h-full w-px bg-gallery-warm/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-32 text-center">
          <div className="animate-fade-in">
            <p className="text-xs tracking-[0.4em] uppercase text-gallery-gray mb-6">
              Design-Centered Custom Furniture
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-gallery-charcoal leading-tight">
              공간의 가치를
              <br />
              <span className="text-gallery-accent">담다</span>
            </h1>
            <p className="mt-8 text-lg md:text-xl text-gallery-gray max-w-2xl mx-auto leading-relaxed">
              다담가구는 당신의 공간에 맞춤형 가치를 더합니다.
              <br className="hidden md:block" />
              설계부터 제작, 설치까지 완벽한 가구 솔루션을 경험하세요.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/portfolio" className="btn-primary">
                포트폴리오 보기
              </Link>
              <Link href="/contact" className="btn-outline">
                무료 상담 신청
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-xs tracking-widest uppercase text-gallery-gray">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-gallery-gray to-transparent" />
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="section-padding bg-gallery-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-gallery-gold mb-4">
                About DaDam
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-gallery-charcoal leading-tight">
                설계가 다르면
                <br />
                가구가 다릅니다
              </h2>
              <div className="mt-8 space-y-6 text-gallery-gray">
                <p>
                  다담가구는 단순한 가구 제작을 넘어, 공간과 사람을 연결하는
                  설계 중심의 맞춤 가구 전문 기업입니다.
                </p>
                <p>
                  모든 프로젝트는 고객의 라이프스타일에 대한 깊은 이해에서 시작됩니다.
                  밀리미터 단위의 정밀한 설계와 최고급 자재, 숙련된 장인의 손끝에서
                  탄생하는 다담가구만의 특별한 경험을 만나보세요.
                </p>
              </div>
              <Link
                href="/process"
                className="inline-flex items-center gap-2 mt-8 text-gallery-charcoal elegant-underline"
              >
                <span>서비스 과정 알아보기</span>
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-gallery-warm rounded-sm overflow-hidden">
                {/* Placeholder for image */}
                <div className="w-full h-full flex items-center justify-center text-gallery-gray">
                  <div className="text-center">
                    <p className="font-serif text-2xl">다담가구</p>
                    <p className="text-sm mt-2">설계 중심의 맞춤 가구</p>
                  </div>
                </div>
              </div>
              {/* Decorative frame */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-gallery-gold/30 rounded-sm -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Works Section - Gallery Style */}
      <section className="section-padding bg-gallery-cream">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-gallery-gold mb-4">
                Portfolio
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-gallery-charcoal">
                대표 작품
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="mt-6 md:mt-0 inline-flex items-center gap-2 text-gallery-charcoal elegant-underline"
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
                className={`group relative overflow-hidden ${
                  index === 0 ? 'md:row-span-2' : ''
                }`}
              >
                <div className={`aspect-[4/5] ${work.color} overflow-hidden`}>
                  {/* Placeholder - replace with actual image */}
                  <div className="w-full h-full flex items-center justify-center text-gallery-charcoal/50 group-hover:scale-105 transition-transform duration-700">
                    <div className="text-center p-8">
                      <p className="font-serif text-xl">{work.title}</p>
                      <p className="text-sm mt-2">{work.category}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gallery-black/60 to-transparent text-gallery-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-xs tracking-widest uppercase mb-2">{work.category}</p>
                  <h3 className="font-serif text-xl">{work.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-gallery-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-gallery-gold mb-4">
              Our Process
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-gallery-charcoal">
              서비스 진행 과정
            </h2>
            <p className="mt-6 text-gallery-gray max-w-2xl mx-auto">
              다담가구는 상담부터 A/S까지 모든 과정을 직접 관리하여
              <br className="hidden md:block" />
              최상의 결과물을 약속합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={step.number} className="group">
                <div className="relative p-8 bg-gallery-cream rounded-sm transition-all duration-300 group-hover:bg-gallery-warm">
                  {/* Step number */}
                  <span className="absolute top-4 right-4 font-serif text-5xl text-gallery-warm group-hover:text-gallery-white/50 transition-colors">
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gallery-white mb-6">
                    <step.icon size={24} className="text-gallery-charcoal" />
                  </div>

                  <h3 className="font-serif text-2xl text-gallery-charcoal mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gallery-gray leading-relaxed">
                    {step.description}
                  </p>

                  {/* Connector line */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gallery-gold/50" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/process" className="btn-outline">
              자세히 알아보기
            </Link>
          </div>
        </div>
      </section>

      {/* Materials Preview Section */}
      <section className="section-padding bg-gallery-charcoal text-gallery-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-gallery-gray/20 rounded-sm flex items-center justify-center">
                  <span className="text-gallery-gray">원목</span>
                </div>
                <div className="aspect-square bg-gallery-gray/20 rounded-sm flex items-center justify-center mt-8">
                  <span className="text-gallery-gray">하드웨어</span>
                </div>
                <div className="aspect-square bg-gallery-gray/20 rounded-sm flex items-center justify-center">
                  <span className="text-gallery-gray">마감재</span>
                </div>
                <div className="aspect-square bg-gallery-gray/20 rounded-sm flex items-center justify-center mt-8">
                  <span className="text-gallery-gray">부자재</span>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-xs tracking-[0.3em] uppercase text-gallery-gold mb-4">
                Materials
              </p>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight">
                품질을 결정하는
                <br />
                자재의 차이
              </h2>
              <p className="mt-8 text-gallery-gray leading-relaxed">
                다담가구는 최상급 원목, 프리미엄 하드웨어, 친환경 마감재만을 사용합니다.
                10년, 20년이 지나도 변함없는 품질을 위해 자재 선택에 타협하지 않습니다.
              </p>
              <Link
                href="/materials"
                className="inline-flex items-center gap-2 mt-8 text-gallery-white elegant-underline"
              >
                <span>자재 소개 보기</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Preview Section */}
      <section className="section-padding bg-gallery-cream">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gallery-gold mb-4">
            Interior Partners
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-gallery-charcoal">
            인테리어 파트너
          </h2>
          <p className="mt-6 text-gallery-gray max-w-2xl mx-auto">
            다담가구와 함께하는 검증된 인테리어 디자인 업체들을 만나보세요.
            <br className="hidden md:block" />
            전문가의 손길로 완성되는 특별한 공간을 경험하실 수 있습니다.
          </p>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((partner) => (
              <div
                key={partner}
                className="aspect-[3/2] bg-gallery-white rounded-sm flex items-center justify-center border border-gallery-warm hover:border-gallery-gold transition-colors"
              >
                <span className="text-gallery-gray text-sm">파트너 {partner}</span>
              </div>
            ))}
          </div>

          <Link href="/partners" className="inline-block mt-12 btn-outline">
            파트너 전체 보기
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gallery-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-gallery-charcoal">
            당신만의 공간을
            <br />
            설계해 드립니다
          </h2>
          <p className="mt-6 text-gallery-gray">
            지금 바로 무료 상담을 신청하시고, 다담가구만의 특별한 경험을 시작하세요.
          </p>
          <Link href="/contact" className="inline-block mt-10 btn-primary">
            무료 상담 신청하기
          </Link>
        </div>
      </section>
    </>
  )
}
