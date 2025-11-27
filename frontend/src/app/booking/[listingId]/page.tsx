// src/app/booking/[listingId]/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useBookingStore } from '@/store/bookingStore';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = (params?.listingId ?? '') as string;

  const {
    booking,
    setBooking,          // 기존 스토어 구조 유지
    paymentOption,
    setPaymentOption,
    paymentMethod,
    setPaymentMethod,
    guestInfo,
    updateGuestInfo,
    noteToHost,
    setNoteToHost,
  } = useBookingStore();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ✅ 이제는 preview API를 호출하지 않고,
  // BookCard 에서 넣어준 booking state가 없으면 홈으로 돌려보냄
  useEffect(() => {
    if (!listingId) return;

    if (!booking) {
      alert('예약 정보가 없습니다. 다시 시도해주세요.');
      router.replace('/');
      return;
    }

    // 만약 listingId와 booking.listing.id가 다르면 정합성 체크
    if (booking.listing?.id && booking.listing.id !== listingId) {
      console.warn('listingId와 booking.listing.id가 다릅니다.', {
        listingId,
        bookingListingId: booking.listing.id,
      });
    }

    setLoading(false);
  }, [booking, listingId, router, setBooking]);

  // ✅ 여기서 실제 백엔드에 예약 생성 요청
  //    POST /rooms/:roomId/bookings  (body: { startDate, endDate })
  const handleSubmit = async () => {
    if (!booking || submitting) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/signin');
      return;
    }

    try {
      setSubmitting(true);

      const roomId = booking.listing.id; // BookCard에서 저장해둔 값

      const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startDate: booking.checkIn,
          endDate: booking.checkOut,
        }),
      });

      if (res.status === 401) {
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('token');
        router.push('/signin');
        return;
      }

      if (res.status === 409) {
        // 백엔드에서 "해당 날짜에는 이미 예약이 있습니다" 409 Conflict 반환
        const errBody = await res.json().catch(() => null);
        alert(
          errBody?.message ??
            '해당 날짜에는 이미 예약이 있습니다. 다른 날짜를 선택해주세요.',
        );
        return;
      }

      if (!res.ok) {
        console.error('예약 요청 실패:', res.status, await res.text());
        alert('예약 요청에 실패했습니다. 다시 시도해주세요.');
        return;
      }

      const data = await res.json();
      console.log('예약 완료:', data);

      alert('예약이 완료되었습니다!');
      // TODO: 필요하면 예약 상세 페이지로 라우팅 변경 가능
      router.push('/');
    } catch (error) {
      console.error('예약 요청 중 오류:', error);
      alert('예약 요청 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(value);

  const formatDateRange = (checkIn: string, checkOut: string) => {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const formatter = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return `${formatter.format(inDate)} ~ ${formatter.format(outDate)}`;
  };

  const priceDetail = booking?.priceDetail;
  const listing = booking?.listing;

  const guestSummary = useMemo(() => {
    const parts: string[] = [];
    if (guestInfo.adults) parts.push(`성인 ${guestInfo.adults}명`);
    if (guestInfo.children) parts.push(`어린이 ${guestInfo.children}명`);
    if (guestInfo.infants) parts.push(`유아 ${guestInfo.infants}명`);
    return parts.join(', ') || '게스트 없음';
  }, [guestInfo]);

  if (loading || !booking || !priceDetail || !listing) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="h-10 w-32 animate-pulse rounded-full bg-neutral-200" />
        </div>
      </main>
    );
  }

  // ⬇️ 아래부터는 기존 UI 그대로 (요금 요약/게스트/카드 정보 등) – 로직만 위에서 바뀐 상태
  return (
    <main className="min-h-screen bg-neutral-50">
      {/* 상단 TripNest 헤더 */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold text-rose-500">TripNest</div>
          <div className="text-sm text-neutral-600">예약 요청</div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row">
        {/* 왼쪽: 단계별 예약 영역 (결제 시기 / 결제 수단 / 메모 등) */}
        {/* ... (기존 코드 그대로) ... */}

        {/* 마지막 버튼만 handleSubmit 사용 */}
        {/* 3. 요청 내용 확인 - 마지막 부분만 발췌 */}
        {/* ... 중략 ... */}
        {/* handleSubmit 부분만 확인하면 됨 */}
        {/* 예: */}
        {/* 
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-neutral-900 px-6 py-2 text-sm font-semibold text-white hover:bg-black disabled:bg-neutral-400"
          >
            {submitting ? "요청 보내는 중..." : "예약 요청 보내기"}
          </button>
        */}
      </div>
    </main>
  );
}
