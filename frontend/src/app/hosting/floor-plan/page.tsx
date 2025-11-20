'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  HOSTING_STEPS,
  initialState,
  useHostingStore,
} from '@/store/useHostingStore';
import GuestBedroomBedStepper from '@/components/hosting/GuestBedroomBedStepper';

/**
 * 숙소의 평면도(게스트, 침실, 침대 수)를 설정하는 페이지입니다. (4단계)
 */
export default function Page() {
  const router = useRouter();
  const { hostingData, updateHostingData, step } = useHostingStore();

  const handleValueChange = (
    key: 'guests' | 'bedrooms' | 'beds' | 'bathrooms',
    value: number,
  ) => {
    updateHostingData({
      floorPlan: { ...hostingData.floorPlan, [key]: value },
    });
  };

  const handleNext = () => {
    const currentIndex = HOSTING_STEPS.indexOf(step);
    const nextStepPath = HOSTING_STEPS[currentIndex + 1];

    if (nextStepPath) router.push(`/hosting/${nextStepPath}`);
  };

  return (
    <main>
      <section className="h-screen flex flex-col border border-dashed">
        <div className="max-w-4xl mx-auto flex-1 py-10 flex flex-col items-center justify-center gap-10">
          <header className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              숙소의 기본 정보를 알려주세요
            </h1>
            <p className="mt-2 text-gray-600">
              4단계: 숙박 인원, 침실, 침대, 욕실 개수를 알려주세요.
            </p>
          </header>

          <GuestBedroomBedStepper
            floorPlan={
              hostingData.floorPlan || initialState.hostingData.floorPlan
            }
            onValueChange={handleValueChange}
          />
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
