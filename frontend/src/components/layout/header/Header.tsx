'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { Button } from '../../ui/button';
import SearchBar from '@/components/search/SearchBar';
import HeaderMenuButton from './HeaderMenuButton';
import HeaderHostingButton from './HeaderHostingButton';
import HeaderAvatar from './HeaderAvatar';
import HeaderNav from './HeaderNav';

export default function Header() {
  const pathname = usePathname();
  const hiddenPages = ['/signin', '/signup', '/hosting'];
  const isHiddenPage = hiddenPages.some((page) => pathname.startsWith(page));
  if (isHiddenPage) return null;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md p-4 md:px-10 pt-4 pb-8 space-y-4 whitespace-nowrap">
      <section className="flex items-center justify-between lg:grid lg:grid-cols-3">
        {/* 좌측 */}
        <div className="relative flex items-center h-10 cursor-pointer my-auto shrink-0">
          <Link
            href="/"
            className="text-lg sm:text-2xl font-bold text-[#FF385C] uppercase"
          >
            tripnest
          </Link>
        </div>

        {/* 중간 */}
        <div className="hidden md:block">
          <HeaderNav />
        </div>

        {/* 우측 */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 md:gap-4 text-gray-700">
          <HeaderHostingButton />
          <Button
            variant={'secondary'}
            size={'icon'}
            className="rounded-full hover:bg-neutral-200"
          >
            <Globe />
          </Button>
          <HeaderAvatar />
          <HeaderMenuButton />
        </div>
      </section>

      <section>
        <div className="hidden md:block">
          <SearchBar />
        </div>
        <div className="block md:hidden">
          <HeaderNav />
        </div>
      </section>
    </header>
  );
}
