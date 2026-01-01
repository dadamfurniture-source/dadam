import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Instagram, Youtube } from 'lucide-react'

const footerLinks = {
  menu: [
    { label: 'About us', href: '/about' },
    { label: 'Collection', href: '/portfolio' },
    { label: 'Products', href: '/products' },
    { label: 'AI Design', href: '/ai-design' },
    { label: 'Stories', href: '/stories' },
    { label: 'Showroom', href: '/showroom' },
    { label: 'Service', href: '/service' },
  ],
  support: [
    { label: '자주 묻는 질문', href: '/faq' },
    { label: '이용 약관', href: '/terms' },
    { label: '개인정보처리방침', href: '/privacy' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-dadam-charcoal text-white">
      {/* Main Footer */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <svg
                className="w-8 h-8 text-white"
                viewBox="0 0 40 40"
                fill="currentColor"
              >
                <path d="M20 4L4 12v16l16 8 16-8V12L20 4zm0 4l12 6-12 6-12-6 12-6zm-12 10l12 6 12-6v8l-12 6-12-6v-8z"/>
              </svg>
              <span className="font-serif text-2xl">다담</span>
            </Link>

            <p className="mt-6 text-sm text-white/60 leading-relaxed max-w-md">
              AI 기술과 30년 장인정신이 만나 탄생하는 프리미엄 맞춤 가구.
              최고급 자재와 정교한 시공으로 완벽한 공간을 만들어 드립니다.
            </p>

            {/* Contact Info */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Phone className="w-4 h-4 text-dadam-gold" />
                <span>02-1234-5678</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Mail className="w-4 h-4 text-dadam-gold" />
                <span>contact@dadam.co.kr</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <MapPin className="w-4 h-4 text-dadam-gold" />
                <span>서울시 강남구 논현동 123-45</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Clock className="w-4 h-4 text-dadam-gold" />
                <span>평일 09:00 - 18:00</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-white transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-white transition-colors"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Menu Links */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-white/40 mb-6">
              Menu
            </h4>
            <ul className="space-y-3">
              {footerLinks.menu.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-white/40 mb-6">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* A/S Badge */}
            <div className="mt-8 p-4 border border-dadam-gold/30">
              <p className="text-sm text-dadam-gold font-medium">평생 A/S 보장</p>
              <p className="text-xs text-white/40 mt-1">
                다담과 함께하는 최상의 사후관리
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/40">
              © 2024 다담가구. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-white/40">
              <span>사업자등록번호: 123-45-67890</span>
              <span>대표: 홍길동</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
