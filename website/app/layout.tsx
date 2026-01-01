import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: '다담가구 | 설계 중심의 맞춤 가구',
  description: '공간의 가치를 담다. 다담가구는 설계부터 제작, 설치까지 맞춤형 가구 솔루션을 제공합니다.',
  keywords: '맞춤가구, 빌트인가구, 인테리어, 가구설계, 다담가구',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-gallery-white antialiased">
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
