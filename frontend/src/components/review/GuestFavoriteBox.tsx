"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import ReviewsModal from "./ReviewsModal";

type GuestFavoriteBoxProps = {
  listingId: string;
  overallRating: number;
  reviewCount: number;
};

export default function GuestFavoriteBox({
  listingId,
  overallRating,
  reviewCount,
}: GuestFavoriteBoxProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between rounded-3xl border border-neutral-200 bg-white px-4 py-3 text-left shadow-sm hover:border-neutral-500 md:w-auto"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="text-sm">
            <div className="font-semibold">게스트 선호</div>
            <div className="text-xs text-neutral-600">
              에어비앤비 게스트에게 가장 사랑받는 숙소입니다.
            </div>
          </div>
        </div>
        <div className="ml-4 text-right text-xs text-neutral-700">
          <div className="font-semibold">{overallRating.toFixed(2)}</div>
          <div className="text-neutral-500">후기 {reviewCount}개</div>
        </div>
      </button>

      <ReviewsModal
        open={open}
        onClose={() => setOpen(false)}
        listingId={listingId}
      />
    </>
  );
}