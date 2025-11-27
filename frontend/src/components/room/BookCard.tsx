// src/components/room/BookCard.tsx
'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from './Card';
import { Button } from '../ui/button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { ChevronDown, Minus, Plus } from 'lucide-react';
import { useBookingStore } from '@/store/useBookingStore';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useAuthStore } from '../layout/header/useAuthStore';

export default function BookCard({
  pricePerNight,
  roomId,
}: {
  pricePerNight: number;
  roomId: string;
}) {
  const router = useRouter();
  const { newBooking, setBookingData, resetNewBooking } = useBookingStore();
  const { isLoggedIn } = useAuthStore();
  const { startDate, endDate, guests } = newBooking;

  // 컴포넌트 마운트 시 이전 예약 정보 초기화 및 listingId 설정
  useEffect(() => {
    resetNewBooking();
    setBookingData({ listingId: roomId });
  }, [roomId]);

  const handleGuestsChange = (amount: number) => {
    setBookingData({ guests: Math.max(1, guests + amount) });
  };

  const nights = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return (
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      ) || 0
    );
  }, [startDate, endDate]);
  const totalGuestsText = `게스트 ${guests}명`;
  const totalPrice = useMemo(
    () => pricePerNight * nights,
    [pricePerNight, nights],
  );
  const finalPrice = totalPrice;

  const handleBooking = () => {
    if (!startDate || !endDate) {
      alert('체크인 및 체크아웃 날짜를 모두 선택해주세요.');
      return;
    }

    if (!isLoggedIn) {
      router.push('/signin');
      return;
    }

    router.push(`/booking/${roomId}`);
  };

  return (
    <Card className="sticky top-24 rounded-xl border border-gray-300/ p-6 shadow-xl  border-red-500">
      {/* 요금 */}
      <div className="flex items-baseline gap-1 ">
        <span className="text-[22px] font-bold">
          ₩{pricePerNight.toLocaleString()}
        </span>
        <span className="text-gray-600">/ 박</span>
      </div>

      {/* 날짜 선택 */}
      <div className=" rounded-lg border border-gray-400">
        <div className="grid grid-cols-2 border-b border-gray-400">
          <div className="border-r p-2 text-sm">
            <div className="text-[10px] uppercase">체크인</div>
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setBookingData({ startDate: date });
                if (endDate && date && endDate < date) {
                  setBookingData({ endDate: null });
                }
              }}
              minDate={new Date()}
              placeholderText="날짜 입력"
              className="w-full"
              locale={ko}
              dateFormat="yyyy. M. d"
            />
          </div>
          <div className="p-2 text-sm">
            <div className="text-[10px] uppercase">체크아웃</div>
            <DatePicker
              selected={endDate}
              onChange={(date) => setBookingData({ endDate: date })}
              minDate={startDate || new Date()}
              placeholderText="날짜 입력"
              className="w-full"
              locale={ko}
              dateFormat="yyyy. M. d"
            />
          </div>
        </div>

        {/* 게스트 선택 */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex w-full items-center justify-between rounded-b-lg p-3 text-left hover:bg-gray-50">
              <div>
                <div className="text-[10px] uppercase">인원</div>
                <div className="text-[14px]">{totalGuestsText}</div>
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">게스트</p>
                  <p className="text-sm text-muted-foreground">만 13세 이상</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => handleGuestsChange(-1)}
                    disabled={guests <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center text-lg font-bold">
                    {guests}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => handleGuestsChange(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* 어린이나 유아 추가가 필요하다면 여기에 비슷한 UI를 추가할 수 있습니다. */}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* 예약 버튼 – 이제는 "예약 API"가 아니라 "booking 페이지로 이동" */}
      <button
        className="mt-4 h-12 w-full rounded-lg bg-pink-500 text-lg font-bold text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        onClick={handleBooking}
        disabled={!startDate || !endDate || nights === 0}
      >
        예약하기
      </button>

      <div className="mt-4 text-center text-sm text-gray-600">
        예약 확정 전에는 요금이 청구되지 않습니다.
      </div>

      {nights > 0 && (
        <div className="mt-6 space-y-2 border-t pt-4">
          <div className="flex justify-between text-muted-foreground">
            <span>
              ₩{pricePerNight.toLocaleString()} x {nights}박
            </span>
            <span>₩{totalPrice.toLocaleString()}</span>
          </div>
          {/* TODO: 수수료 정보가 있다면 여기에 추가 */}
          <div className="flex justify-between font-bold">
            <span>총 합계</span>
            <span>₩{finalPrice.toLocaleString()}</span>
          </div>
        </div>
      )}
    </Card>
  );
}
