// src/components/room/BookCard.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from './Card';
import { Button } from '../ui/button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ChevronDown } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore'; // ✅ zustand

type GuestType = 'adults' | 'children' | 'infants';

interface Guests {
  adults: number;
  children: number;
  infants: number;
}

interface BookCardProps {
  pricePerNight: number;
  roomId: string; // ✅ rooms/[id]에서 내려주는 실제 roomId
}

export default function BookCard({ pricePerNight, roomId }: BookCardProps) {
  const router = useRouter();

  const {
    setBooking,      // Booking 초깃값 저장
    updateGuestInfo, // 게스트 수 저장
  } = useBookingStore();

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState<Guests>({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [showGuests, setShowGuests] = useState(false);

  const handleIncrement = (type: GuestType) => {
    setGuests((g) => ({
      ...g,
      [type]: g[type] + 1,
    }));
  };

  const handleDecrement = (type: GuestType) => {
    setGuests((g) => ({
      ...g,
      [type]: Math.max(0, g[type] - 1),
    }));
  };

  const guestCount = guests.adults + guests.children;
  const infantCount = guests.infants;
  const totalGuestText = [
    guestCount > 0 ? `게스트 ${guestCount}명` : null,
    infantCount > 0 ? `유아 ${infantCount}명` : null,
  ]
    .filter(Boolean)
    .join(', ');

  const totalGuests = totalGuestText || '게스트 추가';

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0;

  // ✅ 여기서는 "예약 API 호출" 대신
  // 1) zustand에 예약 초깃값 저장
  // 2) /booking/[roomId] 로 라우팅만 수행
  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      alert('체크인/체크아웃 날짜를 선택해주세요.');
      return;
    }

    // 로그인 여부는 여기서 한 번 체크 (토큰 없으면 로그인으로 보냄)
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/signin');
      return;
    }

    // ✅ BookingPage에서 보여줄 정보(요약 카드)에 필요한 최소 데이터만 저장
    const checkInIso = checkIn.toISOString();
    const checkOutIso = checkOut.toISOString();

    const draftBooking = {
      // 이 부분 타입은 '@/types/booking' 구조에 맞춰서 저장
      checkIn: checkInIso,
      checkOut: checkOutIso,
      priceDetail: {
        nights,
        pricePerNight,
        total: pricePerNight * nights,
      },
      listing: {
        id: roomId,
        title: '예약하려는 숙소',       // TODO: 필요하면 RoomDetail에서 제목/이미지 내려줘서 채우면 됨
        subtitle: '',
        imageUrl: '',
        locationSummary: '',
        isGuestFavorite: false,
        rating: 5.0,
        reviewCount: 0,
      },
    };

    // zustand에 예약 정보 저장 (타입 안 맞으면 as any로 우선 맞춰줌)
    setBooking(draftBooking as any);

    // 게스트 정보도 zustand에 저장
    updateGuestInfo({
      adults: guests.adults,
      children: guests.children,
      infants: guests.infants,
    });

    // ➡️ 예약 상세 페이지로 이동
    router.push(`/booking/${roomId}`);
  };

  return (
    <Card className="sticky top-24 rounded-xl border border-gray-300 p-6 shadow-xl">
      {/* 요금 */}
      <div className="flex items-baseline gap-1 ">
        <span className="text-[22px] font-bold underline">
          ₩{pricePerNight.toLocaleString()}
        </span>
        <span className="text-gray-600">· {nights}박</span>
      </div>

      {/* 날짜 선택 */}
      <div className=" rounded-lg border border-gray-400">
        <div className="grid grid-cols-2 border-b border-gray-400">
          <div className="border-r p-2 text-sm">
            <div className="text-[10px] uppercase">체크인</div>
            <DatePicker
              selected={checkIn}
              onChange={(date) => {
                setCheckIn(date);
                if (checkOut && date && checkOut < date) {
                  setCheckOut(null);
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
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              minDate={checkIn || new Date()}
              placeholderText="날짜 입력"
              className="w-full"
              locale={ko}
              dateFormat="yyyy. M. d"
            />
          </div>
        </div>

        {/* 게스트 선택 */}
        <Popover open={showGuests} onOpenChange={setShowGuests}>
          <PopoverTrigger asChild>
            <button className="flex w-full items-center justify-between rounded-b-lg p-3 text-left hover:bg-gray-50">
              <div>
                <div className="text-[10px] uppercase">인원</div>
                <div className="text-[14px]">{totalGuests}</div>
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-full p-4" align="start">
            <div className="mb-4 space-y-4 rounded-lg border border-gray-400 p-4">
              {(['adults', 'children', 'infants'] as GuestType[]).map(
                (type) => {
                  const label =
                    type === 'adults'
                      ? '성인'
                      : type === 'children'
                      ? '어린이'
                      : '유아';
                  const description =
                    type === 'adults'
                      ? '만 13세 이상'
                      : type === 'children'
                      ? '만 2-12세'
                      : '만 2세 미만';
                  return (
                    <div
                      key={type}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div>{label}</div>
                        <div className="text-sm text-gray-600">
                          {description}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 rounded-full p-0"
                          onClick={() => handleDecrement(type)}
                          disabled={
                            type === 'adults'
                              ? guests.adults <= 1
                              : guests[type] <= 0
                          }
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">
                          {guests[type]}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 rounded-full p-0"
                          onClick={() => handleIncrement(type)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* 예약 버튼 – 이제는 "예약 API"가 아니라 "booking 페이지로 이동" */}
      <button
        className="h-10 w-full rounded-3xl bg-linear-to-r from-pink-500 to-red-600 text-white hover:from-pink-600 hover:to-red-600"
        onClick={handleBooking}
      >
        예약하기
      </button>

      <div className="mb-4 text-center text-sm text-gray-600">
        예약 확정 전에는 요금이 청구되지 않습니다.
      </div>
    </Card>
  );
}
