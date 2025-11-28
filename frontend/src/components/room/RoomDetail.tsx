// src/app/rooms/[id]/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

import BookCard from '@/components/room/BookCard';
import RoomHeader from '@/components/room/RoomHeader';
import RoomImages from '@/components/room/RoomImages';
import RoomInfo from '@/components/room/RoomInfo';
import KakaoMap from '@/components/room/Map';
import RoomAmenity from '@/components/room/RoomAmenity';
import { Button } from '@/components/ui/button';
import ReviewsModal from '@/components/review/ReviewsModal';
import { Room } from '@/types/room';
import { roomText } from '@/data/room-description';
import RoomDetailReview from './RoomDetailReview';

interface RoomDetailProps {
  room: Room;
}

export default function RoomDetail({ room }: RoomDetailProps) {
  // 리뷰 임시 데이터 (나중에 API로 교체)
  const roomData = {
    id: 'haeundae-111', // 👉 리뷰 모달에 넘겨줄 roomId
    rating: 5.0,
    reviewCount: 23,
  };

  const amenities = [
    '셀프체크인',
    '여행 가방 보관 가능',
    '무료 주차 공간',
    '세탁기 및 건조기',
    '에어컨',
  ];

  const roomDescriptionText = roomText; // 숙소 추가 설명 데이터

  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [openReviews, setOpenReviews] = useState(false);

  return (
    <>
      {/* 사진 모두 보기 오버레이 */}
      {showAllPhotos && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="min-h-screen p-8">
            <Button
              onClick={() => setShowAllPhotos(false)}
              variant="ghost"
              className="fixed gap-2 font-bold text-black"
            >
              닫기
            </Button>
            <div className="mx-auto max-w-2xl space-y-4 pt-14">
              {room.images.map((img, index) => (
                <div key={index}>
                  <Image
                    src={img.url}
                    alt={`숙소사진 ${index + 1}`}
                    width={230}
                    height={250}
                    className="w-full rounded-2xl"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 메인 페이지 */}
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-[1120px] px-6 py-6">
          {/* 상단 헤더 (제목만) */}
          <div className="mb-6">
            <RoomHeader title={room.title} />
          </div>

          {/* 사진 영역 */}
          <RoomImages
            images={room.images}
            onOpenAllPhotos={() => setShowAllPhotos(true)}
          />

          {/* 아래 정보 + 예약 카드 */}
          <div className="grid grid-cols-1 gap-8 pb-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RoomInfo
                description={`${room.description} \n\n ${roomDescriptionText}`}
                amenities={amenities}
                maxGuests={room.maxGuests}
                city={room.city}
                privacyType={room.privacyType}
                rating={roomData.rating}
                reviewCount={roomData.reviewCount}
                onOpenReviews={() => setOpenReviews(true)} // ⬅️ 여기서 모달 오픈
                host={{
                  name: room.host?.name ?? '알 수 없음',
                  avatar: room.host?.avatar,
                  hostingMonths: 3, // 임시값 (추후 계산 가능)
                }}
              />
            </div>

            <div className="lg:col-span-1">
              <BookCard pricePerNight={room.pricePerNight} roomId={room.id} />
            </div>
          </div>

          {/* 위치 */}
          <div className="border-b border-t pb-12">
            <h1 className="pb-3 pt-8 text-2xl">위치</h1>
            <p className="pb-3">
              {room.country}, {room.city}
            </p>
            <KakaoMap address={room.address} />
          </div>

          {/* 숙소 편의 시설 */}
          <div className="gap-4 border-b pb-12">
            <RoomAmenity />
          </div>

          {/* 숙소 리뷰 */}
          <div className="gap-4 border-b pb-12">
            <RoomDetailReview listingId={roomData.id} />
          </div>
        </div>
      </div>

      {/* 리뷰 모달 – 아래 ‘후기 23개’에서만 열림 */}
      <ReviewsModal
        open={openReviews}
        onClose={() => setOpenReviews(false)}
        listingId={roomData.id}
      />
    </>
  );
}
