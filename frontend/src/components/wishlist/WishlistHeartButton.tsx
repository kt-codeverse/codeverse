'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { http } from '@/lib/http';
import { Wishlist } from '@/src/types/model';
import CreateWishlistModal from './CreateWishlistModal';

type WishlistHeartButtonProps = {
  listingId: string;
  initialSaved?: boolean;
};

export default function WishlistHeartButton({
  listingId,
  initialSaved = false,
}: WishlistHeartButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [modalOpen, setModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleClick = async () => {
    if (processing) return;

    try {
      setProcessing(true);

      // 👉 실제 백엔드가 있으면 이 부분이 정상 작동
      const res = await http.get<Wishlist[]>('/wishlists');
      const lists = res.data;

      if (!lists || lists.length === 0) {
        // 위시리스트가 없으면 → 모달 오픈
        setModalOpen(true);
        return;
      }

      // 위시리스트가 있으면: 일단 첫 번째 리스트에 추가
      const target = lists[0];

      await http.post(`/wishlists/${target.id}/items`, {
        listingId,
      });

      setSaved(true);
    } catch (error) {
      console.error('위시리스트 처리 중 에러:', error);

      // ❗지금은 백엔드가 없으니, 에러가 나도 모달은 띄워 주자
      setModalOpen(true);
    } finally {
      setProcessing(false);
    }
  };

  const handleCreated = async (wishlist: Wishlist) => {
    try {
      // 새 위시리스트에 이 숙소도 추가
      await http.post(`/wishlists/${wishlist.id}/items`, {
        listingId,
      });
      setSaved(true);
    } catch (error) {
      console.error('새 위시리스트에 항목 추가 실패:', error);
      // 테스트 단계에서는 실패해도 UI 상으로는 저장된 것처럼 보여도 됨
      setSaved(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={processing}
        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-sm"
        aria-label={saved ? '위시리스트에서 제거' : '위시리스트에 추가'}
      >
        <Heart
          className={`h-5 w-5 ${
            saved ? 'fill-rose-500 text-rose-500' : 'text-neutral-700'
          }`}
        />
      </button>

      <CreateWishlistModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </>
  );
}
