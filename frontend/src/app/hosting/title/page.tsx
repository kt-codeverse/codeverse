'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { HOSTING_STEPS, useHostingStore } from '@/store/useHostingStore';
import TitleForm from '@/components/hosting/TitleForm';

/**
 * 숙소의 제목과 설명을 작성하는 페이지입니다. (7단계)
 */
export default function Page() {
  const router = useRouter();
  const { hostingData, updateHostingData, step } = useHostingStore();

  const handleDataChange = useCallback(
    (data: { title: string; description: string }) => {
      updateHostingData(data);
    },
    [updateHostingData],
  );

  const handleNext = () => {
    const currentIndex = HOSTING_STEPS.indexOf(step);
    const nextStepPath = HOSTING_STEPS[currentIndex + 1];

    // 마지막 단계이므로 다음 경로가 없으면 다른 페이지(예: 검토 페이지)로 이동
    if (nextStepPath) {
      router.push(`/hosting/${nextStepPath}`);
    } else {
      // TODO: 최종 검토 페이지 또는 호스팅 완료 페이지로 이동
      router.push('/hosting/review');
    }
  };

  return (
    <main>
      <section className="h-screen flex flex-col border border-dashed">
        <div className="max-w-4xl mx-auto flex-1 py-10 flex flex-col items-center justify-center gap-10">
          <header className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              숙소에 멋진 이름을 지어주세요
            </h1>
            <p className="mt-2 text-gray-600">
              7단계: 숙소의 특징과 매력이 드러나는 제목과 설명을 작성하세요.
            </p>
          </header>
          <TitleForm
            onDataChange={handleDataChange}
            initialData={{
              title: hostingData.title || '',
              description: hostingData.description || '',
            }}
          />
        </div>

        <div className="py-10 flex justify-between border border-dashed">
          <Button variant="ghost" onClick={() => router.back()}>
            이전
          </Button>
          <Button
            onClick={handleNext}
            disabled={!hostingData.title || !hostingData.description}
          >
            다음
          </Button>
        </div>
      </section>
    </main>
  );
}
