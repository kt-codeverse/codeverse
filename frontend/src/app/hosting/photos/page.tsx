'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

/**
 * 숙소 사진을 업로드하는 페이지입니다. (6단계)
 */
export default function Page() {
  const router = useRouter();

  return (
    <main>
      <section className="h-screen flex flex-col">
        <div className="flex-1 py-10 flex flex-col justify-center gap-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold">숙소 사진을 추가하세요.</h1>
            <p className="mt-2 text-gray-600">
              6단계: 멋진 사진 5장 이상을 올려주세요.
            </p>
          </div>

          {/* TODO: 여기에 사진 업로드 UI를 구현하세요. */}
          <div className="mt-8 h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">사진 업로드 컴포넌트 영역</p>
          </div>
        </div>

        <div className="py-10 flex justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            이전
          </Button>
          <Button asChild>
            <Link href="/hosting/title">다음</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
