import Link from 'next/link';
import { Button } from '@/src/components/ui/button';

/**
 * 숙소의 위치를 지도에 표시하고 주소를 입력하는 페이지입니다. (3단계)
 */
export default function LocationPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">숙소 위치는 어디인가요?</h1>
      <p className="mt-2 text-gray-600">3단계: 주소를 입력해주세요.</p>

      {/* TODO: 여기에 지도 및 주소 검색/입력 UI를 구현하세요. */}
      <div className="mt-8 h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">위치(지도) 선택 컴포넌트 영역</p>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/hosting/privacy-type">이전</Link>
        </Button>
        <Button asChild>
          <Link href="/hosting/floor-plan">다음</Link>
        </Button>
      </div>
    </div>
  );
}
