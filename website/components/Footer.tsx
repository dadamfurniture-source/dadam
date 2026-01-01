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
    <footer className="bg-neutral-900 text-white border-t border-neutral-800">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <svg width="36" height="28" viewBox="0 0 40 28" fill="none">
                <rect x="0" y="0" width="9" height="12" rx="1" fill="#A8D8EA"/>
                <rect x="10" y="0" width="9" height="12" rx="1" fill="#A8D8EA"/>
                <rect x="20" y="0" width="9" height="12" rx="1" fill="#A8D8EA"/>
                <rect x="30" y="0" width="9" height="12" rx="1" fill="#A8D8EA"/>
                <rect x="0" y="14" width="9" height="12" rx="1" fill="#1B3A5F"/>
                <rect x="10" y="14" width="9" height="12" rx="1" fill="#1B3A5F"/>
                <rect x="20" y="14" width="9" height="12" rx="1" fill="#1B3A5F"/>
                <rect x="30" y="14" width="9" height="12" rx="1" fill="#1B3A5F"/>
              </svg>
              <div>
                <span className="text-lg font-medium">DaDam</span>
                <span className="block text-xs text-neutral-500">당신을 담다</span>
              </div>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-md mb-6">
              다담가구는 고객의 라이프스타일을 깊이 이해하고,
              설계부터 제작, 설치까지 맞춤형 가구 솔루션을 제공합니다.
            </p>
            <div className="space-y-1 text-sm text-neutral-500">
              <p>Tel. 02-1234-5678</p>
              <p>Email. contact@dadam.co.kr</p>
              <p>서울시 강남구 논현동 123-45</p>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-sm font-medium mb-4 tracking-wide">서비스</h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-medium mb-4 tracking-wide">고객지원</h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-600">
            <p>© 2024 DaDam. All rights reserved.</p>
            <div className="flex gap-6">
              <span>사업자등록번호: 123-45-67890</span>
              <span>대표: 홍길동</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
