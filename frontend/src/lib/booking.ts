// src/lib/bookings.ts
import { api } from "@/lib/http";

// 백엔드 BookingEntity 중 일부만 사용
export type BackendBooking = {
  id: string;
  startDate: string;
  endDate: string;
  status?: string;
  totalPrice?: number;
  room?: {
    id: string;
    title: string;
    thumbnail?: string | null;
  };
};

// CreateBookingDto에 맞춘 payload 타입
export type CreateBookingPayload = {
  startDate: string; // ISO 문자열
  endDate: string;   // ISO 문자열
};

export async function createBooking(
  roomId: string,
  payload: CreateBookingPayload,
) {
  const res = await api.post<BackendBooking>(
    `/rooms/${roomId}/bookings`,
    payload,
  );
  return res.data;
}

export async function getMyBookings() {
  const res = await api.get<BackendBooking[]>("/bookings/my");
  return res.data;
}

export async function getBookingDetail(id: string) {
  const res = await api.get<BackendBooking>(`/bookings/${id}`);
  return res.data;
}

export async function cancelBooking(id: string) {
  const res = await api.patch<BackendBooking>(`/bookings/${id}/cancel`, {});
  return res.data;
}
