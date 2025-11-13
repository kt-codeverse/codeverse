'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavIcon from '../NavIcon';
import { Globe, Menu, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { navIconUrls } from '@/data/urls';

export default function Header() {
  const pathname = usePathname();
  const isSigninPage = pathname === '/signin';
  const isSignupPage = pathname === '/signup';

  if (isSigninPage || isSignupPage) return null;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md p-4 md:px-10 pt-4 pb-8 space-y-4 whitespace-nowrap">
      {/* 상단 */}
      <section className="max-w-7xl mx-auto grid grid-cols-3 items-center border border-dashed">
        {/* 좌측 */}
        <div className="relative flex items-center h-10 cursor-pointer my-auto">
          <span className="text-2xl font-bold text-[#FF385C] ml-2 hidden md:inline-block uppercase">
            tripnest
          </span>
        </div>

        {/* 중간 */}
        <div className="">
          <ul className="flex items-center justify-between">
            {navIconUrls.map((url, index) => (
              <li key={index} className="flex items-center">
                <NavIcon src={url.src} alt={url.alt} />
                <Link href={url.href}>{url.text}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 우측 */}
        <div className="flex items-center justify-end gap-4 text-gray-700">
          <Button variant={'ghost'} size={'default'} className="rounded-full">
            호스팅 하기
          </Button>
          <Button variant={'secondary'} size={'icon'} className="rounded-full">
            <Globe />
          </Button>
          <Button variant={'secondary'} size={'icon'} className="rounded-full">
            <Menu />
          </Button>
        </div>
      </section>

      {/* 하단 */}
      <section className="max-w-7xl mx-auto border border-dashed">
        <div
          className="max-w-4xl mx-auto flex items-center justify-between w-full 
         bg-white rounded-full shadow-md border border-gray-200 px-4 py-2"
        >
          {/* 여행지 */}
          <div className="flex flex-col flex-1 px-4">
            <label
              htmlFor="location"
              className="text-sm font-semibold text-gray-700"
            >
              여행지
            </label>
            <input
              id="location"
              name="query"
              type="search"
              placeholder="여행지 검색"
              className="outline-none bg-transparent text-gray-900 placeholder-gray-400 text-base"
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          <div className="w-px h-8 bg-gray-200"></div>

          {/* 체크인 */}
          <div className="flex flex-col flex-1 px-4 cursor-pointer">
            <span className="text-sm font-semibold text-gray-700">체크인</span>
            <span className="text-gray-400 text-base">날짜 추가</span>
          </div>

          <div className="w-px h-8 bg-gray-200"></div>

          {/* 체크아웃 */}
          <div className="flex flex-col flex-1 px-4 cursor-pointer">
            <span className="text-sm font-semibold text-gray-700">
              체크아웃
            </span>
            <span className="text-gray-400 text-base">날짜 추가</span>
          </div>

          <div className="w-px h-8 bg-gray-200"></div>

          {/* 여행자 */}
          <div className="flex flex-col flex-1 px-4 cursor-pointer">
            <span className="text-sm font-semibold text-gray-700">여행자</span>
            <span className="text-gray-400 text-base">게스트 추가</span>
          </div>

          {/* 검색버튼 */}
          <button
            className="ml-4 flex items-center justify-center 
            bg-rose-500 text-white rounded-full p-3 hover:bg-rose-600 transition"
          >
            <Search />
          </button>
        </div>
      </section>
    </header>
  );
}
