'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { hostingPrivacyTypeOptions } from '@/data/hosting-privacy-type-options';
import GuestRoomType from '@/components/hosting/GuestRoomType';

/**
 * 게스트에게 제공될 공간의 유형을 선택하는 페이지입니다. (2단계)
 * 예: 전체 공간, 개인실, 다인실
 */
export default function Page() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/hosting/location');
  };

  return (
    <main>
      <section className="h-screen flex flex-col border border-dashed">
        <div
          className="max-w-4xl mx-auto border border-dashed
          flex-1 py-10 flex flex-col items-center justify-center gap-10"
        >
          <header className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              게스트에게 어떤 공간을 제공하시나요?
            </h1>
            <p className="mt-2 text-gray-600">
              2단계: 숙소 유형을 선택해주세요.
            </p>
          </header>

          <GuestRoomType options={hostingPrivacyTypeOptions} />
        </div>

        <div className="py-10 flex justify-between border border-dashed">
          <Button variant="ghost" onClick={() => router.back()}>
            이전
          </Button>
          <Button onClick={handleNext}>다음</Button>
        </div>
      </section>
    </main>
  );
}
