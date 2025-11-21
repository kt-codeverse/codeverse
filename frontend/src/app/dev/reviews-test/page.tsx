"use client";

import GuestFavoriteBox from "@/components/review/GuestFavoriteBox";

export default function ReviewsTestPage() {
  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">
        TripNest 리뷰 모달 테스트
      </h1>
      <GuestFavoriteBox
        listingId="haeundae-111"
        overallRating={4.88}
        reviewCount={139}
      />
    </main>
  );
}