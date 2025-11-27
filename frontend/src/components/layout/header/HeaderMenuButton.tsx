'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../../ui/button';
import { CircleQuestionMark, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from './useAuthStore';
import { useEffect } from 'react';

export default function HeaderMenuButton() {
  const { isLoggedIn, checkAuth } = useAuthStore();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = () => {
    logout();
    router.push('/');
    router.refresh(); // 페이지를 새로고침하여 상태를 업데이트합니다.
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={'secondary'}
          size={'default'}
          className="rounded-full hover:bg-neutral-200 h-10 px-2"
        >
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild className="px-4 py-2 cursor-pointer">
          <Link href="/help" className="flex items-center gap-2">
            <CircleQuestionMark size={16} />
            <span>도움말 센터</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isLoggedIn ? (
          <>
            <DropdownMenuItem asChild className="px-4 py-2 cursor-pointer">
              <Link href="/my/profile">마이 페이지</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="px-4 py-2 cursor-pointer">
              <Link href="/my/wishlists">위시리스트</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="px-4 py-2 cursor-pointer flex items-center gap-2"
            >
              <LogOut size={16} />
              <span>로그아웃</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild className="px-4 py-2 cursor-pointer">
            <Link href="/signin">로그인 또는 회원가입</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
