// src/components/room/BookCard.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 🔥 추가
import { Card } from './Card';
import { Button } from '../ui/button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ChevronDown } from 'lucide-react';
// import axios from 'axios';  // ❌ 더 이상 사용 안 함, 제거해도 됨

type GuestType = 'adults' | 'children' | 'infants';

interface Guests {
  adults: number;
  children: number;
  infants: number;
}

interface BookCardProps {
  pricePerNight: number;
  roomId: string; // ✅ 이 숙소의 roomId (rooms/:id에서 내려줌)
}

export default function BookCard({ pricePerNight, roomId }: BookCardProps) {
  const router = useRouter();

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState<Guests>({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [showGuests, setShowGuests] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // 🔥 예약 API 호출 (POST /rooms/:roomId/bookings) - fetch + token 방식
  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      alert('체크인/체크아웃 날짜를 선택해주세요.');
      return;
    }

    // 1) 토큰 가져오기
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/signin');
      return;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://54.116.28.243/api';

    const payload = {
      startDate: checkIn.toISOString(), // Nest DTO: IsDateString
      endDate: checkOut.toISOString(),
    };

    try {
      setIsSubmitting(true);

      const res = await fetch(`${baseUrl}/rooms/${roomId}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ jwt 인증
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        // 토큰 만료 / 잘못된 경우
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('token');
        router.push('/signin');
        return;
      }

      if (!res.ok) {
        console.error('예약 실패 응답:', res.status, await res.text());
        alert('예약에 실패했습니다. 다시 시도해주세요.');
        return;
      }

      const data = await res.json();
      console.log('예약 성공:', data);
      alert('예약이 완료되었습니다!');

      // 나중에: 예약 상세 페이지로 이동하고 싶으면 여기서 router.push(`/booking/${data.id}`) 등으로 이동 가능
    } catch (error) {
      console.error('예약 요청 에러:', error);
      alert('예약 요청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="sticky top-24 p-6 border border-gray-300 rounded-xl shadow-xl">
      {/* 요금 */}
      <div className="flex items-baseline gap-1 ">
        <span className="text-[22px] underline font-bold">
          ₩{pricePerNight.toLocaleString()}
        </span>
        <span className="text-gray-600">· {nights}박</span>
      </div>

      {/* 날짜 선택 */}
      <div className=" border border-gray-400 rounded-lg ">
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
            <button className="w-full p-3 text-left hover:bg-gray-50 rounded-b-lg flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase">인원</div>
                <div className="text-[14px]">{totalGuests}</div>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-full p-4" align="start">
            <div className="border border-gray-400 rounded-lg mb-4 p-4 space-y-4">
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
                          className="w-8 h-8 rounded-full p-0"
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
                          className="w-8 h-8 rounded-full p-0"
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

      {/* 예약 버튼 */}
      <button
        className="w-full h-10 bg-linear-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-600 rounded-3xl text-white"
        onClick={handleBooking}
        disabled={isSubmitting}
      >
        {isSubmitting ? '예약 중...' : '예약하기'}
      </button>

      <div className="text-center text-sm text-gray-600 mb-4">
        예약 확정 전에는 요금이 청구되지 않습니다.
      </div>
    </Card>
  );
}
