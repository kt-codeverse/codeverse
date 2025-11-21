'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import type { Room } from '@/types/room';
import Link from 'next/link';

/**
 * 숙소 정보를 표시하는 카드 컴포넌트
 * @param room - 표시할 숙소 데이터
 */
export function RoomCard({ room }: { room: Room }) {
  return (
    <Card className="w-full overflow-hidden pt-0 gap-0">
      <CardHeader className="p-0">
        <Carousel className="w-full group">
          <CarouselContent>
            {room.images.map((image) => (
              <CarouselItem key={image.id}>
                <Image
                  src={image.url}
                  alt={room.title}
                  width={500}
                  height={500}
                  className="aspect-square h-auto w-full object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <CarouselPrevious className="static translate-x-0 translate-y-0 left-0 bg-white/80 hover:bg-white" />
            <CarouselNext className="static translate-x-0 translate-y-0 right-0 bg-white/80 hover:bg-white" />
          </div>
        </Carousel>
      </CardHeader>
      <Link href={`/rooms/${room.id}`}>
        <CardContent className="px-4 pt-2">
          <CardTitle className="truncate text-lg">{room.title}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {room.city}, {room.country}
          </p>
          <p className="mt-2 font-semibold">
            {room.pricePerNight.toLocaleString('ko-KR')} 만원 / 박
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
