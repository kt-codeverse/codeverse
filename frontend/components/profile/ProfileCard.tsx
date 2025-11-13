// components/profile/ProfileCard.tsx
type User = {
  name: string;
  role: string;
  trips: number;
  reviews: number;
  memberFor: string;
  verified?: boolean;
};

export default function ProfileCard({ user }: { user: User }) {
  return (
    <div className="w-full max-w-md rounded-3xl border bg-white p-6 shadow-md">
      {/* 아바타 + 이름 */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-900 text-2xl font-bold text-white">
            {user.name.slice(0, 1)}
          </div>
          {user.verified && (
            <span
              className="absolute -right-1 bottom-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white text-xs ring-4 ring-white"
              title="Verified"
            >
              ✓
            </span>
          )}
        </div>
        <div>
          <div className="text-xl font-extrabold">{user.name}</div>
          <div className="text-sm text-gray-600">{user.role}</div>
        </div>
      </div>

      {/* 구분선 */}
      <hr className="my-6" />

      {/* 통계 */}
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-gray-500">TripNest를 통한 여행</dt>
          <dd className="mt-1 text-lg font-semibold">{user.trips}회</dd>
        </div>
        <div>
          <dt className="text-gray-500">후기</dt>
          <dd className="mt-1 text-lg font-semibold">{user.reviews}개</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-gray-500">가입 기간</dt>
          <dd className="mt-1 text-lg font-semibold">{user.memberFor}</dd>
        </div>
      </dl>
    </div>
  );
}
