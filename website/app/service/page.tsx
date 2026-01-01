import Link from 'next/link'
import {
  Sparkles,
  MessageSquare,
  Ruler,
  Wrench,
  Truck,
  Shield,
  Phone,
  Clock,
  CheckCircle2,
  ArrowRight,
  Hammer,
  Award,
  RefreshCw,
  HeartHandshake
} from 'lucide-react'

// Process steps
const processSteps = [
  {
    number: '01',
    title: 'AI 상담',
    description: 'AI Agent와 대화하며 라이프스타일과 공간 요구사항을 분석합니다. 원하시는 스타일, 예산, 일정 등을 편하게 말씀해주세요.',
    icon: MessageSquare,
    duration: '약 15분',
    aiFeature: true,
  },
  {
    number: '02',
    title: '방문 실측',
    description: '전문 설계사가 직접 방문하여 정밀 실측을 진행합니다. 밀리미터 단위의 정확한 측정으로 최적의 설계가 가능합니다.',
    icon: Ruler,
    duration: '약 1시간',
  },
  {
    number: '03',
    title: 'AI 설계 & 3D 시뮬레이션',
    description: 'AI가 실측 데이터를 기반으로 최적의 가구 배치와 디자인을 제안합니다. 3D 시뮬레이션으로 완성된 모습을 미리 확인하세요.',
    icon: Sparkles,
    duration: '3-5일',
    aiFeature: true,
  },
  {
    number: '04',
    title: '장인 제작',
    description: '30년 경력의 숙련된 장인이 엄선된 고급 자재로 직접 제작합니다. 모든 과정은 품질 관리 시스템을 통해 철저히 관리됩니다.',
    icon: Wrench,
    duration: '2-4주',
  },
  {
    number: '05',
    title: '설치',
    description: '전문 설치팀이 완벽하게 설치해드립니다. 설치 후 세부 조정과 청소까지 깔끔하게 마무리합니다.',
    icon: Truck,
    duration: '1일',
  },
  {
    number: '06',
    title: '평생 A/S',
    description: '설치 완료 후에도 평생 A/S를 제공합니다. 작은 조정부터 수리까지, 언제든 연락주세요.',
    icon: Shield,
    duration: '평생',
  },
]

// A/S features
const asFeatures = [
  {
    icon: Clock,
    title: '빠른 응대',
    description: '접수 후 24시간 내 응대, 72시간 내 방문',
  },
  {
    icon: RefreshCw,
    title: '무상 수리',
    description: '제조 결함은 기간 제한 없이 무상 수리',
  },
  {
    icon: Hammer,
    title: '유지보수',
    description: '연 1회 무료 점검 및 관리 서비스',
  },
  {
    icon: HeartHandshake,
    title: '고객 만족',
    description: '불만족 시 재작업 또는 환불 보장',
  },
]

// Guarantees
const guarantees = [
  '자재 품질 5년 보증',
  '제조 결함 무상 수리',
  '설치 1년 내 무상 조정',
  '평생 유상 A/S',
  '정기 점검 서비스',
  '긴급 출동 서비스',
]

