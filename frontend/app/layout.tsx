import Header from '@/components/layout/Header';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/layout/Footer';

const inter = Inter({ weight: '400', style: 'normal', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TripNest | sdfsdfsfdsfd',
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
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
