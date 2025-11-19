'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

export default function GuestBedroomBedStepper() {
  const [guests, setGuests] = useState(4);
  const [bedrooms, setBedrooms] = useState(1);
  const [beds, setBeds] = useState(1);

  return (
    <div className="sm:min-w-xl space-y-4">
      {/* 게스트 */}
      <div className="flex items-center justify-between p-4 border rounded-md shadow-sm">
        <div>
          <div className="text-sm font-medium">게스트</div>
          <div className="text-xs text-gray-500">숙박 인원 {guests}명</div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setGuests(Math.max(1, guests - 1))}
            aria-label="게스트 수 줄이기"
          >
            <Minus size={12} />
          </Button>
          <span className="w-6 text-center">{guests}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setGuests(guests + 1)}
            aria-label="게스트 수 늘리기"
          >
            <Plus size={12} />
          </Button>
        </div>
      </div>

      {/* 침실 */}
      <div className="flex items-center justify-between p-4 border rounded-md shadow-sm">
        <div>
          <div className="text-sm font-medium">침실</div>
          <div className="text-xs text-gray-500">{bedrooms}개</div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
            aria-label="침실 수 줄이기"
          >
            <Minus size={12} />
          </Button>
          <span className="w-6 text-center">{bedrooms}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setBedrooms(bedrooms + 1)}
            aria-label="침실 수 늘리기"
          >
            <Plus size={12} />
          </Button>
        </div>
      </div>

      {/* 침대 */}
      <div className="flex items-center justify-between p-4 border rounded-md shadow-sm">
        <div>
          <div className="text-sm font-medium">침대</div>
          <div className="text-xs text-gray-500">{beds}개</div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setBeds(Math.max(1, beds - 1))}
            disabled={beds <= 1}
            aria-label="침대 수 줄이기"
          >
            <Minus size={12} />
          </Button>
          <span className="w-6 text-center">{beds}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setBeds(beds + 1)}
            aria-label="침대 수 늘리기"
          >
            <Plus size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}
