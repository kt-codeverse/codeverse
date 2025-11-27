'use client';

import { useEffect, useState } from 'react';
import Container from '@/components/layout/Container';
import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/footer/Footer';
import WishlistCard from '@/components/wishlist/WishlistCard';
import { http } from '@/lib/http';
import { Wishlist } from '@/types/model';

export default function WishlistsPage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await http.get<Wishlist[]>('/wishlists');
        setWishlists(res.data);
      } catch (error) {
        console.error('위시리스트 불러오기 실패, 더미 데이터 사용:', error);

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
            name: '민기',
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
  }, []);

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

      <Footer />
    </main>
  );
}
