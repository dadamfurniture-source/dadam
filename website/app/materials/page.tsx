import Link from 'next/link'
import { CheckCircle, Shield, Leaf, Award } from 'lucide-react'

const materialCategories = [
  {
    id: 'wood',
    title: '원목 / 목재',
    subtitle: 'Premium Wood',
    description: '엄선된 최상급 원목만을 사용합니다. 월넛, 오크, 애쉬 등 다양한 수종의 원목을 직접 선별하여 사용합니다.',
    color: 'bg-[#C4A77D]',
    items: [
      {
        name: '북미산 월넛',
        origin: 'USA',
        feature: '깊은 갈색 톤의 고급 원목, 내구성 우수',
      },
      {
        name: '유럽산 오크',
        origin: 'Europe',
        feature: '밝은 톤의 클래식한 나무결, 강한 내구성',
      },
      {
        name: '화이트 애쉬',
        origin: 'North America',
        feature: '밝고 깨끗한 색상, 모던한 공간에 적합',
      },
      {
        name: '체리우드',
        origin: 'USA',
        feature: '시간이 지날수록 깊어지는 색상, 따뜻한 분위기',
      },
    ],
  },
  {
    id: 'hardware',
    title: '하드웨어',
    subtitle: 'Premium Hardware',
    description: '독일, 오스트리아 등 세계 최고의 하드웨어 브랜드 제품만을 사용합니다.',
    color: 'bg-[#8C8C8C]',
    items: [
      {
        name: 'Blum',
        origin: 'Austria',
        feature: '세계 1위 경첩/슬라이드 전문 브랜드',
      },
      {
        name: 'Hettich',
        origin: 'Germany',
        feature: '프리미엄 서랍 시스템, 소프트클로즈',
      },
      {
        name: 'Hafele',
        origin: 'Germany',
        feature: '고급 손잡이, 조명, 액세서리',
      },
      {
        name: 'Grass',
        origin: 'Austria',
        feature: '무소음 경첩, 리프트 시스템',
      },
    ],
  },
  {
    id: 'finish',
    title: '마감재',
    subtitle: 'Finishing Materials',
    description: 'E0 등급의 친환경 마감재와 프리미엄 도료만을 사용하여 건강한 공간을 만듭니다.',
    color: 'bg-[#B8B0A8]',
    items: [
      {
        name: 'LX하우시스 인테리어필름',
        origin: 'Korea',
        feature: '친환경 인증, 다양한 패턴',
      },
      {
        name: 'EGGER 보드',
        origin: 'Austria',
        feature: 'E0 등급, 내구성 우수',
      },
      {
        name: 'Becker Acroma 도료',
        origin: 'Sweden',
        feature: '무독성 수성 도료, 친환경',
      },
      {
        name: 'Fenix NTM',
        origin: 'Italy',
        feature: '항균, 지문방지, 자가치유',
      },
    ],
  },
  {
    id: 'accessories',
    title: '부자재',
    subtitle: 'Accessories',
    description: '수납 효율을 극대화하는 다양한 부자재와 액세서리를 제공합니다.',
    color: 'bg-[#A8B0B8]',
    items: [
      {
        name: '주방 바스켓 시스템',
        origin: 'Germany/Korea',
        feature: '스테인리스 바스켓, 다양한 사이즈',
      },
      {
        name: '드레스룸 수납',
        origin: 'Italy/Korea',
        feature: '행거, 트레이, 서랍 시스템',
      },
      {
        name: 'LED 조명',
        origin: 'Germany/Korea',
        feature: '센서등, 간접조명, 터치등',
      },
      {
        name: '특수 수납 솔루션',
        origin: 'Various',
        feature: '코너장, 회전장, 리프트 수납',
      },
    ],
  },
]

