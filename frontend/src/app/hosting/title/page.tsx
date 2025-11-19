'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

/**
 * 숙소의 이름을 정하는 페이지입니다. (7단계, 마지막)
 */
export default function Page() {
  const router = useRouter();

  return (
    <main>
      <section className="h-screen flex flex-col">
        <div className="flex-1 py-10 flex flex-col justify-center gap-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold">숙소 이름 정하기</h1>
            <p className="mt-2 text-gray-600">
              7단계: 게스트가 검색할 때 표시될 멋진 이름을 만들어보세요.
            </p>
          </div>

          <div className="mt-8 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">숙소 이름 입력 컴포넌트 영역</p>
          </div>
        </div>

        <div className="py-10 flex justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            이전
          </Button>
          <Button>호스팅 완료하기</Button>
        </div>
      </section>
    </main>
  );
}
