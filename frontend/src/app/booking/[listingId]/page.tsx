'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBookingStore } from '@/store/useBookingStore';
import { useAuthStore } from '@/components/layout/header/useAuthStore';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

// TODO: 실제 숙소 정보를 가져오는 로직으로 교체해야 합니다.
// 현재는 임시 데이터를 사용합니다.
const MOCK_ROOM_DATA = {
  title: '해운대 오션뷰 스위트',
  imageUrl:
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  pricePerNight: 150000,
};

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const { newBooking, resetNewBooking } = useBookingStore();
  const { isLoggedIn } = useAuthStore();
  const { startDate, endDate, guests } = newBooking;
  const [submitting, setSubmitting] = useState(false);

  const nights = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
  }, [startDate, endDate]);

  const totalPrice = useMemo(
    () => MOCK_ROOM_DATA.pricePerNight * nights,
    [nights],
  );

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      router.push('/signin');
      return;
    }

    if (!startDate || !endDate || !guests) {
      alert('예약 정보가 완전하지 않습니다. 날짜와 인원을 확인해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      const url = `${process.env.API_URL}/rooms/${params.listingId}/bookings`;
      const token = localStorage.getItem('token');
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          guests,
        }),
      });
      if (!res.ok) throw new Error('예약 요청 실패');
      const data = await res.json();
      console.log('예약 완료:', data);
      alert('예약이 성공적으로 완료되었습니다.');
      resetNewBooking(); // 스토어 상태 초기화
      // router.push('/my/bookings');
    } catch (error) {
      console.error('예약 요청 중 오류:', error);
      alert('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('ko-KR').format(value);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 p-8 md:grid-cols-2">
        {/* 왼쪽: 예약 정보 요약 */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">예약 확인 및 결제</h1>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">예약 정보</h2>
            <div className="flex gap-4">
              <Image
                src={MOCK_ROOM_DATA.imageUrl}
                alt={MOCK_ROOM_DATA.title}
                width={120}
                height={100}
                className="h-24 w-28 rounded-md object-cover"
              />
              <div className="flex flex-col justify-between">
                <p className="font-medium">{MOCK_ROOM_DATA.title}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(startDate)} - {formatDate(endDate)} ({nights}박)
                </p>
                <p className="text-sm text-gray-500">게스트 {guests}명</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">요금 세부정보</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>
                  ₩{formatCurrency(MOCK_ROOM_DATA.pricePerNight)} x {nights}박
                </span>
                <span>₩{formatCurrency(totalPrice)}</span>
              </div>
              {/* TODO: 서비스 수수료, 세금 등 추가 항목 */}
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>총 합계 (KRW)</span>
                  <span>₩{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 결제 수단 및 최종 확인 */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">결제 수단</h2>
            {/* TODO: 결제 수단 선택 UI 구현 */}
            <p className="text-gray-600">카카오페이 / 신용카드 등</p>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="h-14 w-full rounded-lg bg-pink-500 text-lg font-bold text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {submitting ? '예약 요청 중...' : '예약 요청 보내기'}
          </Button>
          <p className="text-center text-xs text-gray-500">
            위 버튼을 클릭하면 호스트가 24시간 이내에 응답합니다. <br />
            예약이 확정되기 전까지는 요금이 청구되지 않습니다.
          </p>
        </div>
      </div>
    </main>
  );
}
