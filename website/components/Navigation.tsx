'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/portfolio', label: '포트폴리오', en: 'Portfolio' },
  { href: '/partners', label: '인테리어 파트너', en: 'Partners' },
  { href: '/materials', label: '자재 소개', en: 'Materials' },
  { href: '/process', label: '서비스 안내', en: 'Process' },
  { href: '/contact', label: '상담 문의', en: 'Contact' },
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
            ? 'bg-gallery-white/95 backdrop-blur-md shadow-sm py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group">
              <div className="flex flex-col">
                <span className="font-serif text-2xl md:text-3xl text-gallery-charcoal tracking-tight">
                  다담가구
                </span>
                <span className="text-[10px] tracking-[0.3em] text-gallery-gray uppercase">
                  DaDam Furniture
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative py-2"
                >
                  <span className="text-sm text-gallery-charcoal tracking-wide">
                    {link.label}
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-gallery-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* CTA Button - Desktop */}
            <Link
              href="/contact"
              className="hidden lg:block px-6 py-3 border border-gallery-charcoal text-gallery-charcoal
                         text-xs tracking-widest uppercase transition-all duration-300
                         hover:bg-gallery-charcoal hover:text-gallery-white"
            >
              상담 예약
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gallery-charcoal"
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
          className="absolute inset-0 bg-gallery-black/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div
          className={`absolute right-0 top-0 h-full w-80 bg-gallery-white shadow-2xl transition-transform duration-500 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 text-gallery-charcoal"
              aria-label="메뉴 닫기"
            >
              <X size={24} />
            </button>

            <div className="mt-16 space-y-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-4 border-b border-gallery-warm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-lg text-gallery-charcoal">{link.label}</span>
                  <span className="block text-xs text-gallery-gray tracking-widest uppercase mt-1">
                    {link.en}
                  </span>
                </Link>
              ))}
            </div>

            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full mt-8 py-4 bg-gallery-charcoal text-gallery-white text-center
                         text-sm tracking-widest uppercase"
            >
              상담 예약하기
            </Link>

            <div className="mt-12 pt-8 border-t border-gallery-warm">
              <p className="text-xs text-gallery-gray">
                © 2024 다담가구
              </p>
              <p className="text-xs text-gallery-gray mt-1">
                공간의 가치를 담다
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
