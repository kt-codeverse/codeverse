'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

const AMENITIES_LIST = [
  { key: 'tv', label: 'TV' },
  { key: 'wifi', label: '와이파이' },
  { key: 'kitchen', label: '주방' },
  { key: 'airConditioner', label: '에어컨' },
  { key: 'freeParking', label: '무료 주차' },
];

export default function FilterAmenities() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amenities = searchParams.getAll('amenities');

  const handleAmenityClick = (amenityKey: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    const currentAmenities = newParams.getAll('amenities');

    // 토글 작업
    let updatedAmenities: string[];
    const isSelected = currentAmenities.includes(amenityKey);
    if (isSelected) {
      updatedAmenities = currentAmenities.filter((a) => a !== amenityKey);
    } else {
      updatedAmenities = [...currentAmenities, amenityKey];
    }

    newParams.delete('amenities');
    updatedAmenities.forEach((amenity) => {
      newParams.append('amenities', amenity);
    });

    router.push(`/search?${newParams.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {AMENITIES_LIST.map(({ key, label }) => {
        const isSelected = amenities.includes(key);
        return (
          <Button
            key={key}
            role="checkbox"
            aria-checked={isSelected}
            variant={isSelected ? 'secondary' : 'outline'}
            onClick={() => handleAmenityClick(key)}
            className="rounded-full"
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}
