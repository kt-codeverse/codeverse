'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

/**
 * 숙소에서 제공하는 편의시설을 선택하는 페이지입니다. (5단계)
 * 예: 와이파이, 주방, TV 등
 */
export default function Page() {
  const router = useRouter();

  return (
    <main>
      <section className="h-screen flex flex-col">
        <div className="flex-1 py-10 flex flex-col justify-center gap-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              숙소의 편의시설을 알려주세요.
            </h1>
            <p className="mt-2 text-gray-600">
              5단계: 제공하는 편의시설을 선택하세요.
            </p>
          </div>

          {/* TODO: 여기에 편의시설 선택 UI(체크박스 등)를 구현하세요. */}
          <div className="mt-8 h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">편의시설 선택 컴포넌트 영역</p>
          </div>
        </div>

        <div className="py-10 flex justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            이전
          </Button>
          <Button asChild>
            <Link href="/hosting/photos">다음</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
