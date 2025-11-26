'use client';

import { useEffect, useState } from 'react';
import Container from '@/components/layout/Container';
import ProfileCard from '@/components/profile/ProfileCard';
import type { User, Review } from '@/types/model';
import { useRouter } from 'next/navigation';

export default function MyProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        // 2. 로컬 스토리지에서 액세스 토큰을 가져옵니다.
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/signin');
          return;
        }
        // console.log({ token });

        const res1 = await fetch(`${process.env.API_URL}/users/me`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const me = await res1.json();
        setUser(me);
        console.log({ me });

        // 리뷰 서비스에서 숙소에 대한 리뷰가 아니라 사용자에 대한 리뷰를 제공받는 엔드포인트가 필요함
        // const res2 = await fetch(`${process.env.API_URL}/reviews`, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        // const reviews = await res2.json();
        // setReviews(reviews);
        // console.log({ reviews });
      } catch (error) {
        console.error('프로필 API 실패, 목업 사용:', error);

        // 임시 더미 데이터
        setUser({
          id: 'dummy-user',
          name: '민기',
          role: '게스트',
          trips: 1,
          reviewsCount: 1,
          memberFor: '4개월',
          avatar: null,
        } as User);

        setReviews([
          {
            id: 'r1',
            author: '리나',
            date: '2025년 7월',
            content: '감사합니다 🙂',
          } as Review,
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading || !user) {
    return (
      <main className="min-h-dvh flex flex-col bg-white">
        <Container>
          <section className="py-10">로딩 중...</section>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col bg-white">
      {/* ✅ Header / Footer 는 전역 layout 에서 렌더링되므로 여기선 안 씀 */}
      <Container>
        <section className="flex gap-10 py-10">
          {/* ✅ 내부 사이드바(프로필 / 이전 여행 / 인연) 제거하고,
              상위 레이아웃에 있는 사이드바만 사용 */}

          {/* 오른쪽 내용만 남기기 */}
          <section className="flex-1">
            {/* 상단 제목 */}
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-extrabold">자기소개</h3>
            </div>

            {/* 프로필 카드 (아바타는 user.avatar 사용) */}
            <div className="mt-6">
              <ProfileCard
                user={user}
                reviewsCount={reviews.length}
                avatarUrl={user.avatar ?? null}
              />
            </div>

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
    </main>
  );
}
