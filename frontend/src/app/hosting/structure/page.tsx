'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import RadioCardGroup from '@/components/hosting/RadioCardGroup';
import { hostingStructureOptions } from '@/data/hosting-structure-options';
import { Button } from '@/components/ui/button';
import { HOSTING_STEPS, useHostingStore } from '@/store/useHostingStore';

/**
 * 호스팅할 숙소의 구조를 선택하는 페이지입니다. (1단계)
 * 예: 주택, 아파트, 호텔 등
 */
export default function Page() {
  const router = useRouter();
  const { hostingData, updateHostingData, step } = useHostingStore();

  const handleValueChange = (value: string) => {
    updateHostingData({ structure: value });
  };

  const handleNext = useCallback(() => {
    const currentIndex = HOSTING_STEPS.indexOf(step);
    const nextStepPath = HOSTING_STEPS[currentIndex + 1];

    if (nextStepPath) router.push(`/hosting/${nextStepPath}`);
  }, [step, router]);

  return (
    <main>
      <section className="h-screen flex flex-col border/ border-dashed/">
        <div
          className="flex-1 py-10 border/ border-dashed/
          flex flex-col justify-center gap-10 "
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              어떤 유형의 숙소를 호스팅하시나요?
            </h1>
            <p className="mt-2 text-gray-600">
              1단계: 숙소의 구조를 선택해주세요.
            </p>
          </div>

          <div className="w-full max-w-4xl mx-auto">
            <RadioCardGroup
              options={hostingStructureOptions}
              value={hostingData.structure ?? undefined}
              onValueChange={handleValueChange}
            />
          </div>
        </div>

        <div className="py-10 flex justify-between border/ border-dashed/">
          <Button variant="ghost" onClick={() => router.back()}>
            이전
          </Button>
          <Button onClick={handleNext} disabled={!hostingData.structure}>
            다음
          </Button>
        </div>
      </section>
    </main>
  );
}
