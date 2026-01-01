'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/portfolio', label: '포트폴리오' },
  { href: '/partners', label: '인테리어 파트너' },
  { href: '/materials', label: '자재 소개' },
  { href: '/process', label: '서비스 안내' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <svg width="36" height="32" viewBox="0 0 40 28" fill="none" className="transition-elegant">
                <rect x="0" y="0" width="9" height="12" rx="1" className="fill-primary-sky"/>
                <rect x="10" y="0" width="9" height="12" rx="1" className="fill-primary-sky"/>
                <rect x="20" y="0" width="9" height="12" rx="1" className="fill-primary-sky"/>
                <rect x="30" y="0" width="9" height="12" rx="1" className="fill-primary-sky"/>
                <rect x="0" y="14" width="9" height="12" rx="1" className="fill-primary-navy"/>
                <rect x="10" y="14" width="9" height="12" rx="1" className="fill-primary-navy"/>
                <rect x="20" y="14" width="9" height="12" rx="1" className="fill-primary-navy"/>
                <rect x="30" y="14" width="9" height="12" rx="1" className="fill-primary-navy"/>
              </svg>
              <span className={`text-lg lg:text-xl font-medium tracking-tight transition-colors ${
                isScrolled ? 'text-neutral-800' : 'text-white'
              } group-hover:text-primary-sky`}>
                다담가구
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm underline-animation tracking-wide transition-colors ${
                    isScrolled
                      ? 'text-neutral-600 hover:text-primary-navy'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className={`ml-4 px-6 py-2.5 text-sm tracking-wide transition-all duration-300 ${
                  isScrolled
                    ? 'border border-primary-navy text-primary-navy hover:bg-primary-navy hover:text-white'
                    : 'border border-white/50 text-white hover:bg-white hover:text-primary-navy'
                }`}
              >
                상담 예약
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`lg:hidden p-2 ${isScrolled ? 'text-neutral-800' : 'text-white'}`}
              aria-label="메뉴 열기"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div
          className={`absolute right-0 top-0 h-full w-full max-w-sm bg-primary-navy transform transition-transform duration-500 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-8 h-full flex flex-col">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="self-end p-2 text-white/70 hover:text-white"
              aria-label="메뉴 닫기"
            >
              <X size={24} />
            </button>

            <div className="flex-1 flex flex-col justify-center space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl text-white font-light tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl text-white font-light tracking-wide"
              >
                상담 문의
              </Link>
            </div>

            <div className="text-white/50 text-sm">
              <p>Tel. 02-1234-5678</p>
              <p className="mt-1">contact@dadam.co.kr</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
