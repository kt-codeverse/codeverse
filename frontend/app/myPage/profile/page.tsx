// app/myPage/profile/page.tsx
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileCard from "@/components/profile/ProfileCard";

export default function MyPageProfile() {
  // 더미 데이터 (추후 API 연동 교체)
  const user = {
    name: "민기",
    role: "게스트",
    trips: 1,
    reviews: 1,
    memberFor: "4개월",
    verified: true,
  };

  const reviews = [
    { id: "r1", author: "리나", date: "2025년 7월", text: "감사합니다 🙂" },
  ];

  return (
    <main className="min-h-dvh">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="inline-block h-7 w-7 rounded-full bg-rose-500" />
            <span className="text-xl font-semibold">tripnest</span>
          </div>
          <nav className="flex items-center gap-4 text-sm text-gray-600">
            <button className="rounded-full bg-gray-900 text-white h-9 w-9">민</button>
            <button className="rounded-full border h-9 w-9">≡</button>
          </nav>
        </div>
      </header>

      {/* 본문 */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-[260px_1fr]">
        {/* 왼쪽 사이드바 */}
        <aside>
          <h2 className="mb-6 text-3xl font-extrabold">프로필</h2>
          <ProfileSidebar basePath="/myPage" />
        </aside>

        {/* 오른쪽 콘텐츠 */}
        <section className="pb-24">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-extrabold">자기소개</h3>
            <button className="rounded-full border px-3 py-1.5 text-sm shadow-sm hover:bg-gray-50">
              수정
            </button>
          </div>

          <div className="mt-6">
            <ProfileCard user={user} />
          </div>

          <div className="mt-8 flex items-center gap-2 text-gray-700">
            <span className="inline-block h-5 w-5 rounded-full border" />
            <span className="underline">본인 인증 완료</span>
          </div>

          <hr className="my-10" />

          <div className="mt-6">
            <h4 className="text-2xl font-bold">후기</h4>
            <ul className="mt-6 space-y-6">
              {reviews.map((r) => (
                <li key={r.id} className="flex items-start gap-3">
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-200" />
                  <div>
                    <div className="font-medium">{r.author}</div>
                    <div className="text-sm text-gray-500">{r.date}</div>
                    <p className="mt-2">{r.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
