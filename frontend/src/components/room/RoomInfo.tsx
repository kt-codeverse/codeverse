'use client';
import { LucideIcon, Star } from 'lucide-react';
import RoomDescription from './RoomDescription';
import Image from 'next/image';

interface RoomInfoProps {
  description: string;
  amenities: {
    label: string;
    icon: LucideIcon;
  }[];
  maxGuests: number;
  city: string;
  privacyType: string;
  rating?: number;
  reviewCount?: number;
  onOpenReviews: () => void; // ← 추가
  host: {
    name: string;
    avatar: string | null;
    hostingMonths: number;
  };
}

export default function RoomInfo({
  description,
  amenities,
  maxGuests,
  city,
  privacyType,
  rating = 5.0,
  reviewCount = 23,
  onOpenReviews,
  host,
}: RoomInfoProps) {
  return (
    <div>
      {/* 상단 설명 */}
      <div className="border-b pb-6">
        <h2 className="mb-2">
          {city}의 집 {privacyType}
        </h2>
        <p className="text-gray-600 mb-3">
          최대 인원 {maxGuests}명 · 침실 2개 · 침대 2개 · 욕실 1개
        </p>

        {/* ★ 5.0 · 후기 23개 */}
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 fill-current" />
          <span>{rating.toFixed(1)}</span>

          <span className="mx-1">·</span>

          <button
            className="underline font-medium"
            onClick={onOpenReviews} // ← 모달 오픈
          >
            후기 {reviewCount}개
          </button>
        </div>
      </div>

      {/* 편의시설 */}
      <div className="py-6 border-b">
        <div className="grid grid-cols-2 gap-4">
          {amenities.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 text-sm text-gray-600"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 호스트 정보 */}
      <div className="py-6 border-b flex items-center gap-6">
        <Image
          src={
            host.avatar ??
            'https://res.cloudinary.com/dgvgxnwos/image/upload/v1763448528/%E1%84%83%E1%85%A1%E1%84%8B%E1%85%AE%E1%86%AB%E1%84%85%E1%85%A9%E1%84%83%E1%85%B3_gkc9vu.jpg'
          }
          alt="호스트 프로필"
          width={48}
          height={48}
          className="rounded-full w-12 h-12 object-cover"
        />
        <div>
          <p className="text-md">호스트: {host.name} 님</p>
          <p className="text-sm text-gray-500">
            호스팅 경력 {host.hostingMonths}년
          </p>
        </div>
      </div>

      {/* 숙소 상세 설명 */}
      <div className="p-4">
        <RoomDescription fullText={description} />
      </div>
    </div>
  );
}
