import Link from 'next/link'
import Image from 'next/image'

const featuredWorks = [
  {
    id: 1,
    title: '청담동 펜트하우스',
    category: 'Kitchen',
    description: '화이트 톤 아일랜드 키친',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  },
  {
    id: 2,
    title: '판교 타운하우스',
    category: 'Dressing Room',
    description: '워크인 드레스룸',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&q=80',
  },
  {
    id: 3,
    title: '한남동 복층',
    category: 'Living Room',
    description: '월넛 벽면 수납장',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  },
  {
    id: 4,
    title: '분당 단독주택',
    category: 'Study',
    description: '빌트인 서재 시스템',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80',
  },
  {
    id: 5,
    title: '용산 아파트',
    category: 'Bedroom',
    description: '헤드보드 & 수납',
    image: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=600&q=80',
  },
]

const processSteps = [
  { number: '01', title: '상담', description: '고객님의 라이프스타일과\n공간을 깊이 이해합니다' },
  { number: '02', title: '설계', description: '밀리미터 단위의 정밀한\n맞춤 설계를 진행합니다' },
  { number: '03', title: '제작', description: '숙련된 장인이 직접\n정성껏 제작합니다' },
  { number: '04', title: '설치 & A/S', description: '완벽한 설치와 10년\n품질 보증을 약속합니다' },
]

