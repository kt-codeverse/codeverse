'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Minus, Plus, User } from 'lucide-react';

export default function FilterGuests({ maxGuests }: { maxGuests: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL의 게스트 수를 정수로 파싱, 없으면 1로 초기화합니다.
  const initialGuests = parseInt(maxGuests, 10) || 1;
  const [guests, setGuests] = useState(initialGuests);
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('guests', guests.toString());
    router.push(`/search?${newParams.toString()}`);
    setIsOpen(false);
  };

  const label = initialGuests > 0 ? `게스트 ${initialGuests}명` : '인원 선택';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[180px] justify-start text-left font-normal"
        >
          <User className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-4" align="start">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">게스트</p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setGuests(Math.max(1, guests - 1))}
              disabled={guests <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {guests}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setGuests(guests + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button onClick={handleApply} className="w-full mt-4">
          적용
        </Button>
      </PopoverContent>
    </Popover>
  );
}
