'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

/**
 * 목적지를 필터링하는 컴포넌트입니다.
 * Input을 통해 목적지를 변경하고 '검색' 버튼으로 라우팅을 트리거합니다.
 * @param {string} initialDestination - 현재 URL 쿼리에서 받아온 목적지.
 */
export default function FilterDestination({
  initialDestination,
}: {
  initialDestination: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [destination, setDestination] = useState(initialDestination);

  /**
   * '검색' 버튼 클릭 또는 Enter 입력 시, 현재 입력된 목적지로 URL 쿼리를 업데이트하고
   * 검색 페이지로 라우팅합니다.
   */
  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (destination) {
      newParams.set('destination', destination);
    } else {
      newParams.delete('destination');
    }
    router.push(`/search?${newParams.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center">
        <MapPin className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="여행지 검색"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="w-[200px] pl-10"
        />
      </div>
      <Button onClick={handleSearch}>검색</Button>
    </div>
  );
}
