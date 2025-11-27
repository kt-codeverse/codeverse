'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { hostingPrivacyTypeOptions } from '@/data/hosting-privacy-type-options';
import GuestRoomType from '@/components/hosting/GuestRoomType';
import { HOSTING_STEPS, useHostingStore } from '@/store/useHostingStore';

/**
 * 게스트에게 제공될 공간의 유형을 선택하는 페이지입니다. (2단계)
 * 예: 공간 전체, 개인실, 다인실
 */
export default function Page() {
  const router = useRouter();
  const { hostingData, updateHostingData, step } = useHostingStore();
  const privacyType = hostingData.privacyType;

  const handleValueChange = (value: string) => {
    updateHostingData({ privacyType: value });
  };

  const handleNext = useCallback(() => {
    const currentIndex = HOSTING_STEPS.indexOf(step);
    const nextStepPath = HOSTING_STEPS[currentIndex + 1];

    if (nextStepPath) router.push(`/hosting/${nextStepPath}`);
  }, [step, router]);

  return (
    <main>
      <section className="h-screen flex flex-col border/ border-dashed/">
        <div className="max-w-2xl mx-auto flex-1 py-10 flex flex-col justify-center gap-10">
          <header className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              게스트가 머물게 될 숙소의 종류를 선택해주세요
            </h1>
            <p className="mt-2 text-gray-600">
              2단계: 게스트에게 제공되는 공간의 유형을 선택해주세요.
            </p>
          </header>

          <GuestRoomType
            options={hostingPrivacyTypeOptions}
            value={privacyType ?? undefined}
            onValueChange={handleValueChange}
          />
        </div>

        <div className="py-10 flex justify-between border/ border-dashed/">
          <Button variant="ghost" onClick={() => router.back()}>
            이전
          </Button>
          <Button onClick={handleNext} disabled={!privacyType}>
            다음
          </Button>
        </div>
      </section>
    </main>
  );
}
