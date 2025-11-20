'use client';

import { useRouter } from 'next/navigation';
import { useHostingStore } from '@/store/useHostingStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Check } from 'lucide-react';
import HostingReview from './HostingReview';

/**
 * @description 호스팅할 숙소 정보를 최종 검토하는 페이지
 * 사용자가 각 단계에서 입력한 정보를 보여주고, 수정할 수 있도록 각 단계로 이동하는 기능을 제공합니다.
 */
export default function ReviewPage() {
  const router = useRouter();
  const { hostingData } = useHostingStore();

  const handlePublish = () => {
    // TODO: API 호출을 통해 숙소 등록 로직 구현
    console.log('Publishing listing:', hostingData);
    alert('숙소 등록이 완료되었습니다! (콘솔 로그 확인)');
  };

  return (
    <main>
      <section className="h-screen flex flex-col border border-dashed">
        <div className="container mx-auto flex-1 overflow-y-auto py-10">
          <HostingReview />
        </div>

        <div className="py-10 flex justify-between border border-dashed">
          <Button variant="ghost" onClick={() => router.back()}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            이전
          </Button>
          <Button onClick={handlePublish}>
            <Check className="mr-2 h-4 w-4" />
            숙소 등록하기
          </Button>
        </div>
      </section>
    </main>
  );
}
