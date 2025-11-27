'use client';

import { useEffect, useState } from 'react';
import Container from '@/components/layout/Container';
import WishlistCard from '@/components/wishlist/WishlistCard';
import { Wishlist } from '@/types/model';
import { useRouter } from 'next/navigation';

export default function WishlistsPage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        // 🔐 1. 토큰 가져오기
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/signin');
          return;
        }

        // 🌐 2. fetch로 API 호출
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlists`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        // 401(로그인 만료) → 다시 로그인
        if (res.status === 401) {
          router.push('/signin');
          return;
        }

        if (!res.ok) throw new Error('Failed to fetch wishlists');

        const data = await res.json();
        setWishlists(data);
      } catch (error) {
        console.error('위시리스트 API 실패, 더미 데이터 사용:', error);

        // 🧪 더미 데이터
        const dummy: Wishlist[] = [
          {
            id: 'recent',
            name: '최근 조회',
            coverImages: [
              'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
            ],
            updatedAt: new Date().toISOString(),
            itemCount: 3,
          },
          {
            id: 'mingi',
            name: '김민준',
            coverImages: [
              'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=800&q=80',
            ],
            updatedAt: new Date().toISOString(),
            itemCount: 1,
          },
        ];

        setWishlists(dummy);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  return (
    <main className="min-h-dvh flex flex-col">

      <Container>
        <section className="py-10">
          <h1 className="text-3xl font-extrabold mb-8">위시리스트</h1>

          {loading && <p>로딩 중...</p>}

          {!loading && wishlists.length === 0 && (
            <p className="text-neutral-500">아직 만든 위시리스트가 없습니다.</p>
          )}

          {!loading && wishlists.length > 0 && (
            <div className="flex flex-wrap gap-8">
              {wishlists.map((w) => (
                <WishlistCard key={w.id} wishlist={w} />
              ))}
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
