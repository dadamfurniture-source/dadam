'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Sparkles } from 'lucide-react'

const navLinks = [
  { href: '/ai-design', label: 'AI 설계 상담', en: 'AI Design', highlight: true },
  { href: '/portfolio', label: '포트폴리오', en: 'Portfolio' },
  { href: '/quote', label: '견적 시스템', en: 'Quote' },
  { href: '/service', label: '서비스 & A/S', en: 'Service' },
  { href: '/about', label: '회사 소개', en: 'About' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-dadam-white/95 backdrop-blur-md shadow-sm py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dadam-ai-primary to-dadam-ai-secondary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-dadam-ai-primary to-dadam-ai-secondary opacity-30 blur group-hover:opacity-50 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl md:text-3xl text-dadam-charcoal tracking-tight">
                  다담가구
                </span>
                <span className="text-[10px] tracking-[0.2em] text-dadam-gray uppercase">
                  AI Design Furniture
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative py-2 ${
                    link.highlight
                      ? 'px-4 py-2 rounded-full bg-gradient-to-r from-dadam-ai-primary to-dadam-ai-secondary text-white text-sm font-medium hover:shadow-lg hover:shadow-dadam-ai-primary/30 transition-all'
                      : ''
                  }`}
                >
                  {link.highlight ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {link.label}
                    </span>
                  ) : (
                    <>
                      <span className="text-sm text-dadam-charcoal tracking-wide">
                        {link.label}
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-dadam-ai-primary to-dadam-ai-secondary transition-all duration-300 group-hover:w-full" />
                    </>
                  )}
                </Link>
              ))}
            </div>

            {/* CTA Button - Desktop */}
            <Link
              href="/quote"
              className="hidden lg:block px-6 py-3 border border-dadam-charcoal text-dadam-charcoal
                         text-xs tracking-widest uppercase transition-all duration-300
                         hover:bg-dadam-charcoal hover:text-white rounded-lg"
            >
              무료 견적
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-dadam-charcoal"
              aria-label="메뉴 열기"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-500 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-dadam-black/30 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div
          className={`absolute right-0 top-0 h-full w-80 bg-dadam-white shadow-2xl transition-transform duration-500 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 text-dadam-charcoal"
              aria-label="메뉴 닫기"
            >
              <X size={24} />
            </button>

            {/* AI Badge */}
            <div className="mt-12 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-dadam-ai-primary/10 to-dadam-ai-secondary/10 border border-dadam-ai-primary/20">
                <Sparkles className="w-4 h-4 text-dadam-ai-primary" />
                <span className="text-sm font-medium gradient-text">AI 설계 시스템</span>
              </div>
            </div>

            <div className="space-y-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-4 border-b border-dadam-warm ${
                    link.highlight ? 'bg-gradient-to-r from-dadam-ai-primary/5 to-dadam-ai-secondary/5 -mx-2 px-2 rounded-lg border-none mb-2' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className={`text-lg ${link.highlight ? 'gradient-text font-medium' : 'text-dadam-charcoal'}`}>
                    {link.highlight && <Sparkles className="w-4 h-4 inline mr-2" />}
                    {link.label}
                  </span>
                  <span className="block text-xs text-dadam-gray tracking-widest uppercase mt-1">
                    {link.en}
                  </span>
                </Link>
              ))}
            </div>

            <Link
              href="/quote"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full mt-8 py-4 bg-gradient-to-r from-dadam-ai-primary to-dadam-ai-secondary text-white text-center
                         text-sm tracking-widest uppercase rounded-xl"
            >
              무료 견적 받기
            </Link>

            <div className="mt-12 pt-8 border-t border-dadam-warm">
              <p className="text-xs text-dadam-gray">
                © 2024 다담가구
              </p>
              <p className="text-xs text-dadam-gray mt-1">
                AI가 설계하는 프리미엄 맞춤 가구
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
