import Image from 'next/image';
import { Wishlist } from '@/src/types/model';

type Props = {
  wishlist: Wishlist;
};

export default function WishlistCard({ wishlist }: Props) {
  const { name, coverImages, itemCount, updatedAt } = wishlist;

  // 썸네일 4칸 채우기 (부족하면 빈 회색 박스로)
  const MAX_IMAGES = 4;
  const images = [...coverImages];
  while (images.length < MAX_IMAGES) {
    images.push('');
  }

  const formattedDate = new Date(updatedAt).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="w-64">
      {/* 2x2 이미지 그리드 */}
      <div className="grid grid-cols-2 grid-rows-2 overflow-hidden rounded-3xl shadow-md">
        {images.map((src, idx) => (
          <div key={idx} className="relative aspect-[4/3] bg-neutral-200">
            {src && (
              <Image
                src={src}
                alt={`${name} 썸네일 ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 256px, 50vw"
              />
            )}
          </div>
        ))}
      </div>

      {/* 텍스트 영역 */}
      <div className="mt-3">
        <div className="text-base font-semibold">{name}</div>
        <div className="text-sm text-neutral-500">
          {itemCount > 0
            ? `저장된 항목 ${itemCount}개`
            : `${formattedDate} • 항목 없음`}
        </div>
      </div>
    </div>
  );
}
