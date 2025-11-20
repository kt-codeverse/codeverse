'use client';

import { useRouter } from 'next/navigation';
import { useHostingStore, HostingStep } from '@/store/useHostingStore';
import {
  Home,
  MapPin,
  BedDouble,
  Bath,
  Users,
  // Image as ImageIcon,
} from 'lucide-react';
import ReviewSection from './ReviewSection';

/**
 * @description 호스팅할 숙소 정보를 최종 검토하는 페이지의 메인 컴포넌트
 */
export default function HostingReview() {
  const router = useRouter();
  const { hostingData, setStep } = useHostingStore();
  const {
    structure,
    privacyType,
    location,
    floorPlan,
    amenities,
    // photos,
    title,
    description,
  } = hostingData;

  /**
   * @description 특정 호스팅 단계로 이동하는 함수
   * @param step - 이동할 호스팅 단계
   */
  const handleEdit = (step: HostingStep) => {
    setStep(step);
    router.push(`/hosting/${step}`);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">
          숙소 정보 검토하기
        </h1>
        <p className="mt-2 text-muted-foreground">
          숙소를 등록하기 전에 모든 정보가 정확한지 확인해 주세요. 언제든지
          정보를 수정할 수 있습니다.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ReviewSection title="숙소 유형" onEdit={() => handleEdit('structure')}>
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            <span>{structure || '미설정'}</span>
          </div>
        </ReviewSection>

        <ReviewSection
          title="게스트 전용 공간"
          onEdit={() => handleEdit('privacy-type')}
        >
          <p>{privacyType || '미설정'}</p>
        </ReviewSection>

        <ReviewSection title="숙소 위치" onEdit={() => handleEdit('location')}>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>{location?.address || '미설정'}</span>
          </div>
        </ReviewSection>

        <ReviewSection
          title="숙소 기본 정보"
          onEdit={() => handleEdit('floor-plan')}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>게스트 {floorPlan.guests}명</span>
            </div>
            <div className="flex items-center gap-2">
              <BedDouble className="h-5 w-5" />
              <span>침실 {floorPlan.bedrooms}개</span>
            </div>
            <div className="flex items-center gap-2">
              <BedDouble className="h-5 w-5" />
              <span>침대 {floorPlan.beds}개</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5" />
              <span>욕실 {floorPlan.bathrooms}개</span>
            </div>
          </div>
        </ReviewSection>

        <ReviewSection title="편의시설" onEdit={() => handleEdit('amenities')}>
          <div className="flex flex-wrap gap-2">
            {amenities.length > 0 ? (
              amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="rounded-full bg-secondary px-3 py-1 text-sm"
                >
                  {amenity}
                </div>
              ))
            ) : (
              <p>선택된 편의시설이 없습니다.</p>
            )}
          </div>
        </ReviewSection>

        {/* <ReviewSection title="숙소 사진" onEdit={() => handleEdit('photos')}>
          {photos.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {photos.slice(0, 5).map((photo, index) => (
                <div key={photo.public_id} className="relative aspect-square">
                  <Image
                    src={photo.secure_url}
                    alt={`숙소 사진 ${index + 1}`}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              <span>등록된 사진이 없습니다.</span>
            </div>
          )}
        </ReviewSection> */}

        <ReviewSection
          title="숙소 이름 및 설명"
          onEdit={() => handleEdit('title')}
        >
          <div className="space-y-1">
            <h4 className="font-semibold">{title || '제목 없음'}</h4>
            <p className="text-sm">{description || '설명이 아직 없습니다.'}</p>
          </div>
        </ReviewSection>
      </div>
    </div>
  );
}
