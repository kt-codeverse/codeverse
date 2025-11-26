import Header from '@/components/layout/header/Header';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/layout/footer/Footer';
// [1] ChatWidget 컴포넌트 추가
import ChatWidget from '@/components/ChatWidget'; //

const inter = Inter({ weight: '400', style: 'normal', subsets: ['latin'] });

export const metadata: Metadata = {
  // 기존 메타데이터 유지
  title: 'TRIPNEST',
  description: '',
  keywords: [''],
  // icons: "/favicon.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Header />
        {children}
        <Footer />
        {/* [2] 앱 전체에 채팅 위젯 추가 */}
        {/* 역할: 모든 페이지의 콘텐츠(children)와 푸터 위에 채팅 위젯을 고정 배치합니다. */}
        <ChatWidget />
      </body>
    </html>
  );
}
