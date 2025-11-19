'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AmenitySelector from '@/components/hosting/AmenitySelector';
import { amenityCategories } from '@/data/hosting-amenities-options';

/**
 * 숙소에서 제공하는 편의시설을 선택하는 페이지입니다. (5단계)
 * 예: 와이파이, 주방, TV 등
 */
export default function Page() {
  const router = useRouter();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  console.log({ selectedAmenities });

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedAmenities(selectedIds);
    // TODO: 선택된 편의시설 ID 목록을 상태 관리(e.g., Zustand, Redux) 또는 상위 컴포넌트로 전달하세요.
    console.log('Selected amenities:', selectedIds);
  };

  const handleNext = () => {
    // TODO: 다음 단계로 넘어가기 전, 선택된 편의시설 정보를 저장하는 로직을 추가하세요.
    router.push('/hosting/photos');
  };

  return (
    <main>
      <section className="h-screen flex flex-col">
        <div className="flex-1 py-10 flex flex-col gap-10 max-w-4xl mx-auto w-full">
          <header>
            <h1 className="text-3xl font-bold tracking-tight">
              숙소의 편의시설을 알려주세요
            </h1>
            <p className="mt-2 text-gray-600">
              5단계: 게스트가 이용할 수 있는 편의시설을 선택해주세요.
            </p>
          </header>

          <AmenitySelector
            categories={amenityCategories}
            onSelectionChange={handleSelectionChange}
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
