"use client";

import { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import ProfileCard from "@/components/profile/ProfileCard";
import { http } from "@/lib/http";
import type { User, Review } from "@/types/model";

// 🔹 백엔드 /users/me 응답 타입 (실제 필드 + 앞으로 추가될 가능성 있는 필드까지 여유 있게 정의)
type MeResponse = {
  id: string;
  email: string;
  name?: string;
  avatar?: string | null;
  role?: string;
};

export default function MyProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // ✅ 실제 API 연동: /users/me
        const meRes = await http.get<MeResponse>("/users/me");
        const me = meRes.data;

        // 백엔드 응답 → 프론트에서 쓰는 User 타입으로 매핑
        const mappedUser: User = {
          // User 타입에 id 필드가 있다면 그대로 사용, 없다면 무시돼도 상관 없음
          id: (me as any).id ?? "me",
          name: me.name ?? me.email.split("@")[0] ?? "게스트",
          role: me.role ?? "게스트",
          trips: 1, // 아직 API에 없으니 임시 값
          reviewsCount: 1, // 마찬가지로 임시 값
          memberFor: "4개월", // 테스트용 더미
          verified: true,
          avatar: me.avatar ?? null, // 🔥 여기서 아바타 URL 받아서 저장
        };

        setUser(mappedUser);

        // 리뷰 API가 아직 없으니, 일단 더미 데이터 사용
        setReviews([
          {
            id: "r1",
            author: "리나",
            date: "2025년 7월",
            content: "감사합니다 🙂",
          } as Review,
        ]);
      } catch (error) {
        console.error("프로필 API 실패, 목업 사용:", error);

        // 💡 /users/me 호출 실패 시 완전 더미 User 생성 (User 타입에 맞춰서)
        const fallbackUser: User = {
          id: "dummy",
          name: "민기",
          role: "게스트",
          trips: 1,
          reviewsCount: 1,
          memberFor: "4개월",
          verified: true,
          avatar: null,
        };

        setUser(fallbackUser);

        setReviews([
          {
            id: "r1",
            author: "리나",
            date: "2025년 7월",
            content: "감사합니다 🙂",
          } as Review,
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !user) {
    return (
      <main className="min-h-dvh flex flex-col">
        <Header />
        <Container>
          <section className="py-10">로딩 중...</section>
        </Container>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col bg-white">
      <Header />

      <Container>
        <section className="flex gap-10 py-10">
          {/* 왼쪽 사이드바 (프로필 / 이전 여행 / 인연) */}
          <aside className="w-56">
            <h2 className="mb-4 text-2xl font-extrabold">프로필</h2>
            <nav className="space-y-3 text-sm">
              <div className="rounded-xl bg-neutral-900 px-4 py-3 text-white">
                자기소개
              </div>
              <div className="rounded-xl border px-4 py-3 text-neutral-700">
                이전 여행
              </div>
              <div className="rounded-xl border px-4 py-3 text-neutral-700">
                인연
              </div>
            </nav>
          </aside>

          {/* 오른쪽 내용 */}
          <section className="flex-1">
            {/* 상단 제목 (수정 버튼 제거됨) */}
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-extrabold">자기소개</h3>
            </div>

            {/* 프로필 카드 - avatar는 /users/me에서 온 user.avatar 사용 */}
            <div className="mt-6">
              <ProfileCard
                user={user}
                reviewsCount={reviews.length}
                avatarUrl={user.avatar ?? null}
              />
            </div>

            {/* ✅ 본인 인증 완료 영역은 제거한 상태 */}

            {/* 후기 리스트 */}
            <div className="mt-10">
              <h4 className="text-2xl font-bold">후기</h4>
              <ul className="mt-6 space-y-6">
                {reviews.map((r) => (
                  <li key={r.id} className="flex items-start gap-3">
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-200" />
                    <div>
                      <div className="font-medium">{r.author}</div>
                      <div className="text-sm text-gray-500">{r.date}</div>
                      <p className="mt-2 text-sm text-neutral-800">
                        {r.content}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </section>
      </Container>

      <Footer />
    </main>
  );
}
