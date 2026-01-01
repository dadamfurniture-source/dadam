import Link from 'next/link'
import {
  Sparkles,
  Award,
  Users,
  Hammer,
  Gem,
  TreeDeciduous,
  Shield,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight
} from 'lucide-react'

// Craftsmen
const craftsmen = [
  {
    name: '김대목 장인',
    role: '수석 목공 장인',
    experience: '35년',
    specialty: '원목 가공 & 마감',
    description: '일본 목공 기술을 전수받아 섬세한 마감과 정교한 조립이 특기입니다.',
  },
  {
    name: '이설계 장인',
    role: '설계 총괄',
    experience: '28년',
    specialty: '공간 설계 & 3D 모델링',
    description: '수백 건의 프로젝트 경험으로 최적의 공간 활용을 설계합니다.',
  },
  {
    name: '박마감 장인',
    role: '마감 전문 장인',
    experience: '25년',
    specialty: '도장 & 표면 처리',
    description: '유럽 최신 마감 기술로 아름답고 내구성 있는 표면을 완성합니다.',
  },
]

// Materials
const materials = [
  {
    icon: TreeDeciduous,
    title: '프리미엄 원목',
    items: ['유럽산 오크', '북미산 월넛', '이탈리아 체리목', '스칸디나비아 애쉬'],
    description: '20년 이상 자연 건조된 최상급 원목만을 사용합니다.',
  },
  {
    icon: Gem,
    title: '하드웨어',
    items: ['블룸 경첩', '헤펠레 레일', '그라스 서랍 시스템', '프리미엄 손잡이'],
    description: '유럽 최고급 하드웨어로 오래도록 부드러운 사용감을 보장합니다.',
  },
  {
    icon: Shield,
    title: '친환경 마감재',
    items: ['천연 오일 스테인', '수성 우레탄', 'E0 등급 합판', '친환경 접착제'],
    description: '가족의 건강을 위한 무독성 친환경 마감재만 사용합니다.',
  },
]

// Company values
const values = [
  {
    icon: Sparkles,
    title: 'AI 혁신',
    description: '최신 AI 기술로 더 정확하고 효율적인 가구 설계를 실현합니다.',
  },
  {
    icon: Hammer,
    title: '장인정신',
    description: '30년 이상의 경험과 노하우로 한 땀 한 땀 정성껏 제작합니다.',
  },
  {
    icon: Users,
    title: '고객 중심',
    description: '고객의 라이프스타일을 깊이 이해하고 맞춤형 솔루션을 제공합니다.',
  },
  {
    icon: Award,
    title: '품질 최우선',
    description: '최상급 자재와 철저한 품질 관리로 최고의 결과물을 약속합니다.',
  },
]

