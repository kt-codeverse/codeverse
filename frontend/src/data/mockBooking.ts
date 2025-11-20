// src/data/mockBooking.ts
import type { Booking } from "@/types/booking";

export const mockBookings: Record<string, Booking> = {
  "haeundae-111": {
    id: "booking_haeundae_111",
    listing: {
      id: "haeundae-111",
      title: "해변과-111 (더블·트윈 베드)",
      subtitle: "#해운대해변110m #전망좋은방 #정수기 #무료주차",
      imageUrl:
        "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=900&q=80",
      rating: 4.98,
      reviewCount: 40,
      isGuestFavorite: true,
      locationSummary: "부산 해운대, 게스트 선호 숙소",
    },
    checkIn: "2025-12-05T15:00:00.000Z",
    checkOut: "2025-12-07T11:00:00.000Z",
    guestInfo: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    priceDetail: {
      nights: 2,
      pricePerNight: 95312,
      cleaningFee: 0,
      serviceFee: 0,
      total: 190623,
      currency: "KRW",
    },
    freeCancellationUntil: "2025-11-20T23:59:59.000Z",
  },

  // 필요하면 다른 listingId도 추가
};
