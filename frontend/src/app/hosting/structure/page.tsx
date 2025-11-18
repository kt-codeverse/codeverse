'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import RadioCardGroup from '@/src/components/RadioCardGroup';
import { hostingStructureOptions } from '@/src/data/hosting-structure-options';

/**
 * 호스팅할 숙소의 구조를 선택하는 페이지입니다. (1단계)
 * 예: 주택, 아파트, 호텔 등
 */
export default function StructurePage() {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto flex h-full flex-col gap-6 px-4">
          <header className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              어떤 유형의 숙소를 호스팅하시나요?
            </h1>
            <p className="mt-2 text-gray-600">
              1단계: 숙소의 구조를 선택해주세요.
            </p>
          </header>

          <RadioCardGroup options={hostingStructureOptions} />
        </div>
      </main>

      <footer className="sticky bottom-0 border-t bg-white">
        <div className="container mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Button variant="ghost" onClick={() => router.back()}>
            이전
          </Button>
          <Button asChild>
            <Link href="/hosting/privacy-type">다음</Link>
          </Button>
        </div>
      </footer>
    </div>
  );
}
