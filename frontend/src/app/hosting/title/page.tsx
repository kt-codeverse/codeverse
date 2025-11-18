import Link from 'next/link';
import { Button } from '@/src/components/ui/button';

/**
 * 숙소의 이름을 정하는 페이지입니다. (7단계, 마지막)
 */
export default function TitlePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">숙소 이름 정하기</h1>
      <p className="mt-2 text-gray-600">
        7단계: 게스트가 검색할 때 표시될 멋진 이름을 만들어보세요.
      </p>

      {/* TODO: 여기에 숙소 이름을 입력하는 폼 UI를 구현하세요. */}
      <div className="mt-8 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">숙소 이름 입력 컴포넌트 영역</p>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/hosting/photos">이전</Link>
        </Button>
        <Button>호스팅 완료하기</Button>
      </div>
    </div>
  );
}
