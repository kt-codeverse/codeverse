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
        <div className="relative flex items-center h-10 cursor-pointer my-auto shrink-0">
          <span className="text-2xl font-bold text-[#FF385C] ml-2 hidden md:inline-block ">
            TripNest
          </span>
        </div>

        {/* 중간 */}
        <div className="">
          <ul className="flex items-center justify-between">
            {navIconUrls.map((url, index) => (
              <li
                key={index}
                className="flex items-center group hover:cursor-pointer"
              >
                <span className="group-hover:scale-110 transition">
                  <NavIcon src={url.src} alt={url.alt} />
                </span>
                <Link href={url.href}>{url.text}</Link>
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