export default function ServicePage() {
  return (
    <div className="min-h-screen bg-dadam-white">
      {/* Hero Section */}
      <section className="relative py-32 bg-dadam-cream overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-dadam-ai-primary/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dadam-ai-primary/10 border border-dadam-ai-primary/20 mb-6">
              <Shield className="w-4 h-4 text-dadam-ai-primary" />
              <span className="text-sm font-medium text-dadam-ai-primary">Service & A/S</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl text-dadam-charcoal">
              처음부터 끝까지
              <br />
              <span className="gradient-text">완벽한 서비스</span>
            </h1>
            <p className="mt-6 text-lg text-dadam-gray max-w-2xl">
              AI 상담부터 장인 제작, 설치, 그리고 평생 A/S까지.
              다담가구는 모든 과정에서 최상의 경험을 약속합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-dadam-charcoal">
              서비스 <span className="gradient-text">진행 과정</span>
            </h2>
            <p className="mt-4 text-dadam-gray">
              AI와 장인이 함께하는 체계적인 프로세스
            </p>
          </div>

          <div className="space-y-8">
            {processSteps.map((step, index) => (
              <div
                key={step.number}
                className={`flex flex-col lg:flex-row gap-8 items-start ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className="flex-1">
                  <div className={`p-8 rounded-2xl border ${
                    step.aiFeature
                      ? 'bg-gradient-to-br from-dadam-ai-primary/5 to-dadam-ai-secondary/5 border-dadam-ai-primary/20'
                      : 'bg-white border-dadam-warm'
                  }`}>
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        step.aiFeature
                          ? 'bg-gradient-to-br from-dadam-ai-primary to-dadam-ai-secondary'
                          : 'bg-dadam-cream'
                      }`}>
                        <step.icon className={`w-8 h-8 ${step.aiFeature ? 'text-white' : 'text-dadam-charcoal'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`font-serif text-3xl ${
                            step.aiFeature ? 'gradient-text' : 'text-dadam-gold'
                          }`}>
                            {step.number}
                          </span>
                          {step.aiFeature && (
                            <span className="px-2 py-1 rounded bg-dadam-ai-primary/20 text-xs text-dadam-ai-primary font-medium">
                              AI
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif text-2xl text-dadam-charcoal mb-3">
                          {step.title}
                        </h3>
                        <p className="text-dadam-gray leading-relaxed">
                          {step.description}
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-dadam-gold" />
                          <span className="text-dadam-gray">소요 시간: {step.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:flex flex-col items-center justify-center w-20">
                    <div className="w-px h-20 bg-gradient-to-b from-dadam-ai-primary to-dadam-ai-secondary" />
                    <ArrowRight className="w-6 h-6 text-dadam-ai-primary rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A/S Section */}
      <section className="section-padding bg-dadam-charcoal text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dadam-gold/20 border border-dadam-gold/30 mb-6">
                <Shield className="w-4 h-4 text-dadam-gold" />
                <span className="text-sm text-dadam-gold font-medium">평생 A/S 보장</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl">
                제작 후에도
                <br />
                <span className="text-dadam-gold">평생 함께</span>합니다
              </h2>
              <p className="mt-6 text-dadam-gray leading-relaxed">
                다담가구는 가구를 설치한 후에도 고객님과의 관계가 끝나지 않습니다.
                평생 A/S 보장으로 언제든 최상의 상태를 유지할 수 있도록 도와드립니다.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {guarantees.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-dadam-gold flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {asFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div className="w-12 h-12 rounded-xl bg-dadam-gold/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-dadam-gold" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-dadam-gray">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-dadam-charcoal">
              품질 <span className="text-dadam-gold">약속</span>
            </h2>
            <p className="mt-4 text-dadam-gray">
              다담가구가 약속하는 5가지 품질 원칙
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              { number: '01', title: '최상급 자재', desc: '엄선된 유럽산 원목과 프리미엄 하드웨어' },
              { number: '02', title: '정밀 설계', desc: '밀리미터 단위의 정확한 맞춤 제작' },
              { number: '03', title: '장인 제작', desc: '30년 경력 숙련 장인의 수작업' },
              { number: '04', title: '철저한 검수', desc: '5단계 품질 검사 시스템' },
              { number: '05', title: '평생 책임', desc: '설치 후에도 평생 A/S 보장' },
            ].map((item) => (
              <div key={item.number} className="text-center p-6">
                <span className="font-serif text-4xl gradient-text">{item.number}</span>
                <h3 className="font-medium text-dadam-charcoal mt-4 mb-2">{item.title}</h3>
                <p className="text-sm text-dadam-gray">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-dadam-cream">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-dadam-charcoal">
            서비스에 대해
            <br />
            <span className="gradient-text">궁금하신 점</span>이 있으신가요?
          </h2>
          <p className="mt-6 text-dadam-gray">
            언제든 편하게 문의해주세요. 친절하게 안내해드리겠습니다.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ai-design" className="btn-primary">
              <Sparkles className="w-4 h-4 mr-2" />
              AI 상담 시작하기
            </Link>
            <a
              href="tel:02-1234-5678"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-dadam-charcoal text-dadam-charcoal rounded-lg hover:bg-dadam-charcoal hover:text-white transition-all"
            >
              <Phone className="w-4 h-4" />
              02-1234-5678
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
