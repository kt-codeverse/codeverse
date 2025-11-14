"use client";

import { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import WishlistCard from "@/components/wishlist/WishlistCard";
import { http } from "@/lib/http";
import { Wishlist } from "@/types/model";

export default function WishlistsPage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 실제 백엔드 붙일 때:
        const res = await http.get<Wishlist[]>("/wishlists");
        setWishlists(res.data);

        // 더미 데이터
        const dummy: Wishlist[] = [
          {
            id: "recent",
            name: "최근 조회",
            coverImages: [
              "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1516887120175-b0f7b0c70a6e?auto=format&fit=crop&w=800&q=80",
            ],
            updatedAt: new Date().toISOString(),
            itemCount: 3,
          },
          {
            id: "mingi",
            name: "민기",
            coverImages: [
              "https://images.unsplash.com/photo-1600607687920-4e2a534a9edd?auto=format&fit=crop&w=800&q=80",
            ],
            updatedAt: new Date().toISOString(),
            itemCount: 1,
          },
        ];
        setWishlists(dummy);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="min-h-dvh flex flex-col">
      <SiteHeader />

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

      <SiteFooter />
    </main>
  );
}
