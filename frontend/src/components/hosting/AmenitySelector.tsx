'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { AmenityCategory } from '@/data/hosting-amenities-options';

interface AmenitySelectorProps {
  categories: AmenityCategory[];
  onSelectionChange: (selectedIds: string[]) => void;
  initialSelection?: string[];
}

/**
 * 숙소 편의시설을 선택하는 컴포넌트입니다.
 * 여러 카테고리에 걸쳐 편의시설을 표시하고, 사용자가 여러 항목을 선택할 수 있습니다.
 * @param {AmenitySelectorProps} props - categories: 편의시설 카테고리 목록, onSelectionChange: 선택 변경 시 호출될 콜백 함수
 */
export default function AmenitySelector({
  categories,
  onSelectionChange,
  initialSelection = [],
}: AmenitySelectorProps) {
  const [selectedAmenities, setSelectedAmenities] =
    useState<string[]>(initialSelection);

  /**
   * 편의시설 선택 상태를 토글하고, 변경된 선택 목록을 부모 컴포넌트로 전달합니다.
   * @param amenityId - 사용자가 선택한 편의시설의 ID
   */
  const handleToggleAmenity = (amenityId: string) => {
    const newSelection = selectedAmenities.includes(amenityId)
      ? selectedAmenities.filter((id) => id !== amenityId)
      : [...selectedAmenities, amenityId];

    setSelectedAmenities(newSelection);
    onSelectionChange(newSelection);
  };

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category.name}>
          <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {category.items.map((amenity) => (
              <div key={amenity.id}>
                <Label
                  htmlFor={amenity.id}
                  className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Checkbox
                    id={amenity.id}
                    checked={selectedAmenities.includes(amenity.id)}
                    onCheckedChange={() => handleToggleAmenity(amenity.id)}
                    className="sr-only peer"
                  />
                  <div className="flex-1 flex flex-col gap-2">
                    {amenity.icon}
                    <span className="font-semibold">{amenity.label}</span>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
