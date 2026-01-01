import Link from 'next/link'
import { Sparkles, Phone, Mail, MapPin, Clock } from 'lucide-react'

const footerLinks = {
  services: [
    { label: 'AI 설계 상담', href: '/ai-design' },
    { label: '포트폴리오', href: '/portfolio' },
    { label: '견적 시스템', href: '/quote' },
    { label: '서비스 & A/S', href: '/service' },
  ],
  company: [
    { label: '회사 소개', href: '/about' },
    { label: '장인 소개', href: '/about#craftsmen' },
    { label: '자재 소개', href: '/about#materials' },
    { label: '오시는 길', href: '/about#location' },
  ],
  support: [
    { label: '자주 묻는 질문', href: '/faq' },
    { label: '이용 약관', href: '/terms' },
    { label: '개인정보처리방침', href: '/privacy' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-dadam-charcoal text-dadam-warm">
      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dadam-ai-primary/20 to-dadam-ai-secondary/20" />
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dadam-ai-primary/20 border border-dadam-ai-primary/30 mb-4">
                <Sparkles className="w-4 h-4 text-dadam-ai-glow" />
                <span className="text-xs text-dadam-ai-glow">AI 설계 시스템</span>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl text-white">
                지금 바로 AI와 함께
                <br />
                <span className="gradient-text">맞춤 가구를 설계</span>하세요
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/ai-design"
                className="px-8 py-4 bg-gradient-to-r from-dadam-ai-primary to-dadam-ai-secondary text-white text-sm tracking-widest uppercase rounded-xl hover:shadow-lg hover:shadow-dadam-ai-primary/30 transition-all"
              >
                AI 상담 시작하기
              </Link>
              <Link
                href="/quote"
                className="px-8 py-4 border border-white/30 text-white text-sm tracking-widest uppercase rounded-xl hover:bg-white/10 transition-all"
              >
                무료 견적 받기
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dadam-ai-primary to-dadam-ai-secondary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-white">다담가구</h3>
                <p className="text-xs tracking-[0.2em] text-dadam-gray uppercase">
                  AI Design Furniture
                </p>
              </div>
            </Link>
            <p className="mt-6 text-sm text-dadam-gray leading-relaxed max-w-md">
              AI Agent가 설계하는 프리미엄 맞춤 가구. 고급 자재와 장인정신으로
              완성되는 고품질 인테리어 가구 솔루션을 경험하세요.
            </p>

            {/* Contact Info */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm text-dadam-gray">
                <Phone className="w-4 h-4 text-dadam-ai-primary" />
                <span>02-1234-5678</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-dadam-gray">
                <Mail className="w-4 h-4 text-dadam-ai-primary" />
                <span>contact@dadam.co.kr</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-dadam-gray">
                <MapPin className="w-4 h-4 text-dadam-ai-primary" />
                <span>서울시 강남구 논현동 123-45</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-dadam-gray">
                <Clock className="w-4 h-4 text-dadam-ai-primary" />
                <span>평일 09:00 - 18:00 (주말 예약제)</span>
              </div>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-white mb-6">
              서비스
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-dadam-gray hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-white mb-6">
              회사
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-dadam-gray hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-white mb-6">
              고객지원
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-dadam-gray hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* A/S Badge */}
            <div className="mt-6 p-4 rounded-xl bg-dadam-gold/10 border border-dadam-gold/20">
              <p className="text-xs text-dadam-gold font-medium">평생 A/S 보장</p>
              <p className="text-xs text-dadam-gray mt-1">
                다담가구와 함께하는 최상의 사후관리
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dadam-gray/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-dadam-gray">
              © 2024 다담가구. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-dadam-gray">
              <span>사업자등록번호: 123-45-67890</span>
              <span>대표: 홍길동</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
