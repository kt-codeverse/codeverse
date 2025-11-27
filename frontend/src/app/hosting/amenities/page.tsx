'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { HOSTING_STEPS, useHostingStore } from '@/store/useHostingStore';
import AmenitySelector from '@/components/hosting/AmenitySelector';
import { amenityCategories } from '@/data/hosting-amenities-options';

/**
 * 숙소에서 제공하는 편의시설을 선택하는 페이지입니다. (5단계)
 */
export default function Page() {
  const router = useRouter();
  const { hostingData, updateHostingData, step } = useHostingStore();

  const handleSelectionChange = (selectedIds: string[]) => {
    updateHostingData({ amenities: selectedIds });
  };

  const handleNext = useCallback(() => {
    const currentIndex = HOSTING_STEPS.indexOf(step);
    const nextStepPath = HOSTING_STEPS[currentIndex + 1];

    if (nextStepPath) router.push(`/hosting/${nextStepPath}`);
  }, [step, router]);

  return (
    <main>
      <section className="h-screen flex flex-col border/ border-dashed/">
        <div className="max-w-4xl mx-auto flex-1 py-10 flex flex-col items-center justify-center gap-10">
          <header className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              숙소의 편의시설 정보를 알려주세요
            </h1>
            <p className="mt-2 text-gray-600">
              5단계: 게스트에게 제공하는 편의시설을 모두 선택해주세요.
            </p>
          </header>

          <AmenitySelector
            categories={amenityCategories}
            onSelectionChange={handleSelectionChange}
            initialSelection={hostingData.amenities || []}
          />
        </div>

        <div className="py-10 flex justify-between border/ border-dashed/">
          <Button variant="ghost" onClick={() => router.back()}>
            이전
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              !hostingData.amenities || hostingData.amenities.length === 0
            }
          >
            다음
          </Button>
        </div>
      </section>
    </main>
  );
}
