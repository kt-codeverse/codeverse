'use client';
import { Grip } from 'lucide-react';
import React from 'react';
import Image from 'next/image';

interface RoomImagesProps {
  images: string[];
  onOpenAllPhotos: () => void;
}

export default function RoomImages({
  images,
  onOpenAllPhotos,
}: RoomImagesProps) {
  return (
    <div>
      <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[400px] rounded-xl overflow-hidden mb-6">
        <div className="col-span-2 row-span-2">
          <div className="flex items-center justify-center w-full h-full bg-gray-100">
            {/* 큰 메인 이미지 */}
            <Image
              src={images[0]}
              alt="메인 숙소 사진"
              width={300}
              height={300}
              className="w-full h-full object-cover cursor-pointer hover:brightness-75 transition-all"
              onClick={onOpenAllPhotos}
            />
          </div>
        </div>
        {/* 작은 이미지 4개 */}
        {images.slice(1, 5).map((img, index) => (
          <div key={index} className="relative">
            <Image
              src={img}
              alt={`숙소 사진 ${index + 2}`}
              width={100}
              height={100}
              className="w-full h-full object-cover cursor-pointer hover:brightness-75 transition-all"
              onClick={onOpenAllPhotos}
            />
            {index === 3 && (
              <button
                className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg border border-gray-800 hover:bg-gray-50 flex items-center gap-2 text-sm"
                onClick={onOpenAllPhotos}
              >
                <Grip className="w-4 h-4" /> 사진 모두 보기
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
