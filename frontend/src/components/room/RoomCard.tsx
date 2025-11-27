'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { type CarouselApi } from '@/components/ui/carousel';
import { Room } from '../../types/room';
import Link from 'next/link';

export default function RoomCard({ room }: { room: Room }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [api, setApi] = useState<CarouselApi | undefined>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    // 초기화 시점과 슬라이드 변경 시점에 현재 슬라이드 번호를 업데이트합니다.
    const handleSelect = () => setCurrent(api.selectedScrollSnap());

    api.on('init', handleSelect);
    api.on('select', handleSelect);
  }, [api]);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: API 호출을 통해 위시리스트 상태를 서버에 업데이트
    setIsWishlisted((prev) => !prev);
    console.log(`숙소 ID ${room.id} 위시리스트 상태: ${!isWishlisted}`);
  };

  return (
    <li className="group cursor-pointer">
      <Carousel
        setApi={setApi}
        className="relative w-full rounded-2xl overflow-hidden"
        opts={{ loop: true }}
      >
        <CarouselContent className="ml-0">
          {room.images.map((image, index) => (
            <CarouselItem key={image.id} className="pl-0">
              <Image
                src={image.url}
                alt={`${room.title} ${index + 1}`}
                width={500}
                height={500}
                className="aspect-square h-auto w-full object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* 위시리스트 버튼 */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 z-10 p-1 rounded-full bg-black/30 hover:bg-black/50"
        >
          <Heart
            className={`w-5 h-5 ${
              isWishlisted ? 'text-red-500 fill-current' : 'text-white'
            }`}
          />
        </button>

        {/* 좌우 화살표 (호버 시 표시) */}
        <div
          className="absolute inset-0 pointer-events-none
          flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <CarouselPrevious className="pointer-events-auto static translate-x-0 translate-y-0 left-0 bg-white/80 hover:bg-white" />
          <CarouselNext className="pointer-events-auto static translate-x-0 translate-y-0 right-0 bg-white/80 hover:bg-white" />
        </div>

        {/* 인디케이터 */}
        {/* <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"> */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {room.images.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === current ? 'bg-white scale-110' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </Carousel>

      {/* 숙소 정보 */}
      <Link href={`/rooms/${room.id}`}>
        <div className="mt-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold truncate">
              {room.city}, {room.country}
            </h3>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span className="text-sm">4.8</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm truncate">{room.title}</p>
          <p className="mt-1">
            <span className="font-semibold">
              ₩{room.pricePerNight.toLocaleString()}
            </span>{' '}
            / 박
          </p>
        </div>
      </Link>
    </li>
  );
}
