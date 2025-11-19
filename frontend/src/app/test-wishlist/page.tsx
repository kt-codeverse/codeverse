// app/test-wishlist/page.tsx
'use client';

import WishlistHeartButton from '@/components/wishlist/WishlistHeartButton';

export default function TestWishlistPage() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="relative w-40 h-40 bg-gray-200 rounded-2xl flex items-center justify-center">
        <p>테스트 박스</p>
        <WishlistHeartButton listingId="test-listing-123" />
      </div>
    </div>
  );
}
