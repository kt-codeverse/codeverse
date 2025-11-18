import Link from 'next/link';
import { Button } from '@/src/components/ui/button';

/**
 * 호스팅할 숙소의 구조를 선택하는 페이지입니다. (1단계)
 * 예: 주택, 아파트, 호텔 등
 */
export default function StructurePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">어떤 유형의 숙소를 호스팅하시나요?</h1>
      <p className="mt-2 text-gray-600">1단계: 숙소의 구조를 선택해주세요.</p>

      {/* TODO: 여기에 주택, 아파트, 호텔 등 구조 선택 UI를 구현하세요. */}
      <div className="mt-8 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">구조 선택 컴포넌트 영역</p>
      </div>

      <div className="mt-8 flex justify-end">
        <Button asChild>
          <Link href="/hosting/privacy-type">다음</Link>
        </Button>
      </div>
    </div>
  );
}
