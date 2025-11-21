'use client';

interface FilterProps {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: string;
}

/**
 * @description 현재 적용된 검색 필터를 보여주는 컴포넌트
 */
export default function Filter({
  destination,
  checkIn,
  checkOut,
  guests,
}: FilterProps) {
  return (
    <div className="mb-6 text-sm text-gray-600">
      {destination && (
        <span className="mr-4">
          여행지: <strong>{destination}</strong>
        </span>
      )}
      {checkIn && checkOut && (
        <span className="mr-4">
          날짜: <strong>{checkIn}</strong> → <strong>{checkOut}</strong>
        </span>
      )}
      {guests && (
        <span>
          인원: <strong>{guests}명</strong>
        </span>
      )}
    </div>
  );
}
