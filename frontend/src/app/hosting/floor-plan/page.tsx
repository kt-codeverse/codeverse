'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import GuestBedroomBedStepper from '@/components/hosting/GuestBedroomBedStepper';

/**
 * 숙소의 기본 정보(침실, 욕실 개수 등)를 입력하는 페이지입니다. (4단계)
 */
export default function Page() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/hosting/amenities');
  };

  return (
    <main>
      <section className="h-screen flex flex-col border border-dashed">
        <div
          className="max-w-4xl mx-auto border border-dashed 
          flex-1 py-10 flex flex-col justify-center gap-10"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              숙소의 기본 정보를 공유해주세요.
            </h1>
            <p className="mt-2 text-gray-600">
              4단계: 침실, 욕실 등의 개수를 알려주세요.
            </p>
          </div>

          <GuestBedroomBedStepper />
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
