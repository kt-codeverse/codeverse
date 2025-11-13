'use client';

import { usePathname } from 'next/navigation';
import { Globe, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import SearchBar from '../search/SearchBar';

export default function Header() {
  const pathname = usePathname();
  const isSigninPage = pathname === '/signin';
  const isSignupPage = pathname === '/signup';

  if (isSigninPage || isSignupPage) return null;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <section className="max-w-7xl mx-auto flex items-center px-4 py-2">
        <div className="relative flex items-center h-10 cursor-pointer my-auto shrink-0">
          <span className="text-2xl font-bold text-[#FF385C] ml-2 hidden md:inline-block ">
            TripNest
          </span>
        </div>

        <div className="flex-1 flex justify-center px-4">
          <div className="w-full max-w-3xl">
            <SearchBar />
          </div>
        </div>

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
