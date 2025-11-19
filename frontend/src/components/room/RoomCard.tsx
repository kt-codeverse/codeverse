'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import type { Room } from '@/types/room';

interface RoomCardProps {
  room: Room;
}

/**
 * 숙소 정보를 표시하는 카드 컴포넌트
 * @param room - 표시할 숙소 데이터
 */
export function RoomCard({ room }: RoomCardProps) {
  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <CardHeader className="p-0">
        <Carousel className="w-full">
          <CarouselContent>
            {room.images.map((image) => (
              <CarouselItem key={image.id}>
                <div className="relative h-60 w-full">
                  <Image
                    src={image.url}
                    alt={room.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-16" />
          <CarouselNext className="mr-16" />
        </Carousel>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="truncate text-lg">{room.title}</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">
          {room.city}, {room.country}
        </p>
        <p className="mt-2 font-semibold">${room.pricePerNight} / night</p>
      </CardContent>
    </Card>
  );
}
