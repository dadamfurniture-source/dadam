import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: '다담가구 | AI 설계 맞춤 가구',
  description: 'AI Agent가 설계하는 프리미엄 맞춤 가구. 고급 자재와 장인정신으로 완성되는 고품질 인테리어 가구 솔루션.',
  keywords: 'AI가구설계, 맞춤가구, 프리미엄가구, 인테리어, 빌트인가구, 다담가구, AI인테리어',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-dadam-white antialiased">
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
