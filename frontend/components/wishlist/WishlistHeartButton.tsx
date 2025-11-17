"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { http } from "@/lib/http";
import { Wishlist } from "@/types/model";
import CreateWishlistModal from "./CreateWishlistModal";

type WishlistHeartButtonProps = {
  listingId: string;       // 숙소/방 ID
  initialSaved?: boolean;  // 이미 저장된 상태인지 (옵션)
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

      // 1. 우선 사용자의 위시리스트 목록을 가져온다
      const res = await http.get<Wishlist[]>("/wishlists");
      const lists = res.data;

      if (!lists || lists.length === 0) {
        // 2-1. 위시리스트가 하나도 없으면 → 모달 오픈
        setModalOpen(true);
        return;
      }

      // 2-2. 일단은 "첫 번째 위시리스트"에 저장하는 단순 버전
      const target = lists[0];

      await http.post(`/wishlists/${target.id}/items`, {
        listingId,
      });

      setSaved(true);
    } catch (error) {
      console.error("위시리스트에 추가 실패:", error);
    } finally {
      setProcessing(false);
    }
  };

  // 모달에서 새 위시리스트가 생성되었을 때
  const handleCreated = async (wishlist: Wishlist) => {
    try {
      await http.post(`/wishlists/${wishlist.id}/items`, {
        listingId,
      });
      setSaved(true);
    } catch (error) {
      console.error("새 위시리스트에 항목 추가 실패:", error);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={processing}
        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-sm"
        aria-label={saved ? "위시리스트에서 제거" : "위시리스트에 추가"}
      >
        <Heart
          className={`h-5 w-5 ${
            saved ? "fill-rose-500 text-rose-500" : "text-neutral-700"
          }`}
        />
      </button>

      {/* 위시리스트 만들기 모달 */}
      <CreateWishlistModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </>
  );
}