// Timeline/History
const history = [
  { year: '1994', event: '다담가구 설립', detail: '서울 강남에서 맞춤 가구 전문점으로 시작' },
  { year: '2005', event: '자체 공방 확장', detail: '경기도에 1,000평 규모 자체 제작 공방 설립' },
  { year: '2015', event: '프리미엄 라인 론칭', detail: '유럽 수입 자재 기반 프리미엄 맞춤 가구 라인 출시' },
  { year: '2023', event: 'AI 설계 시스템 도입', detail: '업계 최초 AI Agent 기반 설계 상담 시스템 도입' },
  { year: '2024', event: '850+ 프로젝트 완료', detail: '누적 850개 이상의 맞춤 가구 프로젝트 완료' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dadam-white">
      {/* Hero Section */}
      <section className="relative py-32 bg-dadam-cream overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-dadam-gold/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dadam-gold/10 border border-dadam-gold/20 mb-6">
              <span className="text-sm font-medium text-dadam-gold">About DaDam</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl text-dadam-charcoal">
              공간의 가치를
              <br />
              <span className="text-dadam-gold">담다</span>
            </h1>
            <p className="mt-6 text-lg text-dadam-gray max-w-2xl">
              1994년부터 이어온 장인정신과 최신 AI 기술이 만나,
              당신의 공간에 특별한 가치를 담아드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl text-dadam-charcoal mb-6">
                30년 장인정신,
                <br />
                <span className="gradient-text">AI로 진화하다</span>
              </h2>
              <div className="space-y-6 text-dadam-gray">
                <p>
                  다담가구는 1994년 서울 강남에서 작은 맞춤 가구 공방으로 시작했습니다.
                  &apos;공간의 가치를 담다&apos;라는 철학 아래, 고객 한 분 한 분의 라이프스타일을
                  깊이 이해하고 완벽한 맞춤 가구를 제작해왔습니다.
                </p>
                <p>
                  2023년, 업계 최초로 AI Agent 기반 설계 시스템을 도입하며
                  30년의 장인정신과 최첨단 기술을 결합했습니다.
                  AI가 분석하고, 장인이 완성하는 새로운 맞춤 가구의 기준을 제시합니다.
                </p>
                <p>
                  오늘도 다담가구는 고객님의 공간에 특별한 가치를 담기 위해
                  한 땀 한 땀 정성을 다하고 있습니다.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-dadam-warm rounded-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="font-serif text-6xl text-dadam-gold">30</p>
                  <p className="text-lg text-dadam-charcoal mt-2">Years of Craftsmanship</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-dadam-gold/30 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-dadam-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-dadam-charcoal">
              다담가구의 <span className="gradient-text">핵심 가치</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white p-8 rounded-2xl border border-dadam-warm card-hover"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-dadam-ai-primary/10 to-dadam-ai-secondary/10 flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-dadam-ai-primary" />
                </div>
                <h3 className="font-serif text-xl text-dadam-charcoal mb-3">{value.title}</h3>
                <p className="text-dadam-gray text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmen Section */}
      <section id="craftsmen" className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-dadam-charcoal">
              숙련된 <span className="text-dadam-gold">장인</span>들
            </h2>
            <p className="mt-4 text-dadam-gray">
              30년 이상의 경력을 가진 전문 장인들이 함께합니다
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {craftsmen.map((craftsman) => (
              <div
                key={craftsman.name}
                className="bg-dadam-cream p-8 rounded-2xl"
              >
                <div className="w-20 h-20 rounded-full bg-dadam-warm flex items-center justify-center mb-6">
                  <Hammer className="w-8 h-8 text-dadam-charcoal" />
                </div>
                <h3 className="font-serif text-xl text-dadam-charcoal">{craftsman.name}</h3>
                <p className="text-sm text-dadam-gold mt-1">{craftsman.role}</p>
                <div className="mt-4 flex gap-4 text-sm text-dadam-gray">
                  <span>경력 {craftsman.experience}</span>
                  <span>•</span>
                  <span>{craftsman.specialty}</span>
                </div>
                <p className="mt-4 text-dadam-gray text-sm leading-relaxed">
                  {craftsman.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section id="materials" className="section-padding bg-dadam-charcoal text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl">
              엄선된 <span className="text-dadam-gold">프리미엄 자재</span>
            </h2>
            <p className="mt-4 text-dadam-gray">
              품질에 타협하지 않는 최상급 자재만 사용합니다
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {materials.map((material) => (
              <div
                key={material.title}
                className="p-8 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="w-14 h-14 rounded-xl bg-dadam-gold/20 flex items-center justify-center mb-6">
                  <material.icon className="w-7 h-7 text-dadam-gold" />
                </div>
                <h3 className="font-serif text-xl mb-4">{material.title}</h3>
                <ul className="space-y-2 mb-6">
                  {material.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-dadam-gray">
                      <div className="w-1.5 h-1.5 rounded-full bg-dadam-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-dadam-gray">{material.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-dadam-charcoal">
              다담가구의 <span className="gradient-text">발자취</span>
            </h2>
          </div>
          <div className="space-y-8">
            {history.map((item, index) => (
              <div key={item.year} className="flex gap-8">
                <div className="w-20 flex-shrink-0 text-right">
                  <span className="font-serif text-2xl text-dadam-gold">{item.year}</span>
                </div>
                <div className="relative flex-1 pb-8">
                  <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-dadam-ai-primary" />
                  {index < history.length - 1 && (
                    <div className="absolute left-1.5 top-5 w-px h-full bg-dadam-warm" />
                  )}
                  <div className="ml-8">
                    <h3 className="font-medium text-lg text-dadam-charcoal">{item.event}</h3>
                    <p className="text-dadam-gray mt-1">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="section-padding bg-dadam-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-serif text-4xl text-dadam-charcoal mb-8">
                오시는 길
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-dadam-ai-primary mt-1" />
                  <div>
                    <p className="font-medium text-dadam-charcoal">주소</p>
                    <p className="text-dadam-gray">서울시 강남구 논현동 123-45</p>
                    <p className="text-dadam-gray">다담빌딩 1-3층</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-dadam-ai-primary mt-1" />
                  <div>
                    <p className="font-medium text-dadam-charcoal">전화</p>
                    <p className="text-dadam-gray">02-1234-5678</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-dadam-ai-primary mt-1" />
                  <div>
                    <p className="font-medium text-dadam-charcoal">이메일</p>
                    <p className="text-dadam-gray">contact@dadam.co.kr</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-dadam-ai-primary mt-1" />
                  <div>
                    <p className="font-medium text-dadam-charcoal">영업시간</p>
                    <p className="text-dadam-gray">평일 09:00 - 18:00</p>
                    <p className="text-dadam-gray">주말 및 공휴일 예약제</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="aspect-[4/3] bg-dadam-warm rounded-2xl flex items-center justify-center">
              <div className="text-center text-dadam-gray">
                <MapPin className="w-12 h-12 mx-auto mb-4" />
                <p>지도가 표시됩니다</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-dadam-charcoal text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl">
            다담가구와 함께
            <br />
            <span className="gradient-text">특별한 공간</span>을 만들어보세요
          </h2>
          <p className="mt-6 text-dadam-gray">
            AI 설계 상담으로 시작하세요. 당신의 라이프스타일에 맞는
            완벽한 맞춤 가구를 제안해드립니다.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ai-design" className="btn-primary">
              <Sparkles className="w-4 h-4 mr-2" />
              AI 설계 상담
            </Link>
            <Link href="/quote" className="btn-outline border-white/30 text-white hover:bg-white hover:text-dadam-charcoal">
              무료 견적 받기
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
