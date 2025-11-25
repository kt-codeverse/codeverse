"use client";

import { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import ProfileCard from "@/components/profile/ProfileCard";
import { http } from "@/lib/http";
import type { User, Review } from "@/types/model";
import { useAuthStore } from "@/components/layout/header/useAuthStore";

export default function MyProfilePage() {
  const { user: authUser } = useAuthStore(); // 헤더에서 쓰는 로그인 유저
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 백엔드 준비되면 실제 API 사용
        const me = await http.get<User>("/users/me");
        setUser(me.data);

        const rv = await http.get<Review[]>(`/reviews?userId=${me.data.id}`);
        setReviews(rv.data);
      } catch (error) {
        console.error("프로필 API 실패, 목업 사용:", error);

        // 임시 더미 데이터
        const fallbackUser: User = {
          id: authUser?.id ?? "mock-user",
          name: authUser?.name ?? "민기",
          role: "게스트",
          trips: 1,
          reviewsCount: 1, // ✅ 누락됐던 필드
          memberFor: "4개월",
          verified: true,
          avatar: authUser?.avatarUrl ?? "", // ✅ 누락됐던 필드
        };

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
  }, [authUser?.name]);

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
            {/* 상단 제목 (수정 버튼 제거) */}
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-extrabold">자기소개</h3>
              {/* 수정 버튼 제거됨 */}
            </div>

            {/* 프로필 카드 - 아바타 URL 헤더와 공유 */}
            <div className="mt-6">
              <ProfileCard
                user={user}
                reviewsCount={reviews.length}
                avatarUrl={authUser?.avatarUrl ?? null}
              />
            </div>

            {/* 🔥 본인 인증 완료 영역 제거됨 */}

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
