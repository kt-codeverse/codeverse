'use client';

import { usePathname } from 'next/navigation';
import { Globe, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import SearchBar from './SearchBar';

export default function Header() {
  const pathname = usePathname();
  const isSigninPage = pathname === '/signin';
  const isSignupPage = pathname === '/signup';

  if (isSigninPage || isSignupPage) return null;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* 상단: flex 레이아웃으로 변경 - 좌/우는 최소 너비 유지, 중간은 확장하여 검색바 중앙 배치 */}
      <section className="max-w-7xl mx-auto flex items-center px-4 py-2">
        {/* 좌측: 최소 너비, 축소하지 않음 */}
        <div className="relative flex items-center h-10 cursor-pointer my-auto shrink-0">
          <span className="text-2xl font-bold text-[#FF385C] ml-2 hidden md:inline-block ">
            CodeVerse
          </span>
        </div>

        {/* 중간: 가로로 확장, 가운데 정렬. 내부에서 검색바 최대 너비 제한하여 넓게 보이게 함 */}
        <div className="flex-1 flex justify-center px-4">
          <div className="w-full max-w-3xl">
            <SearchBar />
          </div>
        </div>

        {/* 우측: 최소 너비, 축소하지 않음 */}
        <div className="flex items-center justify-end gap-4 text-gray-700 shrink-0">
          <Button variant={'secondary'} size={'icon'} className="rounded-full">
            <Globe />
          </Button>
          <Button variant={'secondary'} size={'icon'} className="rounded-full">
            <Menu />
          </Button>
        </div>
      </section>
    </header>
  );
}