const partners = [
  { name: '스튜디오 루미', style: '모던 · 미니멀', initial: 'L', rating: 4.9 },
  { name: '디자인 오피스 온', style: '럭셔리 · 클래식', initial: 'O', rating: 4.8 },
  { name: '홈앤리빙 디자인', style: '가족형 · 실용적', initial: 'H', rating: 4.7 },
  { name: '아뜰리에 모노', style: '빈티지 · 인더스트리얼', initial: 'M', rating: 4.9 },
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Fullscreen */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80"
            alt="럭셔리 인테리어"
            className="w-full h-full object-cover"
          />
          <div className="hero-overlay absolute inset-0"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-6">
          <p className="text-sm tracking-[0.3em] uppercase text-primary-sky mb-6">
            Design-Centered Custom Furniture
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-normal leading-tight mb-6">
            당신을 담은 가구
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mb-10">
            설계의 정밀함으로 완성하는 맞춤 가구,<br className="hidden md:block" />
            다담가구가 당신의 공간에 가치를 더합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/portfolio" className="btn-primary">
              포트폴리오
            </Link>
            <Link href="/contact" className="btn-outline">
              상담 신청
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center scroll-indicator">
            <span className="text-xs tracking-widest uppercase text-white/60 mb-2">Scroll</span>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/60">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-primary-navy">About DaDam</span>
              <div className="section-divider mt-4 mb-8"></div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-neutral-800 leading-tight mb-8">
                설계가 다르면,<br />
                가구가 다릅니다
              </h2>
              <div className="space-y-6 text-neutral-600 leading-relaxed">
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
              <Link href="/process" className="inline-flex items-center gap-2 mt-10 text-primary-navy underline-animation">
                <span className="text-sm tracking-wide">서비스 과정 알아보기</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12l5-5-5-5"/></svg>
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80"
                alt="다담가구 작업실"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary-navy text-white p-8 max-w-xs">
                <p className="text-3xl font-light mb-2">500<span className="text-primary-sky">+</span></p>
                <p className="text-sm text-white/70">완성된 프로젝트</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-24 lg:py-32 bg-neutral-100">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-primary-navy">Portfolio</span>
              <div className="section-divider mt-4 mb-6"></div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-neutral-800">대표 작품</h2>
            </div>
            <Link href="/portfolio" className="mt-6 md:mt-0 inline-flex items-center gap-2 text-primary-navy underline-animation">
              <span className="text-sm tracking-wide">전체 보기</span>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12l5-5-5-5"/></svg>
            </Link>
          </div>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Item 1 - Large */}
            <div className="gallery-item md:col-span-2 lg:col-span-1 lg:row-span-2 cursor-pointer">
              <img
                src={featuredWorks[0].image}
                alt={featuredWorks[0].title}
                className="w-full h-full object-cover aspect-[3/4] lg:aspect-auto lg:h-full"
              />
              <div className="overlay"></div>
              <div className="content text-white">
                <span className="text-xs tracking-widest uppercase text-primary-sky">{featuredWorks[0].category}</span>
                <h3 className="text-2xl font-serif mt-2">{featuredWorks[0].title}</h3>
                <p className="text-white/70 text-sm mt-2">{featuredWorks[0].description}</p>
              </div>
            </div>

            {featuredWorks.slice(1).map((work) => (
              <div key={work.id} className="gallery-item cursor-pointer">
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full aspect-square object-cover"
                />
                <div className="overlay"></div>
                <div className="content text-white">
                  <span className="text-xs tracking-widest uppercase text-primary-sky">{work.category}</span>
                  <h3 className="text-xl font-serif mt-2">{work.title}</h3>
                  <p className="text-white/70 text-sm mt-1">{work.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <span className="text-xs tracking-[0.3em] uppercase text-primary-navy">Our Process</span>
            <div className="section-divider mx-auto mt-4 mb-6"></div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-neutral-800">서비스 진행 과정</h2>
            <p className="mt-6 text-neutral-500 max-w-2xl mx-auto">
              상담부터 A/S까지, 모든 과정을 직접 관리하여 최상의 결과물을 약속합니다.
            </p>
          </div>

          {/* Process Steps */}
          <div className="relative">
            <div className="hidden lg:block process-line"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {processSteps.map((step, index) => (
                <div key={step.number} className="relative text-center">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center relative z-10 ${
                    index === processSteps.length - 1
                      ? 'bg-primary-navy'
                      : 'bg-primary-sky/20 bg-white'
                  }`}>
                    <span className={`font-serif text-2xl ${
                      index === processSteps.length - 1 ? 'text-white' : 'text-primary-navy'
                    }`}>{step.number}</span>
                  </div>
                  <h3 className="text-xl font-medium text-neutral-800 mb-3">{step.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed whitespace-pre-line">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-24 lg:py-32 bg-primary-navy text-white">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-primary-sky">Materials</span>
              <div className="section-divider mt-4 mb-8"></div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-8">
                품질을 결정하는<br />자재의 차이
              </h2>
              <p className="text-white/70 leading-relaxed mb-10">
                다담가구는 최상급 원목, 프리미엄 하드웨어, 친환경 마감재만을 사용합니다.
                10년, 20년이 지나도 변함없는 품질을 위해 자재 선택에 타협하지 않습니다.
              </p>

              {/* Material Grid */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="border border-white/20 p-5">
                  <h4 className="text-primary-sky font-medium mb-1">원목</h4>
                  <p className="text-sm text-white/50">북미산 월넛, 유럽산 오크</p>
                </div>
                <div className="border border-white/20 p-5">
                  <h4 className="text-primary-sky font-medium mb-1">하드웨어</h4>
                  <p className="text-sm text-white/50">Blum, Hettich, Hafele</p>
                </div>
                <div className="border border-white/20 p-5">
                  <h4 className="text-primary-sky font-medium mb-1">마감재</h4>
                  <p className="text-sm text-white/50">E0 등급 친환경 자재</p>
                </div>
                <div className="border border-white/20 p-5">
                  <h4 className="text-primary-sky font-medium mb-1">부자재</h4>
                  <p className="text-sm text-white/50">LED 조명, 수납 솔루션</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-12">
                <div>
                  <p className="text-4xl font-light text-primary-sky">10<span className="text-lg">년</span></p>
                  <p className="text-sm text-white/50 mt-1">품질 보증</p>
                </div>
                <div>
                  <p className="text-4xl font-light text-primary-sky">100<span className="text-lg">%</span></p>
                  <p className="text-sm text-white/50 mt-1">친환경 자재</p>
                </div>
                <div>
                  <p className="text-4xl font-light text-primary-sky">E0</p>
                  <p className="text-sm text-white/50 mt-1">등급 인증</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" alt="원목" className="w-full aspect-square object-cover"/>
              <img src="https://images.unsplash.com/photo-1597072689227-8882273e8f6a?w=400&q=80" alt="주방" className="w-full aspect-square object-cover mt-8"/>
              <img src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400&q=80" alt="마감재" className="w-full aspect-square object-cover"/>
              <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80" alt="가구" className="w-full aspect-square object-cover mt-8"/>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 lg:py-32 bg-neutral-100">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-primary-navy">Interior Partners</span>
            <div className="section-divider mx-auto mt-4 mb-6"></div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-neutral-800">인테리어 파트너</h2>
            <p className="mt-6 text-neutral-500 max-w-2xl mx-auto">
              다담가구와 함께하는 검증된 인테리어 디자인 업체들을 만나보세요.
            </p>
          </div>

          {/* Partners Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((partner) => (
              <div key={partner.name} className="card-lift bg-white p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-5 bg-neutral-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-serif text-primary-navy">{partner.initial}</span>
                </div>
                <h3 className="font-medium text-neutral-800 mb-1">{partner.name}</h3>
                <p className="text-sm text-neutral-400 mb-4">{partner.style}</p>
                <div className="flex items-center justify-center gap-1 text-sm">
                  <svg width="14" height="14" fill="#F59E0B" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span className="text-neutral-600">{partner.rating}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-neutral-500 mb-4">인테리어 업체 파트너십에 관심이 있으신가요?</p>
            <Link href="/contact" className="btn-dark-outline">
              파트너 등록 문의
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-neutral-900 text-white">
        <div className="max-w-screen-lg mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
            당신만의 공간을<br />설계해 드립니다
          </h2>
          <p className="text-neutral-400 mb-10 max-w-2xl mx-auto">
            지금 바로 무료 상담을 신청하시고, 다담가구만의 특별한 경험을 시작하세요.
          </p>
          <Link href="/contact" className="inline-block px-12 py-4 bg-white text-neutral-900 text-sm tracking-widest uppercase hover:bg-primary-sky transition-colors">
            무료 상담 신청하기
          </Link>
        </div>
      </section>
    </>
  )
}
