import Link from 'next/link';
import { Button } from '@/src/components/ui/button';

/**
 * 숙소의 기본 정보(침실, 욕실 개수 등)를 입력하는 페이지입니다. (4단계)
 */
export default function FloorPlanPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">숙소의 기본 정보를 공유해주세요.</h1>
      <p className="mt-2 text-gray-600">
        4단계: 침실, 욕실 등의 개수를 알려주세요.
      </p>

      {/* TODO: 여기에 침실, 욕실 개수 등을 선택하는 UI를 구현하세요. */}
      <div className="mt-8 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">기본 정보 입력 컴포넌트 영역</p>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/hosting/location">이전</Link>
        </Button>
        <Button asChild>
          <Link href="/hosting/amenities">다음</Link>
        </Button>
      </div>
    </div>
  );
}
