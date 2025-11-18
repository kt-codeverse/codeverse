import Link from 'next/link';
import { Button } from '@/src/components/ui/button';

/**
 * 숙소에서 제공하는 편의시설을 선택하는 페이지입니다. (5단계)
 * 예: 와이파이, 주방, TV 등
 */
export default function AmenitiesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">숙소의 편의시설을 알려주세요.</h1>
      <p className="mt-2 text-gray-600">
        5단계: 제공하는 편의시설을 선택하세요.
      </p>

      {/* TODO: 여기에 편의시설 선택 UI(체크박스 등)를 구현하세요. */}
      <div className="mt-8 h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">편의시설 선택 컴포넌트 영역</p>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/hosting/floor-plan">이전</Link>
        </Button>
        <Button asChild>
          <Link href="/hosting/photos">다음</Link>
        </Button>
      </div>
    </div>
  );
}
