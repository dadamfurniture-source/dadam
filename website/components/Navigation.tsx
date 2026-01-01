'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Search, User, ChevronDown } from 'lucide-react'

const navLinks = [
  { href: '/about', label: 'About us' },
  { href: '/portfolio', label: 'Collection' },
  { href: '/products', label: 'Products' },
  { href: '/ai-design', label: 'AI Design' },
  { href: '/stories', label: 'Stories' },
  { href: '/showroom', label: 'Showroom' },
  { href: '/service', label: 'Service' },
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
            ? 'bg-white/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <svg
                className={`w-8 h-8 transition-colors ${isScrolled ? 'text-dadam-charcoal' : 'text-white'}`}
                viewBox="0 0 40 40"
                fill="currentColor"
              >
                <path d="M20 4L4 12v16l16 8 16-8V12L20 4zm0 4l12 6-12 6-12-6 12-6zm-12 10l12 6 12-6v8l-12 6-12-6v-8z"/>
              </svg>
              <span className={`font-serif text-2xl tracking-tight transition-colors ${isScrolled ? 'text-dadam-charcoal' : 'text-white'}`}>
                다담
              </span>
            </Link>

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wide transition-colors hover:opacity-70 ${
                    isScrolled ? 'text-dadam-charcoal' : 'text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="hidden lg:flex items-center gap-6">
              <button className={`transition-colors hover:opacity-70 ${isScrolled ? 'text-dadam-charcoal' : 'text-white'}`}>
                <User size={20} />
              </button>
              <button className={`transition-colors hover:opacity-70 ${isScrolled ? 'text-dadam-charcoal' : 'text-white'}`}>
                <Search size={20} />
              </button>
              <button className={`flex items-center gap-1 text-sm transition-colors hover:opacity-70 ${isScrolled ? 'text-dadam-charcoal' : 'text-white'}`}>
                KR
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`lg:hidden p-2 transition-colors ${isScrolled ? 'text-dadam-charcoal' : 'text-white'}`}
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
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-dadam-charcoal transition-transform duration-500 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-12">
              <span className="font-serif text-2xl text-white">다담</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-white"
                aria-label="메뉴 닫기"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-2xl text-white hover:text-dadam-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-16 pt-8 border-t border-white/20">
              <div className="flex items-center gap-6 text-white/70">
                <button className="hover:text-white transition-colors">
                  <User size={20} />
                </button>
                <button className="hover:text-white transition-colors">
                  <Search size={20} />
                </button>
                <button className="flex items-center gap-1 text-sm hover:text-white transition-colors">
                  KR
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-sm text-white/50">
                © 2024 다담가구
              </p>
              <p className="text-xs text-white/30 mt-1">
                Premium Custom Furniture
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
