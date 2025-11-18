import Link from 'next/link';
import { Button } from '@/src/components/ui/button';

/**
 * 게스트에게 제공될 공간의 유형을 선택하는 페이지입니다. (2단계)
 * 예: 전체 공간, 개인실, 다인실
 */
export default function PrivacyTypePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">
        게스트에게 어떤 공간을 제공하시나요?
      </h1>
      <p className="mt-2 text-gray-600">2단계: 숙소 유형을 선택해주세요.</p>

      {/* TODO: 여기에 전체 공간, 개인실 등 유형 선택 UI를 구현하세요. */}
      <div className="mt-8 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">개인 공간 유형 선택 컴포넌트 영역</p>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/hosting/structure">이전</Link>
        </Button>
        <Button asChild>
          <Link href="/hosting/location">다음</Link>
        </Button>
      </div>
    </div>
  );
}
