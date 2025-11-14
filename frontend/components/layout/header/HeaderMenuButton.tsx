import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../../ui/button';
import { CircleQuestionMark, Menu } from 'lucide-react';
import Link from 'next/link';

export default function HeaderMenuButton() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={'secondary'}
          size={'icon'}
          className="rounded-full hover:bg-neutral-200"
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

        <DropdownMenuItem asChild className="px-4 py-2 cursor-pointer">
          <Link href="/hosting">호스팅 하기</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="px-4 py-2 cursor-pointer">
          <Link href="/signin">로그인 또는 회원가입</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
