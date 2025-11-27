'use client';

import type { User } from '@/types/model';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type ProfileCardProps = {
  user: User;
  reviewsCount: number;
  /** 헤더에서 쓰는 사용자 아바타 URL (없으면 shadcn 기본 이미지 사용) */
  avatarUrl?: string;
};

export default function ProfileCard({
  user,
  reviewsCount,
  avatarUrl,
}: ProfileCardProps) {
  const initial = user.name?.[0] ?? '게';
  const finalAvatarUrl = avatarUrl || 'https://github.com/shadcn.png';

  return (
    <section className="flex items-center gap-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
      {/* 아바타 영역 */}
      <div className="flex flex-col items-center gap-2">
        <Avatar className="h-20 w-20 text-xl">
          <AvatarImage src={finalAvatarUrl} alt={user.name ?? '프로필'} />
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
        <div className="text-sm font-semibold">{user.name}</div>
        <div className="text-xs text-neutral-500">{user.role ?? '게스트'}</div>
      </div>

      {/* 통계 영역 */}
      <div className="flex-1">
        <div className="mb-6 flex gap-12 text-sm">
          <div>
            <div className="text-neutral-500">TripNest를 통한 여행</div>
            <div className="mt-1 text-lg font-semibold">
              {user.trips ?? 0}회
            </div>
          </div>
          <div>
            <div className="text-neutral-500">후기</div>
            <div className="mt-1 text-lg font-semibold">{reviewsCount}개</div>
          </div>
          <div>
            <div className="text-neutral-500">가입 기간</div>
            <div className="mt-1 text-lg font-semibold">
              {user.memberFor ?? '-'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
