import { navIconUrls } from '@/data/urls';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function HeaderNav() {
  return (
    <ul className="flex items-center justify-between px-8">
      {navIconUrls.map((url, index) => (
        <Link
          key={index}
          href={url.href}
          className={cn(
            'flex items-center gap-1 p-2 rounded-lg transition-colors group',
            url.href !== '/'
              ? 'cursor-not-allowed opacity-50 pointer-events-none' // 비활성화
              : 'hover:bg-gray-100', // 활성화
          )}
        >
          <div>
            <Image
              src={url.src}
              width={100}
              height={100}
              alt={url.alt}
              className="group-hover:scale-110 aspect-square/ transition"
            />
          </div>
          <span className="text-sm font-medium">{url.text}</span>
        </Link>
      ))}
    </ul>
  );
}
