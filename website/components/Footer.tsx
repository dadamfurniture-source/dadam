import Link from 'next/link'

const footerLinks = {
  services: [
    { label: '포트폴리오', href: '/portfolio' },
    { label: '인테리어 파트너', href: '/partners' },
    { label: '자재 소개', href: '/materials' },
    { label: '서비스 안내', href: '/process' },
  ],
  support: [
    { label: '상담 문의', href: '/contact' },
    { label: '자주 묻는 질문', href: '/faq' },
    { label: '이용 약관', href: '/terms' },
    { label: '개인정보처리방침', href: '/privacy' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gallery-charcoal text-gallery-warm">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <h3 className="font-serif text-3xl text-gallery-white">다담가구</h3>
              <p className="text-xs tracking-[0.3em] text-gallery-gray uppercase mt-1">
                DaDam Furniture
              </p>
            </Link>
            <p className="mt-6 text-sm text-gallery-gray leading-relaxed max-w-md">
              공간의 가치를 담다. 다담가구는 고객의 라이프스타일을 깊이 이해하고,
              설계부터 제작, 설치까지 맞춤형 가구 솔루션을 제공합니다.
            </p>
            <div className="mt-8 space-y-2 text-sm text-gallery-gray">
              <p>전화: 02-1234-5678</p>
              <p>이메일: contact@dadam.co.kr</p>
              <p>주소: 서울시 강남구 논현동 123-45</p>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-gallery-white mb-6">
              서비스
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gallery-gray hover:text-gallery-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-gallery-white mb-6">
              고객지원
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gallery-gray hover:text-gallery-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gallery-gray/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gallery-gray">
              © 2024 다담가구. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-gallery-gray">
                사업자등록번호: 123-45-67890
              </span>
              <span className="text-xs text-gallery-gray">
                대표: 홍길동
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
