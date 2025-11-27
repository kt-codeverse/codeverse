'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHostingStore } from '@/store/useHostingStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Check } from 'lucide-react';
import { CreateRoomDto } from '@/types/room.dto';
import HostingReview from './HostingReview';

/**
 * @description 호스팅할 숙소 정보를 최종 검토하는 페이지
 * 사용자가 각 단계에서 입력한 정보를 보여주고, 수정할 수 있도록 각 단계로 이동하는 기능을 제공합니다.
 */
export default function ReviewPage() {
  const router = useRouter();
  const { hostingData } = useHostingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    structure,
    privacyType,
    location: { address, lat, lng },
    // floorPlan,
    amenities,
    photos,
    title,
    description,
    price: pricePerNight,
  } = hostingData;

  /**
   * @description '숙소 등록하기' 버튼 클릭 시 서버에 숙소 생성을 요청하는 함수
   */
  const handlePublish = async () => {
    setIsSubmitting(true);

    console.log({ hostingData });

    // 1. Zustand 스토어의 데이터를 백엔드 DTO 형식으로 변환합니다.
    const createRoomDto: CreateRoomDto = {
      // 구조정보
      structure,
      privacyType,
      // floorPlan,

      // 위치정보
      address,
      lat,
      lng,

      // 편의시설
      amenities,
      images: photos.map((photo) => photo.secure_url as string),
      title,
      description,
      pricePerNight,

      // 임시
      maxGuests: 3,
      country: '서울',
      city: '서울',
    };

    console.log({ createRoomDto });

    // return;

    try {
      // 2. 로컬 스토리지에서 액세스 토큰을 가져옵니다.
      const token = localStorage.getItem('token');
      if (!token) {
        // alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
        router.push('/signin');
        setIsSubmitting(false); // 로딩 상태 해제
        return;
      }
      console.log({ token });

      // 3. 백엔드 API에 POST 요청을 보냅니다.
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createRoomDto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '숙소 등록에 실패했습니다.');
      }

      const newRoom = await response.json();
      alert(`숙소 등록이 완료되었습니다! (ID: ${newRoom.id})`);
      // TODO: 등록 완료 후 숙소 상세 페이지 또는 호스트의 숙소 관리 페이지로 이동
      // router.push(`/rooms/${newRoom.id}`);
    } catch (error) {
      console.error('숙소 등록 중 오류 발생:', error);
      alert(
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <section className="h-screen flex flex-col border/ border-dashed/">
        <div className="container mx-auto flex-1 overflow-y-auto py-10">
          <HostingReview />
        </div>

        <div className="py-10 flex justify-between border/ border-dashed/">
          <Button variant="ghost" onClick={() => router.back()}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            이전
          </Button>
          <Button onClick={handlePublish} disabled={isSubmitting}>
            <Check className="mr-2 h-4 w-4" />
            {isSubmitting ? '등록 중...' : '숙소 등록하기'}
          </Button>
        </div>
      </section>
    </main>
  );
}
