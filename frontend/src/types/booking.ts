// src/types/booking.ts

export type PaymentOption = "full" | "split";
export type PaymentMethod = "card" | "kakaopay" | "naverpay";

export type GuestInfo = {
  adults: number;
  children: number;
  infants: number;
};

export type PriceDetail = {
  nights: number;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
  currency: "KRW";
};

export type ListingSummary = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  isGuestFavorite: boolean;
  locationSummary: string;
};

export type Booking = {
  id: string;
  listing: ListingSummary;
  checkIn: string;   // ISO string
  checkOut: string;  // ISO string
  guestInfo: GuestInfo;
  priceDetail: PriceDetail;
  freeCancellationUntil: string;
};
