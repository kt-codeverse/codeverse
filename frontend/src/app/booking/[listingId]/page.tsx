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

type PaymentMethod = 'card' | 'kakaopay' | 'naverpay';

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const { newBooking, resetNewBooking } = useBookingStore();
  const { isLoggedIn } = useAuthStore();
  const { startDate, endDate, guests } = newBooking;
  const [submitting, setSubmitting] = useState(false);

  // 결제 수단 상태
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  // 카드 결제 입력값 (실제 결제는 아니고 UI용)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

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

    // (선택) 카드 선택 시 최소한의 값 체크
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvc) {
        alert('카드 정보를 모두 입력해주세요.');
        return;
      }
    }

    try {
      setSubmitting(true);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/rooms/${params.listingId}/bookings`;
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
          // paymentMethod은 백엔드 스펙이 생기면 같이 넘기면 됨
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

          {/* 예약 정보 카드 */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">예약 정보</h2>
            <div className="flex gap-4">
              <Image
                src={MOCK_ROOM_DATA.imageUrl}
                alt={MOCK_ROOM_DATA.title}
                width={120}
                height={100}
                className="h-24 w-28 rounded-xl object-cover"
              />
              <div className="flex flex-col justify-between text-sm">
                <p className="font-medium">{MOCK_ROOM_DATA.title}</p>
                <p className="text-gray-500">
                  {formatDate(startDate)} ~ {formatDate(endDate)} ({nights}박)
                </p>
                <p className="text-gray-500">게스트 {guests}명</p>
              </div>
            </div>
          </div>

          {/* 요금 세부정보 카드 */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">요금 세부정보</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>
                  ₩{formatCurrency(MOCK_ROOM_DATA.pricePerNight)} x {nights}박
                </span>
                <span>₩{formatCurrency(totalPrice)}</span>
              </div>

              {/* 추후 서비스 수수료, 세금 등 추가 가능 */}
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
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">결제 수단</h2>

            {/* 결제 수단 선택 버튼 */}
            <div className="mb-4 flex flex-wrap gap-2 text-sm">
              {[
                { value: 'card', label: '신용/체크카드' },
                { value: 'kakaopay', label: '카카오페이' },
                { value: 'naverpay', label: '네이버페이' },
              ].map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setPaymentMethod(m.value as PaymentMethod)}
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                    paymentMethod === m.value
                      ? 'border-pink-500 bg-pink-500 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* 카드 선택 시 입력 폼 */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 text-sm">
                <div>
                  <div className="mb-1 text-xs font-semibold text-gray-600">
                    카드 번호
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={19}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-pink-500"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="mb-1 text-xs font-semibold text-gray-600">
                      유효기간 (MM/YY)
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-pink-500"
                      placeholder="12/27"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <div className="mb-1 text-xs font-semibold text-gray-600">
                      CVC
                    </div>
                    <input
                      type="password"
                      maxLength={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-pink-500"
                      placeholder="***"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  실제 결제 연동은 아직 구현되지 않았으며, 입력된 정보는 서버로
                  전송되지 않습니다.
                </p>
              </div>
            )}

            {/* 카카오페이 / 네이버페이 선택 시 안내문 */}
            {paymentMethod === 'kakaopay' && (
              <p className="mt-2 text-xs text-gray-500">
                결제 단계에서 카카오페이 창이 열립니다. (실제 결제 연동은 추후
                구현 예정입니다.)
              </p>
            )}
            {paymentMethod === 'naverpay' && (
              <p className="mt-2 text-xs text-gray-500">
                결제 단계에서 네이버페이 창이 열립니다. (실제 결제 연동은 추후
                구현 예정입니다.)
              </p>
            )}
          </div>

          {/* 예약 요청 버튼 */}
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="h-14 w-full rounded-xl bg-pink-500 text-lg font-bold text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-gray-400"
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