const certifications = [
  {
    icon: Shield,
    title: 'E0 등급 인증',
    description: '포름알데히드 방출량 최저 등급',
  },
  {
    icon: Leaf,
    title: '친환경 인증',
    description: '환경부 인증 친환경 자재 사용',
  },
  {
    icon: Award,
    title: '품질 보증',
    description: '10년 품질 보증 프로그램',
  },
]

export default function MaterialsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gallery-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.3em] uppercase text-gallery-gold mb-4">
            Materials & Quality
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-gallery-charcoal">
            자재 소개
          </h1>
          <p className="mt-6 text-gallery-gray max-w-2xl">
            다담가구는 최상급 자재만을 사용합니다.
            10년, 20년이 지나도 변함없는 품질을 위해 자재 선택에 타협하지 않습니다.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding bg-gallery-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-gallery-charcoal leading-tight">
                품질을 결정하는
                <br />
                자재의 차이
              </h2>
              <div className="mt-8 space-y-6 text-gallery-gray">
                <p>
                  가구의 품질은 눈에 보이지 않는 곳에서 결정됩니다.
                  다담가구는 겉으로 보이는 마감재뿐만 아니라,
                  내부 구조재, 하드웨어, 접착제까지 모든 자재를
                  최상급으로 선별합니다.
                </p>
                <p>
                  특히 하드웨어는 가구의 수명을 결정하는 핵심 요소입니다.
                  다담가구는 Blum, Hettich 등 세계 최고의 브랜드 제품만을
                  사용하여 10만 회 이상의 개폐 테스트를 통과한
                  내구성을 보장합니다.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className={`p-6 bg-gallery-cream rounded-sm ${index === 2 ? 'col-span-2' : ''}`}
                >
                  <cert.icon size={32} className="text-gallery-gold mb-4" />
                  <h3 className="font-serif text-lg text-gallery-charcoal">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-gallery-gray mt-2">
                    {cert.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Material Categories */}
      {materialCategories.map((category, categoryIndex) => (
        <section
          key={category.id}
          className={`section-padding ${categoryIndex % 2 === 0 ? 'bg-gallery-cream' : 'bg-gallery-white'}`}
        >
          <div className="max-w-7xl mx-auto">
            <div className={`grid lg:grid-cols-2 gap-16 items-start ${categoryIndex % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Image */}
              <div className={`${categoryIndex % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className={`aspect-[4/3] ${category.color} rounded-sm flex items-center justify-center`}>
                  <div className="text-center text-white/80">
                    <p className="font-serif text-3xl">{category.title}</p>
                    <p className="text-sm mt-2">{category.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`${categoryIndex % 2 === 1 ? 'lg:order-1' : ''}`}>
                <p className="text-xs tracking-[0.3em] uppercase text-gallery-gold mb-4">
                  {category.subtitle}
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-gallery-charcoal">
                  {category.title}
                </h2>
                <p className="mt-6 text-gallery-gray">
                  {category.description}
                </p>

                {/* Items */}
                <div className="mt-8 space-y-4">
                  {category.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gallery-white border border-gallery-warm rounded-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gallery-charcoal">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gallery-gray mt-1">
                            {item.feature}
                          </p>
                        </div>
                        <span className="text-xs text-gallery-gold tracking-wider">
                          {item.origin}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Quality Promise */}
      <section className="section-padding bg-gallery-charcoal text-gallery-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl">
            다담가구의 품질 약속
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {[
              { number: '10년', label: '품질 보증' },
              { number: '100%', label: '친환경 자재' },
              { number: '100,000+', label: '개폐 테스트 통과' },
            ].map((item, index) => (
              <div key={index}>
                <p className="font-serif text-4xl text-gallery-gold">
                  {item.number}
                </p>
                <p className="mt-2 text-gallery-gray">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <Link href="/contact" className="inline-block mt-12 btn-primary bg-gallery-white text-gallery-charcoal hover:bg-gallery-cream">
            자재 상담 받기
          </Link>
        </div>
      </section>
    </>
  )
}
