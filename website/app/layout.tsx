import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: '다담가구 | 당신을 담은 가구',
  description: '설계의 정밀함으로 완성하는 맞춤 가구, 다담가구가 당신의 공간에 가치를 더합니다.',
  keywords: '맞춤가구, 빌트인가구, 인테리어, 가구설계, 다담가구, 주방가구, 드레스룸',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-neutral-50 antialiased">
        <Navigation />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
