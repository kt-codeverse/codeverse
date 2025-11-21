'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Filter from '@/components/search/Filter';
import AccommodationList from '@/components/room/AccommodationList';
import type { Accommodation } from '@/components/room/AccommodationCard';

export default function SearchClient() {
  const params = useSearchParams();
  const destination = params.get('destination') ?? '';
  const checkIn = params.get('start') ?? '';
  const checkOut = params.get('end') ?? '';
  const guests = params.get('guests') ?? '';

  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);

  useEffect(() => {
    // 클라이언트에서만 실행되도록 useEffect 내에서 데이터를 생성합니다.
    const generateMockData = () => {
      const mockData: Accommodation[] = new Array(8).fill(null).map((_, i) => ({
        id: i + 1,
        images: [
          `https://picsum.photos/id/${10 + i}/400/300`,
          `https://picsum.photos/id/${20 + i}/400/300`,
          `https://picsum.photos/id/${30 + i}/400/300`,
        ],
        location: `${destination || '제주도'}`,
        title: `멋진 숙소 ${i + 1}`,
        price: Math.floor(Math.random() * 100 + 100) * 1000,
      }));
      setAccommodations(mockData);
    };
    generateMockData();
  }, [destination]); // destination이 바뀔 때마다 목 데이터를 재생성합니다.

  return (
    <>
      <Filter destination={destination} checkIn={checkIn} checkOut={checkOut} guests={guests} />
      <AccommodationList accommodations={accommodations} />
    </>
  );
}
