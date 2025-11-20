'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavIcon from '../../NavIcon';
import { Globe } from 'lucide-react';
import { Button } from '../../ui/button';
import { navIconUrls } from '@/data/urls';
import SearchBar from '@/components/search/SearchBar';
import HeaderMenuButton from './HeaderMenuButton';
import HeaderHostingButton from './HeaderHostingButton';
import { cn } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();

  const hiddenPages = ['/signin', '/signup', '/hosting'];
  const isHiddenPage = hiddenPages.some((page) => pathname.startsWith(page));
  if (isHiddenPage) return null;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md p-4 md:px-10 pt-4 pb-8 space-y-4 whitespace-nowrap">
      {/* 상단 */}
      <section className="max-w-7xl mx-auto grid grid-cols-3 items-center border border-dashed">
        {/* 좌측 */}
        <div className="relative flex items-center h-10 cursor-pointer my-auto shrink-0">
          <span className="text-2xl font-bold text-[#FF385C] ml-2 hidden md:inline-block uppercase">
            tripnest
          </span>
        </div>

        {/* 중간 */}
        <div className="">
          <ul className="flex items-center justify-between">
            {navIconUrls.map((url, index) => (
              <li
                key={index}
                className={cn(
                  'flex items-center group',
                  url.href !== '/'
                    ? 'cursor-not-allowed opacity-50' // 비활성화 스타일
                    : 'hover:cursor-pointer', // 활성화 시 호버 효과
                )}
              >
                <span
                  className={cn(
                    'transition',
                    url.href === '/' && 'group-hover:scale-110', // 활성화 시에만 호버 효과 적용
                  )}
                >
                  <NavIcon src={url.src} alt={url.alt} />
                </span>
                {/* href가 '/'가 아니면 Link 대신 span을 렌더링하여 내비게이션을 방지합니다. */}
                {url.href === '/' ? (
                  <Link href={url.href}>{url.text}</Link>
                ) : (
                  <span>{url.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* 우측 */}
        <div className="flex items-center justify-end gap-4 text-gray-700">
          <HeaderHostingButton />
          <Button
            variant={'secondary'}
            size={'icon'}
            className="rounded-full hover:bg-neutral-200"
          >
            <Globe />
          </Button>
          <HeaderMenuButton />
        </div>
      </section>

      {/* 하단 */}
      <section className="max-w-7xl mx-auto border border-dashed">
        <SearchBar />
      </section>
    </header>
  );
}
