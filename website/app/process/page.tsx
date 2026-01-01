import Link from 'next/link'
import { MessageSquare, Ruler, PenTool, Factory, Truck, Wrench, Phone, CheckCircle } from 'lucide-react'

const processSteps = [
  {
    step: '01',
    title: '상담',
    subtitle: 'Consultation',
    icon: MessageSquare,
    duration: '1-2일',
    description: '고객님의 라이프스타일과 공간에 대해 깊이 이해합니다.',
    details: [
      '전화 또는 온라인 상담 접수',
      '기본 요구사항 및 예산 파악',
      '방문 상담 일정 조율',
      '현장 방문 및 공간 측정',
    ],
  },
  {
    step: '02',
    title: '설계',
    subtitle: 'Design',
    icon: PenTool,
    duration: '3-7일',
    description: '밀리미터 단위의 정밀한 맞춤 설계를 진행합니다.',
    details: [
      '고객 요구사항 상세 분석',
      '3D 도면 및 렌더링 제작',
      '자재 및 컬러 선정',
      '견적서 제공 및 계약',
    ],
  },
  {
    step: '03',
    title: '제작',
    subtitle: 'Manufacturing',
    icon: Factory,
    duration: '2-4주',
    description: '숙련된 장인이 직접 정성껏 제작합니다.',
    details: [
      '자재 입고 및 품질 검수',
      '정밀 가공 및 조립',
      '표면 마감 처리',
      '최종 품질 검사',
    ],
  },
  {
    step: '04',
    title: '배송',
    subtitle: 'Delivery',
    icon: Truck,
    duration: '1일',
    description: '안전한 포장과 배송으로 완벽하게 전달합니다.',
    details: [
      '전문 포장 및 보호',
      '직배송 시스템',
      '설치 전 현장 확인',
      '자재 하차 및 정리',
    ],
  },
  {
    step: '05',
    title: '설치',
    subtitle: 'Installation',
    icon: Wrench,
    duration: '1-3일',
    description: '전문 설치팀이 완벽하게 시공합니다.',
    details: [
      '숙련된 전문 설치팀',
      '정밀 시공 및 조립',
      '마감 및 청소',
      '고객 최종 확인',
    ],
  },
  {
    step: '06',
    title: 'A/S',
    subtitle: 'After Service',
    icon: Phone,
    duration: '상시',
    description: '10년 품질 보증과 지속적인 사후 관리를 약속합니다.',
    details: [
      '10년 품질 보증',
      '신속한 A/S 대응',
      '정기 점검 서비스',
      '부품 교체 지원',
    ],
  },
]

const faqs = [
  {
    question: '상담부터 설치까지 얼마나 걸리나요?',
    answer: '일반적으로 상담부터 설치 완료까지 약 4-6주가 소요됩니다. 프로젝트 규모와 복잡도에 따라 달라질 수 있으며, 상담 시 정확한 일정을 안내해 드립니다.',
  },
  {
    question: '방문 상담은 무료인가요?',
    answer: '네, 첫 방문 상담과 실측은 무료로 진행됩니다. 현장에서 공간을 직접 확인하고 고객님의 요구사항을 상세히 파악하여 정확한 설계와 견적을 제공해 드립니다.',
  },
  {
    question: 'A/S는 어떻게 받을 수 있나요?',
    answer: '전화, 카카오톡, 홈페이지를 통해 A/S를 접수하실 수 있습니다. 접수 후 24시간 이내에 담당자가 연락드리며, 간단한 문제는 전화 안내로, 방문이 필요한 경우 일정을 조율하여 신속하게 처리해 드립니다.',
  },
  {
    question: '설계 변경이 가능한가요?',
    answer: '계약 전까지는 무료로 설계 변경이 가능합니다. 계약 후에는 제작 진행 상황에 따라 변경 가능 범위가 달라지며, 추가 비용이 발생할 수 있습니다.',
  },
]

export default function ProcessPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gallery-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.3em] uppercase text-gallery-gold mb-4">
            Our Process
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-gallery-charcoal">
            서비스 안내
          </h1>
          <p className="mt-6 text-gallery-gray max-w-2xl">
            다담가구는 상담부터 A/S까지 모든 과정을 직접 관리하여
            최상의 결과물을 약속합니다.
          </p>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="section-padding bg-gallery-white">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-0">
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {index < processSteps.length - 1 && (
                  <div className="absolute left-8 md:left-1/2 top-32 bottom-0 w-px bg-gradient-to-b from-gallery-gold to-gallery-warm md:-translate-x-px" />
                )}

                <div className={`grid md:grid-cols-2 gap-8 md:gap-16 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Step Number & Icon */}
                  <div className={`flex items-start gap-6 ${index % 2 === 1 ? 'md:order-2 md:flex-row-reverse' : ''}`}>
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gallery-charcoal flex items-center justify-center">
                        <step.icon size={24} className="text-gallery-white" />
                      </div>
                    </div>
                    <div className={`${index % 2 === 1 ? 'md:text-right' : ''}`}>
                      <p className="text-xs tracking-[0.3em] uppercase text-gallery-gold">
                        Step {step.step}
                      </p>
                      <h3 className="font-serif text-3xl text-gallery-charcoal mt-1">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gallery-gray mt-1">
                        {step.subtitle} · {step.duration}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className={`md:py-8 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <div className="bg-gallery-cream p-8 rounded-sm">
                      <p className="text-gallery-charcoal mb-6">
                        {step.description}
                      </p>
                      <ul className="space-y-3">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gallery-gray">
                            <CheckCircle size={16} className="text-gallery-gold flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Spacer */}
                <div className="h-12 md:h-8" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Summary Timeline */}
      <section className="py-16 bg-gallery-charcoal text-gallery-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between overflow-x-auto pb-4">
            {processSteps.map((step, index) => (
              <div key={step.step} className="flex items-center">
                <div className="flex flex-col items-center min-w-[100px]">
                  <div className="w-12 h-12 rounded-full border-2 border-gallery-gold flex items-center justify-center mb-2">
                    <span className="font-serif text-gallery-gold">{step.step}</span>
                  </div>
                  <span className="text-sm text-gallery-white">{step.title}</span>
                  <span className="text-xs text-gallery-gray mt-1">{step.duration}</span>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="w-12 md:w-24 h-px bg-gallery-gold/50 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gallery-cream">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-gallery-gold mb-4">
              FAQ
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-gallery-charcoal">
              자주 묻는 질문
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gallery-white p-6 rounded-sm"
              >
                <h3 className="font-medium text-gallery-charcoal flex items-start gap-3">
                  <span className="text-gallery-gold flex-shrink-0">Q.</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="mt-4 text-gallery-gray pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gallery-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-gallery-charcoal">
            지금 바로 시작하세요
          </h2>
          <p className="mt-4 text-gallery-gray">
            무료 상담을 통해 당신만의 공간 설계를 시작해보세요.
          </p>
          <Link href="/contact" className="inline-block mt-8 btn-primary">
            무료 상담 신청하기
          </Link>
        </div>
      </section>
    </>
  )
}
