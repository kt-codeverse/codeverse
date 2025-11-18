import Link from 'next/link';
import { Button } from '@/src/components/ui/button';

/**
 * 숙소 사진을 업로드하는 페이지입니다. (6단계)
 */
export default function PhotosPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">숙소 사진을 추가하세요.</h1>
      <p className="mt-2 text-gray-600">
        6단계: 멋진 사진 5장 이상을 올려주세요.
      </p>

      {/* TODO: 여기에 사진 업로드 UI를 구현하세요. */}
      <div className="mt-8 h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">사진 업로드 컴포넌트 영역</p>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/hosting/amenities">이전</Link>
        </Button>
        <Button asChild>
          <Link href="/hosting/title">다음</Link>
        </Button>
      </div>
    </div>
  );
}
